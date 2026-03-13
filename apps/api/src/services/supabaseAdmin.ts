import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let adminClient: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient | null {
  if (adminClient) return adminClient;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key || url.includes("your-project") || key.includes("your-")) {
    return null;
  }

  adminClient = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  return adminClient;
}

// ─── Quiz Submissions ────────────────────────────────────────────────────────

export interface QuizSubmissionInsert {
  email: string;
  child_name: string;
  child_gender: string;
  caregiver_type?: string;
  child_age_range?: string;
  adhd_journey?: string;
  archetype_id: string;
  trait_scores: Record<string, number>;
  responses: Record<string, unknown>;
  pdf_url?: string;
}

export async function insertQuizSubmission(
  data: QuizSubmissionInsert,
): Promise<string | null> {
  const sb = getSupabaseAdmin();
  if (!sb) { console.warn("Supabase not configured — skipping quiz submission insert"); return null; }
  const { data: row, error } = await sb
    .from("quiz_submissions")
    .insert(data)
    .select("id")
    .single();

  if (error) {
    console.error("supabaseAdmin.insertQuizSubmission failed:", error.message);
    return null;
  }

  return row?.id ?? null;
}

export async function updateSubmissionPayment(
  submissionId: string,
  stripePaymentId: string,
  stripeSessionId: string,
): Promise<void> {
  const sb = getSupabaseAdmin();
  if (!sb) { console.warn("Supabase not configured — skipping payment update"); return; }
  const { error } = await sb
    .from("quiz_submissions")
    .update({
      paid: true,
      stripe_payment_id: stripePaymentId,
      stripe_session_id: stripeSessionId,
    })
    .eq("id", submissionId);

  if (error) {
    console.error("supabaseAdmin.updateSubmissionPayment failed:", error.message);
  }
}

// ─── Funnel Events ───────────────────────────────────────────────────────────

export async function insertFunnelEvent(
  sessionId: string,
  eventType: string,
  stepNumber?: number | null,
  metadata?: Record<string, unknown>,
): Promise<void> {
  const sb = getSupabaseAdmin();
  if (!sb) return; // silently skip if Supabase not configured
  const { error } = await sb.from("funnel_events").insert({
    session_id: sessionId,
    event_type: eventType,
    step_number: stepNumber ?? null,
    metadata: metadata ?? {},
  });

  if (error) {
    console.error("supabaseAdmin.insertFunnelEvent failed:", error.message);
  }
}

// ─── Paginated Fetch (bypasses Supabase 1000-row default) ────────────────────

/**
 * Fetches ALL matching rows by paginating with .range().
 * Supabase caps each request at 1000 rows by default — this loops until done.
 */
async function fetchAll<T = Record<string, unknown>>(
  query: ReturnType<SupabaseClient["from"]> & { select: (...args: unknown[]) => unknown },
  table: string,
  selectCols: string,
  filters: (q: ReturnType<SupabaseClient["from"]>) => ReturnType<SupabaseClient["from"]>,
): Promise<T[]> {
  const sb = getSupabaseAdmin();
  if (!sb) return [];

  const PAGE_SIZE = 1000;
  const allRows: T[] = [];
  let offset = 0;
  let hasMore = true;

  while (hasMore) {
    const { data, error } = await (filters(sb.from(table)) as any)
      .select(selectCols)
      .range(offset, offset + PAGE_SIZE - 1);

    if (error) {
      console.error(`fetchAll(${table}) failed at offset ${offset}:`, error.message);
      break;
    }

    if (data && data.length > 0) {
      allRows.push(...(data as T[]));
      offset += data.length;
      if (data.length < PAGE_SIZE) hasMore = false;
    } else {
      hasMore = false;
    }
  }

  return allRows;
}

// ─── Analytics Queries ───────────────────────────────────────────────────────

export interface FunnelAnalytics {
  stepDropoff: Array<{ step: number; views: number; dropoffRate: number }>;
  funnelSummary: {
    quizStarted: number;
    quizCompleted: number;
    checkoutStarted: number;
    purchaseCompleted: number;
    quizCompletionRate: number;
    checkoutRate: number;
    purchaseRate: number;
    overallConversion: number;
  };
  recentSubmissions: Array<{
    id: string;
    email: string;
    archetype_id: string;
    paid: boolean;
    created_at: string;
  }>;
  dailyTrend: Array<{
    date: string;
    started: number;
    completed: number;
    purchased: number;
  }>;
  archetypeDistribution: Array<{ archetypeId: string; count: number }>;
  traitPairDistribution: Array<{ pair: string; count: number }>;
  answerDistribution: Array<{
    questionKey: string;
    topAnswer: string;
    percentage: number;
    totalResponses: number;
  }>;
  avgCompletionTime: number; // seconds
  submissionsByTraitPair: Array<{
    pair: string;
    users: Array<{ email: string; archetype: string; paid: boolean; created_at: string }>;
  }>;
}

