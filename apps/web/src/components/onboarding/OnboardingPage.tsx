import { useCallback, useEffect, useRef, useState } from "react";
import { useOnboarding } from "../../hooks/useOnboarding";
import { TOTAL_STEPS, getStepConfig, ASSESSMENT_CATEGORIES, BASIC_INFO_QUESTIONS } from "@adhd-parenting-quiz/shared";
import type { CategoryId } from "@adhd-parenting-quiz/shared";
import type { OnboardingResponses } from "../../types/onboarding";
import { trackFunnelEvent } from "../../lib/analytics";
import { trackPixelEvent, generateEventId } from "../../lib/fbq";
import OnboardingLayout from "./OnboardingLayout";
import AnimationWrapper from "./AnimationWrapper";
import StepRenderer from "./StepRenderer";
import MicroCopy from "./MicroCopy";
import CalculatingScreen from "./CalculatingScreen";
import InterstitialScreen from "./InterstitialScreen";
import HalfwayScreen from "./HalfwayScreen";

// Derived from shared package so it stays in sync automatically
const BASIC_INFO_COUNT = BASIC_INFO_QUESTIONS.length; // 4

// childName is the last step (TOTAL_STEPS = 43)
const NAME_STEP = TOTAL_STEPS;

// Halfway step: show after sensory category (3rd category)
const HALFWAY_STEP = BASIC_INFO_COUNT +
  ASSESSMENT_CATEGORIES.slice(0, 3).reduce((sum, cat) => sum + cat.questions.length, 0);

// Show interstitials after inattentive, emotional, and executive_function categories.
const INTERSTITIAL_TRIGGER_STEPS = new Map<number, CategoryId>();
{
  let offset = BASIC_INFO_COUNT;
  for (let i = 0; i < ASSESSMENT_CATEGORIES.length - 1; i++) {
    offset += ASSESSMENT_CATEGORIES[i].questions.length;
    const catId = ASSESSMENT_CATEGORIES[i].id as CategoryId;
    if (catId === "inattentive" || catId === "emotional" || catId === "executive_function") {
      INTERSTITIAL_TRIGGER_STEPS.set(offset, catId);
    }
  }
}

function isStepValid(step: number, responses: OnboardingResponses): boolean {
  const config = getStepConfig(step);
  if (!config) return false;

  if (config.type === "basic-info") {
    const val = responses[config.question.key];
    switch (config.question.type) {
      case "single-select":
        return typeof val === "string" && val.length > 0;
      case "text":
        return typeof val === "string" && val.trim().length > 0;
      case "number":
        return typeof val === "number" && val >= 1;
      default:
        return false;
    }
  }

  const key = `${config.categoryId}_${config.questionIndex}`;
  const val = responses[key];
  return typeof val === "number" && val >= 0 && val <= 4;
}

