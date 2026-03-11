import type { ReactNode } from "react";
import ProgressBar from "../ui/ProgressBar";
import SaveIndicator from "../ui/SaveIndicator";
import Button from "../ui/Button";

interface OnboardingLayoutProps {
  currentStep: number;
  saveStatus: "idle" | "saving" | "saved" | "error";
  canContinue: boolean;
  showContinue?: boolean;
  hideBack?: boolean;
  onBack: () => void;
  onContinue: () => void;
  children: ReactNode;
}

export default function OnboardingLayout({
  currentStep,
  saveStatus,
  canContinue,
  showContinue = true,
  hideBack = false,
  onBack,
  onContinue,
  children,
}: OnboardingLayoutProps) {
  return (
    <div className="min-h-[100dvh] overflow-y-auto bg-harbor-bg flex flex-col">
      <ProgressBar current={currentStep} />

      <div className="flex-1 flex flex-col items-center justify-center max-w-xl mx-auto w-full px-6">
        <SaveIndicator status={saveStatus} />

        <div className="w-full py-8">
          {children}
        </div>

        <div className="flex items-center justify-between w-full py-4">
          {currentStep > 1 && !hideBack ? (
            <Button variant="secondary" onClick={onBack}>
              Back
            </Button>
          ) : (
            <div />
          )}
          {showContinue ? (
            <Button
              variant="primary"
              disabled={!canContinue}
              onClick={onContinue}
            >
              Continue
            </Button>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
}