const EMPTY_ANALYTICS: FunnelAnalytics = {
  stepDropoff: [],
  funnelSummary: {
    quizStarted: 0, quizCompleted: 0, checkoutStarted: 0, purchaseCompleted: 0,
    quizCompletionRate: 0, checkoutRate: 0, purchaseRate: 0, overallConversion: 0,
  },
  recentSubmissions: [],
  dailyTrend: [],
  archetypeDistribution: [],
  traitPairDistribution: [],
  answerDistribution: [],
  avgCompletionTime: 0,
  submissionsByTraitPair: [],
};

export async function getAnalytics(days: number = 7): Promise<FunnelAnalytics> {
  const sb = getSupabaseAdmin();
  if (!sb) return EMPTY_ANALYTICS;
  const since = new Date();
  since.setDate(since.getDate() - days);
  const sinceStr = since.toISOString();

  // Helper: fetch all rows from a table with filters (no row limit)
  async function allRows<T = Record<string, unknown>>(
    table: string,
    cols: string,
    applyFilters: (q: any) => any,
  ): Promise<T[]> {
    const PAGE = 1000;
    const result: T[] = [];
    let offset = 0;
    while (true) {
      const { data, error } = await applyFilters(sb!.from(table).select(cols)).range(offset, offset + PAGE - 1);
      if (error) { console.error(`allRows(${table}) offset=${offset}:`, error.message); break; }
      if (!data || data.length === 0) break;
      result.push(...(data as T[]));
      if (data.length < PAGE) break;
      offset += PAGE;
    }
    return result;
  }

  // ── Fetch all data in parallel ───────────────────────────────────────────
  type FunnelRow = { session_id: string; event_type: string; step_number: number | null; created_at: string; metadata: Record<string, unknown> | null };
  type SubRow = { id: string; email: string; archetype_id: string; trait_scores: Record<string, number> | null; paid: boolean; created_at: string };

  const [funnelRows, submissionRows] = await Promise.all([
    allRows<FunnelRow>("funnel_events", "session_id, event_type, step_number, created_at, metadata", (q: any) => q.gte("created_at", sinceStr)),
    allRows<SubRow>("quiz_submissions", "id, email, archetype_id, trait_scores, paid, created_at", (q: any) => q),
  ]);

  // ── 1. Step dropoff ──────────────────────────────────────────────────────
  const stepCounts = new Map<number, Set<string>>();
  for (const row of funnelRows) {
    if (row.event_type !== "step_viewed" || row.step_number == null) continue;
    if (!stepCounts.has(row.step_number)) stepCounts.set(row.step_number, new Set());
    stepCounts.get(row.step_number)!.add(row.session_id);
  }

  const sortedSteps = [...stepCounts.entries()]
    .sort(([a], [b]) => a - b)
    .map(([step, sessions]) => ({ step, views: sessions.size }));

  const stepDropoff = sortedSteps.map((item, i) => {
    const prev = i > 0 ? sortedSteps[i - 1].views : item.views;
    const dropoffRate = prev > 0 ? Number((((prev - item.views) / prev) * 100).toFixed(1)) : 0;
    return { ...item, dropoffRate };
  });

  // ── 2. Funnel summary ────────────────────────────────────────────────────
  const eventSessions = new Map<string, Set<string>>();
  for (const row of funnelRows) {
    if (!eventSessions.has(row.event_type)) eventSessions.set(row.event_type, new Set());
    eventSessions.get(row.event_type)!.add(row.session_id);
  }

  const quizStarted = eventSessions.get("step_viewed")?.size ?? 0;
  const quizCompleted = eventSessions.get("quiz_completed")?.size ?? 0;
  const checkoutStarted = eventSessions.get("checkout_started")?.size ?? 0;
  const purchaseCompleted = eventSessions.get("purchase_completed")?.size ?? 0;

  const pct = (n: number, d: number) => (d > 0 ? Number(((n / d) * 100).toFixed(1)) : 0);

  const funnelSummary = {
    quizStarted,
    quizCompleted,
    checkoutStarted,
    purchaseCompleted,
    quizCompletionRate: pct(quizCompleted, quizStarted),
    checkoutRate: pct(checkoutStarted, quizCompleted),
    purchaseRate: pct(purchaseCompleted, checkoutStarted),
    overallConversion: pct(purchaseCompleted, quizStarted),
  };

  // ── 3. Recent submissions (last 50) ──────────────────────────────────────
  const recentSubmissions = [...submissionRows]
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, 50)
    .map((r) => ({
      id: r.id,
      email: r.email,
      archetype_id: r.archetype_id,
      paid: r.paid,
      created_at: r.created_at,
    }));

  // ── 3b. Submissions grouped by trait pair ────────────────────────────────
  const traitPairUserMap = new Map<string, Array<{ email: string; archetype: string; paid: boolean; created_at: string }>>();
  for (const row of submissionRows) {
    const scores = row.trait_scores as import("@adhd-parenting-quiz/shared").TraitScores | null;
    if (!scores) continue;
    const sorted = Object.entries(scores).sort(([, a], [, b]) => b - a);
    if (sorted.length < 2) continue;
    const pair = [sorted[0][0], sorted[1][0]].sort().join(" & ");
    if (!traitPairUserMap.has(pair)) traitPairUserMap.set(pair, []);
    traitPairUserMap.get(pair)!.push({
      email: row.email,
      archetype: row.archetype_id,
      paid: row.paid,
      created_at: row.created_at,
    });
  }

  const submissionsByTraitPair = [...traitPairUserMap.entries()]
    .map(([pair, users]) => ({ pair, users }))
    .sort((a, b) => b.users.length - a.users.length);

  // ── 4. Daily trend ───────────────────────────────────────────────────────
  const dailyMap = new Map<string, { started: Set<string>; completed: Set<string>; purchased: Set<string> }>();
  for (const row of funnelRows) {
    const date = row.created_at.slice(0, 10);
    if (!dailyMap.has(date)) dailyMap.set(date, { started: new Set(), completed: new Set(), purchased: new Set() });
    const day = dailyMap.get(date)!;
    if (row.event_type === "step_viewed") day.started.add(row.session_id);
    if (row.event_type === "quiz_completed") day.completed.add(row.session_id);
    if (row.event_type === "purchase_completed") day.purchased.add(row.session_id);
  }

  const dailyTrend = [...dailyMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, sets]) => ({ date, started: sets.started.size, completed: sets.completed.size, purchased: sets.purchased.size }));

  // ── 5. Archetype distribution ────────────────────────────────────────────
  const sinceDate = new Date(sinceStr);
  const recentSubs = submissionRows.filter((r) => new Date(r.created_at) >= sinceDate);

  const archetypeCounts = new Map<string, number>();
  for (const row of recentSubs) {
    archetypeCounts.set(row.archetype_id, (archetypeCounts.get(row.archetype_id) ?? 0) + 1);
  }

  const archetypeDistribution = [...archetypeCounts.entries()]
    .map(([archetypeId, count]) => ({ archetypeId, count }))
    .sort((a, b) => b.count - a.count);

  // ── 5b. Trait pair distribution ──────────────────────────────────────────
  const pairCounts = new Map<string, number>();
  for (const row of recentSubs) {
    const scores = row.trait_scores as import("@adhd-parenting-quiz/shared").TraitScores | null;
    if (!scores) continue;
    const sorted = Object.entries(scores).sort(([, a], [, b]) => b - a);
    if (sorted.length < 2) continue;
    const pair = [sorted[0][0], sorted[1][0]].sort().join(" & ");
    pairCounts.set(pair, (pairCounts.get(pair) ?? 0) + 1);
  }

  const traitPairDistribution = [...pairCounts.entries()]
    .map(([pair, count]) => ({ pair, count }))
    .sort((a, b) => b.count - a.count);

  // ── 6. Answer distribution ───────────────────────────────────────────────
  const answerMap = new Map<string, Map<string, number>>();
  for (const row of funnelRows) {
    if (row.event_type !== "answer_submitted" || !row.metadata?.questionKey) continue;
    const qKey = String(row.metadata.questionKey);
    const aVal = String(row.metadata.answerValue ?? "");
    if (!answerMap.has(qKey)) answerMap.set(qKey, new Map());
    const counts = answerMap.get(qKey)!;
    counts.set(aVal, (counts.get(aVal) ?? 0) + 1);
  }

  const answerDistribution = [...answerMap.entries()].map(([questionKey, counts]) => {
    const totalResponses = [...counts.values()].reduce((a, b) => a + b, 0);
    let topAnswer = "";
    let topCount = 0;
    for (const [answer, count] of counts) {
      if (count > topCount) { topAnswer = answer; topCount = count; }
    }
    const percentage = totalResponses > 0 ? Number(((topCount / totalResponses) * 100).toFixed(1)) : 0;
    return { questionKey, topAnswer, percentage, totalResponses };
  });

  // ── 7. Average completion time ───────────────────────────────────────────
  const sessionTimes = new Map<string, { firstStep?: Date; completed?: Date }>();
  for (const row of funnelRows) {
    if (row.event_type !== "step_viewed" && row.event_type !== "quiz_completed") continue;
    if (!sessionTimes.has(row.session_id)) sessionTimes.set(row.session_id, {});
    const entry = sessionTimes.get(row.session_id)!;
    const ts = new Date(row.created_at);
    if (row.event_type === "step_viewed" && (!entry.firstStep || ts < entry.firstStep)) entry.firstStep = ts;
    if (row.event_type === "quiz_completed") entry.completed = ts;
  }

  let totalSeconds = 0;
  let completedCount = 0;
  for (const { firstStep, completed } of sessionTimes.values()) {
    if (firstStep && completed) {
      totalSeconds += (completed.getTime() - firstStep.getTime()) / 1000;
      completedCount++;
    }
  }
  const avgCompletionTime = completedCount > 0 ? Math.round(totalSeconds / completedCount) : 0;

  return { stepDropoff, funnelSummary, recentSubmissions, dailyTrend, archetypeDistribution, traitPairDistribution, answerDistribution, avgCompletionTime, submissionsByTraitPair };
}

