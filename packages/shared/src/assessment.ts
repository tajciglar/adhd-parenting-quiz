// ─── Likert Scale ───────────────────────────────────────────────────────────

export const LIKERT_OPTIONS = [
  { label: "Never / Not at all", value: 0 },
  { label: "Occasionally / A little", value: 1 },
  { label: "Often / A lot", value: 2 },
  { label: "Very Often / Always", value: 3 },
] as const;

// ─── Category IDs ───────────────────────────────────────────────────────────

export type CategoryId =
  | "filter"
  | "engine"
  | "sensory"
  | "fuse"
  | "time"
  | "social";

export const CATEGORY_IDS: CategoryId[] = [
  "filter",
  "engine",
  "sensory",
  "fuse",
  "time",
  "social",
];

// ─── Basic Info Steps (1-6) ─────────────────────────────────────────────────

export interface BasicInfoQuestion {
  type: "single-select" | "text" | "number";
  key: string;
  title: string;
  options?: string[];
  placeholder?: string;
  min?: number;
  max?: number;
}

export const BASIC_INFO_QUESTIONS: BasicInfoQuestion[] = [
  {
    type: "single-select",
    key: "parentGender",
    title: "Your Gender",
    options: ["Male", "Female", "Non-binary/Other"],
  },
  {
    type: "single-select",
    key: "parentAgeRange",
    title: "Your Age Range",
    options: ["18–30", "31–45", "46–60", "61+"],
  },
  {
    type: "text",
    key: "childName",
    title: "Child's Name",
    placeholder: "First name",
  },
  {
    type: "number",
    key: "childAge",
    title: "Child's Age",
    min: 1,
    max: 25,
  },
  {
    type: "single-select",
    key: "childGender",
    title: "Child's Gender",
    options: ["Male", "Female", "Non-binary/Other"],
  },
  {
    type: "single-select",
    key: "householdStructure",
    title: "Household Structure",
    options: [
      "Two-parent household",
      "Single-parent household",
      "Co-parenting (separate households)",
      "Multi-generational (grandparents/relatives living in)",
    ],
  },
];

// ─── Assessment Categories (steps 7-37) ─────────────────────────────────────

export interface AssessmentCategory {
  id: CategoryId;
  label: string;
  subtitle: string;
  questions: string[];
}

export const ASSESSMENT_CATEGORIES: AssessmentCategory[] = [
  {
    id: "filter",
    label: "The Attention Filter",
    subtitle: "Inattentive Traits",
    questions: [
      "Makes careless mistakes in schoolwork or chores.",
      "Has trouble sustaining attention during play or tasks.",
      'Seems not to listen when spoken to directly (the "in a fog" look).',
      'Fails to finish instructions or complete "boring" tasks.',
      "Frequently loses things necessary for tasks (shoes, pencils, toys).",
      "Is easily distracted by unrelated noises or thoughts.",
    ],
  },
  {
    id: "engine",
    label: "The Engine Speed",
    subtitle: "Hyperactive/Impulsive Traits",
    questions: [
      "Fidgets with hands/feet or squirms constantly in their seat.",
      "Leaves their seat in situations where staying seated is expected.",
      "Runs or climbs excessively in inappropriate situations.",
      'Talks excessively or "blurts out" answers before a question is finished.',
      'Acts as if "driven by a motor" (hard to slow down).',
      "Has extreme difficulty waiting for their turn.",
    ],
  },
  {
    id: "sensory",
    label: "The Sensory Guard",
    subtitle: "Sensory Processing",
    questions: [
      "Gets upset by clothing tags, seams in socks, or messy play (mud/glue).",
      'Craves "crashing," jumping, or roughhousing to feel "centered."',
      "Is distressed by loud, sudden noises (vacuums, hand dryers, crowds).",
      'Gets overwhelmed in "busy" places like toy stores or cluttered rooms.',
      "Appears clumsy or uses too much force (e.g., slamming doors unintentionally).",
    ],
  },
  {
    id: "fuse",
    label: "The Emotional Thermostat",
    subtitle: "Dysregulation",
    questions: [
      'Has a very "low fuse" or low frustration tolerance.',
      "Experiences rapid mood changes based on small changes in the environment.",
      'Is hypersensitive to criticism or perceived "rejection."',
      'Has "explosive" meltdowns that seem out of proportion to the trigger.',
      "Has trouble calming down once they are already upset.",
    ],
  },
  {
    id: "time",
    label: "The Time Horizon",
    subtitle: "Executive Function",
    questions: [
      'Struggles to "get started" on a task even when they know how.',
      "Forgets what they were doing mid-task (e.g., goes to get a coat, ends up playing with a toy).",
      'Seems to have no concept of "5 minutes" vs "30 minutes."',
      'Struggles with multi-step directions (e.g., "Get your bag, put on shoes, and meet me at the car").',
    ],
  },
  {
    id: "social",
    label: "The Social Radar",
    subtitle: "Social Cues",
    questions: [
      "Interrupts others' conversations or games frequently.",
      'Struggles to "read the room" (noticing when a friend is annoyed or bored).',
      'Plays too "roughly" or gets too close to people\'s personal space.',
      'Gets "stuck" on a topic they love, even if no one else is interested.',
      'Struggles with "give and take" in imaginative play.',
    ],
  },
];