function IntroScreen({
  objPronoun,
  onReady,
}: {
  objPronoun: string;
  onReady: () => void;
}) {
  return (
    <div className="min-h-[100dvh] bg-harbor-bg flex items-center justify-center px-6 py-8 overflow-y-auto">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl border border-harbor-text/10 shadow-sm p-6 space-y-5">
          <div className="text-center">
            <div className="text-4xl mb-4">🔍</div>
            <h2 className="text-xl font-bold text-harbor-primary leading-snug">
              Great! Let's find your child's ADHD Personality Type.
            </h2>
          </div>

          <p className="text-harbor-text leading-relaxed text-center">
            You're about to discover your child's unique brain profile, their
            strengths, their struggles, and the hidden superpower most people
            around {objPronoun} completely miss.
          </p>

          <p className="text-harbor-text leading-relaxed text-center">
            Answer based on what you see at home, not what you hope for or what
            happens on a good day. The more honest you are, the more accurate
            your child's profile will be.
          </p>

          <button
            type="button"
            onClick={onReady}
            className="w-full rounded-xl bg-harbor-primary text-white px-5 py-3 font-medium hover:opacity-90 active:scale-[0.98] transition-all"
          >
            I'm ready →
          </button>
        </div>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  const {
    currentStep,
    responses,
    direction,
    saveAnswer,
    goNext,
    goBack,
  } = useOnboarding();

  const [showIntro, setShowIntro] = useState(false);
  const [showCalculating, setShowCalculating] = useState(false);
  const [showHalfway, setShowHalfway] = useState(false);
  const [interstitialCategory, setInterstitialCategory] = useState<CategoryId | null>(null);

  // Fire FB Pixel ViewContent when quiz starts (step 1)
  const pixelFiredRef = useRef(false);
  useEffect(() => {
    if (currentStep === 1 && !pixelFiredRef.current) {
      pixelFiredRef.current = true;
      trackPixelEvent("ViewContent", { content_type: "quiz", content_category: "adhd_assessment" }, generateEventId());
    }
  }, [currentStep]);

  const gender = ((responses.childGender as string) ?? "").toLowerCase();
  const objPronoun = gender.includes("boy") || gender.includes("son") ? "him" : gender.includes("girl") || gender.includes("daughter") ? "her" : "them";

  const handleShowCalculating = useCallback(() => {
    trackFunnelEvent("quiz_completed");
    setShowCalculating(true);
  }, []);

  // Determine what happens after a step completes
  const advanceFromStep = useCallback(
    (step: number) => {
      // After last likert question (step before NAME_STEP), go to name step
      // After name step, show calculating
      if (step === NAME_STEP) {
        handleShowCalculating();
      } else if (step === BASIC_INFO_COUNT) {
        // After last basic info question, show intro screen
        setShowIntro(true);
      } else if (step === HALFWAY_STEP) {
        setShowHalfway(true);
      } else if (INTERSTITIAL_TRIGGER_STEPS.has(step)) {
        setInterstitialCategory(INTERSTITIAL_TRIGGER_STEPS.get(step)!);
      } else {
        goNext();
      }
    },
    [goNext, handleShowCalculating],
  );

  const handleAnswer = useCallback(
    (
      step: number,
      key: string,
      value: string | number | undefined,
      immediate?: boolean,
    ) => {
      saveAnswer(step, key, value, immediate);

      // Track individual answer for analytics
      const config = getStepConfig(step);
      if (!config) return;

      const questionType = config.type === "basic-info" ? config.question.type : "likert";
      trackFunnelEvent("answer_submitted", step, {
        questionKey: key,
        answerValue: value,
        questionType,
      });

      const shouldAutoAdvance =
        (config.type === "basic-info" &&
          config.question.type === "single-select") ||
        config.type === "likert";

      if (shouldAutoAdvance) {
        setTimeout(() => advanceFromStep(step), 400);
      }
    },
    [saveAnswer, advanceFromStep],
  );

  if (showCalculating) {
    return <CalculatingScreen responses={responses} />;
  }

  if (showHalfway) {
    return (
      <HalfwayScreen
        childName="your child"
        onContinue={() => {
          setShowHalfway(false);
          goNext();
        }}
      />
    );
  }

  if (interstitialCategory) {
    return (
      <InterstitialScreen
        categoryId={interstitialCategory}
        childName="your child"
        onContinue={() => {
          setInterstitialCategory(null);
          goNext();
        }}
      />
    );
  }

  if (showIntro) {
    return (
      <IntroScreen
        objPronoun={objPronoun}
        onReady={() => {
          setShowIntro(false);
          goNext();
        }}
      />
    );
  }

  const canContinue = isStepValid(currentStep, responses);

  // Only show Continue button for text/number inputs (single-select and likert auto-advance)
  const currentConfig = getStepConfig(currentStep);
  const showContinue =
    currentConfig?.type === "basic-info" &&
    (currentConfig.question.type === "text" || currentConfig.question.type === "number");

  return (
    <OnboardingLayout
      currentStep={currentStep}
      saveStatus="idle"
      canContinue={canContinue}
      showContinue={showContinue}
      hideBack={currentStep === 1}
      onBack={goBack}
      onContinue={() => advanceFromStep(currentStep)}
    >
      <AnimationWrapper stepKey={currentStep} direction={direction}>
        <MicroCopy step={currentStep} />
        <StepRenderer
          step={currentStep}
          responses={responses}
          onAnswer={handleAnswer}
        />
      </AnimationWrapper>
    </OnboardingLayout>
  );
}
