import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOnboarding, clearOnboardingStorage } from "../../hooks/useOnboarding";
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
import CredibilityScreen from "./CredibilityScreen";
import EmailCaptureScreen from "./EmailCaptureScreen";

// Derived from shared package so it stays in sync automatically
const BASIC_INFO_COUNT = BASIC_INFO_QUESTIONS.length; // 4

// Last likert step (before the old name step)
const LAST_QUIZ_STEP = TOTAL_STEPS - 1;

// Show interstitials after every category except social (the last one).
const INTERSTITIAL_TRIGGER_STEPS = new Map<number, CategoryId>();
{
  let offset = BASIC_INFO_COUNT;
  for (let i = 0; i < ASSESSMENT_CATEGORIES.length - 1; i++) {
    offset += ASSESSMENT_CATEGORIES[i].questions.length;
    const catId = ASSESSMENT_CATEGORIES[i].id as CategoryId;
    INTERSTITIAL_TRIGGER_STEPS.set(offset, catId);
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

export default function OnboardingPage() {
  const {
    currentStep,
    responses,
    direction,
    saveAnswer,
    goNext,
    goBack,
  } = useOnboarding();

  const navigate = useNavigate();
  const [showCredibility, setShowCredibility] = useState(false);
  const [showCalculating, setShowCalculating] = useState(false);
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [calcResult, setCalcResult] = useState<{ childName: string; childGender: string; archetypeId: string } | null>(null);
  const [interstitialCategory, setInterstitialCategory] = useState<CategoryId | null>(null);

  // Fire FB Pixel ViewContent when quiz starts (step 1)
  const pixelFiredRef = useRef(false);
  useEffect(() => {
    if (currentStep === 1 && !pixelFiredRef.current) {
      pixelFiredRef.current = true;
      trackPixelEvent("ViewContent", { content_type: "quiz", content_category: "adhd_assessment" }, generateEventId());
    }
  }, [currentStep]);

  const childGender = (responses.childGender as string) ?? "";

  const handleShowCalculating = useCallback(() => {
    trackFunnelEvent("quiz_completed");
    setShowCalculating(true);
  }, []);

  // Determine what happens after a step completes
  const advanceFromStep = useCallback(
    (step: number) => {
      // After last quiz question, skip name step and go straight to calculating
      if (step >= LAST_QUIZ_STEP) {
        handleShowCalculating();
      } else if (step === BASIC_INFO_COUNT) {
        // After last basic info question, show credibility screen
        setShowCredibility(true);
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

  if (showEmailCapture && calcResult) {
    return (
      <EmailCaptureScreen
        childName={calcResult.childName}
        onSubmit={(email) => {
          trackFunnelEvent("optin_completed");
          sessionStorage.setItem("wildprint_responses", JSON.stringify(responses));
          sessionStorage.setItem("wildprint_childName", calcResult.childName);
          sessionStorage.setItem("wildprint_childGender", calcResult.childGender);
          sessionStorage.setItem("wildprint_archetypeId", calcResult.archetypeId);
          sessionStorage.setItem("wildprint_email", email);
          clearOnboardingStorage();
          navigate("/results", {
            replace: true,
            state: {
              responses,
              childName: calcResult.childName,
              childGender: calcResult.childGender,
              archetypeId: calcResult.archetypeId,
              email,
            },
          });
        }}
      />
    );
  }

  if (showCalculating) {
    return (
      <CalculatingScreen
        responses={responses}
        onNameSubmit={(name) => {
          saveAnswer(LAST_QUIZ_STEP + 1, "childName", name);
        }}
        onComplete={(data) => {
          setCalcResult(data);
          setShowEmailCapture(true);
        }}
      />
    );
  }

  if (interstitialCategory) {
    return (
      <InterstitialScreen
        categoryId={interstitialCategory}
        childName="your child"
        childGender={childGender}
        onContinue={() => {
          setInterstitialCategory(null);
          goNext();
        }}
      />
    );
  }

  if (showCredibility) {
    return (
      <CredibilityScreen
        onContinue={() => {
          setShowCredibility(false);
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
