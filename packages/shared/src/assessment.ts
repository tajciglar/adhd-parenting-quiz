// ─── Likert Scale ───────────────────────────────────────────────────────────

export const LIKERT_OPTIONS = [
  { label: "Not really", value: 0 },
  { label: "Rarely", value: 1 },
  { label: "Sometimes", value: 2 },
  { label: "Often", value: 3 },
  { label: "Always", value: 4 },
] as const;

// ─── Category IDs ───────────────────────────────────────────────────────────

export type CategoryId =
  | "inattentive"
  | "hyperactive"
  | "sensory"
  | "emotional"
  | "executive_function"
  | "social";

export const CATEGORY_IDS: CategoryId[] = [
  "inattentive",
  "hyperactive",
  "sensory",
  "emotional",
  "executive_function",
  "social",
];

// ─── Basic Info Steps (1-6) ─────────────────────────────────────────────────

export interface BasicInfoQuestion {
  type: "single-select" | "text" | "number";
  key: string;
  title: string;
  emoji?: string;
  options?: string[];
  optionEmojis?: string[];
  placeholder?: string;
  min?: number;
  max?: number;
}

export const BASIC_INFO_QUESTIONS: BasicInfoQuestion[] = [
  {
    type: "single-select",
    key: "caregiverType",
    title: "You are",
    emoji: "",
    options: ["Mom", "Dad", "Grandma / Grandpa", "Other Caregiver"],
    optionEmojis: ["👩", "👨", "👴", "🧑"],
  },
  {
    type: "single-select",
    key: "childAgeRange",
    title: "How old is your child?",
    emoji: "🎂",
    options: ["3-5", "6-8", "9-11", "12-14", "15+"],
    optionEmojis: ["👶", "🧒", "👦", "🧑‍🎓", "🎓"],
  },
  {
    type: "single-select",
    key: "childGender",
    title: "You are raising:",
    emoji: "👶",
    options: ["A Boy", "A Girl", "A Non-binary/Other"],
    optionEmojis: ["👦", "👧", "🌈"],
  },
  {
    type: "single-select",
    key: "adhdJourney",
    title: "Where are you on the ADHD journey?",
    emoji: "🧩",
    options: ["Formally diagnosed", "Self-diagnosed", "Suspected, figuring it out"],
    optionEmojis: ["📋", "🔍", "🤔"],
  },
  {
    type: "text",
    key: "childName",
    title: "Your Child's Name",
    emoji: "🌟",
    placeholder: "First name",
  },
];

// ─── Assessment Categories (steps 7-37) ─────────────────────────────────────

export interface AssessmentCategory {
  id: CategoryId;
  subtitle: string;
  questions: string[];
}

export const ASSESSMENT_CATEGORIES: AssessmentCategory[] = [
  {
    id: "inattentive",
    subtitle: "Inattentive Traits",
    questions: [
      "Makes careless mistakes in schoolwork or chores.",
      "Has trouble sustaining attention during play or tasks.",
      "Zones out when spoken to directly, even in a quiet setting.",
      'Fails to finish instructions or complete "boring" tasks.',
      "Frequently loses things necessary for tasks (shoes, pencils, toys).",
      "Is easily distracted by unrelated noises or thoughts.",
      "Gets so lost in {pos} own thoughts {sub} {dont} notice time passing.",
    ],
  },
  {
    id: "hyperactive",
    subtitle: "Hyperactive/Impulsive Traits",
    questions: [
      "Fidgets with hands/feet or squirms constantly in {pos} seat.",
      "Leaves {pos} seat in situations where staying seated is expected.",
      "Runs or climbs excessively in inappropriate situations.",
      'Talks excessively or "blurts out" answers before a question is finished.',
      "Has energy that seems impossible to switch off, even at bedtime.",
      "Has extreme difficulty waiting for {pos} turn.",
      "Does physically dangerous things without stopping to think first.",
    ],
  },
  {
    id: "sensory",
    subtitle: "Sensory Processing",
    questions: [
      "Gets upset by clothing tags, sock seams, or messy textures (mud, glue).",
      'Craves "crashing," jumping, or roughhousing to feel "centered."',
      "Is distressed by loud, sudden noises (vacuums, hand dryers, crowds).",
      "Gets overwhelmed in busy or cluttered places (toy stores, busy classrooms).",
      "Uses more force than needed (slams doors, breaks toys, hugs too hard).",
      "Chews on clothing, pencils, or non-food objects.",
      "Constantly needs to touch things.",
    ],
  },
  {
    id: "emotional",
    subtitle: "Dysregulation",
    questions: [
      "Has a very low frustration tolerance, gets upset quickly over small obstacles.",
      "Can go from happy to devastated over something that seems very small to others.",
      'Is hypersensitive to criticism or perceived "rejection."',
      'Has "explosive" meltdowns that seem out of proportion to the trigger.',
      "Has trouble calming down once {sub} {is} already upset.",
      "Holds onto feelings from an argument or disappointment, long after others have moved on.",
    ],
  },
  {
    id: "executive_function",
    subtitle: "Executive Function",
    questions: [
      'Struggles to "get started" on a task, even knowing how.',
      "Forgets what {sub} {was} doing mid-task (e.g., sent to get shoes, found playing instead).",
      'Seems to have no concept of "5 minutes" vs "30 minutes."',
      "Struggles with multi-step directions (e.g., 'Get your bag, put on shoes, and come downstairs').",
      "Gets so absorbed in a favourite activity {sub} {is} shocked when told how much time has passed.",
      "Can't seem to start a task without someone sitting with {obj}, even when knowing what to do.",
    ],
  },
  {
    id: "social",
    subtitle: "Social Cues",
    questions: [
      "Interrupts others' conversations or games frequently.",
      'Struggles to "read the room" (noticing when a friend is annoyed or bored).',
      "Struggles to understand why a friendship ended or why a peer is upset with {obj}.",
      'Gets "stuck" on a favourite topic, even if no one else is interested.',
      "Insists on controlling the rules of games and gets upset if others change them.",
      "Shares very personal thoughts or information with strangers, seems to have no 'filter'.",
    ],
  },
];

