import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearOnboardingStorage } from "../../hooks/useOnboarding";
import { computeTraitProfile, ARCHETYPES } from "@adhd-parenting-quiz/shared";
import type { OnboardingResponses } from "../../types/onboarding";

const ANALYSIS_SECTION_TEMPLATES = [
  "Reviewing attention patterns…",
  "Identifying emotional profile…",
  "Matching executive function traits…",
  "Finding {name}'s ADHD Personality Type",
];

const TESTIMONIALS = [
  {
    name: "Frederick",
    text: "Skeptical at first, but the accuracy amazed me. It's helping me parent my daughter the way she needs.",
  },
  {
    name: "Vanessa",
    text: "My son took the assessment with me so that I could make sure the questions were answered accurately and not just from my perspective. He read the final report and said, \"How do they know who I am?!\"",
  },
  {
    name: "Fiona",
    text: "By the end of page 3, I burst into tears. But those were tears of awareness after knowing that there's nothing wrong with any of us, but only wired differently. And unconditional love is the answer to almost any issue.",
  },
  {
    name: "Kim",
    text: "What I learned about my child boosted my confidence in parenting.",
  },
];

function FiveStars() {
  return (
    <div className="flex items-center justify-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function CalculatingScreen({
  responses,
}: {
  responses: OnboardingResponses;
}) {
  const navigate = useNavigate();
  const childName = ((responses.childName as string | undefined) ?? "your child").trim();
  const childGender = responses.childGender as string | undefined;

  const ANALYSIS_SECTIONS = ANALYSIS_SECTION_TEMPLATES.map((t) =>
    t.replace("{name}", childName),
  );

  const [sectionProgress, setSectionProgress] = useState<number[]>(
    () => ANALYSIS_SECTION_TEMPLATES.map(() => 0),
  );
  const [activeSection, setActiveSection] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Compute archetype client-side
  const traitProfile = useMemo(
    () => computeTraitProfile(responses as Record<string, unknown>, childGender),
    [responses, childGender],
  );
  const archetype = useMemo(
    () => ARCHETYPES.find((a) => a.id === traitProfile.archetypeId) ?? ARCHETYPES[0],
    [traitProfile.archetypeId],
  );

  // Section-by-section progress: 4 sections × 3s each = 12s total
  useEffect(() => {
    const totalSections = ANALYSIS_SECTIONS.length;
    const perSection = 3000; // 3s per section
    const tickInterval = 30;
    const ticksPerSection = perSection / tickInterval;
    let currentSection = 0;
    let tick = 0;

    let holdTicks = 0;
    const holdDuration = 4;

    const timer = setInterval(() => {
      if (holdTicks > 0) {
        holdTicks--;
        if (holdTicks === 0) {
          currentSection++;
          if (currentSection >= totalSections) {
            clearInterval(timer);
            // Navigate after completion
            setTimeout(() => {
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
            }, 500);
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
  }, []);

  // Cycle testimonials every 3s (in sync with sections)
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-[100dvh] bg-harbor-bg flex flex-col items-center justify-center px-6 py-12 overflow-hidden">
      <div className="max-w-sm w-full space-y-8 text-center">
        <div className="space-y-3">
          <div className="text-5xl animate-pulse">🧠</div>
          <h2 className="text-2xl font-bold text-harbor-primary">
            Analysing {childName}'s profile…
          </h2>
        </div>

        {/* Progress sections */}
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

        {/* Testimonials */}
        <div className="bg-white rounded-2xl border border-harbor-text/10 shadow-sm p-5 space-y-3 min-h-[160px] flex flex-col items-center justify-center overflow-hidden">
          <FiveStars />
          <div
            key={activeTestimonial}
            className="text-center space-y-2"
            style={{ animation: "slideInRight 0.5s ease-out both" }}
          >
            <p className="text-sm text-harbor-text leading-relaxed italic">
              &ldquo;{TESTIMONIALS[activeTestimonial].text}&rdquo;
            </p>
            <p className="text-xs font-semibold text-harbor-primary">
              — {TESTIMONIALS[activeTestimonial].name}
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