// ─── Archetypes ─────────────────────────────────────────────────────────────

export interface Archetype {
  id: string;
  animal: string;
  typeName: string;
  highDimensions: CategoryId[];
  priority: number;
  explanation: string;
  traits: string;
  solution: string;
  childPerspective: string;
}

export const ARCHETYPES: Archetype[] = [
  {
    id: "koala",
    animal: "The Koala",
    typeName: "The Dreamy Koala",
    highDimensions: ["filter", "time"],
    priority: 85,
    explanation: "Inattentive + Executive Function profile.",
    traits: "Reflective, imaginative, loses track of steps and time.",
    solution: "Use visual structure and one-step instructions.",
    childPerspective: "",
  },
  {
    id: "hummingbird",
    animal: "The Hummingbird",
    typeName: "The Flash Hummingbird",
    highDimensions: ["filter", "engine"],
    priority: 71,
    explanation: "Inattentive + Hyperactive profile.",
    traits: "Fast shifts in attention, very active, impulsive starts.",
    solution: "Short task cycles, movement breaks, rapid feedback.",
    childPerspective: "",
  },
  {
    id: "tiger",
    animal: "The Tiger",
    typeName: "The Fierce Tiger",
    highDimensions: ["filter", "fuse"],
    priority: 70,
    explanation: "Inattentive + Emotional profile.",
    traits: "Fluctuating focus with big emotional reactions.",
    solution: "Co-regulation first, then task re-entry.",
    childPerspective: "",
  },
  {
    id: "meerkat",
    animal: "The Meerkat",
    typeName: "The Observing Meerkat",
    highDimensions: ["filter", "sensory"],
    priority: 55,
    explanation: "Inattentive + Sensory profile.",
    traits: "Easily overloaded, scanning environment, variable focus.",
    solution: "Lower sensory load and add predictable routines.",
    childPerspective: "",
  },
  {
    id: "stallion",
    animal: "The Stallion",
    typeName: "The Bold Stallion",
    highDimensions: ["fuse", "time"],
    priority: 60,
    explanation: "Emotional + Executive Function profile.",
    traits: "Strong feelings and friction around transitions/planning.",
    solution: "External time supports plus calm transition rituals.",
    childPerspective: "",
  },
  {
    id: "fox",
    animal: "The Fox",
    typeName: "The Clever Fox",
    highDimensions: ["time", "social"],
    priority: 55,
    explanation: "Executive Function + Social profile.",
    traits: "Socially agile with timing/planning weak points.",
    solution: "First/Then flows and clear social boundaries.",
    childPerspective: "",
  },
  {
    id: "owl",
    animal: "The Owl",
    typeName: "The Keen Owl",
    highDimensions: ["filter", "social"],
    priority: 65,
    explanation: "Inattentive + Social profile.",
    traits: "Deep attention pockets, misses cues in fast exchanges.",
    solution: "Practice turn-taking and cue labeling.",
    childPerspective: "",
  },
  {
    id: "jackrabbit",
    animal: "The Jackrabbit",
    typeName: "The Bolt Jackrabbit",
    highDimensions: ["engine", "time"],
    priority: 65,
    explanation: "Hyperactive + Executive Function profile.",
    traits: "Fast action with trouble sequencing and finishing.",
    solution: "Short sprints with explicit stop checkpoints.",
    childPerspective: "",
  },
  {
    id: "eagle",
    animal: "The Eagle",
    typeName: "The Sky Eagle",
    highDimensions: ["filter", "engine", "time"],
    priority: 60,
    explanation: "Inattentive + Hyperactive + Executive profile.",
    traits: "High-speed shifting attention with planning drag.",
    solution: "Externalize priorities and chunk tasks tightly.",
    childPerspective: "",
  },
  {
    id: "elephant",
    animal: "The Elephant",
    typeName: "The Justice Elephant",
    highDimensions: ["fuse", "social"],
    priority: 50,
    explanation: "Emotional + Social profile.",
    traits: "Justice-driven, relationally intense, sensitive to fairness.",
    solution: "Collaborative problem-solving with explicit social framing.",
    childPerspective: "",
  },
  {
    id: "dolphin",
    animal: "The Dolphin",
    typeName: "The Leap Dolphin",
    highDimensions: ["engine", "social"],
    priority: 55,
    explanation: "Hyperactive + Social profile.",
    traits: "Energetic social initiator, fast conversational jumps.",
    solution: "Movement before social-demand tasks and pause cues.",
    childPerspective: "",
  },
  {
    id: "octopus",
    animal: "The Octopus",
    typeName: "The Vivid Octopus",
    highDimensions: ["filter", "engine", "sensory", "fuse", "time", "social"],
    priority: 15,
    explanation: "High complexity across all six dimensions.",
    traits: "Highly variable regulation across settings and demands.",
    solution: "Reduce cognitive load and support multiple systems at once.",
    childPerspective: "",
  },
  {
    id: "hedgehog",
    animal: "The Hedgehog",
    typeName: "The Storm Hedgehog",
    highDimensions: ["sensory", "fuse"],
    priority: 45,
    explanation: "Sensory + Emotional profile.",
    traits: "Sensory-triggered emotional spikes and rapid escalation.",
    solution: "Pre-empt overload and build recovery routines.",
    childPerspective: "",
  },
  {
    id: "bull",
    animal: "The Bull",
    typeName: "The Fearless Bull",
    highDimensions: ["engine", "fuse"],
    priority: 50,
    explanation: "Hyperactive + Emotional profile.",
    traits: "High-drive behavior with hot emotional reactivity.",
    solution: "Movement channels with strong co-regulation anchors.",
    childPerspective: "",
  },
  {
    id: "cheetah",
    animal: "The Cheetah",
    typeName: "The Blaze Cheetah",
    highDimensions: ["engine", "fuse", "time"],
    priority: 45,
    explanation: "Hyperactive + Emotional + Executive profile.",
    traits: "Rapid action, stress spikes, late-stage panic completion.",
    solution: "Time visuals and micro-deadlines before escalation.",
    childPerspective: "",
  },
  {
    id: "rhino",
    animal: "The Rhino",
    typeName: "The Thunder Rhino",
    highDimensions: ["engine", "sensory"],
    priority: 40,
    explanation: "Hyperactive + Sensory profile.",
    traits: "Seeks strong input, forceful pace, hard stops/transitions.",
    solution: "Heavy-work routines and structured sensory outlets.",
    childPerspective: "",
  },
  {
    id: "deer",
    animal: "The Deer",
    typeName: "The Still Deer",
    highDimensions: ["sensory", "time"],
    priority: 40,
    explanation: "Sensory + Executive Function profile.",
    traits: "Cautious pacing, overload around transitions/unknowns.",
    solution: "Preview changes early with consistent sequence cues.",
    childPerspective: "",
  },
  {
    id: "red-panda",
    animal: "The Red Panda",
    typeName: "The Red Panda",
    highDimensions: ["sensory", "social"],
    priority: 35,
    explanation: "Sensory + Social profile.",
    traits: "Social interest with fast fatigue in noisy environments.",
    solution: "Low-stim social scaffolding and planned breaks.",
    childPerspective: "",
  },
  {
    id: "bison",
    animal: "The Bison",
    typeName: "The Storm Bison",
    highDimensions: ["engine", "sensory", "fuse"],
    priority: 35,
    explanation: "Hyperactive + Sensory + Emotional profile.",
    traits: "Large energy with sensory/emotional volatility.",
    solution: "Rhythmic movement and early downshift rituals.",
    childPerspective: "",
  },
  {
    id: "firefly",
    animal: "The Firefly",
    typeName: "The Spark Firefly",
    highDimensions: ["filter", "time", "social"],
    priority: 40,
    explanation: "Inattentive + Executive + Social profile.",
    traits: "Imaginative, socially bright, loses thread under demands.",
    solution: "Visual anchors and conversational pacing supports.",
    childPerspective: "",
  },
  {
    id: "turtle",
    animal: "The Turtle",
    typeName: "The Deep Turtle",
    highDimensions: ["filter", "sensory", "time"],
    priority: 30,
    explanation: "Inattentive + Sensory + Executive profile.",
    traits: "Deliberate pace, overload vulnerability, transition friction.",
    solution: "Calm workspace + visible task sequencing.",
    childPerspective: "",
  },
  {
    id: "macaw",
    animal: "The Macaw",
    typeName: "The Bold Macaw",
    highDimensions: ["engine", "fuse", "social"],
    priority: 30,
    explanation: "Hyperactive + Emotional + Social profile.",
    traits: "Expressive intensity in relationships and group settings.",
    solution: "Channel social energy into defined helper/leader roles.",
    childPerspective: "",
  },
  {
    id: "whale",
    animal: "The Whale",
    typeName: "The Gentle Whale",
    highDimensions: ["sensory", "fuse", "social"],
    priority: 25,
    explanation: "Sensory + Emotional + Social profile.",
    traits: "Deeply affected by environments and interpersonal tone.",
    solution: "Protective sensory boundaries and relational safety cues.",
    childPerspective: "",
  },
  {
    id: "beaver",
    animal: "The Beaver",
    typeName: "The Architect Beaver",
    highDimensions: ["filter", "social", "time", "sensory"],
    priority: 20,
    explanation: "Inattentive + Sensory + Executive + Social profile.",
    traits: "Needs high structure to feel safe and effective.",
    solution: "Consistent routines and transition previews.",
    childPerspective: "",
  },
  {
    id: "hawk",
    animal: "The Hawk",
    typeName: "The Guardian Hawk",
    highDimensions: ["social", "fuse", "sensory", "engine"],
    priority: 25,
    explanation: "Social + Emotional + Sensory + Hyperactive profile.",
    traits: "Protective, alert, and highly reactive under social stress.",
    solution: "Shared rules, predictable social scripts, and decompression.",
    childPerspective: "",
  },
];