// ─── Archetypes ─────────────────────────────────────────────────────────────

export interface Archetype {
  id: string;
  animal: string;
  typeName: string;
  primaryTrait: CategoryId[];
  explanation: string;
  traits: string;
  solution: string;
}

export const ARCHETYPES: Archetype[] = [
  {
    id: "koala",
    animal: "The Koala",
    typeName: "The Dreamy Koala",
    primaryTrait: ["inattentive", "executive_function"],
    explanation: "Inattentive + Executive Function profile.",
    traits: "Reflective, imaginative, loses track of steps and time.",
    solution: "Use visual structure and one-step instructions.",

  },
  {
    id: "hummingbird",
    animal: "The Hummingbird",
    typeName: "The Flash Hummingbird",
    primaryTrait: ["inattentive", "hyperactive"],
    explanation: "Inattentive + Hyperactive profile.",
    traits: "Fast shifts in attention, very active, impulsive starts.",
    solution: "Short task cycles, movement breaks, rapid feedback.",

  },
  {
    id: "tiger",
    animal: "The Tiger",
    typeName: "The Fierce Tiger",
    primaryTrait: ["inattentive", "emotional"],
    explanation: "Inattentive + Emotional profile.",
    traits: "Fluctuating focus with big emotional reactions.",
    solution: "Co-regulation first, then task re-entry.",

  },
  {
    id: "meerkat",
    animal: "The Meerkat",
    typeName: "The Observing Meerkat",
    primaryTrait: ["inattentive", "sensory"],
    explanation: "Inattentive + Sensory profile.",
    traits: "Easily overloaded, scanning environment, variable focus.",
    solution: "Lower sensory load and add predictable routines.",

  },
  {
    id: "stallion",
    animal: "The Stallion",
    typeName: "The Bold Stallion",
    primaryTrait: ["emotional", "executive_function"],
    explanation: "Emotional + Executive Function profile.",
    traits: "Strong feelings and friction around transitions/planning.",
    solution: "External time supports plus calm transition rituals.",

  },
  {
    id: "fox",
    animal: "The Fox",
    typeName: "The Clever Fox",
    primaryTrait: ["executive_function", "social"],
    explanation: "Executive Function + Social profile.",
    traits: "Socially agile with timing/planning weak points.",
    solution: "First/Then flows and clear social boundaries.",

  },
  {
    id: "rabbit",
    animal: "The Rabbit",
    typeName: "The Busy Rabbit",
    primaryTrait: ["hyperactive", "executive_function"],
    explanation: "Hyperactive + Executive Function profile.",
    traits: "Constantly moving, starting things but rarely finishing, energy without direction.",
    solution: "Movement with purpose, visual checklists, short structured bursts.",

  },
  {
    id: "elephant",
    animal: "The Elephant",
    typeName: "The Just Elephant",
    primaryTrait: ["emotional", "social"],
    explanation: "Emotional + Social profile.",
    traits: "Deep sense of fairness, strong emotional reactions to perceived injustice, reads the room intensely.",
    solution: "Validate feelings first, reframe fairness as flexibility, use social stories.",

  },
  {
    id: "dolphin",
    animal: "The Dolphin",
    typeName: "The Splashy Dolphin",
    primaryTrait: ["hyperactive", "social"],
    explanation: "Hyperactive + Social profile.",
    traits: "Verbal impulsivity, social energy, talks fast, interrupts, needs to be part of everything.",
    solution: "Social turn-taking games, signal systems, channel verbal energy into storytelling.",

  },
  {
    id: "hedgehog",
    animal: "The Hedgehog",
    typeName: "The Storm Hedgehog",
    primaryTrait: ["sensory", "emotional"],
    explanation: "Sensory + Emotional profile.",
    traits: "Sensory overload triggers intense emotional responses, needs calm and predictable environments.",
    solution: "Reduce sensory input, validate feelings, create decompression routines.",

  },
  {
    id: "bull",
    animal: "The Bull",
    typeName: "The Fearless Bull",
    primaryTrait: ["hyperactive", "emotional"],
    explanation: "Hyperactive + Emotional profile.",
    traits: "Impulse-to-action gap is near zero, emotions amplify physical impulsivity.",
    solution: "Physical outlets, external braking systems, repair after overwhelm.",

  },
  // ── Tier 3: additional 2-trait profile ──────────────────────────────────
  {
    id: "red_panda",
    animal: "The Red Panda",
    typeName: "The Red Panda",
    primaryTrait: ["sensory", "social"],
    explanation: "Sensory + Social profile.",
    traits: "Sensory sensitivity combined with social challenges.",
    solution: "Controlled social environments with sensory accommodations.",

  },
  // ── Tier 2: 3-trait profiles ────────────────────────────────────────────
  {
    id: "panda",
    animal: "The Panda",
    typeName: "The Cloudy Panda",
    primaryTrait: ["inattentive", "emotional", "executive_function"],
    explanation: "Inattentive + Emotional + Executive Function profile.",
    traits: "Drifting attention, emotional intensity, and planning difficulties combine.",
    solution: "Co-regulation, visual structure, and one-step instructions with emotional support.",

  },
  {
    id: "firefly",
    animal: "The Firefly",
    typeName: "The Spark Firefly",
    primaryTrait: ["emotional", "executive_function", "social"],
    explanation: "Emotional + Executive Function + Social profile.",
    traits: "Strong feelings, planning challenges, and social awareness intertwine.",
    solution: "Emotional validation, external structure, and social coaching.",

  },
  {
    id: "penguin",
    animal: "The Penguin",
    typeName: "The Wandering Penguin",
    primaryTrait: ["inattentive", "executive_function", "social"],
    explanation: "Inattentive + Executive Function + Social profile.",
    traits: "Drifting focus, planning struggles, and social navigation challenges.",
    solution: "Visual schedules, social scripts, and step-by-step support.",

  },
  {
    id: "eagle",
    animal: "The Eagle",
    typeName: "The Sky Eagle",
    primaryTrait: ["inattentive", "hyperactive", "executive_function"],
    explanation: "Inattentive + Hyperactive + Executive Function profile.",
    traits: "Shifting attention, high energy, and organisational challenges.",
    solution: "Movement breaks, visual checklists, and short structured tasks.",

  },
  // ── Tier 1: 4-trait profiles ────────────────────────────────────────────
  {
    id: "whale",
    animal: "The Whale",
    typeName: "The Gentle Whale",
    primaryTrait: ["inattentive", "emotional", "executive_function", "social"],
    explanation: "Inattentive + Emotional + Executive Function + Social profile.",
    traits: "Drifting attention, emotional depth, planning struggles, and social sensitivity.",
    solution: "Holistic support across attention, emotion, structure, and social navigation.",

  },
  {
    id: "bear",
    animal: "The Bear",
    typeName: "The Brave Bear",
    primaryTrait: ["inattentive", "hyperactive", "emotional", "executive_function"],
    explanation: "Inattentive + Hyperactive + Emotional + Executive Function profile.",
    traits: "Shifting focus, high energy, emotional intensity, and organisational challenges.",
    solution: "Movement outlets, emotional co-regulation, visual structure, and step-by-step support.",

  },
  {
    id: "bee",
    animal: "The Bee",
    typeName: "The Buzzy Bee",
    primaryTrait: ["inattentive", "hyperactive", "executive_function", "social"],
    explanation: "Inattentive + Hyperactive + Executive Function + Social profile.",
    traits: "Shifting attention, constant energy, planning struggles, and social navigation challenges.",
    solution: "Short tasks, movement breaks, visual schedules, and social coaching.",

  },
];

