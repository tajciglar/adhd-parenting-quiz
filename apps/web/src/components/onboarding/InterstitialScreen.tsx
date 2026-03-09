import type { CategoryId } from "@adhd-ai-assistant/shared";

interface InterstitialCard {
  emoji: string;
  headline: string;
  body: string;
}

const CARDS: Record<CategoryId, InterstitialCard> = {
  inattentive: {
    emoji: "🧩",
    headline: "You're building a picture most parents never see.",
    body: "1 in 5 children show signs of attention-related challenges. Most go unrecognised for years — and the child quietly learns to believe something is wrong with them.",
  },
  hyperactive: {
    emoji: "⚡",
    headline: "Energy isn't the problem. Direction is.",
    body: "Children with high activity levels often have exceptional drive and creativity. The goal isn't to slow them down — it's to channel what's already there.",
  },
  sensory: {
    emoji: "🎧",
    headline: "The world genuinely feels louder for some children.",
    body: "Sensory sensitivity affects up to 1 in 6 children and is one of the most misunderstood parts of ADHD. It's not drama — it's neurology.",
  },
  emotional: {
    emoji: "💛",
    headline: "Big emotions aren't bad behaviour.",
    body: "Children with ADHD experience emotions more intensely than their peers. With the right support, they don't just cope — they learn to lead with it.",
  },
  executive_function: {
    emoji: "🗺️",
    headline: "Planning is a skill. It can be taught.",
    body: "Executive function doesn't fully develop until adulthood — but structure and scaffolding can bridge the gap at any age, in any home.",
  },
  social: {
    emoji: "🤝",
    headline: "Connection matters more than compliance.",
    body: "Children who struggle socially aren't choosing to be difficult. They're missing a map — and once they have it, things shift faster than most parents expect.",
  },
};

export default function InterstitialScreen({
  categoryId,
  onContinue,
}: {
  categoryId: CategoryId;
  onContinue: () => void;
}) {
  const card = CARDS[categoryId];
  if (!card) return null;

  return (
    <div className="min-h-screen bg-harbor-bg flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full space-y-6">
        <div className="bg-white rounded-2xl border border-harbor-text/10 shadow-sm p-7 space-y-4 text-center">
          <div className="text-5xl">{card.emoji}</div>
          <h2 className="text-xl font-bold text-harbor-primary leading-snug">
            {card.headline}
          </h2>
          <p className="text-harbor-text/70 leading-relaxed">{card.body}</p>
        </div>

        <button
          type="button"
          onClick={onContinue}
          className="w-full rounded-xl bg-harbor-primary text-white px-5 py-4 font-semibold text-base hover:opacity-90 active:scale-[0.98] transition-all shadow-sm"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}
