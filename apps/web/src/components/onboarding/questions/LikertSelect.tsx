import { LIKERT_OPTIONS } from "@adhd-parenting-quiz/shared";

interface LikertSelectProps {
  questionText: string;
  value: number | undefined;
  onChange: (value: number) => void;
}

export default function LikertSelect({
  questionText,
  value,
  onChange,
}: LikertSelectProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-harbor-text mb-8 text-center leading-snug">
        {questionText}
      </h2>

      {/* Horizontal 5-point scale */}
      <div className="flex items-stretch gap-2">
        {LIKERT_OPTIONS.map((opt) => {
          const isSelected = value === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => onChange(opt.value)}
              className={`flex-1 py-3 px-1 rounded-xl border-2 text-center transition-all duration-200 cursor-pointer ${
                isSelected
                  ? "border-harbor-accent bg-harbor-accent/10"
                  : "border-harbor-primary/15 hover:border-harbor-primary/30 bg-white"
              }`}
            >
              <span className="text-xs font-medium leading-tight block">
                {opt.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Scale labels */}
      <div className="flex justify-between mt-2 px-1">
        <span className="text-xs text-harbor-text/40">Disagree</span>
        <span className="text-xs text-harbor-text/40">Agree</span>
      </div>
    </div>
  );
}
