-- ============================================================================
-- Analytics RPC functions — run in Supabase SQL Editor
-- These do all aggregation server-side, eliminating row-limit issues.
-- All funnel_events queries filter out test data (is_test != true).
-- ============================================================================

-- 1. Funnel summary: distinct sessions per event type
CREATE OR REPLACE FUNCTION analytics_funnel_summary(since_ts timestamptz)
RETURNS TABLE(event_type text, unique_sessions bigint) AS $$
  SELECT
    event_type::text,
    COUNT(DISTINCT session_id) AS unique_sessions
  FROM funnel_events
  WHERE created_at >= since_ts
    AND (is_test IS NULL OR is_test = false)
  GROUP BY event_type;
$$ LANGUAGE sql STABLE;

-- 2. Step dropoff: distinct sessions per step number
CREATE OR REPLACE FUNCTION analytics_step_dropoff(since_ts timestamptz)
RETURNS TABLE(step_number int, unique_sessions bigint) AS $$
  SELECT
    step_number::int,
    COUNT(DISTINCT session_id) AS unique_sessions
  FROM funnel_events
  WHERE created_at >= since_ts
    AND event_type = 'step_viewed'
    AND step_number IS NOT NULL
    AND (is_test IS NULL OR is_test = false)
  GROUP BY step_number
  ORDER BY step_number;
$$ LANGUAGE sql STABLE;

-- 3. Daily trend: distinct sessions per event type per day
CREATE OR REPLACE FUNCTION analytics_daily_trend(since_ts timestamptz)
RETURNS TABLE(day date, event_type text, unique_sessions bigint) AS $$
  SELECT
    (created_at AT TIME ZONE 'UTC')::date AS day,
    event_type::text,
    COUNT(DISTINCT session_id) AS unique_sessions
  FROM funnel_events
  WHERE created_at >= since_ts
    AND (is_test IS NULL OR is_test = false)
  GROUP BY day, event_type
  ORDER BY day;
$$ LANGUAGE sql STABLE;

-- 3b. Daily step-1 trend: only sessions that viewed step 1 (accurate "started" count)
CREATE OR REPLACE FUNCTION analytics_daily_step1_trend(since_ts timestamptz)
RETURNS TABLE(day date, unique_sessions bigint) AS $$
  SELECT
    (created_at AT TIME ZONE 'UTC')::date AS day,
    COUNT(DISTINCT session_id) AS unique_sessions
  FROM funnel_events
  WHERE created_at >= since_ts
    AND event_type = 'step_viewed'
    AND step_number = 1
    AND (is_test IS NULL OR is_test = false)
  GROUP BY day
  ORDER BY day;
$$ LANGUAGE sql STABLE;

-- 4. Archetype distribution: count submissions per archetype
CREATE OR REPLACE FUNCTION analytics_archetype_distribution(since_ts timestamptz)
RETURNS TABLE(archetype_id text, count bigint) AS $$
  SELECT
    archetype_id::text,
    COUNT(*) AS count
  FROM quiz_submissions
  WHERE created_at >= since_ts
    AND (is_test IS NULL OR is_test = false)
  GROUP BY archetype_id
  ORDER BY count DESC;
$$ LANGUAGE sql STABLE;

-- 5. Average completion time (seconds between first step_viewed and quiz_completed)
CREATE OR REPLACE FUNCTION analytics_avg_completion_time(since_ts timestamptz)
RETURNS TABLE(avg_seconds numeric, completed_count bigint) AS $$
  WITH starts AS (
    SELECT session_id, MIN(created_at) AS first_step
    FROM funnel_events
    WHERE event_type = 'step_viewed'
      AND created_at >= since_ts
      AND (is_test IS NULL OR is_test = false)
    GROUP BY session_id
  ),
  completions AS (
    SELECT session_id, MIN(created_at) AS completed_at
    FROM funnel_events
    WHERE event_type = 'quiz_completed'
      AND created_at >= since_ts
      AND (is_test IS NULL OR is_test = false)
    GROUP BY session_id
  )
  SELECT
    ROUND(AVG(EXTRACT(EPOCH FROM (c.completed_at - s.first_step)))) AS avg_seconds,
    COUNT(*) AS completed_count
  FROM starts s
  JOIN completions c ON s.session_id = c.session_id;
$$ LANGUAGE sql STABLE;

-- 6. Recent submissions (last 50)
CREATE OR REPLACE FUNCTION analytics_recent_submissions(lim int DEFAULT 50)
RETURNS TABLE(id uuid, email text, archetype_id text, paid boolean, created_at timestamptz) AS $$
  SELECT id, email::text, archetype_id::text, paid, created_at
  FROM quiz_submissions
  WHERE (is_test IS NULL OR is_test = false)
  ORDER BY created_at DESC
  LIMIT lim;
$$ LANGUAGE sql STABLE;

-- 7. All submissions with trait_scores (for trait pair grouping + rescore)
CREATE OR REPLACE FUNCTION analytics_all_submissions()
RETURNS TABLE(id uuid, email text, archetype_id text, trait_scores jsonb, paid boolean, created_at timestamptz) AS $$
  SELECT id, email::text, archetype_id::text, trait_scores, paid, created_at
  FROM quiz_submissions
  WHERE (is_test IS NULL OR is_test = false)
  ORDER BY created_at DESC;
$$ LANGUAGE sql STABLE;
