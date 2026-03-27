import React from "react";
import { getStepConfig } from "@adhd-parenting-quiz/shared";
import type { OnboardingResponses } from "../../types/onboarding";
import SingleSelect from "./questions/SingleSelect";
import TextInput from "./questions/TextInput";
import NumberInput from "./questions/NumberInput";
import LikertSelect from "./questions/LikertSelect";
import type { LikertVariant } from "./questions/LikertSelect";



// Fixed pseudo-random sequence: varied run lengths so it doesn't feel repetitive
// 38 questions total across 6 categories, 3 template variants
const VARIANT_SEQUENCE: LikertVariant[] = [
  // inattentive (7 questions)
  "circles", "circles", "vertical", "emoji", "emoji", "vertical", "circles",
  // hyperactive (7 questions)
  "vertical", "vertical", "vertical", "emoji", "circles", "circles", "emoji",
  // sensory (6 questions)
  "emoji", "emoji", "circles", "vertical", "vertical", "emoji",
  // emotional (6 questions)
  "vertical", "circles", "circles", "emoji", "vertical", "vertical",
  // executive_function (6 questions)
  "circles", "emoji", "emoji", "vertical", "circles", "vertical",
  // social (6 questions)
  "vertical", "emoji", "circles", "circles", "emoji", "vertical",
];

interface StepRendererProps {
  step: number;
  responses: OnboardingResponses;
  onAnswer: (step: number, key: string, value: string | number | undefined, immediate?: boolean) => void;
}

function interpolate(template: string, responses: OnboardingResponses): string {
  const childName = ((responses.childName as string) || "your child").trim();
  const gender = ((responses.childGender as string) ?? "").toLowerCase();
  const isMale = gender === "male" || gender.includes("boy") || gender.includes("son");
  const isFemale = gender === "female" || gender.includes("girl") || gender.includes("daughter");
  const pos = isMale ? "his" : isFemale ? "her" : "their";
  const obj = isMale ? "him" : isFemale ? "her" : "them";
  const sub = isMale ? "he" : isFemale ? "she" : "they";
  const is_ = isMale ? "is" : isFemale ? "is" : "are";
  const was_ = isMale ? "was" : isFemale ? "was" : "were";
  const dont = isMale ? "doesn't" : isFemale ? "doesn't" : "don't";
  const knows = isMale ? "knows" : isFemale ? "knows" : "know";

  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  return template
    .replace(/\{childName\}/g, childName)
    .replace(/\{Sub\}/g, cap(sub))
    .replace(/\{Pos\}/g, cap(pos))
    .replace(/\{Obj\}/g, cap(obj))
    .replace(/\{pos\}/g, pos)
    .replace(/\{obj\}/g, obj)
    .replace(/\{sub\}/g, sub)
    .replace(/\{is\}/g, is_)
    .replace(/\{was\}/g, was_)
    .replace(/\{dont\}/g, dont)
    .replace(/\{knows\}/g, knows)
    .replace(/\{gets\}/g, isMale ? "Gets" : isFemale ? "Gets" : "Get");
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
            subtitle={q.key === "childName" ? "This name will appear throughout your child's personalized report, so use the name they go by." : undefined}
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
    if (step === 1 && q.key === "childGender") {
      const GENDER_CARDS: Array<{ value: string; label: string; image: string; emoji: string; scale?: string }> = [
        { value: "My Son", label: "My Son", image: "/landing/boy.webp", emoji: "👦", scale: "scale-90" },
        { value: "My Daughter", label: "My Daughter", image: "/landing/girl.webp", emoji: "👧", scale: "scale-90" },
      ];

      return (
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold text-harbor-primary leading-snug">
              Discover Your Child's Unique ADHD Personality Type
            </h1>
            <p className="text-sm text-harbor-text/60 leading-relaxed">
              The support your child needs starts here.
            </p>
          </div>

          <div className="text-center">
            <h2 className="text-lg font-semibold text-harbor-text">{title}</h2>
          </div>

          {/* 2-card photo grid */}
          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
            {GENDER_CARDS.map((card) => (
              <button
                key={card.value}
                onClick={() => onAnswer(step, q.key, card.value, true)}
                className="group relative rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-lg active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-harbor-primary/30 aspect-[3/4] bg-[#e8e0f0]"
              >
                <img
                  src={card.image}
                  alt={card.label}
                  className={`absolute inset-0 w-full h-full object-cover object-[center_20%] ${card.scale ?? "scale-125"}`}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                    const parent = (e.target as HTMLImageElement).parentElement;
                    if (parent) {
                      const fallback = document.createElement("span");
                      fallback.className = "absolute inset-0 flex items-center justify-center text-6xl bg-harbor-bg";
                      fallback.textContent = card.emoji;
                      parent.appendChild(fallback);
                    }
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 px-3 py-2.5 bg-harbor-primary text-white font-medium text-sm flex items-center justify-between">
                  <span>{card.label}</span>
                  <svg className="w-4 h-4 opacity-70 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            ))}
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
          <p className="text-xs text-gray-500 leading-relaxed text-center mt-4">
            We ask for your child's name so we can personalise their report for you. It won't be shared, sold, or seen by anyone other than you. This is your report only.
          </p>
        )}
      </div>
    );
  }

  // Likert question — cycle through visual variants to keep it interesting
  const key = `${config.categoryId}_${config.questionIndex}`;
  const globalQuestionIndex = step - 5; // steps 5+ are likert (0-indexed)
  const variant = VARIANT_SEQUENCE[globalQuestionIndex] ?? "circles";
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
        variant={variant}
      />
    </div>
  );
}
