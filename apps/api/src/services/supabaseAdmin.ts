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

  // Try a plain insert first.
  const { data: row, error } = await sb
    .from("quiz_submissions")
    .insert(data)
    .select("id")
    .single();

  if (!error) return row?.id ?? null;

  // If the error is a unique-constraint violation (23505), the email already
  // exists — update the existing row with the latest data and return its id.
  if (error.code === "23505") {
    const { data: updated, error: updateError } = await sb
      .from("quiz_submissions")
      .update({
        child_name: data.child_name,
        child_gender: data.child_gender,
        caregiver_type: data.caregiver_type,
        child_age_range: data.child_age_range,
        adhd_journey: data.adhd_journey,
        archetype_id: data.archetype_id,
        trait_scores: data.trait_scores,
        responses: data.responses,
        pdf_url: data.pdf_url,
      })
      .eq("email", data.email)
      .select("id")
      .single();

    if (updateError) {
      console.error("supabaseAdmin.insertQuizSubmission update failed:", JSON.stringify({
        code: updateError.code,
        message: updateError.message,
        hint: updateError.hint,
        email: data.email,
      }));
      return null;
    }
    return updated?.id ?? null;
  }

  // Any other error — log full details so Railway shows what went wrong
  console.error("supabaseAdmin.insertQuizSubmission failed:", JSON.stringify({
    code: error.code,
    message: error.message,
    details: error.details,
    hint: error.hint,
    email: data.email,
  }));
  return null;
}


