import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearOnboardingStorage } from "../../hooks/useOnboarding";
import { computeTraitProfile, ARCHETYPES } from "@adhd-parenting-quiz/shared";
import type { OnboardingResponses } from "../../types/onboarding";

const ANALYSIS_SECTIONS = [
  "Attention patterns",
  "Sensory responses",
  "Emotional profile",
  "Executive function",
  "Social patterns",
  "Generating report",
];

type Phase = "analyzing" | "found";

export default function CalculatingScreen({
  responses,
}: {
  responses: OnboardingResponses;
}) {
  const navigate = useNavigate();
  const childName = ((responses.childName as string | undefined) ?? "your child").trim();
  const childGender = responses.childGender as string | undefined;

  const [phase, setPhase] = useState<Phase>("analyzing");
  const [sectionProgress, setSectionProgress] = useState<number[]>(
    () => ANALYSIS_SECTIONS.map(() => 0),
  );
  const [activeSection, setActiveSection] = useState(0);
  const [bullseyeScale, setBullseyeScale] = useState(0);

  // Compute archetype client-side
  const traitProfile = useMemo(
    () => computeTraitProfile(responses as Record<string, unknown>),
    [responses],
  );
  const archetype = useMemo(
    () => ARCHETYPES.find((a) => a.id === traitProfile.archetypeId) ?? ARCHETYPES[0],
    [traitProfile.archetypeId],
  );

  // Section-by-section progress: each fills 0→100 sequentially, ~6s total (1s shorter)
  useEffect(() => {
    if (phase !== "analyzing") return;
    const totalSections = ANALYSIS_SECTIONS.length;
    const perSection = 900; // 1s per section (~6s total, down from ~7s)
    const tickInterval = 30;
    const ticksPerSection = perSection / tickInterval;
    let currentSection = 0;
    let tick = 0;

    let holdTicks = 0;
    const holdDuration = 6; // shorter hold between sections

    const timer = setInterval(() => {
      if (holdTicks > 0) {
        holdTicks--;
        if (holdTicks === 0) {
          currentSection++;
          if (currentSection >= totalSections) {
            clearInterval(timer);
            setTimeout(() => setPhase("found"), 300);
          }
        }
        return;
      }

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
        holdTicks = holdDuration;
      }
    }, tickInterval);

    return () => clearInterval(timer);
  }, [phase]);

  // "We found it" — expanding bullseye animation then navigate
  useEffect(() => {
    if (phase !== "found") return;

    // Animate bullseye scale: 0 → 1 over 0.6s via CSS transition
    const scaleTimer = requestAnimationFrame(() => setBullseyeScale(1));

    const timer = setTimeout(() => {
      // Store responses in sessionStorage so the sales page can submit to API
      sessionStorage.setItem("wildprint_responses", JSON.stringify(responses));
      sessionStorage.setItem("wildprint_childName", childName);
      sessionStorage.setItem("wildprint_childGender", childGender ?? "");
      sessionStorage.setItem("wildprint_archetypeId", archetype.id);

      clearOnboardingStorage();

      navigate("/results", {
        replace: true,
        state: {
          responses,
          childName,
          childGender,
          archetypeId: archetype.id,
        },
      });
    }, 2500);
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(scaleTimer);
    };
  }, [phase, responses, childName, childGender, archetype.id, navigate]);

  // ─── "We found it" frame ────────────────────────────────────────────────
  if (phase === "found") {
    return (
      <div className="h-[100dvh] bg-harbor-bg flex items-center justify-center px-6 py-12 overflow-hidden">
        <div className="max-w-sm w-full space-y-6 text-center">
          {/* Expanding bullseye */}
          <div
            className="text-7xl mx-auto transition-transform duration-700 ease-out"
            style={{ transform: `scale(${bullseyeScale})` }}
          >
            🎯
          </div>
          <h2
            className="text-2xl font-bold text-harbor-primary"
            style={{ animation: "fadeInUp 0.6s ease-out 0.3s both" }}
          >
            We found it!
          </h2>
          <p
            className="text-harbor-text/60 text-sm"
            style={{ animation: "fadeInUp 0.5s ease-out 0.6s both" }}
          >
            {childName}'s ADHD personality profile is ready
          </p>
        </div>
        <style>{`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: none; }
          }
        `}</style>
      </div>
    );
  }

  // ─── Analyzing phase ──────────────────────────────────────────────────────
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
            const rawPct = sectionProgress[i];
            const isDone = rawPct >= 100;
            const pct = isDone ? 100 : rawPct;
            const isActive = i === activeSection;
            const isPending = pct === 0 && i > activeSection;

            return (
              <div key={label} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-sm font-medium transition-colors duration-300 flex items-center gap-1.5 ${
                      isDone
                        ? "text-green-600"
                        : isActive
                          ? "text-harbor-primary"
                          : "text-harbor-text/30"
                    }`}
                  >
                    {isDone && (
                      <svg className="w-4 h-4 text-green-600 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                    {label}
                  </span>
                  {(isActive || isDone) && (
                    <span className={`text-xs tabular-nums ${isDone ? "text-green-600" : "text-harbor-text/40"}`}>
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
                      isDone ? "bg-green-500" : "bg-harbor-primary"
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
