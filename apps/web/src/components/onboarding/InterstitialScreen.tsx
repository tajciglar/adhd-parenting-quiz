import type { CategoryId } from "@adhd-parenting-quiz/shared";

interface InterstitialCard {
  emoji?: string;
  image?: string;
  headline: string;
  body: string[];
  bulletList?: string[];
  buttonText?: string;
  bottomImage?: string;
  bulletEmojis?: string[];
}

const CARDS: Record<CategoryId, InterstitialCard> = {
  inattentive: {
    image: "/flow/ChildReading.webp",
    headline: "It's not about intelligence.",
    body: [
      "Children with ADHD are up to 3 years behind their peers in reading, writing, and math. Not because they lack intelligence, but because their attention system works differently.",
      "Source: Barkley, 2015; Journal of Abnormal Child Psychology",
      "Understanding your child's attention patterns is the first step to closing that gap.",
    ],
  },
  hyperactive: {
    image: "/flow/mom&child.webp",
    headline: "When parents truly understand their child's ADHD profile, everything changes.",
    body: [
      "Children whose parents adapt their parenting approach show up to 74% improvement in:",
    ],
    bulletList: [
      "Focus",
      "Emotional regulation",
      "Daily cooperation",
      "Confidence",
    ],
    bulletEmojis: ["🎯", "💛", "🤝", "💪"],
    buttonText: "I agree",
  },
  sensory: {
    image: "/flow/father&child.webp",
    headline: "No two ADHD kids are the same.",
    body: [
      "That's why a one-size-fits-all approach never works. And that's exactly why you're here. {Sub} is lucky to have you.",
    ],
    buttonText: "Keep going",
  },
  emotional: {
    emoji: "💛",
    headline: "Emotional dysregulation is the most misunderstood part of ADHD",
    body: [
      "Research from the University of Cambridge found that 1 in 2 children with ADHD experience significant emotional dysregulation, reacting with an intensity that doesn't match the situation.",
      "This is one of the most misunderstood parts of ADHD — and one of the most important to get right.",
    ],
    bottomImage: "/flow/cambridge-logo.webp",
  },
  executive_function: {
    image: "/flow/child&mom.webp",
    headline: "It's not that they won't. It's that they can't — yet.",
    body: [
      "Executive function develops later in ADHD kids, sometimes years later. What looks like laziness or defiance is actually a brain that's still building its wiring.",
    ],
    buttonText: "Almost done",
  },
  social: {
    emoji: "🤝",
    headline: "Connection matters more than compliance.",
    body: [
      "Children who struggle socially aren't choosing to be difficult. They're missing a map, and once they have it, things shift faster than most parents expect.",
    ],
  },
};

export default function InterstitialScreen({
  categoryId,
  childName,
  childGender,
  onContinue,
}: {
  categoryId: CategoryId;
  childName?: string;
  childGender?: string;
  onContinue: () => void;
}) {
  const card = CARDS[categoryId];
  if (!card) return null;
  const name = childName || "your child";

  // Pronoun interpolation
  const gender = (childGender ?? "").toLowerCase();
  const isMale = gender.includes("boy") || gender.includes("son");
  const isFemale = gender.includes("girl") || gender.includes("daughter");
  const sub = isMale ? "He" : isFemale ? "She" : "They";

  const interpolate = (text: string) =>
    text.replace(/\{childName\}/g, name).replace(/\{Sub\}/g, sub);

  return (
    <div className="min-h-[100dvh] bg-harbor-bg flex items-center justify-center px-6 py-12 overflow-y-auto">
      <div className="max-w-md w-full space-y-6">
        <div className="bg-white rounded-2xl border border-harbor-text/10 shadow-sm p-5 space-y-3 text-center">
          {card.image && (
            <img
              src={card.image}
              alt=""
              className="w-full rounded-xl object-cover"
            />
          )}
          {card.emoji && !card.image && (
            <div className="text-5xl">{card.emoji}</div>
          )}
          <h2 className="text-xl font-bold text-harbor-primary leading-snug">
            {interpolate(card.headline)}
          </h2>
          {card.body.map((paragraph, i) => {
            const isSource = paragraph.toLowerCase().startsWith("source:");
            const text = interpolate(paragraph);
            return (
              <p
                key={i}
                className={
                  isSource
                    ? "text-harbor-text/50 text-xs italic leading-relaxed"
                    : "text-harbor-text leading-relaxed"
                }
              >
                {text}
              </p>
            );
          })}
          {card.bulletList && (
            <ul className="text-left space-y-3 mx-auto max-w-xs">
              {card.bulletList.map((item, i) => (
                <li key={item} className="flex items-center gap-3 text-harbor-text font-medium">
                  <span className="w-9 h-9 rounded-lg bg-harbor-primary/10 flex items-center justify-center text-lg flex-shrink-0">
                    {card.bulletEmojis?.[i] ?? "✓"}
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          )}
          {card.bottomImage && (
            <img
              src={card.bottomImage}
              alt=""
              className="mx-auto h-44 object-contain mt-0"
            />
          )}
        </div>

        <button
          type="button"
          onClick={onContinue}
          className="w-full rounded-xl bg-harbor-primary text-white px-5 py-4 font-semibold text-base hover:opacity-90 active:scale-[0.98] transition-all shadow-sm"
        >
          {card.buttonText ?? "Continue"} →
        </button>
      </div>
    </div>
  );
}