// ─── Step Configuration ─────────────────────────────────────────────────────

export const TOTAL_STEPS = 37;
const BASIC_INFO_COUNT = BASIC_INFO_QUESTIONS.length; // 6

/** Flat list of all Likert questions with their category info */
export interface LikertStepConfig {
  type: "likert";
  categoryId: CategoryId;
  categoryLabel: string;
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
      categoryLabel: cat.label,
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
  return answers.reduce((sum, a) => sum + a, 0);
}

export function normalizeScore(rawScore: number, maxRaw: number): number {
  if (maxRaw === 0) return 0;
  return Math.round((rawScore / maxRaw) * 18);
}

export function getIntensity(normalized: number): Intensity {
  if (normalized <= 6) return "low";
  if (normalized <= 12) return "moderate";
  return "high";
}

export interface TraitScores {
  filter: number;
  engine: number;
  sensory: number;
  fuse: number;
  time: number;
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

/**
 * Compute normalized scores (0-18) for each category.
 */
export function computeScores(
  responses: Record<string, unknown>,
): TraitScores {
  const categoryAnswers = extractCategoryAnswers(responses);
  const scores = {} as TraitScores;

  for (const cat of ASSESSMENT_CATEGORIES) {
    const answers = categoryAnswers[cat.id];
    const raw = scoreCategory(answers);
    const maxRaw = cat.questions.length * 3;
    scores[cat.id] = normalizeScore(raw, maxRaw);
  }

  return scores;
}

/**
 * Match the best archetype using weighted-fit scoring:
 * - Primary signal: average score across an archetype's required dimensions
 * - Secondary signal: configured priority weight (from product ranking)
 */
export function matchArchetype(scores: TraitScores): Archetype {
  let bestArchetype = ARCHETYPES[0];
  let bestFinalScore = Number.NEGATIVE_INFINITY;
  let bestAverageScore = Number.NEGATIVE_INFINITY;

  for (const arch of ARCHETYPES) {
    const dimensionScores = arch.highDimensions.map((d) => scores[d]);
    const avgScore =
      dimensionScores.reduce((sum, value) => sum + value, 0) /
      arch.highDimensions.length;

    // Main signal = avgScore; priority is used as a stable tie-break helper.
    const finalScore = avgScore * 10 + arch.priority;

    if (finalScore > bestFinalScore) {
      bestFinalScore = finalScore;
      bestAverageScore = avgScore;
      bestArchetype = arch;
      continue;
    }

    if (finalScore === bestFinalScore) {
      // Tie-break #1: prefer stronger direct score fit.
      if (avgScore > bestAverageScore) {
        bestAverageScore = avgScore;
        bestArchetype = arch;
        continue;
      }

      // Tie-break #2: prefer more specific (fewer required dimensions).
      if (
        avgScore === bestAverageScore &&
        arch.highDimensions.length < bestArchetype.highDimensions.length
      ) {
        bestArchetype = arch;
      }
    }
  }

  return bestArchetype;
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
