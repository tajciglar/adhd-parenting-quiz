import { useCallback, useState } from "react";
import { useOnboarding } from "../../hooks/useOnboarding";
import { TOTAL_STEPS } from "../../lib/constants";
import { getStepConfig } from "@adhd-ai-assistant/shared";
import type { OnboardingResponses } from "../../types/onboarding";
import OnboardingLayout from "./OnboardingLayout";
import AnimationWrapper from "./AnimationWrapper";
import StepRenderer from "./StepRenderer";
import MicroCopy from "./MicroCopy";
import CalculatingScreen from "./CalculatingScreen";

// Steps 1-6 are basic info; step 7 is the first Likert question
const BASIC_INFO_COUNT = 6;

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
  return typeof val === "number" && val >= 0 && val <= 3;
}

function IntroScreen({
  childName,
  onReady,
}: {
  childName: string;
  onReady: () => void;
}) {
  return (
    <div className="min-h-screen bg-harbor-bg flex items-center justify-center px-6 py-8">
      <div className="max-w-md w-full overflow-y-auto">
        <div className="bg-white rounded-2xl border border-harbor-text/10 shadow-sm p-6 space-y-5">
          <div className="text-center">
            <div className="text-4xl mb-4">🔍</div>
            <h2 className="text-xl font-bold text-harbor-primary leading-snug">
              You're about to discover {childName}'s unique brain profile
            </h2>
          </div>

          <p className="text-harbor-text/70 leading-relaxed">
            Their strengths, their struggles, and the hidden superpower most
            people around them completely miss.
          </p>

          <p className="text-harbor-text/70 leading-relaxed">
            Answer based on what you actually see. The more honest you are, the
            more accurate {childName}'s profile will be.
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

  const childName = (responses.childName as string | undefined) ?? "your child";

  const handleShowCalculating = useCallback(() => {
    setShowCalculating(true);
  }, []);

  const handleAnswer = useCallback(
    (
      step: number,
      key: string,
      value: string | number | undefined,
      immediate?: boolean,
    ) => {
      saveAnswer(step, key, value, immediate);

      const config = getStepConfig(step);
      if (!config) return;

      const shouldAutoAdvance =
        (config.type === "basic-info" &&
          config.question.type === "single-select") ||
        config.type === "likert";

      if (shouldAutoAdvance) {
        setTimeout(() => {
          if (step === TOTAL_STEPS) {
            handleShowCalculating();
          } else if (step === BASIC_INFO_COUNT) {
            setShowIntro(true);
          } else {
            goNext();
          }
        }, 50);
      }
    },
    [saveAnswer, goNext, handleShowCalculating],
  );

  if (showCalculating) {
    return <CalculatingScreen responses={responses} />;
  }

  if (showIntro) {
    return (
      <IntroScreen
        childName={childName}
        onReady={() => {
          setShowIntro(false);
          goNext();
        }}
      />
    );
  }

  const canContinue = isStepValid(currentStep, responses);

  return (
    <OnboardingLayout
      currentStep={currentStep}
      saveStatus="idle"
      canContinue={canContinue}
      onBack={goBack}
      onContinue={() => {
        if (currentStep === TOTAL_STEPS) {
          handleShowCalculating();
        } else if (currentStep === BASIC_INFO_COUNT) {
          setShowIntro(true);
        } else {
          goNext();
        }
      }}
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