// ─── Step Configuration ─────────────────────────────────────────────────────

export const TOTAL_STEPS = 44;
const BASIC_INFO_COUNT = BASIC_INFO_QUESTIONS.length; // 6

/** Flat list of all Likert questions with their category info */
export interface LikertStepConfig {
  type: "likert";
  categoryId: CategoryId;
  categorySubtitle: string;
  questionIndex: number;
  questionText: string;
}

export interface BasicInfoStepConfig {
  type: "basic-info";
  question: BasicInfoQuestion;
}

export type StepConfig = BasicInfoStepConfig | LikertStepConfig;

/** Build flat list of all Likert steps */
const LIKERT_STEPS: LikertStepConfig[] = ASSESSMENT_CATEGORIES.flatMap(
  (cat) =>
    cat.questions.map((q, i) => ({
      type: "likert" as const,
      categoryId: cat.id,
      categorySubtitle: cat.subtitle,
      questionIndex: i,
      questionText: q,
    })),
);

/** Get configuration for a 1-indexed step number */
export function getStepConfig(step: number): StepConfig {
  if (step >= 1 && step <= BASIC_INFO_COUNT) {
    return {
      type: "basic-info",
      question: BASIC_INFO_QUESTIONS[step - 1],
    };
  }
  const likertIndex = step - BASIC_INFO_COUNT - 1;
  return LIKERT_STEPS[likertIndex];
}

