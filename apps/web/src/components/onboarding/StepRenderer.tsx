import React from "react";
import { getStepConfig } from "@adhd-parenting-quiz/shared";
import type { OnboardingResponses } from "../../types/onboarding";
import SingleSelect from "./questions/SingleSelect";
import TextInput from "./questions/TextInput";
import NumberInput from "./questions/NumberInput";
import LikertSelect from "./questions/LikertSelect";
import { TrustPilotReview } from "./TrustPilotReview";

interface StepRendererProps {
  step: number;
  responses: OnboardingResponses;
  onAnswer: (step: number, key: string, value: string | number | undefined, immediate?: boolean) => void;
}

function interpolate(template: string, responses: OnboardingResponses): string {
  const childName = ((responses.childName as string) || "your child").trim();
  const gender = ((responses.childGender as string) ?? "").toLowerCase();
  const isMale = gender === "male" || gender.includes("boy");
  const isFemale = gender === "female" || gender.includes("girl");
  const pos = isMale ? "his" : isFemale ? "her" : "their";
  const obj = isMale ? "him" : isFemale ? "her" : "them";
  const sub = isMale ? "he" : isFemale ? "she" : "they";
  const is_ = isMale ? "is" : isFemale ? "is" : "are";
  const was_ = isMale ? "was" : isFemale ? "was" : "were";
  const dont = isMale ? "doesn't" : isFemale ? "doesn't" : "don't";
  const knows = isMale ? "knows" : isFemale ? "knows" : "know";

  return template
    .replace(/\{childName\}/g, childName)
    .replace(/\{pos\}/g, pos)
    .replace(/\{obj\}/g, obj)
    .replace(/\{sub\}/g, sub)
    .replace(/\{is\}/g, is_)
    .replace(/\{was\}/g, was_)
    .replace(/\{dont\}/g, dont)
    .replace(/\{knows\}/g, knows);
}

export default function StepRenderer({
  step,
  responses,
  onAnswer,
}: StepRendererProps) {
  const config = getStepConfig(step);
  if (!config) return null;

  if (config.type === "basic-info") {
    const q = config.question;
    const title = interpolate(q.title, responses);

    let inner: React.ReactNode = null;
    switch (q.type) {
      case "single-select":
        inner = (
          <SingleSelect
            title={title}
            value={(responses[q.key] as string) ?? ""}
            onChange={(v) => onAnswer(step, q.key, v, true)}
            options={q.options!.map((o, i) => ({ value: o, label: o, emoji: q.optionEmojis?.[i] }))}
          />
        );
        break;
      case "text":
        inner = (
          <TextInput
            title={title}
            value={(responses[q.key] as string) ?? ""}
            onChange={(v) => onAnswer(step, q.key, v)}
            placeholder={q.placeholder}
          />
        );
        break;
      case "number":
        inner = (
          <NumberInput
            title={title}
            value={responses[q.key] as number | undefined}
            onChange={(v) => onAnswer(step, q.key, v)}
          />
        );
        break;
      default:
        return null;
    }

    // ─── Landing page (step 1): photo card grid ───────────────────────────
    if (step === 1 && q.key === "caregiverType") {
      const CAREGIVER_CARDS: Array<{ value: string; label: string; image: string; emoji: string; bg: string }> = [
        { value: "Mom", label: "Mom", image: "/landing/mom.png", emoji: "👩", bg: "#FAF7FC" },
        { value: "Dad", label: "Dad", image: "/landing/dad.png", emoji: "👨", bg: "#FAF7FC" },
        { value: "Grandma / Grandpa", label: "Grandma / Grandpa", image: "/landing/grandparent.png", emoji: "👴", bg: "#FAF7FC" },
        { value: "Other", label: "Other", image: "/landing/teacher.png", emoji: "🧑", bg: "#FAF7FC" },
      ];

      return (
        <div className="space-y-6">
          <TrustPilotReview />

          <div className="text-center space-y-3">
            <h1 className="text-2xl md:text-3xl font-bold text-harbor-primary leading-snug">
              Discover Your Child’s Unique ADHD Personality Type
            </h1>
            <p className="text-sm text-harbor-text leading-relaxed max-w-lg mx-auto">
              A 7-minute assessment backed by 40+ years of clinical experience — revealing who your child really is, why they do what they do, and the hidden gift most people completely miss.
            </p>
          </div>

          <div className="text-center">
            <h2 className="text-lg font-semibold text-harbor-text">{title}</h2>
          </div>

          {/* 2x2 photo card grid */}
          <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
            {CAREGIVER_CARDS.map((card) => (
              <button
                key={card.value}
                onClick={() => onAnswer(step, q.key, card.value, true)}
                className="group relative rounded-2xl border-2 border-harbor-primary/15 overflow-hidden transition-all duration-200 hover:border-harbor-primary/40 hover:shadow-md active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-harbor-primary/30 aspect-[4/5]"
                style={{ background: card.bg }}
              >
                <img
                  src={card.image}
                  alt={card.label}
                  className="absolute inset-0 w-full h-full object-cover object-top"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                    const parent = (e.target as HTMLImageElement).parentElement;
                    if (parent) {
                      const fallback = document.createElement("span");
                      fallback.className = "absolute inset-0 flex items-center justify-center text-6xl";
                      fallback.textContent = card.emoji;
                      parent.appendChild(fallback);
                    }
                  }}
                />
                <div className="absolute bottom-[-2px] left-[-2px] right-[-2px] px-3 py-2.5 rounded-b-2xl bg-harbor-primary text-white font-medium text-sm flex items-center justify-between">
                  <span>{card.label}</span>
                  <svg className="w-4 h-4 opacity-70 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            ))}
          </div>

          <div className="text-center space-y-3 max-w-lg mx-auto">
            <p className="text-xs text-harbor-text/60 leading-relaxed italic">
              This assessment is developed by the team behind the World’s Largest ADHD Parenting Summit with 250,000+ registered parents and world-renowned ADHD experts, such as Dr. Edward Hallowell · Dr. Patricia Quinn · Dr. Stephen Hinshaw · Dr. Sasha Hamdani and 70 more.
            </p>
            <p className="text-xs text-harbor-text/40 leading-relaxed">
              It will take about 7 minutes. Your answers stay private and won’t be shared, sold, or seen by anyone other than you.
            </p>
          </div>
        </div>
      );
    }

    // ─── Standard basic-info step ─────────────────────────────────────────
    return (
      <div>
        {q.emoji && (
          <div className="text-4xl mb-4 text-center">{q.emoji}</div>
        )}
        {inner}
        {q.key === "childName" && (
          <p className="text-xs text-gray-400 leading-relaxed text-center mt-4">
            We ask for your child’s name so we can personalise their report for you. It won’t be shared, sold, or seen by anyone other than you. This is your report only.
          </p>
        )}
      </div>
    );
  }

  // Likert question
  const key = `${config.categoryId}_${config.questionIndex}`;
  return (
    <div>
      {config.categoryId === "sensory" && config.questionIndex === 0 && (
        <p className="text-sm text-harbor-accent font-medium text-center mb-6">
          You're doing great. Keep going! 💪
        </p>
      )}
      <LikertSelect
        questionText={interpolate(config.questionText, responses)}
        value={responses[key] as number | undefined}
        onChange={(v) => onAnswer(step, key, v, true)}
      />
    </div>
  );
}
