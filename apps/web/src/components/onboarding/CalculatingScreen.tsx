import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../lib/api";
import { clearOnboardingStorage } from "../../hooks/useOnboarding";
import { getFbp, getFbc, generateEventId, trackPixelEvent } from "../../lib/fbq";
import { trackFunnelEvent } from "../../lib/analytics";
import { computeTraitProfile, ARCHETYPES } from "@adhd-parenting-quiz/shared";
import type { ArchetypeReportTemplate } from "@adhd-parenting-quiz/shared";
import type { OnboardingResponses } from "../../types/onboarding";
import { AnimalIcon } from "../../lib/animalImages";

const ANALYSIS_SECTIONS = [
  "Attention patterns",
  "Sensory responses",
  "Emotional profile",
  "Executive function",
  "Social patterns",
  "Generating report",
];

type Phase = "analyzing" | "found" | "email" | "submitting" | "duplicate";

function getPronouns(gender?: string) {
  const g = (gender ?? "").toLowerCase();
  if (g.includes("boy")) return { obj: "him", pos: "his" };
  if (g.includes("girl")) return { obj: "her", pos: "her" };
  return { obj: "them", pos: "their" };
}

export default function CalculatingScreen({
  responses,
}: {
  responses: OnboardingResponses;
}) {
  const navigate = useNavigate();
  const childName = (responses.childName as string | undefined) ?? "your child";
  const childGender = responses.childGender as string | undefined;
  const { obj: objPronoun } = getPronouns(childGender);

  const [phase, setPhase] = useState<Phase>("analyzing");
  const [sectionProgress, setSectionProgress] = useState<number[]>(
    () => ANALYSIS_SECTIONS.map(() => 0),
  );
  const [activeSection, setActiveSection] = useState(0);
  const [email, setEmail] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Compute archetype client-side
  const traitProfile = useMemo(
    () => computeTraitProfile(responses as Record<string, unknown>),
    [responses],
  );
  const archetype = useMemo(
    () => ARCHETYPES.find((a) => a.id === traitProfile.archetypeId) ?? ARCHETYPES[0],
    [traitProfile.archetypeId],
  );
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Section-by-section progress: each fills 0→100 sequentially, ~5-6s total
  useEffect(() => {
    if (phase !== "analyzing") return;
    const totalSections = ANALYSIS_SECTIONS.length;
    const perSection = 900; // ms per section (~5.4s total)
    const tickInterval = 30;
    const ticksPerSection = perSection / tickInterval;
    let currentSection = 0;
    let tick = 0;

    const timer = setInterval(() => {
      tick++;
      const pct = Math.min(100, Math.round((tick / ticksPerSection) * 100));

      setSectionProgress((prev) => {
        const next = [...prev];
        next[currentSection] = pct;
        return next;
      });
      setActiveSection(currentSection);

      if (pct >= 100) {
        tick = 0;
        currentSection++;
        if (currentSection >= totalSections) {
          clearInterval(timer);
          setTimeout(() => setPhase("found"), 400);
        }
      }
    }, tickInterval);

    return () => clearInterval(timer);
  }, [phase]);

  // "We found it" frame holds for 2s then transitions to email
  useEffect(() => {
    if (phase !== "found") return;
    const timer = setTimeout(() => setPhase("email"), 2000);
    return () => clearTimeout(timer);
  }, [phase]);

  const handleSubmit = useCallback(async () => {
    if (!isValid || phase === "submitting") return;
    setPhase("submitting");
    setSubmitError(null);

    try {
      const eventId = generateEventId();

      const result = (await api.post("/api/guest/submit", {
        email,
        responses,
        childName,
        childGender,
        fbc: getFbc(),
        fbp: getFbp(),
        eventSourceUrl: window.location.href,
      })) as { report: ArchetypeReportTemplate; submissionId?: string; pdfUrl?: string };

      // Client-side Lead event (deduped with CAPI via eventId)
      trackPixelEvent("Lead", {}, eventId);

      // Track quiz completion in funnel analytics
      trackFunnelEvent("quiz_completed", undefined, {
        archetypeId: result.report?.archetypeId,
      });

      // Store data in sessionStorage for ReportPage (survives refresh)
      sessionStorage.setItem("wildprint_childName", childName);
      sessionStorage.setItem("wildprint_email", email);
      sessionStorage.setItem("wildprint_childGender", childGender ?? "");
      sessionStorage.setItem("wildprint_report", JSON.stringify(result.report));
      if (result.pdfUrl) sessionStorage.setItem("wildprint_pdfUrl", result.pdfUrl);

      clearOnboardingStorage();
      // Test mode: skip report/sales, go straight to thank you
      navigate("/thank-you", { replace: true });
    } catch (err) {
      if (err instanceof Error && err.message === "already_submitted") {
        setPhase("duplicate");
        return;
      }
      setSubmitError(
        err instanceof Error ? err.message : "Something went wrong. Please try again.",
      );
      setPhase("email");
    }
  }, [isValid, phase, email, responses, childName, childGender, navigate]);

  // ─── Duplicate email phase ────────────────────────────────────────────────
  if (phase === "duplicate") {
    return (
      <div className="h-[100dvh] bg-harbor-bg flex items-center justify-center px-6 py-12 overflow-hidden">
        <div className="max-w-md w-full bg-white rounded-2xl border border-harbor-text/10 shadow-sm p-7 space-y-5 text-center">
          <div className="text-4xl">👋</div>
          <h2 className="text-xl font-bold text-harbor-primary leading-snug">
            It looks like you've already received your child's ADHD Personality Report.
          </h2>
          <p className="text-harbor-text leading-relaxed text-center">
            We've sent your child's report to this email before. If you can't
            find it, check your spam folder or reach out to us directly at{" "}
            <a
              href="mailto:info@adhdparenting.com"
              className="text-harbor-accent underline"
            >
              info@adhdparenting.com
            </a>{" "}
            and we'll resend it right away.
          </p>
          <p className="text-harbor-text leading-relaxed text-center">
            If you're here for a different child, just use a different email
            address and we'll create a brand new profile for them.
          </p>
          <button
            type="button"
            onClick={() => {
              setEmail("");
              setPhase("email");
            }}
            className="w-full rounded-xl bg-harbor-primary text-white px-5 py-3 font-medium hover:opacity-90 active:scale-[0.98] transition-all"
          >
            Try a different email →
          </button>
        </div>
      </div>
    );
  }

  // ─── "We found it" frame ────────────────────────────────────────────────
  if (phase === "found") {
    return (
      <div className="h-[100dvh] bg-harbor-bg flex items-center justify-center px-6 py-12 overflow-hidden">
        <div className="max-w-sm w-full space-y-6 text-center">
          <AnimalIcon id={archetype.id} className="w-28 h-28 mx-auto" />
          <h2 className="text-2xl font-bold text-harbor-primary">
            We found it.
          </h2>
        </div>
        <style>{`
          @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
        `}</style>
      </div>
    );
  }

  // ─── Analyzing phase ──────────────────────────────────────────────────────
  if (phase === "analyzing") {
    return (
      <div className="h-[100dvh] bg-harbor-bg flex items-center justify-center px-6 py-12 overflow-hidden">
        <div className="max-w-sm w-full space-y-8 text-center">
          <div className="space-y-3">
            <div className="text-5xl animate-pulse">🧠</div>
            <h2 className="text-2xl font-bold text-harbor-primary">
              Analysing {childName}'s profile…
            </h2>
          </div>

          <div className="space-y-3 text-left">
            {ANALYSIS_SECTIONS.map((label, i) => {
              const pct = sectionProgress[i];
              const isActive = i === activeSection;
              const isDone = pct >= 100;
              const isPending = pct === 0 && i > activeSection;

              return (
                <div key={label} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-sm font-medium transition-colors duration-300 ${
                        isDone
                          ? "text-harbor-accent"
                          : isActive
                            ? "text-harbor-primary"
                            : "text-harbor-text/30"
                      }`}
                    >
                      {isDone ? "✓ " : ""}{label}
                    </span>
                    {isActive && (
                      <span className="text-xs text-harbor-text/40 tabular-nums">
                        {pct}%
                      </span>
                    )}
                  </div>
                  <div
                    className={`h-1.5 rounded-full overflow-hidden transition-colors duration-300 ${
                      isPending ? "bg-harbor-text/5" : "bg-harbor-text/10"
                    }`}
                  >
                    <div
                      className={`h-full rounded-full transition-all duration-75 ${
                        isDone ? "bg-harbor-accent" : "bg-harbor-primary"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ─── Email capture phase with archetype reveal ─────────────────────────
  return (
    <div className="h-[100dvh] bg-harbor-bg flex items-center justify-center px-6 py-8 overflow-y-auto">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl border border-harbor-text/10 shadow-sm p-6 space-y-5">
          {/* Archetype reveal */}
          <div className="text-center space-y-3">
            <AnimalIcon id={archetype.id} className="w-24 h-24 mx-auto" />
            <p className="text-sm font-semibold uppercase tracking-widest text-harbor-accent">
              The report has been generated.
            </p>
            <h2 className="text-2xl font-bold text-harbor-primary leading-snug">
              {childName} is {archetype.typeName}.
            </h2>
          </div>

          <p className="text-harbor-text leading-relaxed text-sm text-center">
            Your child's full ADHD Personality Report is ready, including the neuroscience
            behind {childName}'s specific profile, what drains {objPronoun}, what
            fuels {objPronoun}, and the hidden superpower most people around{" "}
            {objPronoun} completely miss.
          </p>

          <div className="space-y-1">
            <p className="text-sm font-medium text-harbor-text text-center">
              Enter your email to unlock {childName}'s results:
            </p>
          </div>

          <div className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && isValid) void handleSubmit();
              }}
              placeholder="you@example.com"
              disabled={phase === "submitting"}
              className="w-full rounded-xl border border-harbor-text/20 bg-harbor-bg px-4 py-3 text-harbor-text placeholder:text-harbor-text/30 focus:outline-none focus:ring-2 focus:ring-harbor-primary/30 focus:border-harbor-primary transition"
            />

            {submitError ? (
              <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2 text-center">
                {submitError}
              </p>
            ) : null}

            <button
              type="button"
              onClick={() => void handleSubmit()}
              disabled={!isValid || phase === "submitting"}
              className="w-full rounded-xl bg-harbor-primary text-white px-5 py-3 font-medium hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {phase === "submitting" ? "Preparing…" : "Show me the Report →"}
            </button>

            <p className="text-xs text-center text-harbor-text/40">
              Your email is safe. We don't spam or sell data, ever.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