/** Get the onboarding response key for a given step */
export function getStepKey(step: number): string {
  const config = getStepConfig(step);
  if (config.type === "basic-info") {
    return config.question.key;
  }
  return `${config.categoryId}_${config.questionIndex}`;
}

// ─── Scoring ────────────────────────────────────────────────────────────────

export type Intensity = "low" | "moderate" | "high";

export function scoreCategory(answers: number[]): number {
  if (answers.length === 0) return 0;
  const total = answers.reduce((sum, a) => sum + a, 0);
  return Number((total / answers.length).toFixed(2));
}

export function normalizeScore(rawScore: number, maxRaw: number): number {
  if (maxRaw === 0) return 0;
  return Math.round((rawScore / maxRaw) * 18);
}

export function getIntensity(normalized: number): Intensity {
  // Scales for section averages on a 0..4 Likert scale.
  if (normalized < 1.5) return "low";
  if (normalized < 3.0) return "moderate";
  return "high";
}

export interface TraitScores {
  inattentive: number;
  hyperactive: number;
  sensory: number;
  emotional: number;
  executive_function: number;
  social: number;
}

export interface TraitProfile {
  scores: TraitScores;
  archetypeId: string;
}

/**
 * Extract per-category answer arrays from the flat onboarding responses.
 * Keys are like "filter_0", "filter_1", "engine_0", etc.
 */
export function extractCategoryAnswers(
  responses: Record<string, unknown>,
): Record<CategoryId, number[]> {
  const result = {} as Record<CategoryId, number[]>;

  for (const cat of ASSESSMENT_CATEGORIES) {
    const answers: number[] = [];
    for (let i = 0; i < cat.questions.length; i++) {
      const key = `${cat.id}_${i}`;
      const val = responses[key];
      answers.push(typeof val === "number" ? val : 0);
    }
    result[cat.id] = answers;
  }

  return result;
}

function sortCategoriesByScore(scores: TraitScores): CategoryId[] {
  const rankOrder: Record<CategoryId, number> = {
    inattentive: 0,
    hyperactive: 1,
    sensory: 2,
    emotional: 3,
    executive_function: 4,
    social: 5,
  };

  return [...CATEGORY_IDS].sort((a, b) => {
    const diff = scores[b] - scores[a];
    if (diff !== 0) return diff;
    return rankOrder[a] - rankOrder[b];
  });
}

/**
 * Compute section averages (0..4) for each category.
 */
