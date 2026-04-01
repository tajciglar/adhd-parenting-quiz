import { LIKERT_OPTIONS } from "@adhd-parenting-quiz/shared";

export type LikertVariant = "circles" | "vertical" | "emoji";

interface LikertSelectProps {
  questionText: string;
  value: number | undefined;
  onChange: (value: number) => void;
  variant?: LikertVariant;
}

/**
 * 5 circles in a row spanning full width.
 * 0-1 purple (not really / rarely), 2 neutral/gray (sometimes), 3-4 green (often / always).
 */
const CIRCLE_STYLES: Record<
  number,
  { size: string; unselected: string; selected: string }
> = {
  0: {
    size: "w-12 h-12",
    unselected: "border-purple-300 bg-purple-50",
    selected: "border-purple-500 bg-purple-500 ring-4 ring-purple-200",
  },
  1: {
    size: "w-12 h-12",
    unselected: "border-purple-200 bg-purple-50/60",
    selected: "border-purple-400 bg-purple-400 ring-4 ring-purple-200",
  },
  2: {
    size: "w-12 h-12",
    unselected: "border-harbor-text/20 bg-harbor-text/5",
    selected: "border-harbor-text/40 bg-harbor-text/30 ring-4 ring-harbor-text/10",
  },
  3: {
    size: "w-12 h-12",
    unselected: "border-emerald-200 bg-emerald-50/60",
    selected: "border-emerald-400 bg-emerald-400 ring-4 ring-emerald-200",
  },
  4: {
    size: "w-12 h-12",
    unselected: "border-emerald-300 bg-emerald-50",
    selected: "border-emerald-500 bg-emerald-500 ring-4 ring-emerald-200",
  },
};

const EMOJI_SCALE = [
  { face: "😊", bg: "bg-green-500", selectedRing: "ring-green-300" },
  { face: "🙂", bg: "bg-lime-400", selectedRing: "ring-lime-200" },
  { face: "😐", bg: "bg-yellow-400", selectedRing: "ring-yellow-200" },
  { face: "😟", bg: "bg-orange-400", selectedRing: "ring-orange-200" },
  { face: "😣", bg: "bg-red-500", selectedRing: "ring-red-300" },
];

const CIRCLE_LABELS = ["Never", "Hardly", "Sometimes", "Often", "Always"];

function CirclesVariant({ value, onChange }: { value: number | undefined; onChange: (v: number) => void }) {
  return (
    <div className="flex items-end justify-between w-full px-2">
      {LIKERT_OPTIONS.map((opt) => {
        const isSelected = value === opt.value;
        const style = CIRCLE_STYLES[opt.value];
        return (
          <div key={opt.value} className="flex flex-col items-center gap-2">
            <div className="h-14 flex items-center justify-center">
              <button
                onClick={() => onChange(opt.value)}
                className={`${style.size} rounded-full border-2 transition-all duration-200 cursor-pointer flex-shrink-0 ${
                  isSelected ? `${style.selected} scale-110` : style.unselected
                }`}
                aria-label={opt.label}
              />
            </div>
            <span className="text-[13px] font-medium text-gray-600 whitespace-nowrap">
              {CIRCLE_LABELS[opt.value]}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function VerticalVariant({ value, onChange }: { value: number | undefined; onChange: (v: number) => void }) {
  return (
    <div className="space-y-2.5 w-full">
      {LIKERT_OPTIONS.map((opt) => {
        const isSelected = value === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`w-full rounded-xl px-5 py-3.5 text-left font-medium transition-all duration-200 active:scale-[0.98] ${
              isSelected
                ? "bg-harbor-primary text-white shadow-md"
                : "bg-gray-100 text-harbor-text hover:bg-gray-200"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function EmojiVariant({ value, onChange }: { value: number | undefined; onChange: (v: number) => void }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between w-full gap-2 px-1">
        {LIKERT_OPTIONS.map((opt) => {
          const isSelected = value === opt.value;
          const emoji = EMOJI_SCALE[opt.value];
          return (
            <button
              key={opt.value}
              onClick={() => onChange(opt.value)}
              className={`w-14 h-14 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center text-2xl ${emoji.bg} ${
                isSelected
                  ? `ring-4 ${emoji.selectedRing} scale-110 shadow-lg`
                  : "opacity-80 hover:opacity-100 hover:scale-105"
              }`}
              aria-label={opt.label}
            >
              {emoji.face}
            </button>
          );
        })}
      </div>
      <div className="flex justify-between px-1">
        <span className="text-[12px] font-medium text-gray-500">Not really</span>
        <span className="text-[12px] font-medium text-gray-500">Always</span>
      </div>
    </div>
  );
}

export default function LikertSelect({
  questionText,
  value,
  onChange,
  variant = "circles",
}: LikertSelectProps) {
  return (
    <div>
      {/* Fixed-height question area so answer buttons don't jump between short and long questions */}
      <div className="min-h-[6rem] flex items-center justify-center mb-8">
        <h2 className="text-xl font-semibold text-harbor-text text-center leading-snug">
          {questionText}
        </h2>
      </div>

      {variant === "circles" && <CirclesVariant value={value} onChange={onChange} />}
      {variant === "vertical" && <VerticalVariant value={value} onChange={onChange} />}
      {variant === "emoji" && <EmojiVariant value={value} onChange={onChange} />}
    </div>
  );
}
