import { LIKERT_OPTIONS } from "@adhd-parenting-quiz/shared";

interface LikertSelectProps {
  questionText: string;
  value: number | undefined;
  onChange: (value: number) => void;
}

/**
 * 5 circles in a row spanning full width.
 * 0-1 purple (disagree), 2 neutral/gray, 3-4 green (agree).
 * "Disagree" label under first circle, "Agree" under last.
 */
const CIRCLE_STYLES: Record<
  number,
  { size: string; unselected: string; selected: string }
> = {
  0: {
    size: "w-14 h-14",
    unselected: "border-purple-300 bg-purple-50",
    selected: "border-purple-500 bg-purple-500 ring-4 ring-purple-200",
  },
  1: {
    size: "w-12 h-12",
    unselected: "border-purple-200 bg-purple-50/60",
    selected: "border-purple-400 bg-purple-400 ring-4 ring-purple-200",
  },
  2: {
    size: "w-10 h-10",
    unselected: "border-harbor-text/20 bg-harbor-text/5",
    selected: "border-harbor-text/40 bg-harbor-text/30 ring-4 ring-harbor-text/10",
  },
  3: {
    size: "w-12 h-12",
    unselected: "border-emerald-200 bg-emerald-50/60",
    selected: "border-emerald-400 bg-emerald-400 ring-4 ring-emerald-200",
  },
  4: {
    size: "w-14 h-14",
    unselected: "border-emerald-300 bg-emerald-50",
    selected: "border-emerald-500 bg-emerald-500 ring-4 ring-emerald-200",
  },
};

export default function LikertSelect({
  questionText,
  value,
  onChange,
}: LikertSelectProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-harbor-text mb-10 text-center leading-snug">
        {questionText}
      </h2>

      {/* Circles row — full width, evenly spaced */}
      <div className="flex items-center justify-between w-full px-2">
        {LIKERT_OPTIONS.map((opt) => {
          const isSelected = value === opt.value;
          const style = CIRCLE_STYLES[opt.value];
          const isFirst = opt.value === 0;
          const isLast = opt.value === 4;

          return (
            <div key={opt.value} className="flex flex-col items-center gap-2">
              <button
                onClick={() => onChange(opt.value)}
                className={`${style.size} rounded-full border-2 transition-all duration-200 cursor-pointer flex-shrink-0 ${
                  isSelected ? `${style.selected} scale-110` : style.unselected
                }`}
                aria-label={opt.label}
              />
              {isFirst && (
                <span className="text-xs font-medium text-purple-400">Disagree</span>
              )}
              {isLast && (
                <span className="text-xs font-medium text-emerald-400">Agree</span>
              )}
              {!isFirst && !isLast && (
                <span className="text-xs invisible">spacer</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