/** Mark a submission as paid by matching its signed PDF URL */
export async function markPaidByPdfUrl(pdfUrl: string): Promise<void> {
  const sb = getSupabaseAdmin();
  if (!sb) return;
  const { error } = await sb
    .from("quiz_submissions")
    .update({ paid: true })
    .eq("pdf_url", pdfUrl)
    .eq("paid", false);

  if (error) {
    console.error("supabaseAdmin.markPaidByPdfUrl failed:", error.message);
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
    const { data, error } = await applyFilters(sb.from(table).select(cols).order('created_at', { ascending: true })).range(offset, offset + PAGE - 1);
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
  // days=0 means all-time: use epoch as the floor
  const since = days === 0 ? new Date(0) : new Date();
  if (days !== 0) since.setDate(since.getDate() - days);
  const sinceTs = since.toISOString();

  // If analytics were reset, use the reset timestamp as the floor for ALL queries
  const resetAt = await getAnalyticsResetAt();
  const submissionCutoff = resetAt ?? null;
  // For submissions, always use resetAt if set (regardless of days filter)
  const effectiveSinceTs = submissionCutoff && submissionCutoff > sinceTs ? submissionCutoff : sinceTs;

  const pct = (n: number, d: number) => (d > 0 ? Number(((n / d) * 100).toFixed(1)) : 0);

  // ── Try RPC-based analytics (server-side aggregation, no row limits) ─────
  // Falls back to paginated client-side aggregation if RPCs aren't installed.
  // Skip RPCs when a reset cutoff is active — RPCs don't support the cutoff filter
  const useRpc = submissionCutoff ? false : await (async () => {
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
      sb.from("quiz_submissions").select("id, email, child_name, child_gender, archetype_id, paid, created_at").gte("created_at", effectiveSinceTs).order("created_at", { ascending: false }).limit(50),
      allRows<SubRow>(sb, "quiz_submissions", "id, email, child_name, child_gender, archetype_id, trait_scores, paid, created_at, is_test", (q: any) => q.gte("created_at", effectiveSinceTs)),
    ]);

    // Funnel summary
    const eventMap = new Map<string, number>();
    for (const row of funnelData ?? []) eventMap.set(row.event_type, Number(row.unique_sessions));
    // Use step 1 count as "quizStarted" for consistency with fallback path
    const step1Data = (stepData ?? []).find((r: any) => Number(r.step_number) === 1);
    const quizStarted = step1Data ? Number(step1Data.unique_sessions) : (eventMap.get("step_viewed") ?? 0);
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

    // Daily trend — use step1_trend RPC for accurate "started" count (step 1 only)
    // Fall back to step_viewed if step1 RPC not available
    let step1TrendData: any[] | null = null;
    let step1Err: any = null;
    try {
      const res = await sb.rpc("analytics_daily_step1_trend", { since_ts: sinceTs });
      step1TrendData = res.data;
      step1Err = res.error;
    } catch {
      step1Err = true;
    }

    const dailyMap = new Map<string, { started: number; completed: number; purchased: number }>();
    // Populate completed + purchased from the original trend RPC
    for (const row of trendData ?? []) {
      const date = String(row.day);
      if (!dailyMap.has(date)) dailyMap.set(date, { started: 0, completed: 0, purchased: 0 });
      const day = dailyMap.get(date)!;
      const count = Number(row.unique_sessions);
      if (row.event_type === "quiz_completed") day.completed = count;
      if (row.event_type === "purchase_completed") day.purchased = count;
    }
    // Populate "started" from step1 RPC (accurate) or fall back to step_viewed (all steps)
    if (!step1Err && step1TrendData) {
      for (const row of step1TrendData) {
        const date = String(row.day);
        if (!dailyMap.has(date)) dailyMap.set(date, { started: 0, completed: 0, purchased: 0 });
        dailyMap.get(date)!.started = Number(row.unique_sessions);
      }
    } else {
      // Fallback: use all step_viewed (less accurate but still works)
      for (const row of trendData ?? []) {
        if (row.event_type === "step_viewed") {
          const date = String(row.day);
          if (!dailyMap.has(date)) dailyMap.set(date, { started: 0, completed: 0, purchased: 0 });
          dailyMap.get(date)!.started = Number(row.unique_sessions);
        }
      }
    }
    const dailyTrend = [...dailyMap.entries()].sort(([a], [b]) => b.localeCompare(a)).map(([date, d]) => ({ date, ...d }));

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
    const answerRows = await allRows<AnswerRow>(sb, "funnel_events", "metadata", (q: any) => q.eq("event_type", "answer_submitted").gte("created_at", effectiveSinceTs));

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
    allRows<FunnelRow>(sb, "funnel_events", "session_id, event_type, step_number, created_at, metadata, is_test", (q: any) => q.gte("created_at", effectiveSinceTs)),
    allRows<SubRow>(sb, "quiz_submissions", "id, email, child_name, child_gender, archetype_id, trait_scores, paid, created_at, is_test", (q: any) =>
      q.gte("created_at", effectiveSinceTs)
    ),
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
  const quizStarted = stepCounts.get(1)?.size ?? eventSessions.get("step_viewed")?.size ?? 0;
  const quizCompleted = eventSessions.get("quiz_completed")?.size ?? 0;
  const emailSubmitted = eventSessions.get("optin_completed")?.size ?? 0;
  const checkoutStarted = (eventSessions.get("wp_checkout_redirect")?.size ?? 0) + (eventSessions.get("checkout_started")?.size ?? 0);
  const purchaseCompleted = eventSessions.get("purchase_completed")?.size ?? 0;
  // Also count paid submissions as purchased (PDF download marks paid=true)
  const paidSubmissions = submissionRows.filter((r) => r.paid).length;
  const purchased = Math.max(purchaseCompleted, paidSubmissions);
  const funnelSummary = {
    quizStarted, quizCompleted, emailSubmitted, checkoutStarted, purchaseCompleted: purchased,
    quizCompletionRate: pct(quizCompleted, quizStarted),
    emailSubmitRate: pct(emailSubmitted, quizCompleted),
    checkoutRate: pct(checkoutStarted, emailSubmitted),
    purchaseRate: pct(purchased, checkoutStarted), overallConversion: pct(purchased, quizStarted),
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
  type DayBuckets = { started: Set<string>; completed: Set<string>; nameSubmitted: Set<string>; emailSubmitted: Set<string>; checkoutStarted: Set<string>; purchased: Set<string> };
  const emptyDay = (): DayBuckets => ({ started: new Set(), completed: new Set(), nameSubmitted: new Set(), emailSubmitted: new Set(), checkoutStarted: new Set(), purchased: new Set() });
  const dailyMap = new Map<string, DayBuckets>();
  for (const row of funnelRows) {
    const date = row.created_at.slice(0, 10);
    if (!dailyMap.has(date)) dailyMap.set(date, emptyDay());
    const day = dailyMap.get(date)!;
    if (row.event_type === "step_viewed" && row.step_number === 1) day.started.add(row.session_id);
    if (row.event_type === "quiz_completed") day.completed.add(row.session_id);
    if (row.step_number === 44) day.nameSubmitted.add(row.session_id);
    if (row.event_type === "checkout_started" || row.event_type === "wp_checkout_redirect") day.checkoutStarted.add(row.session_id);
    if (row.event_type === "purchase_completed") day.purchased.add(row.session_id);
  }
  // Use quiz_submissions as the source of truth for emailSubmitted and purchased
  for (const row of submissionRows) {
    const date = row.created_at.slice(0, 10);
    if (!dailyMap.has(date)) dailyMap.set(date, emptyDay());
    dailyMap.get(date)!.emailSubmitted.add(row.id);
    if (row.paid) dailyMap.get(date)!.purchased.add(row.id);
  }
  const dailyTrend = [...dailyMap.entries()].sort(([a], [b]) => b.localeCompare(a)).map(([date, sets]) => ({
    date,
    started: sets.started.size,
    completed: sets.completed.size,
    nameSubmitted: sets.nameSubmitted.size,
    emailSubmitted: sets.emailSubmitted.size,
    checkoutStarted: sets.checkoutStarted.size,
    purchased: sets.purchased.size,
  }));

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

// ─── Analytics Reset Cutoff ───────────────────────────────────────────────────
// Stored in admin_settings table (key: "analytics_reset_at").
// When set, all analytics queries only show data created after this timestamp.
// Quiz submissions remain in the DB for AI app / user access.

export async function getAnalyticsResetAt(): Promise<string | null> {
  const sb = getSupabaseAdmin();
  if (!sb) return null;
  const { data } = await sb
    .from("admin_settings")
    .select("value")
    .eq("key", "analytics_reset_at")
    .single();
  return data?.value ?? null;
}

// ─── Reset Analytics ──────────────────────────────────────────────────────────

export async function resetAnalytics(): Promise<{ resetAt: string }> {
  const sb = getSupabaseAdmin();
  if (!sb) throw new Error("Supabase not configured");

  // Use Slovenia local time (CET/CEST = Europe/Ljubljana)
  const resetAt = new Date().toISOString();

  // Store reset timestamp — all analytics queries filter by this cutoff
  // No data is deleted; funnel events and submissions are preserved in DB
  const { error: settingsError } = await sb
    .from("admin_settings")
    .upsert({ key: "analytics_reset_at", value: resetAt }, { onConflict: "key" });

  if (settingsError) throw new Error(`Failed to store analytics_reset_at: ${settingsError.message}`);

  return { resetAt };
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

export interface PdfUrlMismatch {
  id: string;
  email: string;
  childName: string;
  childGender: string;
  archetypeId: string;
  oldPdfUrl: string;
}

/**
 * Finds submissions where the archetype encoded in pdf_url differs from the current archetype_id.
 * Useful after a rescore that updated archetype_id but left pdf_url unchanged.
 */
export async function fetchPdfUrlMismatches(): Promise<{ total: number; mismatches: PdfUrlMismatch[] }> {
  const sb = getSupabaseAdmin();
  if (!sb) return { total: 0, mismatches: [] };

  const { data: rows, error } = await sb
    .from("quiz_submissions")
    .select("id, email, child_name, child_gender, archetype_id, pdf_url");

  if (error || !rows) throw new Error(`Failed to fetch submissions: ${error?.message}`);

  const mismatches: PdfUrlMismatch[] = [];
  for (const row of rows) {
    if (!row.pdf_url || !row.archetype_id) continue;
    try {
      const url = new URL(row.pdf_url);
      const data = url.searchParams.get("data");
      if (!data) continue;
      const payload = JSON.parse(Buffer.from(data, "base64url").toString("utf8")) as { archetypeId?: string };
      if (payload.archetypeId !== row.archetype_id) {
        mismatches.push({
          id: row.id,
          email: row.email,
          childName: row.child_name ?? "",
          childGender: row.child_gender ?? "Other",
          archetypeId: row.archetype_id,
          oldPdfUrl: row.pdf_url,
        });
      }
    } catch {
      // skip rows with malformed pdf_url
    }
  }

  return { total: rows.length, mismatches };
}

/**
 * For each pdf_url mismatch: generates a new correct URL, updates Supabase, and returns the results.
 * AC update is handled by the caller (admin route) since it needs env vars and logging.
 */
export async function applyPdfUrlFix(
  pdfUrlGenerator: (archetypeId: string, childName: string, childGender: string) => string,
): Promise<{ total: number; updated: number; changes: Array<PdfUrlMismatch & { newPdfUrl: string }> }> {
  const sb = getSupabaseAdmin();
  if (!sb) return { total: 0, updated: 0, changes: [] };

  const { total, mismatches } = await fetchPdfUrlMismatches();
  const applied: Array<PdfUrlMismatch & { newPdfUrl: string }> = [];

  for (const m of mismatches) {
    const newPdfUrl = pdfUrlGenerator(m.archetypeId, m.childName, m.childGender);
    const { error } = await sb
      .from("quiz_submissions")
      .update({ pdf_url: newPdfUrl })
      .eq("id", m.id);

    if (!error) applied.push({ ...m, newPdfUrl });
  }

  return { total, updated: applied.length, changes: applied };
}