// ─── Reset Analytics ──────────────────────────────────────────────────────────

export async function resetAnalytics(): Promise<{ deletedEvents: number; deletedSubmissions: number }> {
  const sb = getSupabaseAdmin();
  if (!sb) throw new Error("Supabase not configured");

  // Delete all funnel events (gte epoch to match all rows)
  const { count: eventCount, error: eventError } = await sb
    .from("funnel_events")
    .delete({ count: "exact" })
    .gte("created_at", "1970-01-01T00:00:00.000Z");

  if (eventError) throw new Error(`Failed to delete funnel_events: ${eventError.message}`);

  // Delete all quiz submissions
  const { count: subCount, error: subError } = await sb
    .from("quiz_submissions")
    .delete({ count: "exact" })
    .gte("created_at", "1970-01-01T00:00:00.000Z");

  if (subError) throw new Error(`Failed to delete quiz_submissions: ${subError.message}`);

  return { deletedEvents: eventCount ?? 0, deletedSubmissions: subCount ?? 0 };
}

// ─── Re-score helpers ───────────────────────────────────────────────────────

interface RescoreMismatch {
  id: string;
  email: string;
  currentArchetype: string;
  correctArchetype: string;
}

async function fetchMismatches(): Promise<{ total: number; mismatches: RescoreMismatch[] }> {
  const { matchArchetype } = await import("@adhd-parenting-quiz/shared");
  const sb = getSupabaseAdmin();
  if (!sb) return { total: 0, mismatches: [] };

  const { data: rows, error } = await sb
    .from("quiz_submissions")
    .select("id, email, archetype_id, trait_scores");

  if (error || !rows) throw new Error(`Failed to fetch submissions: ${error?.message}`);

  const mismatches: RescoreMismatch[] = [];
  for (const row of rows) {
    if (!row.trait_scores) continue;
    const correct = matchArchetype(row.trait_scores as import("@adhd-parenting-quiz/shared").TraitScores);
    if (correct.id !== row.archetype_id) {
      mismatches.push({
        id: row.id,
        email: row.email,
        currentArchetype: row.archetype_id,
        correctArchetype: correct.id,
      });
    }
  }

  return { total: rows.length, mismatches };
}

/** Read-only: returns mismatches without changing anything */
export async function checkRescoreMismatches() {
  return fetchMismatches();
}

/** Writes: updates archetype_id for all mismatched submissions */
export async function applyRescore() {
  const sb = getSupabaseAdmin();
  if (!sb) return { total: 0, updated: 0, changes: [] as RescoreMismatch[] };

  const { total, mismatches } = await fetchMismatches();
  const applied: RescoreMismatch[] = [];

  for (const m of mismatches) {
    const { error } = await sb
      .from("quiz_submissions")
      .update({ archetype_id: m.correctArchetype })
      .eq("id", m.id);

    if (!error) applied.push(m);
  }

  return { total, updated: applied.length, changes: applied };
}
