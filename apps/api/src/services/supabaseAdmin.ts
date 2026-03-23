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
  is_test?: boolean;
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
  isTest?: boolean,
): Promise<void> {
  const sb = getSupabaseAdmin();
  if (!sb) return; // silently skip if Supabase not configured
  const { error } = await sb.from("funnel_events").insert({
    session_id: sessionId,
    event_type: eventType,
    step_number: stepNumber ?? null,
    metadata: metadata ?? {},
    is_test: isTest ?? false,
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

/**
 * Paginated fetch: gets ALL rows from a table (bypasses Supabase 1000-row default).
 * Used as fallback when RPCs aren't installed, and for queries needing raw rows.
 */
export async function allRows<T = Record<string, unknown>>(
  sb: SupabaseClient,
  table: string,
  cols: string,
  applyFilters: (q: any) => any,
): Promise<T[]> {
  const PAGE = 1000;
  const result: T[] = [];
  let offset = 0;
  while (true) {
    const { data, error } = await applyFilters(sb.from(table).select(cols)).range(offset, offset + PAGE - 1);
    if (error) { console.error(`allRows(${table}) offset=${offset}:`, error.message); break; }
    if (!data || data.length === 0) break;
    result.push(...(data as T[]));
    if (data.length < PAGE) break;
    offset += PAGE;
  }
  return result;
}

export async function getAnalytics(days: number = 7): Promise<FunnelAnalytics> {
  const sb = getSupabaseAdmin();
  if (!sb) return EMPTY_ANALYTICS;
  const since = new Date();
  since.setDate(since.getDate() - days);
  const sinceTs = since.toISOString();

  const pct = (n: number, d: number) => (d > 0 ? Number(((n / d) * 100).toFixed(1)) : 0);

  // ── Try RPC-based analytics (server-side aggregation, no row limits) ─────
  // Falls back to paginated client-side aggregation if RPCs aren't installed.
  const useRpc = await (async () => {
    try {
      const { error } = await sb.rpc("analytics_funnel_summary", { since_ts: sinceTs });
      return !error; // RPCs are installed
    } catch { return false; }
  })();

  if (useRpc) {
    // ── All RPCs in parallel ─────────────────────────────────────────────
    // NOTE: RPCs don't filter is_test yet — fall through to fallback path
    // which does filter. TODO: update RPCs to accept is_test param.
    type SubRow = { id: string; email: string; child_name: string; child_gender: string; archetype_id: string; trait_scores: Record<string, number> | null; paid: boolean; created_at: string; is_test?: boolean };

    const [
      { data: funnelData },
      { data: stepData },
      { data: trendData },
      { data: archetypeData },
      { data: completionData },
      { data: recentData },
      submissionRows,
    ] = await Promise.all([
      sb.rpc("analytics_funnel_summary", { since_ts: sinceTs }),
      sb.rpc("analytics_step_dropoff", { since_ts: sinceTs }),
      sb.rpc("analytics_daily_trend", { since_ts: sinceTs }),
      sb.rpc("analytics_archetype_distribution", { since_ts: sinceTs }),
      sb.rpc("analytics_avg_completion_time", { since_ts: sinceTs }),
      sb.rpc("analytics_recent_submissions", { lim: 50 }),
      allRows<SubRow>(sb, "quiz_submissions", "id, email, child_name, child_gender, archetype_id, trait_scores, paid, created_at, is_test", (q: any) => q),
    ]);

    // Funnel summary
    const eventMap = new Map<string, number>();
    for (const row of funnelData ?? []) eventMap.set(row.event_type, Number(row.unique_sessions));
    const quizStarted = eventMap.get("step_viewed") ?? 0;
    const quizCompleted = eventMap.get("quiz_completed") ?? 0;
    const checkoutStarted = eventMap.get("checkout_started") ?? 0;
    const purchaseCompleted = eventMap.get("purchase_completed") ?? 0;

    const funnelSummary = {
      quizStarted, quizCompleted, checkoutStarted, purchaseCompleted,
      quizCompletionRate: pct(quizCompleted, quizStarted),
      checkoutRate: pct(checkoutStarted, quizCompleted),
      purchaseRate: pct(purchaseCompleted, checkoutStarted),
      overallConversion: pct(purchaseCompleted, quizStarted),
    };

    // Step dropoff
    const sortedSteps = (stepData ?? []).map((r: any) => ({ step: Number(r.step_number), views: Number(r.unique_sessions) }));
    const stepDropoff = sortedSteps.map((item: any, i: number) => {
      const prev = i > 0 ? sortedSteps[i - 1].views : item.views;
      const dropoffRate = prev > 0 ? Number((((prev - item.views) / prev) * 100).toFixed(1)) : 0;
      return { ...item, dropoffRate };
    });

    // Daily trend
    const dailyMap = new Map<string, { started: number; completed: number; purchased: number }>();
    for (const row of trendData ?? []) {
      const date = String(row.day);
      if (!dailyMap.has(date)) dailyMap.set(date, { started: 0, completed: 0, purchased: 0 });
      const day = dailyMap.get(date)!;
      const count = Number(row.unique_sessions);
      if (row.event_type === "step_viewed") day.started = count;
      if (row.event_type === "quiz_completed") day.completed = count;
      if (row.event_type === "purchase_completed") day.purchased = count;
    }
    const dailyTrend = [...dailyMap.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([date, d]) => ({ date, ...d }));

    // Archetype distribution
    const archetypeDistribution = (archetypeData ?? []).map((r: any) => ({ archetypeId: String(r.archetype_id), count: Number(r.count) }));

    // Avg completion time
    const avgCompletionTime = completionData?.[0]?.avg_seconds ? Number(completionData[0].avg_seconds) : 0;

    // Recent submissions
    const recentSubmissions = (recentData ?? []).map((r: any) => ({
      id: r.id, email: r.email, child_name: r.child_name ?? "", child_gender: r.child_gender ?? "", archetype_id: r.archetype_id, paid: r.paid, created_at: r.created_at,
    }));

    // Trait pair grouping + distribution (needs raw rows for JSON processing)
    const sinceDate = new Date(sinceTs);
    const recentSubs = submissionRows.filter((r) => new Date(r.created_at) >= sinceDate);

    const traitPairUserMap = new Map<string, Array<{ email: string; archetype: string; paid: boolean; created_at: string }>>();
    const pairCounts = new Map<string, number>();

    for (const row of submissionRows) {
      const scores = row.trait_scores as import("@adhd-parenting-quiz/shared").TraitScores | null;
      if (!scores) continue;
      const sorted = Object.entries(scores).sort(([, a], [, b]) => b - a);
      if (sorted.length < 2) continue;
      const pair = [sorted[0][0], sorted[1][0]].sort().join(" & ");
      if (!traitPairUserMap.has(pair)) traitPairUserMap.set(pair, []);
      traitPairUserMap.get(pair)!.push({ email: row.email, archetype: row.archetype_id, paid: row.paid, created_at: row.created_at });
    }
    for (const row of recentSubs) {
      const scores = row.trait_scores as import("@adhd-parenting-quiz/shared").TraitScores | null;
      if (!scores) continue;
      const sorted = Object.entries(scores).sort(([, a], [, b]) => b - a);
      if (sorted.length < 2) continue;
      const pair = [sorted[0][0], sorted[1][0]].sort().join(" & ");
      pairCounts.set(pair, (pairCounts.get(pair) ?? 0) + 1);
    }

    const submissionsByTraitPair = [...traitPairUserMap.entries()].map(([pair, users]) => ({ pair, users })).sort((a, b) => b.users.length - a.users.length);
    const traitPairDistribution = [...pairCounts.entries()].map(([pair, count]) => ({ pair, count })).sort((a, b) => b.count - a.count);

    // Answer distribution — still needs raw funnel events with metadata
    // Use paginated fetch for answer_submitted events only
    type AnswerRow = { metadata: Record<string, unknown> | null };
    const answerRows = await allRows<AnswerRow>(sb, "funnel_events", "metadata", (q: any) => q.eq("event_type", "answer_submitted").gte("created_at", sinceTs));

    const answerMap = new Map<string, Map<string, number>>();
    for (const row of answerRows) {
      if (!row.metadata?.questionKey) continue;
      const qKey = String(row.metadata.questionKey);
      const aVal = String(row.metadata.answerValue ?? "");
      if (!answerMap.has(qKey)) answerMap.set(qKey, new Map());
      const counts = answerMap.get(qKey)!;
      counts.set(aVal, (counts.get(aVal) ?? 0) + 1);
    }
    const answerDistribution = [...answerMap.entries()].map(([questionKey, counts]) => {
      const totalResponses = [...counts.values()].reduce((a, b) => a + b, 0);
      let topAnswer = ""; let topCount = 0;
      for (const [answer, count] of counts) { if (count > topCount) { topAnswer = answer; topCount = count; } }
      return { questionKey, topAnswer, percentage: totalResponses > 0 ? Number(((topCount / totalResponses) * 100).toFixed(1)) : 0, totalResponses };
    });

    return { stepDropoff, funnelSummary, recentSubmissions, dailyTrend, archetypeDistribution, traitPairDistribution, answerDistribution, avgCompletionTime, submissionsByTraitPair };
  }

  // ── Fallback: paginated client-side aggregation ──────────────────────────
  // Used when RPCs aren't installed yet. Works correctly but slower.
  console.warn("analytics: RPCs not found, using paginated fallback. Run supabase/migrations/001_analytics_rpcs.sql to enable RPCs.");

  type FunnelRow = { session_id: string; event_type: string; step_number: number | null; created_at: string; metadata: Record<string, unknown> | null; is_test?: boolean };
  type SubRow = { id: string; email: string; child_name: string; child_gender: string; archetype_id: string; trait_scores: Record<string, number> | null; paid: boolean; created_at: string; is_test?: boolean };

  const [rawFunnelRows, rawSubmissionRows] = await Promise.all([
    allRows<FunnelRow>(sb, "funnel_events", "session_id, event_type, step_number, created_at, metadata, is_test", (q: any) => q.gte("created_at", sinceTs)),
    allRows<SubRow>(sb, "quiz_submissions", "id, email, child_name, child_gender, archetype_id, trait_scores, paid, created_at, is_test", (q: any) => q),
  ]);

  // Filter out test data
  const funnelRows = rawFunnelRows.filter((r) => !r.is_test);
  const submissionRows = rawSubmissionRows.filter((r) => !r.is_test);

  // Step dropoff
  const stepCounts = new Map<number, Set<string>>();
  for (const row of funnelRows) {
    if (row.event_type !== "step_viewed" || row.step_number == null) continue;
    if (!stepCounts.has(row.step_number)) stepCounts.set(row.step_number, new Set());
    stepCounts.get(row.step_number)!.add(row.session_id);
  }
  const sortedSteps = [...stepCounts.entries()].sort(([a], [b]) => a - b).map(([step, s]) => ({ step, views: s.size }));
  const stepDropoff = sortedSteps.map((item, i) => {
    const prev = i > 0 ? sortedSteps[i - 1].views : item.views;
    return { ...item, dropoffRate: prev > 0 ? Number((((prev - item.views) / prev) * 100).toFixed(1)) : 0 };
  });

  // Funnel summary
  const eventSessions = new Map<string, Set<string>>();
  for (const row of funnelRows) {
    if (!eventSessions.has(row.event_type)) eventSessions.set(row.event_type, new Set());
    eventSessions.get(row.event_type)!.add(row.session_id);
  }
  const quizStarted = eventSessions.get("step_viewed")?.size ?? 0;
  const quizCompleted = eventSessions.get("quiz_completed")?.size ?? 0;
  const checkoutStarted = eventSessions.get("checkout_started")?.size ?? 0;
  const purchaseCompleted = eventSessions.get("purchase_completed")?.size ?? 0;
  const funnelSummary = {
    quizStarted, quizCompleted, checkoutStarted, purchaseCompleted,
    quizCompletionRate: pct(quizCompleted, quizStarted), checkoutRate: pct(checkoutStarted, quizCompleted),
    purchaseRate: pct(purchaseCompleted, checkoutStarted), overallConversion: pct(purchaseCompleted, quizStarted),
  };

  // Recent submissions
  const recentSubmissions = [...submissionRows].sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, 50)
    .map((r) => ({ id: r.id, email: r.email, child_name: r.child_name ?? "", child_gender: r.child_gender ?? "", archetype_id: r.archetype_id, paid: r.paid, created_at: r.created_at }));

  // Trait pair grouping
  const traitPairUserMap = new Map<string, Array<{ email: string; archetype: string; paid: boolean; created_at: string }>>();
  for (const row of submissionRows) {
    const scores = row.trait_scores as import("@adhd-parenting-quiz/shared").TraitScores | null;
    if (!scores) continue;
    const sorted = Object.entries(scores).sort(([, a], [, b]) => b - a);
    if (sorted.length < 2) continue;
    const pair = [sorted[0][0], sorted[1][0]].sort().join(" & ");
    if (!traitPairUserMap.has(pair)) traitPairUserMap.set(pair, []);
    traitPairUserMap.get(pair)!.push({ email: row.email, archetype: row.archetype_id, paid: row.paid, created_at: row.created_at });
  }
  const submissionsByTraitPair = [...traitPairUserMap.entries()].map(([pair, users]) => ({ pair, users })).sort((a, b) => b.users.length - a.users.length);

  // Daily trend
  const dailyMap = new Map<string, { started: Set<string>; completed: Set<string>; purchased: Set<string> }>();
  for (const row of funnelRows) {
    const date = row.created_at.slice(0, 10);
    if (!dailyMap.has(date)) dailyMap.set(date, { started: new Set(), completed: new Set(), purchased: new Set() });
    const day = dailyMap.get(date)!;
    if (row.event_type === "step_viewed") day.started.add(row.session_id);
    if (row.event_type === "quiz_completed") day.completed.add(row.session_id);
    if (row.event_type === "purchase_completed") day.purchased.add(row.session_id);
  }
  const dailyTrend = [...dailyMap.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([date, sets]) => ({ date, started: sets.started.size, completed: sets.completed.size, purchased: sets.purchased.size }));

  // Archetype + trait pair distribution
  const sinceDate = new Date(sinceTs);
  const recentSubs = submissionRows.filter((r) => new Date(r.created_at) >= sinceDate);
  const archetypeCounts = new Map<string, number>();
  for (const row of recentSubs) archetypeCounts.set(row.archetype_id, (archetypeCounts.get(row.archetype_id) ?? 0) + 1);
  const archetypeDistribution = [...archetypeCounts.entries()].map(([archetypeId, count]) => ({ archetypeId, count })).sort((a, b) => b.count - a.count);

  const pairCounts = new Map<string, number>();
  for (const row of recentSubs) {
    const scores = row.trait_scores as import("@adhd-parenting-quiz/shared").TraitScores | null;
    if (!scores) continue;
    const sorted = Object.entries(scores).sort(([, a], [, b]) => b - a);
    if (sorted.length < 2) continue;
    const pair = [sorted[0][0], sorted[1][0]].sort().join(" & ");
    pairCounts.set(pair, (pairCounts.get(pair) ?? 0) + 1);
  }
  const traitPairDistribution = [...pairCounts.entries()].map(([pair, count]) => ({ pair, count })).sort((a, b) => b.count - a.count);

  // Answer distribution
  const answerMap = new Map<string, Map<string, number>>();
  for (const row of funnelRows) {
    if (row.event_type !== "answer_submitted" || !row.metadata?.questionKey) continue;
    const qKey = String(row.metadata.questionKey);
    const aVal = String(row.metadata.answerValue ?? "");
    if (!answerMap.has(qKey)) answerMap.set(qKey, new Map());
    answerMap.get(qKey)!.set(aVal, (answerMap.get(qKey)!.get(aVal) ?? 0) + 1);
  }
  const answerDistribution = [...answerMap.entries()].map(([questionKey, counts]) => {
    const totalResponses = [...counts.values()].reduce((a, b) => a + b, 0);
    let topAnswer = ""; let topCount = 0;
    for (const [answer, count] of counts) { if (count > topCount) { topAnswer = answer; topCount = count; } }
    return { questionKey, topAnswer, percentage: totalResponses > 0 ? Number(((topCount / totalResponses) * 100).toFixed(1)) : 0, totalResponses };
  });

  // Avg completion time
  const sessionTimes = new Map<string, { firstStep?: Date; completed?: Date }>();
  for (const row of funnelRows) {
    if (row.event_type !== "step_viewed" && row.event_type !== "quiz_completed") continue;
    if (!sessionTimes.has(row.session_id)) sessionTimes.set(row.session_id, {});
    const entry = sessionTimes.get(row.session_id)!;
    const ts = new Date(row.created_at);
    if (row.event_type === "step_viewed" && (!entry.firstStep || ts < entry.firstStep)) entry.firstStep = ts;
    if (row.event_type === "quiz_completed") entry.completed = ts;
  }
  let totalSeconds = 0; let completedCount = 0;
  for (const { firstStep, completed } of sessionTimes.values()) {
    if (firstStep && completed) { totalSeconds += (completed.getTime() - firstStep.getTime()) / 1000; completedCount++; }
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

export interface RescoreMismatch {
  id: string;
  email: string;
  childName: string;
  childGender: string;
  currentArchetype: string;
  correctArchetype: string;
}

async function fetchMismatches(): Promise<{ total: number; mismatches: RescoreMismatch[] }> {
  const { matchArchetype, applyGenderVariant } = await import("@adhd-parenting-quiz/shared");
  const sb = getSupabaseAdmin();
  if (!sb) return { total: 0, mismatches: [] };

  const { data: rows, error } = await sb
    .from("quiz_submissions")
    .select("id, email, child_name, child_gender, archetype_id, trait_scores");

  if (error || !rows) throw new Error(`Failed to fetch submissions: ${error?.message}`);

  const mismatches: RescoreMismatch[] = [];
  for (const row of rows) {
    if (!row.trait_scores) continue;
    const baseMatch = matchArchetype(row.trait_scores as import("@adhd-parenting-quiz/shared").TraitScores);
    const correct = { ...baseMatch, id: applyGenderVariant(baseMatch.id, row.child_gender ?? undefined) };
    if (correct.id !== row.archetype_id) {
      mismatches.push({
        id: row.id,
        email: row.email,
        childName: row.child_name ?? "",
        childGender: row.child_gender ?? "Other",
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

/**
 * Updates archetype_id and pdf_url for all mismatched submissions.
 * The pdfUrlGenerator is provided by the caller (admin route) since it needs API_BASE_URL etc.
 */
export async function applyRescoreAndResend(
  pdfUrlGenerator: (archetypeId: string, childName: string, childGender: string) => string,
): Promise<{ total: number; updated: number; changes: Array<RescoreMismatch & { newPdfUrl: string }> }> {
  const sb = getSupabaseAdmin();
  if (!sb) return { total: 0, updated: 0, changes: [] };

  const { total, mismatches } = await fetchMismatches();
  const applied: Array<RescoreMismatch & { newPdfUrl: string }> = [];

  for (const m of mismatches) {
    const newPdfUrl = pdfUrlGenerator(m.correctArchetype, m.childName, m.childGender);
    const { error } = await sb
      .from("quiz_submissions")
      .update({ archetype_id: m.correctArchetype, pdf_url: newPdfUrl })
      .eq("id", m.id);

    if (!error) applied.push({ ...m, newPdfUrl });
  }

  return { total, updated: applied.length, changes: applied };
}

/**
 * Read-only: returns mismatches with newly generated PDF URLs — does NOT write to DB.
 */
export async function getRescoredPdfLinks(
  pdfUrlGenerator: (archetypeId: string, childName: string, childGender: string) => string,
): Promise<{ total: number; count: number; links: Array<RescoreMismatch & { newPdfUrl: string }> }> {
  const { total, mismatches } = await fetchMismatches();
  const links = mismatches.map((m) => ({
    ...m,
    newPdfUrl: pdfUrlGenerator(m.correctArchetype, m.childName, m.childGender),
  }));
  return { total, count: links.length, links };
}