export function computeScores(
  responses: Record<string, unknown>,
): TraitScores {
  const categoryAnswers = extractCategoryAnswers(responses);
  const scores = {} as TraitScores;

  for (const cat of ASSESSMENT_CATEGORIES) {
    const answers = categoryAnswers[cat.id];
    scores[cat.id] = scoreCategory(answers);
  }

  return scores;
}

/**
 * Determine cluster depth using natural break analysis.
 * Finds the largest gap between consecutive ranked traits
 * to determine how many traits form the child's natural cluster.
 */
function findClusterDepth(
  ranked: CategoryId[],
  scores: TraitScores,
): 2 | 3 | 4 {
  const gapA = scores[ranked[1]] - scores[ranked[2]]; // between #2 and #3
  const gapB = scores[ranked[2]] - scores[ranked[3]]; // between #3 and #4
  const gapC = scores[ranked[3]] - scores[ranked[4]]; // between #4 and #5

  // If two gaps are equal or within 0.1, prefer the deeper cluster
  if (gapC >= gapB - 0.1 && gapC >= gapA - 0.1) return 4;
  if (gapB >= gapA - 0.1) return 3;
  return 2;
}

/** Check if a set of CategoryIds matches an archetype's primaryTrait (order-insensitive) */
function traitSetMatches(
  traitSet: Set<CategoryId>,
  archetype: Archetype,
): boolean {
  if (archetype.primaryTrait.length !== traitSet.size) return false;
  return archetype.primaryTrait.every((t) => traitSet.has(t));
}

/** Find archetype matching exactly the given trait set */
function findByTraitSet(traitSet: Set<CategoryId>): Archetype | undefined {
  return ARCHETYPES.find((a) => traitSetMatches(traitSet, a));
}

/**
 * Fallback for missing 2-trait combos (1+6, 2+3, 3+5).
 * Uses the 3rd-highest trait to find the nearest existing 2-trait profile
 * that includes one of the top 2 traits plus the 3rd trait.
 * Prefers the profile containing the strongest trait.
 */
function nearestTier3Match(
  ranked: CategoryId[],
  scores: TraitScores,
): Archetype {
  const top1 = ranked[0];
  const top2 = ranked[1];
  const third = ranked[2];

  // Try combinations: top1+third and top2+third
  const option1 = findByTraitSet(new Set([top1, third]));
  const option2 = findByTraitSet(new Set([top2, third]));

  if (option1 && option2) {
    // Prefer the profile including the strongest trait
    return scores[top1] >= scores[top2] ? option1 : option2;
  }
  if (option1) return option1;
  if (option2) return option2;

  // Final fallback — koala
  return ARCHETYPES.find((a) => a.id === "koala")!;
}

/**
 * Match archetype using tiered profile matching:
 * 1) Rank all six categories by score (descending).
 * 2) Find natural break to determine cluster depth (2, 3, or 4).
 * 3) Try matching at that depth, falling through to lower tiers.
 *
 * Tier 1 (4-trait) → Tier 2 (3-trait) → Tier 3 (2-trait)
 */
export function matchArchetype(scores: TraitScores): Archetype {
  const ranked = sortCategoriesByScore(scores);
  const clusterDepth = findClusterDepth(ranked, scores);

  const top4 = new Set(ranked.slice(0, 4) as CategoryId[]);
  const top3 = new Set(ranked.slice(0, 3) as CategoryId[]);
  const top2 = new Set(ranked.slice(0, 2) as CategoryId[]);

  if (clusterDepth === 4) {
    const tier1 = findByTraitSet(top4);
    if (tier1) return tier1;
    const tier2 = findByTraitSet(top3);
    if (tier2) return tier2;
    const tier3 = findByTraitSet(top2);
    if (tier3) return tier3;
    return nearestTier3Match(ranked, scores);
  }

  if (clusterDepth === 3) {
    const tier2 = findByTraitSet(top3);
    if (tier2) return tier2;
    const tier3 = findByTraitSet(top2);
    if (tier3) return tier3;
    return nearestTier3Match(ranked, scores);
  }

  // clusterDepth === 2
  const tier3 = findByTraitSet(top2);
  if (tier3) return tier3;
  return nearestTier3Match(ranked, scores);
}

/**
 * Full pipeline: responses → scores → archetype → TraitProfile
 */
export function computeTraitProfile(
  responses: Record<string, unknown>,
): TraitProfile {
  const scores = computeScores(responses);
  const archetype = matchArchetype(scores);
  return { scores, archetypeId: archetype.id };
}
