import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearOnboardingStorage } from "../../hooks/useOnboarding";
import { computeTraitProfile, ARCHETYPES } from "@adhd-parenting-quiz/shared";
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

type Phase = "analyzing" | "found";

export default function CalculatingScreen({
  responses,
}: {
  responses: OnboardingResponses;
}) {
  const navigate = useNavigate();
  const childName = (responses.childName as string | undefined) ?? "your child";
  const childGender = responses.childGender as string | undefined;

  const [phase, setPhase] = useState<Phase>("analyzing");
  const [sectionProgress, setSectionProgress] = useState<number[]>(
    () => ANALYSIS_SECTIONS.map(() => 0),
  );
  const [activeSection, setActiveSection] = useState(0);

  // Compute archetype client-side
  const traitProfile = useMemo(
    () => computeTraitProfile(responses as Record<string, unknown>),
    [responses],
  );
  const archetype = useMemo(
    () => ARCHETYPES.find((a) => a.id === traitProfile.archetypeId) ?? ARCHETYPES[0],
    [traitProfile.archetypeId],
  );

  // Section-by-section progress: each fills 0→100 sequentially, ~7s total
  useEffect(() => {
    if (phase !== "analyzing") return;
    const totalSections = ANALYSIS_SECTIONS.length;
    const perSection = 1170;
    const tickInterval = 30;
    const ticksPerSection = perSection / tickInterval;
    let currentSection = 0;
    let tick = 0;

    let holdTicks = 0;
    const holdDuration = 8;

    const timer = setInterval(() => {
      if (holdTicks > 0) {
        holdTicks--;
        if (holdTicks === 0) {
          currentSection++;
          if (currentSection >= totalSections) {
            clearInterval(timer);
            setTimeout(() => setPhase("found"), 400);
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

  // "We found it" frame holds for 2.5s then navigates to sales page
  useEffect(() => {
    if (phase !== "found") return;
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
    return () => clearTimeout(timer);
  }, [phase, responses, childName, childGender, archetype.id, navigate]);

  // ─── "We found it" frame ────────────────────────────────────────────────
  if (phase === "found") {
    return (
      <div className="h-[100dvh] bg-harbor-bg flex items-center justify-center px-6 py-12 overflow-hidden">
        <div
          className="max-w-sm w-full space-y-6 text-center"
          style={{ animation: "fadeIn 0.6s ease-out" }}
        >
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
                  {(isActive || isDone) && (
                    <span className={`text-xs tabular-nums ${isDone ? "text-harbor-accent" : "text-harbor-text/40"}`}>
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
