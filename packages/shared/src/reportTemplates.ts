export interface ArchetypeReportTemplate {
  archetypeId: string;
  title: string;
  innerVoiceQuote: string;
  animalDescription: string;
  aboutChild: string;
  hiddenGift: string;
  aboutBrain: string;
  brainSections: Array<{
    title: string;
    content: string;
  }>;
  dayInLife: {
    morning: string;
    school: string;
    afterSchool: string;
    bedtime: string;
  };
  drains: string[];
  fuels: string[];
  overwhelm: string;
  affirmations: Array<{
    when: string;
    say: string;
  }>;
  doNotSay: Array<{
    when: string;
    insteadOf: string;
    tryThis: string;
  }>;
  closingLine: string;
  whatHelps?: {
    aboutChild?: string;
    hiddenGift?: string;
    brain?: string;
    morning?: string;
    school?: string;
    afterSchool?: string;
    bedtime?: string;
    overwhelm?: string;
  };
}

const REPORT_TEMPLATES: Record<string, ArchetypeReportTemplate> = {
  "fox": {
    "fuels": [
      "Clear, specific first steps provided just before the task begins",
      "Structure that makes starting easier than avoiding",
      "Private, non-shaming conversations about what made the task feel too hard",
      "Adults who celebrate [HIS/HER/THEIR] verbal intelligence while addressing the gap underneath",
      "Support systems that make the hard things genuinely more manageable",
      "Being understood as someone whose brain found a clever workaround for a real problem",
      "Explicit, concrete expectations delivered without room for negotiation"
    ],
    "title": "THE CLEVER FOX",
    "drains": [
      "Tasks that feel cognitively overwhelming with no starting support",
      "Environments where avoidance is easy and support is absent",
      "Being caught out and shamed for avoidance behavior",
      "Feeling like [HIS/HER/THEIR] intelligence is being used against [HIM/HER/THEM]",
      "Consequences that don't address the underlying executive struggle",
      "Being labeled as manipulative or dishonest",
      "Unstructured tasks with no clear expectations"
    ],
    "doNotSay": [
      {
        "when": "You can see exactly what's happening and you're frustrated by it",
        "tryThis": "\"I can see you're trying to get around this. Let's talk about what makes it feel so hard.\"",
        "insteadOf": "\"Stop trying to manipulate me.\""
      },
      {
        "when": "Something hasn't been told straight and trust feels thin",
        "tryThis": "\"I know you're not trying to lie. Your brain is trying to avoid something difficult.\"",
        "insteadOf": "\"You're so dishonest.\""
      },
      {
        "when": "The intelligence is being used against you and it's wearing you down",
        "tryThis": "\"You are clever. Let's use that for something that actually helps you.\"",
        "insteadOf": "\"You think you're so clever.\""
      },
      {
        "when": "You've caught it in real time and [NAME] knows it",
        "tryThis": "\"I see what's happening. And I also see how hard this feels. Let's do it together.\"",
        "insteadOf": "\"I can see right through you.\""
      },
      {
        "when": "You're worried about what these patterns mean long term",
        "tryThis": "\"I want to help you get to a place where you don't need to get away with anything.\"",
        "insteadOf": "\"You'll never get away with this forever.\""
      }
    ],
    "dayInLife": {
      "school": "[NAME]'s classroom behavior is a study in social intelligence deployed in service of executive avoidance. [HE/SHE/THEY] asks questions at strategic moments - not always because [HE/SHE/THEY] doesn't know the answer, but because a question buys time and shifts attention. [HE/SHE/THEY] volunteers for tasks that involve talking or presenting (because these activate [HIS/HER/THEIR] genuine strengths) and finds reasons to avoid tasks that require sustained written output or careful sequential work. Teachers often describe [NAME] as bright but inconsistent, engaged but avoidant, charming but frustrating. All of these things are true simultaneously, and they all point to the same underlying dynamic.",
      "bedtime": "[NAME] is often at [HIS/HER/THEIR] most genuinely connected at bedtime - the social performance of the day has wound down, the pressure to manage and navigate has eased, and what remains is often a surprisingly open, thoughtful, emotionally honest child who wants to talk, to connect, and to be known. Make time for that child every night.",
      "morning": "Getting [NAME] out of the house in the morning is rarely straightforward. [HE/SHE/THEY] has learned to navigate them socially - a well-timed joke, a question that pulls your attention sideways, a conversation that somehow becomes the whole morning. Before you know it, it's 10 minutes later and [HE/SHE/THEY] still hasn't got [HIS/HER/THEIR] shoes on. It's important that you know that this is not deliberate manipulation. It is [NAME]'s most reliable coping strategy operating exactly as it was designed to.",
      "afterSchool": "Homework is where [NAME]'s avoidance strategies are most visible and most persistent. The negotiation, the bargaining, the creative reframing of why the homework doesn't need to be done right now, the sudden urgent need to tell you something important just as you sit down together - these are all [NAME]'s executive system doing what it does best. The task feels genuinely hard. The social route around it feels genuinely easy. Until the environment changes to make avoidance less available and support more present, this dynamic will repeat reliably every afternoon."
    },
    "overwhelm": "[NAME]'s overwhelm is one of the least visible on this list, because [HIS/HER/THEIR] primary response to difficulty is social navigation rather than emotional escalation or physical dysregulation. When [NAME] is overwhelmed, [HE/SHE/THEY] talks more, deflects more, jokes more, negotiates more. The performance intensifies. The charm goes up. And underneath it, quietly, [NAME] is at the limit of what [HIS/HER/THEIR] executive system can manage.\nThe moment when this facade breaks (when the social navigation finally fails, when the task cannot be avoided any longer, when the consequence is unavoidable) can be surprisingly raw. [NAME] may cry, shut down, express genuine shame, or become uncharacteristically quiet. This is [HIM/HER/THEM] without the toolkit. And it is a moment that requires enormous gentleness - because underneath all the cleverness is a child who knows, on some level, that [HE/SHE/THEY] keeps finding ways around things [HE/SHE/THEY] should be able to do, and who carries more shame about that than [HE/SHE/THEY] ever lets on.\nIn these moments the most powerful thing you can do is separate the behavior from the child completely. Say it directly: \"You're not lazy. I've never thought that, not once.\" But don't stop there. Understanding why something happens doesn't mean nothing has to change. [NAME] needs to hear both things: the struggle is real, and building better systems is not optional. Warm and clear, not one or the other.",
    "aboutChild": "[NAME] is the child who can talk [HIMSELF/HERSELF/THEMSELVES] out of almost anything. [HE/SHE/THEY] has an answer for every question, a reason for every situation, and a remarkably persuasive way of presenting both that can leave adults genuinely uncertain about what just happened. [HE/SHE/THEY] connects easily with people, reads a room quickly, and has a natural way of making others want to help [HIM/HER/THEM]. [NAME] is not doing this deliberately. [HE/SHE/THEY] is doing what [HIS/HER/THEIR] brain does automatically and extremely well - reading the social situation, identifying the path of least resistance, and using language to navigate toward it.\nWhat drives this behavior is the intersection of two neurological realities: a genuine struggle with executive function that makes certain tasks feel insurmountable, and a highly developed social intelligence that has learned, quite effectively, to compensate. When a task feels too hard to start, too overwhelming to organize, or too cognitively demanding to sustain, [NAME]'s brain does not shut down. It finds another route. And the route it has found (charm, persuasion, reframing) works often enough to have become [HIS/HER/THEIR] default response.",
    "archetypeId": "fox",
    "closingLine": "[NAME] is a Clever Fox. And the world needs more of them.",
    "affirmations": [
      { "when": "After avoidance, deflection, or a task that didn't happen, again", "say": "\"You are not your avoidance. That's just your brain finding a way around something hard.\"" },
      { "when": "When [NAME]'s intelligence is being used to wriggle out of things instead of doing them", "say": "\"Your cleverness is genuinely one of your best qualities. We're going to use it for bigger things.\"" },
      { "when": "When [NAME] has become defensive and is bracing for a confrontation", "say": "\"I'm not trying to catch you out. I'm trying to make the hard things easier.\"" },
      { "when": "When the pattern of talking around things is becoming the default response to difficulty", "say": "\"I know it feels easier to talk your way around things. Let's make doing them feel easier too.\"" },
      { "when": "On a hard day when the avoidance and the strategies have overshadowed everything else", "say": "\"I see who you are underneath all of this. And that person is extraordinary.\"" }
    ],
    "aboutBrain": "[NAME]'s profile is shaped by two areas where [HIS/HER/THEIR] brain works differently.",
    "brainSections": [
      {
        "title": "Executive Function",
        "content": "[NAME]'s brain struggles with the cognitive work of organizing, initiating, and sustaining effort on tasks that feel difficult, boring, or cognitively demanding. This is a genuine neurological gap in the system that generates the activation energy needed to begin and persist with hard things. When [NAME] encounters a task that triggers this gap, the discomfort is immediate and physical, like a wall that goes up before [HE/SHE/THEY] has even tried. The avoidance that follows is not a choice to be lazy. It is a nervous system protecting itself from an experience it finds genuinely aversive."
      },
      {
        "title": "Social Awareness",
        "content": "[NAME]'s social intelligence is genuinely high - and this is both a strength and, in its current form, a complicating factor. [HE/SHE/THEY] reads people with precision. [HE/SHE/THEY] knows what adults want to hear, what will defuse a situation, what angle will be most persuasive. [HE/SHE/THEY] uses this knowledge fluidly and instinctively in social situations (including situations where the goal is to avoid something [HIS/HER/THEIR] executive system finds too difficult to face)."
      }
    ],
    "innerVoiceQuote": "I found a better route. The original route was fine. Mine was just more interesting.",
    "hiddenGift": "The verbal intelligence, social awareness, and adaptive thinking that [NAME] currently uses to avoid difficult tasks are the same qualities that will one day make [HIM/HER/THEM] exceptional. The ability to read a room, find the right words, adapt to any audience, and think laterally around obstacles is genuinely rare and genuinely valuable. Leaders, negotiators, communicators, entrepreneurs - the qualities [NAME] is already demonstrating at [HIS/HER/THEIR] age are the foundation of extraordinary capability. The goal is to create an environment where [NAME]'s executive struggles are supported enough that these same gifts can be pointed at something worthy of them.",
    "animalDescription": "The Fox is widely regarded as one of the most intelligent animals in the natural world. Not because it is the strongest or the fastest, but because it is the most adaptable. It reads its environment with extraordinary precision, identifies exactly what is needed in any given situation, and finds a way to get there that most other animals would never think of. It doesn't force its way through obstacles. It finds the gap, the angle, the clever route that was always there but invisible to everyone else. This particular Fox is the Clever one. [NAME] doesn't just think. [NAME] thinks around things - and that is a quality that will serve [HIM/HER/THEM] extraordinarily well for the rest of [HIS/HER/THEIR] life, once the right environment is found to channel it.",
    "whatHelps": {
      "hiddenGift": "What helps is giving these strengths a good job to do. Let [NAME] explain ideas out loud, teach something back, help solve real problems, make choices, and use words as a strength, but always alongside support for the parts that are harder. If [NAME] talks brilliantly about a project, help turn that into one finished paragraph, one completed plan, or one task done from start to end.",
      "brain": "What helps is removing the wall, not pushing harder against it. Break the task into the smallest possible first step. Sit with [HIM/HER/THEM] for the first two minutes. Use a timer to create a defined, contained start. The goal is just to get [HIM/HER/THEM] through the door - once [HE/SHE/THEY] is moving, the brain usually follows.",
      "morning": "The fix is to take yourself out of the equation. A visual checklist on the wall - not your voice, not a reminder, not a back-and-forth. Just the list. Point to it. \"What's next?\" The routine becomes the authority, not you - and there is nothing left to charm [HIS/HER/THEIR] way around.",
      "school": "Before school, practise the exact kind of work that gets avoided. Sit with [NAME] for five or 10 minutes at home and make the task very small: one sentence, one sum, one written answer, one short sequence. Stay close, help start immediately, and do not let talking replace doing. The goal is to build the habit of beginning, sticking, and finishing a small piece even when it is not the kind of task that comes easily.",
      "afterSchool": "Sit with [NAME] for the first five minutes of homework. Not to do it for [HIM/HER/THEM], just to be present while [HE/SHE/THEY] starts. Once the engine is running, [NAME] can often continue alone. It's the ignition that needs support, not the drive.",
      "overwhelm": "In these moments the most powerful thing you can do is separate the behavior from the child completely. Say it directly: \"You're not lazy. I've never thought that, not once.\" But don't stop there. Understanding why something happens doesn't mean nothing has to change. [NAME] needs to hear both things: the struggle is real, and building better systems is not optional. Warm and clear, not one or the other."
    }
  },
  "hummingbird": {
    "fuels": [
      "Regular movement breaks built into the day",
      "Tasks with novelty, variety or a competitive element",
      "One clear instruction at a time with immediate feedback",
      "Physical activity before demanding cognitive tasks",
      "Being given legitimate ways to move and fidget",
      "Clear signals before every change of activity",
      "An adult who channels [HIS/HER/THEIR] energy rather than suppresses it"
    ],
    "title": "THE FLASH HUMMINGBIRD",
    "drains": [
      "Long periods of required stillness",
      "Repetitive, low-stimulation tasks",
      "Multi-step instructions given all at once",
      "Environments with no outlet for physical energy",
      "Being constantly corrected for movement and noise",
      "Transitions without warning or structure",
      "Feeling like [HIS/HER/THEIR] energy is a problem"
    ],
    "doNotSay": [
      {
        "when": "They can't stop moving during homework or a meal",
        "tryThis": "\"Let's find a way for you to move while we do this.\"",
        "insteadOf": "\"Why can't you just sit still?\""
      },
      {
        "when": "They've abandoned another project halfway through",
        "tryThis": "\"Let's pick one thing and finish it together.\"",
        "insteadOf": "\"You never finish anything.\""
      },
      {
        "when": "You're running on empty and the noise and chaos is relentless",
        "tryThis": "\"I need a minute. Then I'm all yours.\"",
        "insteadOf": "\"You're so exhausting.\""
      },
      {
        "when": "You've said something three times and nothing has registered",
        "tryThis": "\"Let me get your full attention for just 30 seconds.\"",
        "insteadOf": "\"Why don't you ever listen?\""
      },
      {
        "when": "The energy is escalating and you can feel it tipping",
        "tryThis": "\"I can see you're really revved up. Let's get some energy out first.\"",
        "insteadOf": "\"You're driving me crazy.\""
      }
    ],
    "dayInLife": {
      "school": "[NAME]'s classroom is a significant daily challenge. Sitting still for extended periods goes against everything [HIS/HER/THEIR] nervous system needs. [HE/SHE/THEY] fidgets, shifts, taps, gets up, calls out, not to disrupt, but to regulate. [HIS/HER/THEIR] teacher may describe [HIM/HER/THEM] as disruptive, impulsive, or unable to follow instructions. What is actually happening is a child whose brain requires movement and novelty to stay engaged, trapped in an environment designed for stillness and repetition. [NAME] is not the problem in that classroom. The mismatch between [HIS/HER/THEIR] neurological needs and the environment's demands is the problem.",
      "bedtime": "[NAME]'s brain does not have a natural dimmer switch. As the day winds down for everyone else, [HIS/HER/THEIR] nervous system is still running. Getting [NAME] to sleep requires more than just putting [HIM/HER/THEM] to bed, it requires a deliberate, consistent wind-down sequence that gradually reduces stimulation. Screens, roughhousing, and exciting conversations close to bedtime will significantly delay sleep. A predictable, calm routine, the same every night, is one of the most powerful tools you have for this part of the day.",
      "morning": "Getting [NAME] out of the house in the morning is one of the most reliably challenging parts of your day, and it will be until the right systems are in place. [HE/SHE/THEY] wakes up already in motion, already talking, already interested in seventeen things before [HIS/HER/THEIR] feet hit the floor. Each step of the morning routine is an opportunity for [HIS/HER/THEIR] attention to be captured by something more interesting than the last. Getting dressed requires passing the bookshelf. Brushing teeth requires walking past the bedroom where something interesting is happening. Every transition is a potential detour, not because [NAME] is being difficult, but because [HIS/HER/THEIR] brain treats every new stimulus as equally important and equally worthy of immediate attention.",
      "afterSchool": "If you were hoping the energy would be lower after a full day of school, it often isn't, at least not immediately. [NAME] arrives home like a pressure valve releasing. Everything that was held in, sat on, and suppressed during the school day comes out at once, in noise, in movement, in a torrent of words about everything and nothing. This is not [NAME] being difficult. This is [NAME] finally being somewhere safe enough to be fully [HIMSELF/HERSELF/THEMSELVES]. Give [HIM/HER/THEM] time and space to decompress before asking anything of [HIM/HER/THEM]."
    },
    "overwhelm": "[NAME]'s overwhelm looks different from most children's. It rarely arrives as quiet withdrawal, it arrives as escalation. When [NAME]'s nervous system reaches its limit, the movement gets bigger, the noise gets louder, the behavior gets more dysregulated. What looks like [NAME] \"acting up\" is often actually [NAME] at the edge of what [HIS/HER/THEIR] nervous system can manage. The stimulation has become too much, the demands have piled up, and the only available response is to go faster and louder rather than slower and quieter.\nIn these moments the instinct is often to clamp down, to demand stillness, raise your voice, increase consequences. This will almost always make things worse. What [NAME] needs when escalating is a reduction in demands, an increase in space, and if possible a physical outlet, a run outside, a jumping session, something that lets the nervous system discharge rather than implode. Once the physical release has happened, [NAME] will come back to baseline faster than you might expect. The recovery time for a Flash Hummingbird, when handled well, is remarkably short.",
    "aboutChild": "[NAME] is the child who is everywhere and nowhere at the same time. [HE/SHE/THEY] starts breakfast, remembers something funny, slides off the chair, picks up a toy from the floor, begins building something, hears a noise outside, goes to investigate - and is genuinely surprised 10 minutes later when you point out that the cereal is still on the table, untouched and soggy. This is a brain and a body that are wired to keep moving, keep seeking, keep starting - and that find it genuinely, neurologically difficult to slow down, land, and finish. [NAME] is not scattered, [HE/SHE/THEY] is responding to a brain that doesn't filter - everything comes in at full blast, all at once, and it all feels like it matters right now.\nLiving with [NAME] is exhilarating and exhausting in almost equal measure. [HE/SHE/THEY] brings energy, spontaneity and an infectious aliveness to every room [HE/SHE/THEY] enters. [HE/SHE/THEY] also leaves a trail of unfinished tasks, lost belongings, interrupted conversations, and half-built creations. On the hard days, that trail is all you can see. But it is not the whole picture, and it is not who [HE/SHE/THEY] is. That trail is not [HIS/HER/THEIR] fault. It is the natural byproduct of a brain that is always already on to the next thing.",
    "archetypeId": "hummingbird",
    "closingLine": "[NAME] is a Flash Hummingbird. And the world needs more of them.",
    "affirmations": [
      { "when": "When the energy in the room is too much and everyone's patience is running thin", "say": "\"Your energy is not a problem. We just need to find the right place for it to go.\"" },
      { "when": "After being asked to sit still for the fifth time and still not managing it", "say": "\"I know sitting still is really hard for you. That's not your fault.\"" },
      { "when": "When [NAME] can feel they're wearing people out", "say": "\"You are not too much. You are exactly right.\"" },
      { "when": "When the excitement and intensity feel like they're being treated as a flaw", "say": "\"I love how excited you get about things. That's one of my favorite things about you.\"" },
      { "when": "After a day where nothing seemed to work and everyone is frustrated", "say": "\"We'll figure out a system together. I'm not giving up on finding what works.\"" }
    ],
    "aboutBrain": "[NAME]'s profile is shaped by two areas where [HIS/HER/THEIR] brain works differently.",
    "brainSections": [
      {
        "title": "Attention",
        "content": "[NAME]'s brain has a dopamine regulation system that is constantly seeking novelty and stimulation. The moment a task becomes familiar, repetitive, or unstimulating, [HIS/HER/THEIR] brain begins scanning for something more activating, not as a choice, but as an automatic neurological response. This is why [NAME] can be completely absorbed in something exciting one minute and completely disengaged from something routine the next. The issue is never ability or desire. It is whether the task in front of [HIM/HER/THEM] is generating enough neurological stimulation to hold [HIS/HER/THEIR] brain in place. When it isn't, and for most ordinary tasks, it isn't, [HIS/HER/THEIR] attention simply moves on without asking permission."
      },
      {
        "title": "Hyperactivity",
        "content": "[NAME]'s brain and body are in a state of constant activation. This is not excess energy that can be burned off with enough exercise, though movement absolutely helps. It is a neurological baseline that sits significantly higher than most children [HIS/HER/THEIR] age. [HIS/HER/THEIR] body moves because [HIS/HER/THEIR] nervous system needs it to. Fidgeting, squirming, getting up, touching things, making noise, these are not misbehaviors. They are [NAME]'s nervous system regulating itself the only way it knows how. Stillness, for [NAME], is not restful. It is genuinely effortful, and demanding it without support is like asking someone to hold their breath for an extended period and then being frustrated when they gasp for air."
      }
    ],
    "innerVoiceQuote": "I bring the energy that makes the room feel alive. You can't teach that.",
    "hiddenGift": "The same engine that makes [NAME] so hard to keep up with is the engine that makes [HIM/HER/THEM] extraordinary in the right environment. [NAME] generates ideas faster than most people process them. [HE/SHE/THEY] is first, first to try, first to respond, first to notice something new, first to suggest something nobody else thought of. [HIS/HER/THEIR] enthusiasm is genuine and contagious. When [NAME] is interested in something, truly interested, the focus and energy [HE/SHE/THEY] brings to it is unlike anything you have seen from a child. The goal is not to slow [NAME] down. The goal is to build a world around [HIM/HER/THEM] that gives that extraordinary energy somewhere meaningful to land.",
    "animalDescription": "The Hummingbird is the most energetic creature on earth, beating its wings up to 80 times per second, visiting hundreds of flowers in a single day, never fully still, never fully done. It doesn't choose this pace. It is simply built this way, its metabolism demands constant movement and constant input just to survive. This particular Hummingbird is the Flash one, here, gone, already somewhere else before you finished the sentence. Not because it doesn't care about where it just was. Because the next thing is already calling, and the body was moving before the brain had a chance to decide.",
    "whatHelps": {
      "aboutChild": "Don't fight the movement, channel it. A visual routine removes the need to remember. One instruction at a time removes the need to hold everything at once. A physical outlet before any demand that requires sitting gives the engine somewhere to go first.",
      "hiddenGift": "Find the thing that makes [NAME] forget to move. It exists, every Hummingbird has one: a subject, a skill, a world that holds them completely still without asking. When you find it, protect it fiercely. That is not just [NAME]'s hobby, that is [NAME]'s way in.",
      "brain": "For attention, keep tasks short and use timers to make them feel bounded. Add novelty where you can - vary the setting, the format, the order. Use [NAME]'s interests as an entry point when introducing something new. For hyperactivity, allow movement during work - standing, fidget tools, sitting on the floor. Build in physical breaks before demanding focused effort. Don't fight the fidgeting; it's how [NAME]'s brain stays regulated enough to function.",
      "morning": "A visual routine on the wall removes the need to remember or negotiate - [NAME] follows the chart, not you, which also means fewer battles. Lay everything out the night before: clothes, bag, everything. Reduce the number of decisions the morning requires to almost zero. And keep the environment as boring as possible until you're out the door.",
      "school": "If the school is open to it, ask about a movement pass - permission to get up and walk to the water fountain or do a quick errand. A fidget tool on the desk, sitting at the end of a row, or standing at the back during lessons can all help [NAME] regulate without disrupting anyone.",
      "afterSchool": "Give [HIM/HER/THEM] time and space to decompress before asking anything of [HIM/HER/THEM]. 15 to 20 minutes of free physical play before any demands (a trampoline, a run in the garden, even just bouncing a ball) lets the pressure valve release safely.",
      "bedtime": "Start winding down 30 minutes before bed - same sequence every night. Cut screens, roughhousing, and stimulating conversation in that window. Keep it calm, dim, and predictable. If [NAME] still can't settle, try a low-key audiobook or soft music to give the brain something quiet to hold onto instead of generating its own noise.",
      "overwhelm": "In these moments the instinct is often to clamp down: to demand stillness, raise your voice, increase consequences. This will almost always make things worse. What [NAME] needs when escalating is a reduction in demands, an increase in space, and if possible a physical outlet: a run outside, a jumping session, something that lets the nervous system discharge rather than implode. Once the physical release has happened, [NAME] will come back to baseline faster than you might expect. The recovery time for a Flash Hummingbird, when handled well, is remarkably short."
    }
  },
  "koala": {
    "fuels": [
      "One instruction at a time, delivered with eye contact",
      "Unstructured creative time with no expected outcome",
      "Gentle re-entry after drifting, without shame",
      "Predictable daily routines that reduce decision fatigue",
      "Being recognized specifically for [HIS/HER/THEIR] imagination and ideas",
      "A 5-minute heads-up before any change of activity",
      "An adult who treats [HIS/HER/THEIR] inner world as an asset, not an obstacle"
    ],
    "title": "THE DREAMY KOALA",
    "drains": [
      "Open-ended tasks with no clear starting point",
      "Long multi-step instructions given all at once",
      "Being rushed or pressured when [HE/SHE/THEY] is mid-thought",
      "Constant background noise or unpredictable environments",
      "Being asked why [HE/SHE/THEY] forgot, [HE/SHE/THEY] genuinely doesn't know",
      "Transitions without any warning or preparation time",
      "Feeling like [HIS/HER/THEIR] natural pace is a problem to be solved"
    ],
    "doNotSay": [
      {
        "when": "You've said something and they clearly didn't register it",
        "tryThis": "\"Let me get your eyes first, and then I'll tell you.\"",
        "insteadOf": "\"You never listen.\""
      },
      {
        "when": "They've left the house without something important, again",
        "tryThis": "\"Let's build a system together so it's easier next time.\"",
        "insteadOf": "\"How did you forget AGAIN?\""
      },
      {
        "when": "They're staring at a blank page or drifting mid-task",
        "tryThis": "\"Let's find a quiet spot and start this one together.\"",
        "insteadOf": "\"Why can't you just focus?\""
      },
      {
        "when": "You've lost them mid-conversation",
        "tryThis": "\"Welcome back! What were you thinking about?\"",
        "insteadOf": "\"You were daydreaming AGAIN.\""
      },
      {
        "when": "They've forgotten something that mattered to you both",
        "tryThis": "\"I know you care. Your brain just works differently, and that's totally okay.\"",
        "insteadOf": "\"You'd remember if you actually cared.\""
      }
    ],
    "dayInLife": {
      "school": "[NAME]'s teacher describes [HIM/HER/THEM] as bright but distant. When she begins explaining something, [NAME] starts with the best of intentions. But by the third or fourth sentence, a word she used triggered a thought, which opened a door, which led somewhere else entirely, and now [NAME] is mentally three rooms away while [HIS/HER/THEIR] body sits obediently at [HIS/HER/THEIR] desk. [HE/SHE/THEY] will have no memory of the instructions. Not because [HE/SHE/THEY] wasn't trying. Because the neurological pathway that was supposed to carry that information simply didn't stay open long enough. [HE/SHE/THEY] will look around at what other children are doing and try to piece together what [HE/SHE/THEY] missed, a strategy that works sometimes and quietly exhausts [HIM/HER/THEM] every single day.\n",
      "bedtime": "You might expect that a child who drifts through the day would fall asleep easily. [NAME] does not. The moment the external world goes quiet, [HIS/HER/THEIR] internal world gets louder. Thoughts arrive uninvited, ideas, memories, tomorrow's worries, a song, a question about space, something funny that happened three weeks ago. [HIS/HER/THEIR] brain, freed from the effort of trying to stay present, begins generating freely, and it is very good at it. [NAME] is often the last one asleep. This is not defiance. It is a brain that doesn't have an off switch, and it needs your patience at the end of the day as much as at the beginning.",
      "morning": "You ask [NAME] to get dressed. [HE/SHE/THEY] nods, [HE/SHE/THEY] heard you, [HE/SHE/THEY] intends to do it, and [HE/SHE/THEY] heads to [HIS/HER/THEIR] room. When you come back, [HE/SHE/THEY] is sitting on the edge of [HIS/HER/THEIR] bed in [HIS/HER/THEIR] pajamas, holding a small Lego piece [HE/SHE/THEY] found on the floor, turning it over in [HIS/HER/THEIR] fingers with complete absorption. [HE/SHE/THEY] looks up with genuine surprise when you tell [HIM/HER/THEM] it's been fifteen minutes. [HE/SHE/THEY] is not pretending. [HE/SHE/THEY] has no idea where the time went, because for [NAME], it didn't go anywhere. It simply didn't exist. The task of getting dressed required [HIM/HER/THEM] to hold an intention, initiate a sequence of steps, and resist the pull of everything more interesting that appeared along the way. That is an enormous amount of executive work before 8am.\nWhat helps: give [NAME] one step at a time ('put on your shirt' — wait — 'now your trousers') rather than the whole sequence. Stay nearby. The gentle, repeated re-anchoring is the support, not the nagging.",
      "afterSchool": "You give [NAME] a simple three-step task when [HE/SHE/THEY] gets home: put your bag away, wash your hands, come for a snack. [HE/SHE/THEY] sets off with full intention. On the way to the bathroom [HE/SHE/THEY] notices [HIS/HER/THEIR] favourite book on the hallway shelf and pulls it out just to look at the cover. Twenty-five minutes later you find [HIM/HER/THEM] cross-legged on the floor of [HIS/HER/THEIR] bedroom, deeply immersed in chapter four, genuinely surprised to see you standing in the doorway. [HE/SHE/THEY] did not decide to ignore the instructions. [HE/SHE/THEY] simply got lost on the way, the way [NAME] always gets lost, quietly and completely, in whatever [HIS/HER/THEIR] brain finds most alive in that moment.\n"
    },
    "overwhelm": "When [NAME] Gets Overwhelmed [NAME]'s overwhelm does not usually arrive loudly. There is no explosion, no dramatic signal that something has gone wrong. Instead, [NAME] disappears. Not physically, [HE/SHE/THEY] is still sitting right there, but the lights go off behind [HIS/HER/THEIR] eyes and [HE/SHE/THEY] retreats somewhere unreachable. This is [HIS/HER/THEIR] nervous system's response to a world that has asked too much, too fast, with too little support. When the demands accumulate beyond what [HIS/HER/THEIR] executive system can organize, the only available response is to check out entirely.\nWhat makes this particularly hard for parents is that [NAME]'s overwhelm is invisible until it is complete. One minute [HE/SHE/THEY] seems fine. The next [HE/SHE/THEY] is gone, unresponsive, blank, or quietly tearful in a way that seems to have no identifiable cause. The cause is almost never the thing that happened last. It is the accumulation of everything that happened before it.\nIn these moments, resist the instinct to push through. Do not increase demands. Do not ask [HIM/HER/THEM] to explain [HIMSELF/HERSELF/THEMSELVES]. Instead, move close. Speak quietly and simply. A hand on the shoulder, a single low-stakes question, two minutes of sitting together without agenda, these are the things that bring [NAME] back. Once [HE/SHE/THEY] has returned, [HE/SHE/THEY] will often be ready to connect and even to try again. But that conversation can only happen after the storm, however quiet that storm may have been.\n",
    "aboutChild": "[NAME] is the child who stares out the window during dinner, forgets [HIS/HER/THEIR] shoes three times before leaving the house, and loses track of what [HE/SHE/THEY] was doing before [HE/SHE/THEY] even started. This isn't defiance and it isn't laziness, and it's important that you hear that clearly, because [NAME] has probably already been made to feel like it is both. [HIS/HER/THEIR] brain genuinely struggles to stay anchored in the present moment. It drifts, floats, and wanders into a rich inner world that feels more vivid and natural than the one everyone else seems to be living in. [HE/SHE/THEY] isn't tuning you out. [HE/SHE/THEY] is simply somewhere else entirely, and the journey back takes real effort every single time. Living with [NAME] can feel like trying to hold a conversation with someone who is perpetually just slightly out of reach. That gap is not emotional distance. It is neurological, and it is not [HIS/HER/THEIR] fault.",
    "archetypeId": "koala",
    "closingLine": "[NAME] is a Dreamy Koala. And the world needs more of them.",
    "affirmations": [
      { "when": "After drifting, a meltdown, or a hard transition, when coming back feels like too much", "say": "\"I know it's hard to come back. Take your time.\"" },
      { "when": "After losing something, missing a step, or forgetting something that mattered", "say": "\"Forgetting doesn't mean you don't care. I know that.\"" },
      { "when": "When [NAME] seems embarrassed by how their mind works", "say": "\"Your imagination is one of the best things about you.\"" },
      { "when": "Mid-struggle - when you can feel them bracing for your frustration", "say": "\"I'm not frustrated with you. I'm right here with you.\"" },
      { "when": "On a hard day, when everything feels like evidence that something is wrong with them", "say": "\"You don't have to be different. You just need the right support, and we'll find it together.\"" }
    ],
    "aboutBrain": "[NAME]'s profile is shaped by two areas where [HIS/HER/THEIR] brain works differently.",
    "brainSections": [
      {
        "title": "Attention",
        "content": "[NAME]'s brain produces lower levels of dopamine in the prefrontal cortex, the region responsible for keeping us mentally present and engaged. In practical terms, this means [HIS/HER/THEIR] brain's anchor to the present moment is significantly looser than most people's. It's not that [HE/SHE/THEY] doesn't care about what you're saying. It's that without sufficient stimulation or novelty, [HIS/HER/THEIR] brain quite literally cannot maintain its grip on the now, it slides, quietly and without warning, into internal thought. When [NAME] seems to have not heard you, [HE/SHE/THEY] very likely didn't. Not because [HE/SHE/THEY] chose to ignore you, but because the signal never fully arrived. [HIS/HER/THEIR] brain had already drifted before the sentence was finished. This happens at school, at the dinner table, mid-conversation, and mid-task, not occasionally, but as a consistent and exhausting feature of [HIS/HER/THEIR] daily experience."
      },
      {
        "title": "Executive Function",
        "content": "the brain's internal management system, housed in that same prefrontal region. Executive function governs the ability to start tasks, hold instructions in working memory, manage time, transition between activities, and follow through on intentions. For [NAME], this system requires significantly more external support than it does for most children [HIS/HER/THEIR] age. The gap between knowing what to do and actually beginning it can feel enormous and genuinely insurmountable without help. This is why [NAME] can tell you exactly what [HE/SHE/THEY] needs to do and still sit motionless in front of a blank page for twenty minutes. It is not procrastination. It is not stubbornness. It is a brain that needs a co-pilot to get off the ground, and there is no shame in that whatsoever."
      }
    ],
    "innerVoiceQuote": "I notice the small beautiful things that everyone else walks past. I can't help stopping for them.",
    "hiddenGift": "Here is what the school reports and the frustrated mornings don't tell you: [NAME]'s drifting mind is the same mind that makes unexpected creative leaps, notices details others walk straight past, and imagines things that simply haven't existed yet. The brain that cannot stay on task is the same brain that can spend three uninterrupted hours completely absorbed in building, drawing, inventing, or storytelling, without ever needing to be told what to do next, without ever checking if anyone is watching, without ever running out of ideas. That quality of deep, self-directed focus is genuinely rare. Most people spend their entire adult lives trying to find it. [NAME] was born with it. [HE/SHE/THEY] doesn't need to be fixed. [HE/SHE/THEY] needs a world that makes room for the way [HE/SHE/THEY] naturally thinks, and a parent who understands the difference.",
    "animalDescription": "The Koala In the eucalyptus forests of eastern Australia, the Koala moves through the world at its own unhurried pace. While other animals rush and compete and react, the Koala is still, not because it lacks awareness, but because its inner world is simply more absorbing than the noise outside. It sleeps up to twenty hours a day, not out of laziness, but because its brain requires extraordinary amounts of rest to process everything it takes in. This particular Koala is the Dreamy one, the one whose inner world is so rich, so vivid, and so endlessly absorbing that the outside world can barely compete. Where others see a child who is absent, we see a mind that is simply elsewhere. And elsewhere, for [NAME], is a very interesting place.",
    "whatHelps": {
      "aboutChild": "[NAME] does best when you get close, say [HIS/HER/THEIR] name, and give one short direction at a time, like “Put on your shoes now.” [HE/SHE/THEY] is more likely to follow through when adults use checklists, routines, and visual reminders instead of long lectures. Praise works best when it is immediate and specific, like “You remembered your backpack the first time, that was responsible.” When [NAME] gets distracted, calm redirection and a clear next step help much more than criticism or shame.",
      "hiddenGift": "[NAME] focuses deeply and doesn't switch gears easily, so uninterrupted time matters more than it might for other kids. Don't break concentration for non-urgent things, and when [HE/SHE/THEY] seems checked out, check first if [HE/SHE/THEY] is actually mid-thought. Transitions and context-switching are hard. Let [HIM/HER/THEM] finish before introducing something new.",
      "brain": "Make eye contact and use [NAME]'s name before giving instructions - don't speak to [HIM/HER/THEM] from across the room. Keep instructions to one step at a time and ask [HIM/HER/THEM] to repeat the key point back. For tasks, give a concrete first action instead of a general instruction (\"open your notebook\" not \"do your homework\"). Stay nearby for the first few minutes rather than walking away. Give a heads-up before transitions (e.g. \"five more minutes\") so they're not a surprise.",
      "morning": "Give [NAME] one step at a time (\"put on your shirt\" then wait, then \"now your trousers\") rather than the whole sequence. Your presence during transitions helps anchor their focus. Over time, you can gradually step back as they build their own re-anchoring skills.",
      "school": "If your school is open to it, a brief written summary of instructions, even a sticky note on the desk, can give [NAME] a way back in without relying entirely on memory.",
      "afterSchool": "Give one instruction at a time and check that it's done before giving the next. If [NAME] goes quiet, go find [HIM/HER/THEM] - [HE/SHE/THEY] has almost certainly gotten absorbed in something.",
      "bedtime": "Start winding down 30 minutes early - dim lights, no screens, same sequence every night. If [NAME] can't quiet the mental noise, try giving the brain something low-key to latch onto: an audiobook or soft music works better than silence.",
      "overwhelm": "In these moments, resist the instinct to push through. Do not increase demands. Do not ask [HIM/HER/THEM] to explain [HIMSELF/HERSELF/THEMSELVES]. Instead, move close. Speak quietly and simply. A hand on the shoulder. Sit down next to [HIM/HER/THEM]. Say nothing, or say very little. Once [HE/SHE/THEY] has returned, [HE/SHE/THEY] will often be ready to connect and even to try again. But that conversation can only happen after the storm (however quiet that storm may have been)."
    }
  },
  "meerkat": {
    "fuels": [
      "Calm, low-stimulation spaces with predictable sensory input",
      "Soft, seamless clothing chosen with [HIS/HER/THEIR] input",
      "Warning before transitions or changes in environment",
      "Gentle, low-pressure re-entry with no immediate demands",
      "Protected quiet time after school before any activities",
      "An adult who takes [HIS/HER/THEIR] sensory experience seriously",
      "Being understood as someone whose nervous system works differently"
    ],
    "title": "THE OBSERVING MEERKAT",
    "drains": [
      "Loud, unpredictable, or crowded environments",
      "Clothing with uncomfortable textures, tags, or tight fits",
      "Sudden loud noises or unexpected sensory surprises",
      "Being pulled out of internal retreat without warning",
      "Busy after-school schedules with no decompression time",
      "Environments where sensory needs are dismissed or minimized",
      "Being described as \"too sensitive\" or \"overreacting\""
    ],
    "doNotSay": [
      {
        "when": "A reaction seems disproportionate to what happened",
        "tryThis": "\"Your nervous system works differently. Let's figure out what helps.\"",
        "insteadOf": "\"You're too sensitive.\""
      },
      {
        "when": "A sensory trigger seems minor and you want them to push through",
        "tryThis": "\"I know that's uncomfortable. Let's find a way to make it easier.\"",
        "insteadOf": "\"Just ignore it.\""
      },
      {
        "when": "The environment seems fine to everyone else but not to [NAME]",
        "tryThis": "\"I believe you that it's too much. Let's find some quiet.\"",
        "insteadOf": "\"There's nothing to be overwhelmed about.\""
      },
      {
        "when": "[NAME] has drifted and you need them back",
        "tryThis": "\"Welcome back. Take your time, I'll wait.\"",
        "insteadOf": "\"Stop daydreaming and pay attention.\""
      },
      {
        "when": "You're worried about how [NAME] will cope in the world",
        "tryThis": "\"There's nothing to toughen up from. You're exactly as you're supposed to be.\"",
        "insteadOf": "\"You need to toughen up.\""
      }
    ],
    "dayInLife": {
      "school": "The classroom is [NAME]'s most challenging environment. It is bright, noisy, unpredictable, and full of competing sensory demands, all of which [NAME]'s nervous system is processing at high intensity while simultaneously trying to learn, follow instructions, and manage social interactions. The result is that [NAME] retreats. [HE/SHE/THEY] goes quiet, looks away, appears to switch off. Teachers often interpret this as disengagement or lack of effort. What is actually happening is a child whose sensory system has reached its processing limit and has made the only available decision, redirect inward, reduce external input, protect what remains of the available cognitive capacity.",
      "bedtime": "Bedtime can actually be one of the easier parts of [NAME]'s day, if the environment is right. Low light, familiar textures, quiet and predictable surroundings are exactly what [HIS/HER/THEIR] nervous system needs to settle. The challenge is the transition to that environment, moving from the sensory demands of the evening to the calm of bed requires a gradual, consistent wind-down that reduces stimulation incrementally. Abrupt transitions, screens close to bedtime, or unexpected changes to the routine will make settling significantly harder for [NAME] than it needs to be.",
      "morning": "[NAME]'s morning is often derailed before it begins, not by explosive behavior or physical distraction, but by the quiet accumulation of sensory information that starts the moment [HE/SHE/THEY] wakes up. The texture of [HIS/HER/THEIR] clothing. The brightness of the kitchen light. The noise of the radio or a sibling's voice. The smell of breakfast. Each of these is a small sensory input that most people process automatically and unconsciously. For [NAME], each one requires active neurological processing, and by the time [HE/SHE/THEY] reaches the breakfast table, [HIS/HER/THEIR] system is already carrying a load that most children won't reach until mid-morning. The drift and the withdrawal that follow are not attitude. They are a nervous system already working at capacity.",
      "afterSchool": "[NAME] needs significant decompression time after school, more than most children, and more than most parents expect. The school day represents hours of sustained sensory and cognitive effort that is largely invisible to everyone around [HIM/HER/THEM]. Arriving home and being immediately asked questions, given tasks, or placed in another stimulating environment will often push [NAME] past the point of functional capacity. What [NAME] needs first is quiet. A low-stimulation space, minimal demands, and time to let [HIS/HER/THEIR] nervous system settle before anything else is asked of it."
    },
    "overwhelm": "[NAME]'s overwhelm is almost always quiet, and that is precisely what makes it easy to miss until it is complete. There is no explosion, no dramatic escalation, no obvious warning signal. Instead [NAME] simply goes further inside. The withdrawal deepens. [HE/SHE/THEY] becomes unreachable, not uncooperative, not defiant, just genuinely unavailable. [HIS/HER/THEIR] nervous system has reached the limit of what it can process and has shut the door on further input.\nPushing through this withdrawal, demanding engagement, increasing verbal instruction, raising expectations, will almost always extend it. [NAME]'s nervous system cannot be argued or reasoned back to baseline. It needs time, reduced stimulation, and the absence of demand. A quiet space, familiar sensory comfort, a weighted blanket, a preferred texture, a known smell, and a patient adult nearby without agenda are the most effective tools available. The return will happen. It cannot be forced. And when [NAME] does come back, [HE/SHE/THEY] will often be surprisingly present, warm, and ready to connect, because the nervous system, having been allowed to reset, is genuinely available again.",
    "aboutChild": "[NAME] is one of the most quietly observant children you will ever meet. [HE/SHE/THEY] notices things others walk straight past, the shift in someone's mood, the hum of the fluorescent light, the texture of the chair, the conversation happening three tables away. [HIS/HER/THEIR] senses are turned up higher than most people's, which means the world delivers significantly more information to [NAME] per minute than it does to the average child. For a nervous system already working hard to process that volume of input, noisy classrooms, busy shopping centres, and unpredictable social environments are not just uncomfortable, they are genuinely exhausting.\n[NAME]'s response to this is to go inside. Not physically, [HE/SHE/THEY] is still sitting right there, but mentally, [HE/SHE/THEY] retreats to a quieter, safer internal world where the input is manageable and the noise can't reach. This looks like daydreaming. It looks like inattention. It looks, sometimes, like a child who simply isn't interested or isn't trying. None of those things are true. [NAME] is trying harder than most people realize, to manage a sensory experience that is significantly more intense than average, while also appearing to function normally in environments that were not designed with [HIS/HER/THEIR] nervous system in mind.",
    "archetypeId": "meerkat",
    "closingLine": "[NAME] is an Observing Meerkat. And the world needs more of them.",
    "affirmations": [
      {
        "when": "After a long day, or when [NAME] is visibly depleted and hasn't had a moment to themselves",
        "say": "\"You don't have to be on all the time. It's okay to need quiet.\""
      },
      {
        "when": "In a loud or overwhelming environment where [NAME] is clearly struggling",
        "say": "\"I know the world feels loud sometimes. We'll find the quiet together.\""
      },
      {
        "when": "When [NAME] has been told, again, that they're overreacting or too much",
        "say": "\"Being sensitive is not a weakness. It's just how your brain is built.\""
      },
      {
        "when": "When [NAME] has withdrawn and you can feel the pressure building to pull them back",
        "say": "\"I'm not going to push you. I'll be here when you're ready.\""
      },
      {
        "when": "When [NAME] seems embarrassed by how differently they experience things",
        "say": "\"You notice things most people never see. That's actually remarkable.\""
      }
    ],
    "aboutBrain": "[NAME]'s profile is shaped by two areas where [HIS/HER/THEIR] brain works differently, and understanding both transforms the way you interpret [HIS/HER/THEIR] daily behavior.",
    "brainSections": [
      {
        "title": "Attention",
        "content": "[NAME]'s brain struggles to stay anchored in the present moment, but unlike children whose inattention is driven purely by novelty-seeking, [NAME]'s drift is strongly linked to sensory load. When the environment becomes too stimulating, [HIS/HER/THEIR] brain makes an automatic protective decision to disengage from external input and redirect attention inward. This is not a voluntary choice. It is a neurological self-preservation response, the brain managing an input load it cannot sustainably process by simply reducing the amount of external information it is trying to handle. The daydream is not laziness. It is the brain's pressure valve."
      },
      {
        "title": "Sensory Processing",
        "content": "[NAME]'s nervous system processes sensory information, sound, light, touch, smell, texture, movement, with a sensitivity that sits significantly above the typical range. The technical term is sensory over-responsivity, and research shows it is present in approximately 40-60% of children with ADHD. For [NAME], this means that environments which feel perfectly comfortable to most children can feel genuinely overwhelming, not as a matter of preference or sensitivity of character, but as a matter of neurological wiring. The classroom that feels normal to twenty-five other children may feel, to [NAME], like trying to concentrate in the middle of a crowded, noisy, bright, unpredictable space with no way to turn down the volume."
      }
    ],
    "innerVoiceQuote": "It's safer and quieter inside my own head.",
    "hiddenGift": "The same heightened sensory awareness that makes busy environments so difficult for [NAME] is the source of some of [HIS/HER/THEIR] most extraordinary qualities. [NAME] notices nuance that others miss entirely. [HE/SHE/THEY] is deeply attuned to the emotional atmosphere of a room, the unspoken feelings of the people around [HIM/HER/THEM], the beauty in small details that most people walk past without seeing. [HIS/HER/THEIR] inner world is rich, detailed, and genuinely creative, built from years of retreating inside and finding that there is extraordinary territory there. Given the right environment, calm, predictable, low-stimulation, [NAME] is one of the most perceptive, thoughtful, and quietly brilliant children in the room.",
    "animalDescription": "The Meerkat is one of the most watchful creatures on earth. It stands perfectly still at the entrance to its burrow, eyes scanning the horizon in every direction simultaneously, processing the environment with a level of alertness that most animals never reach. It notices everything, every sound, every movement, every shift in the air. And when what it finds is too much, when the threat is real or the input is overwhelming, it disappears underground, into the quiet and the dark and the safety of its own space. This particular Meerkat is the Observing one, not passive, not absent, but watching everything, processing everything, and retreating inside when the world outside becomes more than [HIS/HER/THEIR] nervous system can comfortably hold.",
    "whatHelps": {
      "aboutChild": "Seat [NAME] away from noise and high-traffic areas where possible. Give advance warning before busy or unpredictable environments. Always have an exit plan. After overwhelming outings, build in quiet recovery time before expecting anything else from [HIM/HER/THEM].",
      "hiddenGift": "Give [NAME] calm, low-stimulation environments to work and think in - that's when the best qualities show up. Make space for [HIS/HER/THEIR] observations - ask what [NAME] picked up on, what [NAME] thinks, how something felt. Don't rush to an answer. That inner world needs time to surface.",
      "brain": "Reduce sensory load before asking for focus - quiet the environment first, then make the request. Identify [NAME]'s specific triggers (noise, lighting, clothing textures, crowding) and reduce them where possible. Noise-cancelling headphones, preferred seating, and advance warning before overwhelming environments all make a difference.",
      "school": "If your school is open to accommodations, noise-cancelling headphones during independent work, a seat away from high-traffic areas, and permission to take brief sensory breaks can dramatically reduce the number of times [NAME] needs to check out.",
      "overwhelm": "Pushing through this withdrawal (demanding engagement, increasing verbal instruction, raising expectations) will almost always extend it. [NAME]'s nervous system cannot be argued or reasoned back to baseline. It needs time, reduced stimulation, and the absence of demand. A quiet space, familiar sensory comfort (a weighted blanket, a preferred texture, a known smell) and a patient adult nearby are the most effective tools available. The return will happen. It cannot be forced. And when [NAME] does come back, [HE/SHE/THEY] will often be surprisingly present, warm, and ready to connect - because the nervous system, having been allowed to reset, is genuinely available again."
    }
  },
  "stallion": {
    "fuels": [
      "Visual timers and countdowns that make time physically present",
      "A specific, immediate first step with a clear time attached",
      "Experiencing natural consequences in real time where safe to do so",
      "Consistent advance warning before any change of activity",
      "Understanding that the gap is neurological, not a character flaw",
      "Systems designed specifically for the way [HIS/HER/THEIR] brain experiences time",
      "Immediate, concrete, real rewards connected directly to action"
    ],
    "title": "THE BOLD STALLION",
    "drains": [
      "Deadlines that exist only as spoken words or abstract dates",
      "Open-ended tasks with no clear starting point or urgency",
      "Being told consequences repeatedly without new information",
      "Transitions between activities without warning or structure",
      "Feeling ashamed about the gap between intention and action",
      "Being compared to siblings or peers who manage time well",
      "Vague, future-oriented motivators"
    ],
    "doNotSay": [
      {
        "when": "It's the night before and nothing has been started",
        "tryThis": "\"Let's build on an earlier starting point together.\"",
        "insteadOf": "\"You always leave everything to the last minute.\""
      },
      {
        "when": "The time was there and it still didn't happen",
        "tryThis": "\"I know it didn't feel urgent. Let's make it feel more real earlier next time.\"",
        "insteadOf": "\"You had all day, why didn't you just do it?\""
      },
      {
        "when": "A consequence has landed that could have been avoided",
        "tryThis": "\"Your brain needs different tools for time. Let's find them.\"",
        "insteadOf": "\"You're so irresponsible.\""
      },
      {
        "when": "You're watching it unfold exactly as you predicted",
        "tryThis": "\"Okay. We're here now. What's the one thing we can do right now?\"",
        "insteadOf": "\"I told you this would happen.\""
      },
      {
        "when": "It's become a recurring fight and you're exhausted by it",
        "tryThis": "\"This is a pattern we can change, not by trying harder, but by trying differently.\"",
        "insteadOf": "\"Why do you always do this?\""
      }
    ],
    "dayInLife": {
      "school": "[NAME]'s teacher reports that [HE/SHE/THEY] frequently fails to begin assignments, leaves work unfinished, and seems unmotivated despite clearly understanding the material. What the teacher is observing is task initiation failure, the gap between knowing what to do and being able to make [HIMSELF/HERSELF/THEMSELVES] begin it. For [NAME], starting a task requires a level of activation energy that most children generate automatically. Without genuine interest, external pressure, or a very clear and immediate starting point, that activation simply doesn't arrive. [NAME] sits. Time passes. The task remains untouched. Not because [HE/SHE/THEY] doesn't care, but because the neurological signal that says \"begin now\" isn't firing.",
      "bedtime": "[NAME] often experiences a surge of emotional weight at bedtime, the things undone, the things said, the things that went wrong during the day landing with full force now that the busyness of the day has stopped. This is the emotional regulation piece of [NAME]'s profile expressing itself, feelings that were too abstract during the day becoming suddenly, vividly real in the quiet. [NAME] may want to talk, may become anxious, may find sleep genuinely difficult. A brief, calm check-in before lights out, not to problem-solve but simply to acknowledge, can make a significant difference to how settled [NAME] feels going into the night.",
      "morning": "The morning routine is a consistent challenge for [NAME], not because [HE/SHE/THEY] is resistant, but because the urgency of \"we need to leave in ten minutes\" does not land with the same emotional weight for [NAME] as it does for you. Ten minutes is \"not now.\" Five minutes is still \"not now.\" Two minutes begins to feel like \"now\", but by then it is too late. [NAME] is not ignoring the clock. [NAME]'s brain is simply not generating the anticipatory urgency that would translate time pressure into action before the last possible moment. External tools, visual timers, alarms, countdowns, that make time physically visible rather than abstractly spoken are not just helpful for [NAME]. They are neurologically necessary.",
      "afterSchool": "Homework is the most reliable daily battleground for [NAME], and the dynamic is almost always the same. There is time. [NAME] knows there is time. The homework will get done. Later. After dinner. Before bed. The time keeps moving and the homework keeps existing comfortably in \"not now\" until suddenly it is 9pm and the crisis is real and [NAME] is doing in forty frantic minutes what could have been done calmly in twenty at 4pm. This is not a strategy [NAME] is choosing. It is the predictable output of a brain that cannot generate urgency until urgency is undeniable, and the solution is external structure that creates artificial \"now\" moments earlier in the afternoon."
    },
    "overwhelm": "[NAME]'s overwhelm has a very specific shape, it arrives when \"not now\" suddenly becomes \"now\" with insufficient preparation time. The emotional crash of a missed deadline, an unexpected consequence, or a sudden realization that time has run out is genuinely dysregulating for [NAME], not because [HE/SHE/THEY] is being dramatic, but because the emotional impact of that moment is hitting [HIS/HER/THEIR] nervous system all at once, without the gradual build-up that advance awareness would have provided.\nIn these moments [NAME] may become tearful, angry, shut down, or overwhelmed in ways that seem disproportionate to the situation. They are not disproportionate to [NAME]'s experience of the situation, which is of a future that just arrived without warning and brought all of its emotional weight with it simultaneously. The most helpful response is not to focus on what went wrong or what should have been done differently. That conversation can happen later, calmly, when [NAME]'s nervous system has settled. In the immediate moment [NAME] needs acknowledgment, reduced pressure, and a clear, simple path forward, what can we do right now, with what we have, from where we are.",
    "aboutChild": "[NAME] is the child who fully intends to do everything that is asked of [HIM/HER/THEM]. This is important to understand clearly, the intention is genuine. [HE/SHE/THEY] is not avoiding tasks out of laziness or defiance. [HE/SHE/THEY] genuinely plans to do it. Later. After this. In a minute. The problem is that for [NAME], \"later\" exists in a future that doesn't feel real yet, and \"now\" is the only time that has any neurological weight. The consequence that will happen tomorrow, the deadline that arrives next week, the disappointment that will follow if the task isn't done, these things exist intellectually for [NAME] but carry almost no emotional urgency. They are abstract. They are distant. They are not now.\nAnd then suddenly they are now. The deadline has arrived. The consequence is immediate. The future has collapsed into the present with no warning, or rather, with warnings that [NAME]'s brain was not built to receive. The Stallion hears the starting gun and launches, brilliantly, boldly, with everything it has. But the starting gun should have fired an hour ago. And the gap between when [NAME] needed to begin and when [NAME] actually began is not a character flaw. It is a neurological one, and it is one of the most misunderstood features of this profile.",
    "archetypeId": "stallion",
    "closingLine": "[NAME] is a Bold Stallion. And the world needs more of them.",
    "affirmations": [
      {
        "when": "After something wasn't done and you both know the intention was real",
        "say": "\"I know you meant to do it. I believe you.\""
      },
      {
        "when": "When [NAME] is using the diagnosis as a get-out, or when shame is making it worse",
        "say": "\"Your brain experiences time differently. That's not an excuse, it's an explanation.\""
      },
      {
        "when": "After a pattern has repeated enough times that everyone is frustrated",
        "say": "\"We're going to build systems that make this easier. Not just expect it to improve on its own.\""
      },
      {
        "when": "When [NAME] pulled it off at the last minute and feels conflicted about it",
        "say": "\"The fact that you can perform under pressure means the capability is absolutely there.\""
      },
      {
        "when": "On a day when [NAME] seems to have stopped believing anything will ever change",
        "say": "\"I'm not giving up on finding what works for you. Neither should you.\""
      }
    ],
    "aboutBrain": "[NAME]'s profile is shaped by two areas where [HIS/HER/THEIR] brain works differently, and understanding both reframes what looks like willful avoidance as something far more neurological and far more manageable.",
    "brainSections": [
      {
        "title": "Emotional Regulation",
        "content": "specifically the way [NAME]'s brain processes the emotional weight of future events. Most people experience a form of anticipatory emotion, a feeling of mild urgency, mild anxiety, or mild motivation when thinking about an upcoming deadline or obligation. This feeling is what activates action before the deadline arrives. For [NAME], this anticipatory emotional signal is significantly weaker than average. The future deadline does not generate enough emotional weight to compete with the very real, very immediate pull of whatever is happening right now. This is not a moral failure. It is a neurological difference in how the brain's emotional forecasting system operates, and it explains almost everything about [NAME]'s relationship with time, tasks, and consequences."
      },
      {
        "title": "Executive Function",
        "content": "specifically time awareness and task initiation. [NAME]'s brain has a genuinely impaired sense of time passing. Research describes this as \"time blindness\", a condition in which the ADHD brain experiences time not as a continuous flow but as two states: now and not now. Everything in the future exists in \"not now\", and \"not now\" has no urgency, no weight, and no ability to motivate action until it suddenly becomes \"now.\" This explains why [NAME] can be told about a deadline repeatedly and still not begin, the deadline lives in \"not now\" until the last possible moment, at which point it crashes into \"now\" with full force and [NAME] responds with everything [HE/SHE/THEY] has. The response is genuine. The timing is the problem. And the timing is neurological."
      }
    ],
    "innerVoiceQuote": "I was going to do it. I just... didn't know it was already so late.",
    "hiddenGift": "What looks like chronic procrastination is actually something more complex and more interesting than it appears. [NAME]'s brain, when finally activated by genuine urgency, performs at a level that surprises everyone, including [NAME]. The focus that arrives under pressure is real, powerful, and productive. [NAME] can produce in one hour of genuine deadline pressure what takes most children an entire afternoon. That capacity is not nothing. It is a form of performance that, with the right understanding and the right systems, can be channeled rather than constantly fought. [NAME] is not a procrastinator who needs to try harder. [NAME] is someone whose brain runs on a different kind of fuel, and the goal is to find ways to generate that fuel without always requiring a crisis.",
    "animalDescription": "The Stallion is one of the most powerful animals on earth, muscular, fast, and capable of extraordinary bursts of speed and endurance when the moment demands it. But watch a Stallion in an open field and you will notice something else entirely. It stands still. It grazes. It moves unhurriedly from one patch of grass to the next, completely unbothered by the passage of time, completely unaware that anything is pressing or urgent, until something startles it. And then, instantly, it is everything it was always capable of being. Pure power, full speed, total commitment. This particular Stallion is the Bold one, not bold because it is fearless, but because when it finally moves, it moves with everything it has. The challenge is that the starting gun has to be very, very loud before this Stallion hears it.",
    "whatHelps": {
      "aboutChild": "The intention is real, so don't fight that battle. The goal is to make the future feel present before the crisis hits. Visual timers, mini-deadlines, and breaking tasks into chunks with immediate small rewards all help manufacture the urgency [NAME]'s brain can't generate on its own. When you need something done, don't appeal to future consequences - make it about right now. \"Do this and then you can do that\" works. \"You'll regret it later\" doesn't.",
      "hiddenGift": "The goal is to learn how to manufacture that sense of urgency deliberately, before the crisis hits. Short deadlines with real consequences. Timers. Competitions with [HIMSELF/HERSELF/THEMSELVES]. A parent sitting nearby. Music that signals it's time.",
      "brain": "What helps is making time visible and concrete. Timers on the desk. A clock that counts down rather than up. Breaking the task into chunks with a mini-deadline for each one. A five-minute warning before any transition.",
      "morning": "Don't say \"we need to leave in 10 minutes\" - that's not information [NAME]'s brain can use yet. Put a visual timer on the kitchen counter where it can be seen. Make time physical, not spoken. And wherever possible, remove decisions the night before: clothes out, bag packed, nothing left in the morning that doesn't have to be.",
      "school": "A clear, single first step written on a sticky note on the desk removes the activation barrier that stops [NAME] getting started. The task itself isn't the problem, the gap between nothing and something is. Make that gap as small as possible: not \"write your essay,\" but \"write the first sentence.\"",
      "afterSchool": "Set a specific homework time (not \"before dinner\" but \"at 4 pm\") and make it non-negotiable. Use a visible timer to make the work feel bounded: \"20 minutes on, then you're done.\" Sit nearby for the first few minutes without doing anything; just being present is often enough to get [NAME] started. Once started, the momentum usually carries.",
      "bedtime": "A two-minute check-in before lights out is usually all it takes - \"best bit of today, anything sitting heavy?\" Keep it brief and don't problem-solve. If [NAME] is lying awake replaying something that went wrong, it's almost always because it hasn't been said out loud to anyone yet.",
      "overwhelm": "The most helpful response in the moment is not to focus on what went wrong. Put the debrief away for later. In the immediate moment, [NAME] needs three things: acknowledgment (\"I can see this got really hard\"), reduced pressure (\"we don't need to solve all of it right now\"), and one single next step (\"just do this one thing, nothing else\")."
    }
  },
  "tiger": {
    "fuels": [
      "Tasks broken into very small, manageable steps",
      "Private, gentle redirection delivered without shame",
      "Knowing exactly what is coming and when",
      "Being named and validated before being redirected",
      "Co-regulation, a calm adult presence alongside [HIM/HER/THEM]",
      "Regular emotional check-ins throughout the day",
      "An adult who treats [HIS/HER/THEIR] emotional depth as a gift"
    ],
    "title": "THE FIERCE TIGER ",
    "drains": [
      "Tasks that feel too big with no visible starting point",
      "Being corrected or criticized in front of others",
      "Unpredictable changes to routine or expectations",
      "Feeling misunderstood or dismissed when upset",
      "Being told to \"calm down\" without being helped to",
      "Accumulating small frustrations with no release",
      "Feeling like [HIS/HER/THEIR] feelings are too much"
    ],
    "doNotSay": [
      {
        "when": "The storm is in full force and you want it to stop",
        "tryThis": "\"I'm right here. We'll get through this together.\"",
        "insteadOf": "\"Calm down.\""
      },
      {
        "when": "The reaction feels disproportionate to what happened",
        "tryThis": "\"That felt really big, didn't it. I get it.\"",
        "insteadOf": "\"You're overreacting.\""
      },
      {
        "when": "The intensity is frequent and you're worn down by it",
        "tryThis": "\"I can see you're really upset. Let's find a quiet spot.\"",
        "insteadOf": "\"Why does everything have to be so dramatic?\""
      },
      {
        "when": "A hard moment has derailed the whole morning",
        "tryThis": "\"That was a hard start. Let's reset and try again.\"",
        "insteadOf": "\"You ruined the whole morning.\""
      },
      {
        "when": "The reaction feels irrational and you're frustrated",
        "tryThis": "\"Your feelings are real. Let's just sit here for a minute.\"",
        "insteadOf": "\"You're being ridiculous.\""
      }
    ],
    "dayInLife": {
      "school": "A worksheet lands on [NAME]'s desk. [HE/SHE/THEY] looks at it and feels an immediate wave of something that sits between dread and panic, not because [HE/SHE/THEY] can't do the work, but because [HIS/HER/THEIR] brain has registered this task as threatening. The moment that emotional response arrives, [HIS/HER/THEIR] attention collapses and the task becomes even harder than it already was. [NAME] may cry, refuse, put [HIS/HER/THEIR] head on the desk, or react with anger that seems completely disproportionate. The teacher sees defiance or dysregulation. [NAME] is experiencing something much closer to genuine overwhelm, and needs support, not consequences.",
      "bedtime": "[NAME] replays the day. The thing someone said at lunch. The moment [HE/SHE/THEY] got in trouble. The homework that felt impossible. The friendship that felt uncertain. [HIS/HER/THEIR] brain does not release these moments easily, they sit heavy and vivid long after everyone else has moved on. Bedtime for [NAME] often requires more emotional support than the rest of the day combined. A few minutes of quiet connection, no agenda, no problem-solving, just presence, can make the difference between a settled night and a very long one.",
      "morning": "The wrong cereal. A shirt that feels slightly uncomfortable. A sibling who said something thoughtless. A permission slip that can't be found. Any one of these alone would be manageable, but for [NAME], by 7:30am the emotional load is already approaching full. Each small frustration adds to the last. When you ask [HIM/HER/THEM] to hurry up and [HE/SHE/THEY] still can't find the permission slip, the mug overflows. What looks from the outside like a meltdown about a piece of paper is actually the accumulated weight of an already overwhelming morning meeting one demand too many. [NAME] is not being dramatic. [HE/SHE/THEY] is at capacity, and capacity was reached before breakfast was finished.",
      "afterSchool": "[NAME] holds it together at school, running on willpower, social pressure, and the constant effort of managing [HIMSELF/HERSELF/THEMSELVES] in a demanding environment. When [HE/SHE/THEY] walks through your front door, that effort ends and everything that was held in releases at once. This is known as afterschool restraint collapse, and it is one of the most reliable features of [NAME]'s day. It is exhausting for everyone. It is also, in its own way, a sign of trust. [NAME] falls apart with you because you are the safest person in [HIS/HER/THEIR] world. That is not nothing."
    },
    "overwhelm": "[NAME]'s overwhelm arrives fast and takes over completely. It may look like a meltdown, a flat refusal, tears that seem wildly out of proportion, or an explosion of anger that appears to come from nowhere. What is happening underneath is a nervous system that has been flooded, logic is temporarily offline and [NAME] genuinely cannot access reason, perspective, or calm until the flood begins to recede. The window between trigger and full overwhelm is very short. The window between full overwhelm and return to baseline is much longer than it looks like it should be.\nTrying to reason, discipline, or problem-solve during this moment will make it worse, not because [NAME] is being stubborn, but because the part of [HIS/HER/THEIR] brain that can receive and process that input is temporarily unavailable. What [NAME] needs in these moments is a regulated adult nearby, minimal language, no new demands, and time. The conversation, the learning, the repair, the connection, can only happen after the storm has passed. And it should always happen. Coming back together after a hard moment is one of the most powerful things you can do for [NAME]'s long term emotional development.",
    "aboutChild": "[NAME] is a child of enormous inner weather. [HE/SHE/THEY] can be laughing and connected one moment and completely undone the next, That's because [HIS/HER/THEIR] emotional experience is genuinely more intense than most people will ever fully understand. When [NAME] faces a task that feels too big, [HIS/HER/THEIR] brain doesn't just feel frustrated, it registers a threat. When something goes wrong socially, it doesn't just feel bad, it feels catastrophic. And when something is wonderful, it is the most wonderful thing that has ever happened to anyone, ever. [NAME] lives at full emotional volume, in every direction, all the time.\nWhat makes this particularly complex is that [NAME] also struggles to stay mentally present. The combination of emotional intensity and inattention means that when feelings arrive (and they arrive fast) every transition is a potential detour.[HIS/HER/THEIR] brain treats every new stimulus as equally important and equally worthy of immediate attention.",
    "archetypeId": "tiger",
    "closingLine": "[NAME] is a Fierce Tiger. And the world needs more of them.",
    "affirmations": [
      { "when": "In the middle of it - when the feelings are big and overwhelming and logic isn't available yet", "say": "\"Your feelings make sense. All of them.\"" },
      { "when": "When [NAME] is scared you'll lose patience and walk away", "say": "\"I'm not going anywhere. I'll be right here until it passes.\"" },
      { "when": "When the intensity of the reaction is making [NAME] feel like something is wrong with them", "say": "\"You don't have to be calm to be loved.\"" },
      { "when": "After a meltdown, once things have settled, when shame starts to creep in", "say": "\"That was really hard. I saw how hard you tried.\"" },
      { "when": "When [NAME] isn't ready to talk but needs to know there's no pressure", "say": "\"We can talk about it when you're ready. There's no rush.\"" }
    ],
    "aboutBrain": "[NAME]'s profile is shaped by two areas where [HIS/HER/THEIR] brain works differently",
    "brainSections": [
      {
        "title": "Attention",
        "content": "[NAME]'s brain struggles to stay anchored in the present moment under ordinary circumstances, but when emotions are involved, that struggle becomes significantly more acute. The prefrontal cortex, which manages both attention and emotional regulation, is the area most affected in [NAME]'s brain. When an emotion is triggered, frustration, disappointment, excitement, shame, the emotional response floods the prefrontal cortex and attention collapses entirely. This is why [NAME] can seem to be managing reasonably well and then, after one difficult moment, become completely unreachable. The emotion didn't cause a distraction. It caused a neurological shutdown of the very system [NAME] needs to stay present, think clearly, and regulate [HIMSELF/HERSELF/THEMSELVES]."
      },
      {
        "title": "Emotional Regulation",
        "content": "[NAME]'s emotional responses arrive faster and hit harder than [HIS/HER/THEIR] logical brain can manage. Research shows that children with this profile can experience emotions with an intensity two to three times greater than their peers, and take significantly longer to return to baseline once dysregulated. There is very little gap between feeling and reaction. By the time [NAME] is aware of the emotion, it has already taken over. This is not a choice and it is not a character flaw. It is a neurological pattern, one that responds to consistency, co-regulation, and time, not to punishment or reasoning in the heat of the moment."
      }
    ],
    "innerVoiceQuote": "I feel joy the same way I feel pain - all the way through, all at once, with nothing held back.",
    "hiddenGift": "The same emotional intensity that makes [NAME]'s hard moments so hard is the very source of [HIS/HER/THEIR] greatest gifts. [NAME] loves fiercely, creates passionately, and connects with others at a depth that most adults spend a lifetime trying to reach. [HE/SHE/THEY] will be the first to notice when someone in the room is quietly sad. The first to stand up for someone being treated unfairly. The first to pour [HIS/HER/THEIR] whole heart into something [HE/SHE/THEY] believes in. [NAME]'s feelings are [HIS/HER/THEIR] greatest strength - waiting for the right environment to be channeled rather than contained.",
    "animalDescription": "The Tiger is one of the most powerful and capable animals on earth (and also one of the most misunderstood). It does not move in packs or perform for an audience. It carries its strength quietly, privately, and entirely on its own terms. When the Tiger is calm, it is breathtaking - focused, graceful, deeply present. When the Tiger is overwhelmed, everything changes. The response is immediate, total, and impossible to ignore. This particular Tiger is the Fierce one - not fierce because it wants to frighten anyone, but because everything it feels, it feels completely. There is no halfway with this Tiger. There is only all of it, all at once.",
    "whatHelps": {
      "aboutChild": "When [NAME] is emotionally flooded, logic doesn't work, so don't try to reason [HIM/HER/THEM] out of it at the moment. Acknowledge the feeling first (\"I can see that felt really bad\") before anything else. Keep your voice calm and your words short. Give [HIM/HER/THEM] space to come down before problem-solving or consequences. Once [NAME] is regulated again, [HE/SHE/THEY] can hear you. Before that point, [HE/SHE/THEY] genuinely cannot. Repair and discuss after, not during.",
      "hiddenGift": "What [HE/SHE/THEY] needs to know is that feeling this much is not a problem to be fixed. Give [HIM/HER/THEM] outlets: art, music, animals, causes, stories, people who need care. Let [HIM/HER/THEM] feel it fully, then help [HIM/HER/THEM] point it somewhere.",
      "brain": "What helps is not reasoning in the moment, that door is closed. Lower your voice instead of raising it. Get physically close rather than standing over [HIM/HER/THEM]. Name what you see without judgment: \"I can see you're really overwhelmed right now.\" Don't demand eye contact. Don't ask questions. Just stay. Afterwards, when the storm has passed and [HE/SHE/THEY] is calm again, that is the moment for conversation.",
      "morning": "Reduce morning decisions the night before (clothes laid out, bag packed, permission slips signed). Every decision you can remove from the morning is one less thing filling [NAME]'s emotional cup before the day even starts.",
      "school": "From the outside it looks like a behaviour problem. From the inside, [HE/SHE/THEY] is drowning. [NAME] doesn't need to be redirected or disciplined at that moment. [HE/SHE/THEY] needs someone to sit beside [HIM/HER/THEM], break the task into one single step, and say: just this bit, I'll stay with you.",
      "afterSchool": "Don't front-load demands the moment [NAME] gets home. Give [HIM/HER/THEM] 20-30 minutes of low-pressure decompression first - snack, quiet time, whatever [HE/SHE/THEY] needs. Save homework, chores, and difficult conversations for after that window.",
      "bedtime": "Before lights out, ask one low-stakes question: \"Anything bugging you from today?\" and let [NAME] talk. Don't problem-solve, just listen. Two minutes of that is usually enough to take the weight off and help [HIM/HER/THEM] actually settle.",
      "overwhelm": "Trying to reason, discipline, or problem-solve during this moment will make it worse because the part of [HIS/HER/THEIR] brain that can receive and process that input is temporarily unavailable. What [NAME] needs in these moments is a regulated adult nearby, minimal language, no new demands, and time. The conversation can only happen after the storm has passed. And it should always happen. Coming back together after a hard moment is one of the most powerful things you can do for [NAME]'s long term emotional development."
    }
  },
  "rabbit": {
    "fuels": [
      "A clear, specific first step delivered just before it's needed",
      "One step at a time, confirmed before the next is given",
      "Regular, legitimate movement built into the structure of the day",
      "External organisational tools — checklists, timers, visual schedules",
      "Systems that make organisation easier, not just expectations that it improves",
      "Consistent transition routines that remove the executive load",
      "An environment that channels energy rather than suppresses it"
    ],
    "title": "THE BUSY RABBIT",
    "drains": [
      "Open-ended tasks with no clear structure or starting point",
      "Multi-step instructions given all at once",
      "Environments that require prolonged stillness",
      "Being asked to plan or organise independently",
      "Consequences for disorganisation without support",
      "Transitions without clear structure or warning",
      "Feeling like [HIS/HER/THEIR] energy is the problem"
    ],
    "doNotSay": [
      {
        "when": "The chaos is visible and you don't understand how it keeps happening",
        "tryThis": "\"Let's build a system together that works for your brain.\"",
        "insteadOf": "\"Why can't you just get organised?\""
      },
      {
        "when": "Another thing has been abandoned halfway through",
        "tryThis": "\"Let's pick one thing and finish just that one thing today.\"",
        "insteadOf": "\"You never finish anything.\""
      },
      {
        "when": "The task was clear and it still didn't happen",
        "tryThis": "\"Knowing and doing are different things. Let's bridge that gap together.\"",
        "insteadOf": "\"You knew what you had to do.\""
      },
      {
        "when": "The movement and restlessness is constant and you need it to stop",
        "tryThis": "\"Let's find a good way for you to move right now.\"",
        "insteadOf": "\"Why are you always running around?\""
      },
      {
        "when": "You're not sure if the effort is actually there",
        "tryThis": "\"I know you're trying. Let's find what makes it easier.\"",
        "insteadOf": "\"You'd get it done if you actually tried.\""
      }
    ],
    "dayInLife": {
      "morning": "You tell [NAME] to get ready for school. [HE/SHE/THEY] launches into motion immediately — there is never a shortage of willingness or energy. The problem is that \"get ready for school\" is a multi-step sequence that requires [NAME] to hold several tasks in working memory simultaneously, prioritise them, and execute them in order. By the time [HE/SHE/THEY] has found one shoe, noticed something interesting, started a completely unrelated physical activity, remembered the shoe, lost the shoe again, and arrived at the front door with no bag and one sock, the time available has run out. [NAME] is not slow. [NAME] moved constantly for twenty minutes. The movement just didn't connect to the goal. What helps: give one instruction at a time (\"shoes on\" then wait, then \"bag by the door\"). A visual checklist on the wall with pictures or words keeps the sequence visible. Your presence during the routine helps anchor the steps. Over time, you can gradually step back as the habit builds.",
      "school": "[NAME]'s teacher sees a child who cannot stay in [HIS/HER/THEIR] seat, struggles to begin assignments without direct one-on-one prompting, leaves tasks unfinished, loses materials regularly, and seems to have no awareness of time passing. All of this is accurate — and all of it is executive function, not attitude. The classroom environment, which assumes a working internal organisational system, is one of the most demanding environments for [NAME]. Every request the classroom makes — sit, plan, begin, sequence, finish, transition — is a direct request on the system that is [NAME]'s greatest area of neurological difference. [NAME] is not failing to try. [NAME] is trying enormously hard in an environment that requires the one thing [HIS/HER/THEIR] brain finds hardest. What helps: ask [NAME]'s teacher to provide a clear first step when giving assignments (\"Start by writing your name and reading question one\"), allow movement breaks, and use a visual timer for transitions.",
      "afterSchool": "Free time for [NAME] is genuinely free — unstructured, unplanned, and driven entirely by whatever presents itself first. This can look like chaos to an observer. To [NAME] it feels like relief. The absence of executive demands is genuinely restorative. However, without some gentle structure, even free time can become frustrating — [NAME] may cycle through many activities without settling, not because [HE/SHE/THEY] is bored but because [HIS/HER/THEIR] brain finds it hard to self-direct even in play. A loose framework — two or three options to choose from rather than infinite open space — often helps more than it constrains. What helps: offer a simple choice (\"Do you want to ride your bike or build with Lego?\") rather than asking \"What do you want to do?\" Open-ended questions require the executive planning that is [NAME]'s hardest skill.",
      "bedtime": "The transition to bed is a significant executive challenge for [NAME]. It requires [HIM/HER/THEM] to stop a current activity, follow a sequence of steps, and arrive at sleep — all of which demand exactly the skills [HIS/HER/THEIR] brain finds hardest. A visual routine — pictures or a checklist of the bedtime steps in order — is a genuine cognitive support that removes the working memory load from a brain that is already tired and running low on regulatory capacity. A sample structure: physical wind-down 30 minutes before bed, followed by bath or shower, then 20 minutes of quiet time (reading together or calm music, no screens), then lights out. Consistency matters more than perfection."
    },
    "overwhelm": "[NAME]'s overwhelm shows up physically before anything else. When the executive demands of a situation exceed what [HIS/HER/THEIR] brain can manage — too many steps, too much to hold, too much expected without enough support — the response is escalating physical dysregulation. The movement gets bigger. The behaviour gets more erratic. The ability to follow even simple instructions fades. This is not defiance. It is a nervous system that has reached its organisational ceiling and is discharging the overload through the only channel reliably available to it — physical movement.\nIn these moments, adding more verbal instruction will not help. [NAME]'s working memory is already full. More words are simply more load on a system that is already overwhelmed. What helps is reducing demands to zero, providing a physical outlet, and waiting. Once [HIS/HER/THEIR] nervous system has discharged and returned to baseline, [NAME] will be genuinely ready to try again — and will often do so with complete willingness, as if the previous storm never happened. That reset is real. Trust it.\nIf you find this pattern happening daily, it may help to build in more physical release earlier in the day — before the demands stack up. A 15-minute burst of intense movement (running, trampolining, climbing) before homework or transitions can lower the baseline enough to prevent the overflow.",
    "aboutChild": "[NAME] is a child of extraordinary physical energy and genuine organisational challenges. [HE/SHE/THEY] is always moving, always doing, always in the middle of something — but ask [HIM/HER/THEM] what [HE/SHE/THEY] is working toward and [HE/SHE/THEY] will look at you with complete sincerity and absolutely no answer. It is not that [NAME] lacks intelligence or motivation. It is that the internal system that takes energy and points it in a useful direction — the system that creates plans, sequences steps, and tracks progress toward a goal — is not yet working the way it will one day. [NAME] has the engine of a racing car and the steering is still developing. The speed is real. The power is real. The destination is genuinely unclear.\nThis can be deeply frustrating for the adults around [NAME] — who see all that capability and energy and cannot understand why it doesn't seem to translate into anything finished, organised, or on time. It is equally frustrating for [NAME], who genuinely wants to do well, genuinely intends to complete things, and genuinely cannot understand why the gap between intention and execution is so consistently wide. [NAME] is not lazy. [NAME] is not defiant. [NAME] is running as fast as [HE/SHE/THEY] can in a direction [HE/SHE/THEY] hasn't quite figured out yet. That gap is neurological, not a character flaw.",
    "archetypeId": "rabbit",
    "closingLine": "[NAME] is a Busy Rabbit. And the world needs more of them.",
    "affirmations": [
      {
        "when": "After another system has failed and everyone is out of ideas",
        "say": "\"You're not disorganised because you don't care. Your brain just needs a different system.\""
      },
      {
        "when": "When a task feels so big that starting feels impossible",
        "say": "\"Let's figure out the first step together. Just the first one.\""
      },
      {
        "when": "When the energy and intensity are wearing everyone out",
        "say": "\"Your energy is one of the best things about you. We just need to give it somewhere to go.\""
      },
      {
        "when": "When [NAME] can feel your patience running out and is starting to shut down",
        "say": "\"I'm not frustrated with you. I'm frustrated with the situation. There's a difference.\""
      },
      {
        "when": "When [NAME] seems overwhelmed by the gap between where they are and where they need to be",
        "say": "\"You don't have to have it all figured out. We'll build the map together.\""
      }
    ],
    "aboutBrain": "[NAME]'s profile is shaped by two areas where [HIS/HER/THEIR] brain works differently.",
    "brainSections": [
      {
        "title": "Hyperactivity",
        "content": "[NAME]'s nervous system operates at a consistently elevated baseline. Movement is not a choice, it is a neurological requirement. [HIS/HER/THEIR] brain regulates itself through physical activity in a way that most brains do not. Fidgeting, jumping, running, bouncing, touching - this is [NAME]'s nervous system staying functional, not misbehaving. Asking [NAME] to sit still without providing an alternative way to move is like asking someone to think clearly while holding their breath. It is technically possible for very short periods, but it is not sustainable (and it comes at a significant cognitive cost)."
      },
      {
        "title": "Executive Function",
        "content": "Executive function is the brain's internal management system - the cognitive architecture that allows a person to make a plan, hold it in working memory, sequence the steps, initiate the first one, monitor progress, adjust when things go wrong, and follow through to completion.\nFor [NAME], this system is still developing relative to [HIS/HER/THEIR] age and intelligence. This is not about trying harder. The research is clear that executive function in ADHD brains develops on a different timeline than neurotypical peers, meaning a 10-year-old with this profile may have the executive function capacity of a 7-year-old, regardless of how intelligent or capable they are in other areas."
      }
    ],
    "innerVoiceQuote": "I threw myself into it completely. That's the only way I know how to do anything.",
    "hiddenGift": "The same explosive energy that makes structure so difficult for [NAME] is the quality that makes [HIM/HER/THEM] extraordinary in the right environment. [NAME] is fast — fast to respond, fast to act, fast to throw [HIMSELF/HERSELF/THEMSELVES] into something new with total physical commitment. [HE/SHE/THEY] is fearless in a way that genuinely careful, organised children rarely are. When the right external structure is provided — a clear starting point, a defined path, a specific goal — [NAME]'s energy becomes one of the most powerful forces in the room. This child doesn't need to be slowed down. [HE/SHE/THEY] needs to be given a track to run on. And when that track exists, [NAME] will outrun almost everyone.",
    "animalDescription": "The Rabbit is one of the fastest land animals relative to its size — capable of explosive bursts of speed, sharp directional changes, and seemingly endless physical energy. It doesn't plan its route. It doesn't need to. It simply moves — fast, instinctively, and with total commitment to whatever direction it is currently pointed in. The Rabbit is not lost. It is just never entirely sure where it is going until it gets there. This particular Rabbit is the Busy one — pure explosive energy, firing in any direction, at any moment, with no advance warning and no internal map. Not reckless. Just running on a system that was built for speed and hasn't quite got the navigation software installed yet.",
    "whatHelps": {
      "aboutChild": "What helps is putting the structure outside the child instead of expecting it to happen internally. Keep routines visible, break jobs into very small steps, and stay nearby for the start of tasks, because getting going is often the hardest part. Use checklists, timers, baskets, labels, and one clear place for important things so less has to be held in memory.",
      "hiddenGift": "Find the track and protect it fiercely. That means identifying the environments, activities, and challenges where [NAME]'s energy becomes an asset rather than a problem: sport, performance, building, competition, anything with a clear goal and a physical dimension - and investing in them seriously. When [NAME] is in the right environment, the support needs look completely different. The goal shifts from managing the energy to channeling it.",
      "brain": "Physical activity temporarily raises dopamine and norepinephrine levels in the brain - the exact chemicals that ADHD brains are short on. So before anything that requires sitting and concentrating (homework, dinner, a difficult conversation) give [NAME] 10 minutes of hard physical activity first. A run around the block, 10 minutes on a trampoline, anything that genuinely raises the heart rate.",
      "morning": "Give one instruction at a time (\"shoes on\" then wait, then \"bag by the door\"). A visual checklist on the wall with pictures or words keeps the sequence visible. Your presence during the routine helps anchor the steps. Over time, you can gradually step back as the habit builds.",
      "school": "The most useful thing you can do is share this document with [NAME]'s teacher. The specific requests that make the biggest difference are: a clear first step when giving assignments (\"start by writing your name and reading question one\"), a visual timer on the desk for transitions, and a quiet signal (agreed in advance) that [NAME] can use when [HE/SHE/THEY] is overwhelmed and needs a moment.",
      "afterSchool": "A loose framework (two or three options to choose from rather than infinite open space) often helps more than it constrains. So make sure to offer a simple choice (\"Do you want to ride your bike or build with Lego?\") rather than asking \"What do you want to do?\" Open-ended questions require the executive planning that is [NAME]'s hardest skill.",
      "bedtime": "A visual routine (pictures or a checklist of the bedtime steps in order) is a great tool that removes the working memory load from a brain that is already tired and running low on regulatory capacity. A sample structure: physical wind-down 30 minutes before bed, followed by bath or shower, then 20 minutes of quiet time (reading together or calm music, no screens), then lights out. Remember, consistency matters more than perfection.",
      "overwhelm": "If you find this pattern happening daily, it may help to build in more physical release earlier in the day, before the demands stack up. A 15-minute burst of intense movement (running, trampolining, climbing) before homework or transitions can lower the baseline enough to prevent the overflow."
    }
  },
  "elephant": {
    "fuels": [
      "Clear, consistent rules applied the same way every time",
      "Being heard fully before any redirection or reframing",
      "Explicit social expectations delivered in advance",
      "Genuine acknowledgment of what went wrong without minimising",
      "Time and space to process before being asked to move on",
      "Adults who are consistent, transparent, and willing to explain their reasoning",
      "Being recognised as someone with genuine courage and principle"
    ],
    "title": "THE JUST ELEPHANT",
    "drains": [
      "Rules that are applied inconsistently or without explanation",
      "Feeling dismissed or minimised when raising a genuine concern",
      "Social situations with unwritten or shifting rules",
      "Apologies that feel incomplete or insincere",
      "Being told to \"let it go\" before [HE/SHE/THEY] has processed it",
      "Environments where power is used arbitrarily",
      "Feeling like [HIS/HER/THEIR] moral compass is a problem"
    ],
    "doNotSay": [
      {
        "when": "The injustice is real but the moment has passed and you need to move forward",
        "tryThis": "\"You're right that it wasn't fair. That's genuinely hard.\"",
        "insteadOf": "\"Life isn't fair. Get over it.\""
      },
      {
        "when": "Every day seems to bring a new grievance and you're worn down by the frequency",
        "tryThis": "\"I can see this really matters to you. Tell me what happened.\"",
        "insteadOf": "\"You're always arguing about something.\""
      },
      {
        "when": "The reaction feels disproportionate and you don't have the bandwidth for it right now",
        "tryThis": "\"I know this feels big. Let's sit with it for a minute.\"",
        "insteadOf": "\"Why do you have to make everything such a big deal?\""
      },
      {
        "when": "You need to move on and [NAME] is still holding onto something from hours ago",
        "tryThis": "\"I know it's hard to put down. Take the time you need.\"",
        "insteadOf": "\"Just let it go.\""
      },
      {
        "when": "The emotional response seems out of proportion to what actually happened",
        "tryThis": "\"Your feelings about this make complete sense. Let's talk it through.\"",
        "insteadOf": "\"You're being too sensitive.\""
      }
    ],
    "dayInLife": {
      "morning": "The morning can derail quickly for [NAME] if something feels wrong before it has even properly begun. A perceived unfairness — a sibling who got more of something, a rule that was applied differently yesterday, a promise from last night that hasn't been honoured — lands immediately and fully on [NAME]'s emotional radar. [HE/SHE/THEY] will not be able to move past it until it has been acknowledged. Not necessarily resolved — acknowledged. [NAME] does not always need the wrong to be fixed. [HE/SHE/THEY] needs to know that you know it happened and that it matters. That acknowledgment, delivered early and genuinely, can prevent an entire morning from unravelling. What helps: a brief, calm sentence like \"I hear you. That wasn't fair, and it matters. We'll come back to it after school.\" This gives [NAME] the acknowledgment [HE/SHE/THEY] needs without opening a full discussion when time is short.",
      "school": "The classroom is a daily source of both connection and conflict for [NAME]. [HE/SHE/THEY] is acutely aware of how rules are applied — and when they are applied inconsistently, [NAME] will say so. When a classmate is treated unfairly, [NAME] will respond — sometimes helpfully, sometimes in ways that create new problems. [HE/SHE/THEY] finds it hard to let small unfairnesses pass, to understand that rules sometimes have exceptions, and to navigate the grey areas of social interaction that don't conform to clear principles. [NAME] operates in black and white in a world that is almost entirely grey — and the friction that creates is daily and genuine. What helps: if your school is receptive, ask for a pre-agreed signal between [NAME] and the teacher — a quiet hand gesture or a note card — that means \"I've noticed something unfair and I need to talk about it later.\" This gives [NAME] a legitimate channel without disrupting the class.",
      "afterSchool": "[NAME] arrives home carrying the day's injustices with full emotional intensity. The thing the teacher said that wasn't fair. The game at lunch that was rigged. The friend who broke an agreement. Each of these is as present and as heavy as it was when it happened — and [NAME] needs to put them down before [HE/SHE/THEY] can engage with anything else. This is not venting for the sake of it. This is [NAME]'s emotional processing system doing the work it needs to do to move forward. The most helpful response is to listen fully, validate genuinely, and resist the urge to minimise or reframe until [NAME] has finished. A practical approach: give [NAME] 15 minutes of your undivided listening when [HE/SHE/THEY] gets home. No advice, no corrections — just \"Tell me.\" Once [HE/SHE/THEY] has been heard, the emotional load lightens and homework or other demands become possible.",
      "bedtime": "[NAME] replays the day at bedtime with extraordinary detail and emotional fidelity. The injustice from this morning is still present. The unresolved social situation from lunch is still unresolved. [NAME]'s brain does not release the day's emotional content easily — it holds it, processes it, returns to it. A short, calm bedtime conversation that allows [NAME] to voice what is still sitting with [HIM/HER/THEM] — without agenda, without problem-solving, just listening — is one of the most powerful investments you can make in [HIS/HER/THEIR] long-term emotional regulation. A sample structure: five minutes of \"What's still on your mind?\" followed by a grounding ritual (reading together, a calming breathing exercise, or quiet music). This gives [NAME]'s brain permission to set things down for the night."
    },
    "overwhelm": "[NAME]'s overwhelm is almost always triggered by a perceived injustice — real or misread — and it arrives with the full force of every similar experience [HE/SHE/THEY] has ever had stored in that extraordinary emotional memory. What looks like a strong reaction to a small event is often the accumulated weight of many similar events landing simultaneously. [NAME] is not just reacting to what happened today. [HE/SHE/THEY] is reacting to today plus every time this has happened before, carried forward with full emotional intensity.\nIn these moments [NAME] needs one thing above all else before anything else is possible — to be heard. Not agreed with. Not validated in every detail. Simply heard. An adult who listens fully, acknowledges genuinely, and resists the urge to immediately correct, reframe, or minimise will find that [NAME]'s overwhelm de-escalates faster than almost any other intervention. The argument, the explanation, the teaching moment — all of these are available and valuable, but only after [NAME] has felt genuinely heard. Before that moment, no amount of reasoning will reach [HIM/HER/THEM]. After it, [NAME] is often surprisingly open, reflective, and willing to consider other perspectives.\nIf this pattern is happening frequently, it can help to build a \"fairness journal\" with [NAME] — a notebook where [HE/SHE/THEY] writes or draws what felt unfair that day. This gives the emotional memory somewhere to land other than bedtime, and over time helps [NAME] see patterns and develop [HIS/HER/THEIR] own perspective on which injustices need action and which can be set down.",
    "aboutChild": "[NAME] is the child who will never let an injustice pass without comment. Not because [HE/SHE/THEY] is looking for trouble, not because [HE/SHE/THEY] enjoys conflict, but because [HIS/HER/THEIR] brain is wired to notice unfairness with a precision and intensity that most people simply don't experience. When something is wrong — when the rules are applied inconsistently, when someone is treated badly, when a promise is broken, when the outcome doesn't match what was agreed — [NAME] feels it as a physical reality. Not as mild irritation. As something that must be addressed, right now, regardless of the social cost of addressing it.\n[NAME] also carries things. A wrong done three weeks ago is as present to [HIM/HER/THEM] today as it was when it happened. An apology that felt incomplete is still incomplete. A friendship that ended badly is still being processed long after everyone else has moved on. [NAME]'s emotional memory is extraordinarily long and extraordinarily vivid — and the feelings stored in that memory do not fade with time the way they do for most people. This is not stubbornness or holding a grudge. It is the way [NAME]'s emotional and social brain stores and retrieves experience — completely, vividly, and with full emotional intensity intact.",
    "archetypeId": "elephant",
    "closingLine": "[NAME] is a Just Elephant. And the world needs more of them.",
    "affirmations": [
      {
        "when": "When something genuinely wasn't fair and [NAME] needs to know you see it too",
        "say": "\"I hear you. That does sound unfair.\""
      },
      {
        "when": "When the intensity of the moral compass is creating friction and [NAME] is starting to feel like it's a problem",
        "say": "\"Your sense of right and wrong is one of the things I admire most about you.\""
      },
      {
        "when": "When [NAME] is locked in a position and can't find a way through without feeling like they're betraying their principles",
        "say": "\"You don't have to agree with everything. But let's find a way through it together.\""
      },
      {
        "when": "When something from days or weeks ago is clearly still being carried",
        "say": "\"I know you're still carrying that. We can talk about it for as long as you need.\""
      },
      {
        "when": "When [NAME] has been told to let something go or stop making it a big deal",
        "say": "\"The world needs people who notice what you notice. Don't ever stop noticing.\""
      }
    ],
    "aboutBrain": "[NAME]'s profile is shaped by two areas where [HIS/HER/THEIR] brain works differently.",
    "brainSections": [
      {
        "title": "Emotional Regulation",
        "content": "[NAME]'s brain processes emotionally significant events (particularly events involving fairness, loyalty, and social trust) with a significantly higher intensity than most children [HIS/HER/THEIR] age. The emotional response to perceived injustice is not chosen or performed. It arrives automatically, fully formed, and at a volume that bypasses [NAME]'s ability to moderate it before it is already expressed. Research on emotional dysregulation in ADHD consistently shows that the gap between emotional trigger and emotional response is significantly narrower in children with this profile - meaning [NAME] is reacting before the moderating brain systems have had time to engage."
      },
      {
        "title": "Social Awareness",
        "content": "[NAME]'s social awareness is in some ways extraordinarily high. [HE/SHE/THEY] notices social dynamics, power imbalances, inconsistencies in how rules are applied, and subtle unfairnesses that most children walk straight past. That's because [HIS/HER/THEIR] social processing is focused on a specific dimension of social experience: fairness, consistency, and adherence to agreed rules. This makes [NAME] a fierce and reliable ally and a formidable advocate in any situation where the rules are being bent."
      }
    ],
    "innerVoiceQuote": "My moral compass doesn't waver. Not even a little. Not even when it would be easier if it did.",
    "hiddenGift": "The qualities that make [NAME] so intense in moments of conflict are the same qualities that will make [HIM/HER/THEM] an extraordinary force for good in the world. [NAME] will not stay quiet when someone is being treated unfairly — not as a child, and not as an adult. [HE/SHE/THEY] will be the person who speaks up in the meeting, who stands beside the person being left out, who refuses to let a wrong go unacknowledged simply because addressing it is socially uncomfortable. The world needs people who feel injustice this acutely and respond to it this consistently. [NAME] is one of those people — already, at [HIS/HER/THEIR] age, operating with a moral clarity and a social courage that most adults spend their entire lives working toward.",
    "animalDescription": "The Elephant never forgets. This is not a myth, it is one of the most well-documented features of elephant cognition. It remembers every kindness and every wrong. It remembers the path taken years ago and the face of someone it hasn't seen in a decade. It carries its history with it completely - every experience, every interaction, every moment of connection stored with extraordinary fidelity.\nThe Elephant also lives in community more deeply than almost any other animal. Its social bonds are fierce, its loyalty absolute, its grief when those bonds are broken genuinely profound. This particular Elephant is the Just one - the one for whom fairness is not a preference but a principle, and for whom the world's failure to operate according to that principle is not an inconvenience but a genuine, daily source of pain.",
    "whatHelps": {
      "aboutChild": "What helps is giving [NAME] a safe, structured way to raise the issue without having to fight it out in the moment. Use clear phrases like \"Tell me what felt unfair,\" \"Do you want help solving it now or do you want me to just hear it first?\" and \"Write it down and we'll come back to it at 4 o'clock.\" That lowers the urgency without dismissing the feeling. This child usually copes better when adults acknowledge the unfairness quickly, stay calm, and help sort out what needs action now and what can wait.",
      "hiddenGift": "Don't manage this quality down, point it somewhere. When [NAME] stands up for someone, name it directly: \"That took courage and I noticed it.\" When the moral intensity creates friction, separate the instinct (good) from the execution (needs work), \"Your instinct was right. Let's talk about how you handled it.\" Over time, [NAME] needs to learn that having a strong moral compass and knowing when to act on it are two different skills.",
      "brain": "Use this quality actively. When [NAME] spots an inconsistency or an injustice, take it seriously even when the timing is inconvenient, dismissing it damages trust fast and deeply. At the same time, help [NAME] understand that noticing something unfair and knowing what to do about it are two separate skills, and that the second one takes longer to develop. \"You're right that it wasn't fair. Now let's think about what to do with that.\"",
      "morning": "A brief, calm sentence like \"I hear you. That wasn't fair, and it matters. We'll come back to it after school.\" This gives [NAME] the acknowledgment [HE/SHE/THEY] needs without opening a full discussion when time is short.",
      "school": "At home, when things are calm, practise the phrase \"that's not fair\" together, and what [NAME] can do with that feeling instead of acting on it immediately. A simple agreed script helps: \"I'm going to write it down and we'll talk about it later.\" Give [NAME] a small notebook for exactly this purpose.",
      "afterSchool": "Give it 15 minutes when they walk through the door - just listen, don't fix, don't reframe, don't minimise. The day needs to come out before anything else can go in. Once it's been heard properly, the emotional load lifts and [NAME] can actually engage with what comes next. Skip that window and you'll spend twice as long on everything else.",
      "bedtime": "Two minutes before lights out, \"Anything still sitting with you from today?\" Then just listen. Don't solve it, don't tell [NAME] it wasn't that bad, and don't rush to the other side of it. The emotional memory holds everything at full intensity until it's been said out loud to someone who actually heard it. That conversation doesn't need to be long, It just needs to be honest.",
      "overwhelm": "If this pattern is happening frequently, it can help to build a \"fairness journal\" with [NAME] - a notebook where [HE/SHE/THEY] note down what felt unfair that day. This gives the emotional memory somewhere to land other than bedtime, and over time helps [NAME] see patterns and develop [HIS/HER/THEIR] own perspective on which injustices need action and which can be set down."
    }
  },
  "dolphin": {
    "fuels": [
      "A specific, legitimate time when talking will be welcomed",
      "Explicit social coaching delivered privately and without shame",
      "Gentle, specific feedback about what to try differently next time",
      "Regular, structured opportunities for genuine social connection",
      "Concrete, practised social skills — turn-taking, waiting, reading cues",
      "Help understanding what happened and what [HE/SHE/THEY] can learn from it",
      "An adult who celebrates [HIS/HER/THEIR] warmth while building [HIS/HER/THEIR] regulation"
    ],
    "title": "THE SPLASHY DOLPHIN",
    "drains": [
      "Being told to stop talking without being given an alternative",
      "Social situations where the rules of engagement are unclear",
      "Feeling rejected or excluded after a social misstep",
      "Environments that require prolonged silence or social withdrawal",
      "Being told [HE/SHE/THEY] is \"too much\" without being told what to do differently",
      "Friendships that end without explanation",
      "Feeling like [HIS/HER/THEIR] social energy is a problem"
    ],
    "doNotSay": [
      {
        "when": "[NAME] has jumped in before someone finished speaking",
        "tryThis": "\"Let's practise waiting. I'll show you what to look for.\"",
        "insteadOf": "\"Stop interrupting, let people talk.\""
      },
      {
        "when": "The energy is high and the room needs it to come down",
        "tryThis": "\"Your energy is wonderful. Let's find the right place for it to go.\"",
        "insteadOf": "\"Why can't you just be calm?\""
      },
      {
        "when": "The talking is relentless and you genuinely need it to stop",
        "tryThis": "\"Let's find the right moment for this. I want to hear it then.\"",
        "insteadOf": "\"Nobody wants to hear you all the time.\""
      },
      {
        "when": "The social energy has dominated and others have gone quiet",
        "tryThis": "\"I know you love connecting. Let's make sure others get a turn too.\"",
        "insteadOf": "\"You always have to be the centre of attention.\""
      },
      {
        "when": "A friendship has taken a hit because of something [NAME] did",
        "tryThis": "\"That one was hard. Let's talk about what happened and what to try next time.\"",
        "insteadOf": "\"You pushed them away again.\""
      }
    ],
    "dayInLife": {
      "morning": "[NAME] wakes up ready to connect. Before breakfast is finished [HE/SHE/THEY] has already told you three things, asked four questions, interrupted a conversation twice, and begun a story that is still unfinished when it is time to leave for school. None of this is designed to be disruptive. [NAME]'s brain woke up full — full of thoughts, full of energy, full of things that need to be shared — and the morning is the first available outlet. The challenge is that the morning also has a schedule, and [NAME]'s social momentum and the morning's practical demands are almost always in direct conflict. What helps: give [NAME] a specific \"talk time\" during breakfast (\"Tell me your best thing while we eat\") and then a clear transition signal (\"Now it's get-ready time. We'll talk more in the car\"). This channels the social energy rather than fighting it.",
      "school": "The classroom is where [NAME]'s social profile creates the most consistent difficulty. [HE/SHE/THEY] calls out answers before being asked. [HE/SHE/THEY] interrupts the teacher mid-sentence — not defiantly, but because the thought arrived and the thought felt urgent. [HE/SHE/THEY] turns to talk to a classmate at precisely the moment the classmate is trying to focus. In group work [HE/SHE/THEY] leads with energy — not to exclude others, but because [HIS/HER/THEIR] ideas are coming faster than the group can receive them. Teachers see disruption. [NAME] sees connection. The mismatch between these two realities is one of the most painful features of [NAME]'s school experience. What helps: a \"thought parking lot\" — a small notebook where [NAME] jots ideas to share later instead of blurting them. This honours the thought without disrupting the class.\nSocially, [NAME] often finds that [HIS/HER/THEIR] peer relationships are warm but uneven. [HE/SHE/THEY] is liked — [HIS/HER/THEIR] energy and enthusiasm are genuinely appealing — but [HE/SHE/THEY] can also be found tiring by children who need a slower, quieter pace. [NAME] may cycle through friendships more quickly than most, not because [HE/SHE/THEY] is unkind but because the sustained regulation required to maintain reciprocal friendships over time is one of [HIS/HER/THEIR] most significant challenges. What helps: coach [NAME] on one specific social skill at a time. This week's skill might be \"ask one question, then wait for the full answer.\" Practise it at home, role-play it, celebrate when it happens. Small, specific, repeated.",
      "afterSchool": "[NAME] arrives home at full social volume — the containment of the school day releasing immediately. [HE/SHE/THEY] needs to debrief, to tell you everything, to process the day through conversation at high speed. This is genuine need, not performance — [NAME]'s brain processes experience through social sharing in a way that is neurologically real and important. Where possible, give [HIM/HER/THEM] this time before anything else is asked. The debrief is not a distraction from the afternoon. It is [NAME] doing the emotional and cognitive work of landing from the school day — and it will make everything that follows significantly more manageable.",
      "bedtime": "Getting [NAME] to wind down at bedtime is one of the most reliably challenging parts of the day. [HIS/HER/THEIR] brain is still generating — still connecting, still processing, still finding things that need to be said. A structured wind-down that gradually reduces social stimulation — moving from conversation to reading to quiet — works better than an abrupt transition to silence, which [NAME]'s brain will resist. A brief, contained final conversation — two minutes, then lights out, no extensions — gives [NAME]'s social brain the closing it needs without opening the door to another hour of talking. What helps: set a timer for the final conversation. When it ends, say \"Save the rest for tomorrow morning. I want to hear it then.\" This gives [NAME] permission to stop without feeling unheard."
    },
    "overwhelm": "[NAME]'s overwhelm is social at its core — it arrives when connection goes wrong, when [HE/SHE/THEY] has been rejected, excluded, or told one too many times that [HE/SHE/THEY] is too much. The response is rarely quiet. [NAME]'s distress, like [HIS/HER/THEIR] joy, is expressed externally — in tears, in escalating bids for connection, in increased volume and increased urgency that can look like deliberate disruption but is actually a nervous system in genuine pain.\nWhat [NAME] needs in these moments is connection — not distance. The instinct to withdraw [HIM/HER/THEM] from social situations when [HIS/HER/THEIR] behaviour escalates can make things significantly worse, because removal from connection is the very thing [NAME]'s nervous system experiences as most threatening. A calm, close, regulated adult who offers genuine presence — not to talk, not to problem-solve, just to be there — will de-escalate [NAME] faster than almost any other intervention. Once [HIS/HER/THEIR] nervous system has felt genuinely received, [NAME] will come back to baseline with remarkable speed. The need for connection that drives the overwhelm is the same need that, when met, resolves it.\nIf social rejection is a recurring trigger, it helps to build a \"social replay\" routine with [NAME]. After a difficult interaction, walk through it together: \"What happened? What did you want to happen? What could you try next time?\" This builds the self-monitoring skills [NAME]'s brain is still developing, without shame.",
    "aboutChild": "[NAME] is one of the most socially motivated children you will ever meet. [HE/SHE/THEY] genuinely, deeply, fundamentally needs other people — not as a preference but as a neurological requirement. Connection is not something [NAME] enjoys. It is something [NAME] runs on. The energy, the ideas, the joy that [HE/SHE/THEY] brings to every social interaction is entirely real — and it is also entirely unregulated. [NAME] interrupts not because [HE/SHE/THEY] doesn't care about the person speaking, but because the thought that just arrived feels so urgent, so alive, so certain to vanish if not spoken immediately, that waiting feels genuinely neurologically impossible. The interruption is not rudeness. It is the urgency of a brain that knows its ideas are fleeting and has learned, through experience, that the only way to keep them is to say them right now.\nThis creates a painful paradox at the heart of [NAME]'s social life. The thing [NAME] wants most — genuine, sustained connection with peers — is made harder by the very quality that drives [HIS/HER/THEIR] desire for it. [HE/SHE/THEY] comes on with full energy, full warmth, full enthusiasm. [HE/SHE/THEY] can dominate conversations without meaning to. [HE/SHE/THEY] misses the moment when the other person has had enough — not because [HE/SHE/THEY] doesn't care, but because [HIS/HER/THEIR] social accelerator is fully engaged and [HIS/HER/THEIR] brakes are still developing. The child who wants connection more than almost anything is the child who sometimes accidentally overwhelms it. And [NAME] feels that gap every single time.",
    "archetypeId": "dolphin",
    "closingLine": "[NAME] is a Splashy Dolphin. And the world needs more of them.",
    "whatHelps": {
      "aboutChild": "The pause between thought and speech is genuinely shorter than average. But it can be worked on, and home is the place to do it. Practise the pause in low-stakes moments, make it a game rather than a correction, and build a simple agreed signal between the two of you (a look, a word) that means \"ease off a little.\" That signal gives [NAME] the information the brain isn't yet supplying in real time, without the shame of a public correction. Debrief social situations after the fact, when things are calm.",
      "hiddenGift": "Help [NAME] identify the friendships that feel easy rather than exhausting - the ones where the energy is matched rather than managed. When a friendship is working, name what's good about it specifically: \"I notice you're always yourself around them.\" When one isn't working, don't just manage the fallout - help [NAME] understand why. The goal over time is to help [NAME] tell the difference between friendships that are genuinely nourishing and ones that just feel intense.",
      "brain": "What helps is slowing the interaction down from the outside. Give clear rules such as waiting for a turn, keeping answers short, or pausing before speaking, and practise them often in calm moments, not just when something has gone wrong. In the moment, interrupt kindly and directly rather than relying on hints: \"Pause,\" \"Let her finish,\" \"One sentence, then listen,\" or \"Ask a question back.\" This child does better with real-time coaching than with correction afterwards.",
      "morning": "Give [NAME] a specific \"talk time\" during breakfast (\"Tell me your best thing while we eat\") and then a clear transition signal (\"Now it's get-ready time. We'll talk more in the car\"). This channels the social energy rather than fighting it.",
      "school": "If the school is open to it, a quiet word with the teacher about [NAME]'s profile can shift the dynamic significantly - a child who calls out because the answer is bursting out of them needs a different response than a child who is being deliberately disruptive, and most teachers, once they understand the difference, will adapt. At home, help [NAME] identify one or two friendships worth investing in and focus there rather than spreading the social energy thin.",
      "afterSchool": "Give it 15 minutes when they walk through the door - just listen, let it all come out at full speed, and don't try to slow it down or redirect it yet. That debrief is how [NAME]'s brain processes the day, and skipping it doesn't save time, it costs it. Once it's out, [NAME] can actually land. Before it is, nothing else is really possible anyway.",
      "bedtime": "Set a timer for the final conversation. When it ends, say \"Save the rest for tomorrow morning. I want to hear it then.\" This gives [NAME] permission to stop without feeling unheard.",
      "overwhelm": "A calm, close, regulated adult who offers genuine presence will de-escalate [NAME] faster than almost any other intervention. Once [HIS/HER/THEIR] nervous system has felt genuinely received, [NAME] will come back to baseline with remarkable speed. The need for connection that drives the overwhelm is the same need that, when met, resolves it."
    },
    "affirmations": [
      { "when": "When the social enthusiasm is being treated as a problem rather than a quality", "say": "\"I love how much you love people. That is one of your greatest gifts.\"" },
      { "when": "After a friendship has ended or a social situation has gone wrong and [NAME] is wondering if it's always going to be this way", "say": "\"The right friends are out there. We'll find them together.\"" },
      { "when": "When [NAME] is starting to feel like the intensity itself is the problem", "say": "\"You're not too much. You just need people who can keep up.\"" },
      { "when": "When a social situation didn't go the way [NAME] hoped and the hurt is real and visible", "say": "\"I know it hurts when that doesn't go the way you wanted. That makes complete sense.\"" },
      { "when": "When the same pattern has repeated and [NAME] is losing confidence that anything will ever change", "say": "\"You're learning. Every time is practice. You're getting better.\"" }
    ],
    "aboutBrain": "[NAME]'s profile is shaped by two areas where [HIS/HER/THEIR] brain works differently.",
    "brainSections": [
      {
        "title": "Hyperactivity",
        "content": "[NAME]'s hyperactivity expresses itself primarily in verbal and social behaviour. For many children hyperactivity is primarily physical - the inability to sit still, the constant movement, the physical restlessness. For [NAME], the hyperactivity runs through [HIS/HER/THEIR] social and verbal world. The thoughts come fast, the words come faster, and the gap between thinking and speaking is almost nonexistent. This is the neurological reality of a brain whose inhibitory systems (the systems that create the pause between thought and action, between impulse and expression) are still developing relative to [HIS/HER/THEIR] age."
      },
      {
        "title": "Social Awareness",
        "content": "[NAME]'s social desire is extraordinarily high. [HIS/HER/THEIR] social intelligence ([HIS/HER/THEIR] ability to read emotions, to care genuinely about others, to form deep bonds) is also genuinely high. The gap is specifically in the area of social timing and social regulation - knowing when to speak, when to wait, when the other person has had enough, when the energy in the room has shifted. These are skills that require the brain's inhibitory and self-monitoring systems to work in real time during social interaction, and these are precisely the systems most affected in [NAME]'s profile. [NAME] wants to get it right. [HIS/HER/THEIR] brain just isn't yet giving [HIM/HER/THEM] the information [HE/SHE/THEY] needs to do so consistently."
      }
    ],
    "innerVoiceQuote": "I make people feel like the most interesting person alive. Because to me, they are.",
    "hiddenGift": "The social energy that makes [NAME]'s relationships so complex is the same energy that makes [HIM/HER/THEM] one of the most genuinely warm, enthusiastic, and life-giving people in any room. [NAME] makes people feel seen, wanted, and exciting — because to [NAME], they genuinely are. [HIS/HER/THEIR] enthusiasm is not performance. [HIS/HER/THEIR] interest is not strategic. When [NAME] is excited about you, about your idea, about what you just said — that excitement is completely real and completely infectious. The right friends — the ones who can match [HIS/HER/THEIR] energy, who find [HIS/HER/THEIR] pace exhilarating rather than tiring — will love [NAME] with an intensity that most people never experience. Those friendships exist. [NAME] just needs support finding them and keeping them.",
    "animalDescription": "The Dolphin is one of the most socially sophisticated creatures on earth. It lives in pods, communicates constantly, plays with genuine joy, and forms bonds that last a lifetime. It does not choose solitude. It does not function well without connection. The social world is not something the Dolphin navigates — it is something the Dolphin is made of, at every level, all the way down. And it moves through that social world at extraordinary speed — splashing, diving, circling, always in motion, always communicating, always already on to the next thing before the last thing has fully landed. This particular Dolphin is the Splashy one — the one whose energy lands with a splash every time, who is already talking before [HE/SHE/THEY] has decided to speak, already in the middle of the connection before [HE/SHE/THEY] has checked whether the other person is ready to receive it."
  },
  "hedgehog": {
    "archetypeId": "hedgehog",
    "title": "THE STORM HEDGEHOG",
    "innerVoiceQuote": "The world is louder for me. But it's also more beautiful, and I wouldn't trade that.",
    "animalDescription": "The Hedgehog is one of nature's most misunderstood creatures. From the outside it appears prickly, defensive, difficult to get close to. But underneath those spines is one of the softest, most gentle animals you will ever encounter. The spines are protection — a nervous system's response to a world that arrives too fast, too loud, and too sharp. When the Hedgehog feels safe — truly safe — it uncurls, shows its belly, and is warm, curious, and remarkably trusting. This particular Hedgehog is the Storm one — the one whose sensory world and emotional world amplify each other, creating an inner weather system that can shift from calm to storm with very little warning.",
    "aboutChild": "[NAME] is the child who flinches at a hand dryer, who refuses to wear the school jumper because the label feels like sandpaper, who melts down in a crowded supermarket because every sound, every light, every unexpected touch is arriving at a volume the rest of us simply cannot hear. [NAME]'s sensory system is turned up higher than most people's. What registers as background noise for other children registers as genuine physical discomfort for [NAME]. A scratchy tag is not an inconvenience. It is a persistent, unavoidable source of pain. A sudden loud noise is not startling. It is physically distressing. The world, for [NAME], is simply louder, brighter, rougher, and more overwhelming than it is for most people.\nWhat makes [NAME]'s experience particularly intense is that the sensory overload does not stay in the body. It travels directly to the emotional system. When [NAME]'s senses are overwhelmed, the emotional response is immediate, intense, and often looks completely out of proportion to whatever triggered it. A noisy classroom doesn't just make [NAME] uncomfortable — it makes [HIM/HER/THEM] irritable, tearful, or explosive, in ways that look like moodiness or defiance but are actually the emotional overflow of a sensory system that has been pushed past its limit. This is not a choice. It is just the way [NAME]'s nervous system processes a world.",
    "hiddenGift": "The same sensitivity that makes the world so overwhelming for [NAME] is also the source of [HIS/HER/THEIR] most extraordinary qualities. [NAME] notices things other children walk straight past — the shift in a friend's mood, the beauty of light through a window, the wrong note in a piece of music, the subtle unfairness in a conversation. [HIS/HER/THEIR] emotional depth is genuine and remarkable. In a calm, safe environment [NAME] is one of the warmest, funniest, most deeply loyal children you will ever meet. [HE/SHE/THEY] feels things fully — joy as much as pain, connection as much as overwhelm. The empathy that comes from living in a world turned up to full volume is real, and it is rare. [NAME] doesn't need to be toughened up. [HE/SHE/THEY] needs a world that makes enough room for the depth of feeling [HE/SHE/THEY] was born with. Many of the most gifted artists, musicians, writers, and caregivers share exactly this profile.",
    "aboutBrain": "[NAME]'s profile is shaped by two areas where [HIS/HER/THEIR] brain works differently.",
    "brainSections": [
      {
        "title": "Sensory Processing",
        "content": "[NAME]'s brain receives sensory input (sound, touch, light, movement, texture) at a significantly higher intensity than most children [HIS/HER/THEIR] age. This is not a sensitivity that can be reasoned away or toughened out. The volume knob on [NAME]'s sensory system is set higher than average, and it does not have a manual override. Sounds that other children barely notice can feel physically painful. Textures that other children tolerate without thought can feel unbearable. Busy, crowded, noisy environments that other children find exciting can feel genuinely threatening to [NAME]'s nervous system."
      },
      {
        "title": "Emotional Regulation",
        "content": "On its own, emotional intensity is already part of [NAME]'s wiring. But when it combines with sensory overload, the two systems amplify each other. A sensory trigger (a loud noise, an unexpected touch, a chaotic environment) creates physical distress. That physical distress immediately activates the emotional system. The emotional system responds with an intensity that matches the sensory pain — not the external event. So what looks to the outside world like an overreaction to a door slamming is actually [NAME]'s nervous system responding to genuine physical pain with a proportionate emotional response. The reaction makes sense once you understand what [NAME] is actually experiencing. The challenge is that the rest of the world cannot feel what [NAME] feels, so the response looks disproportionate from the outside."
      }
    ],
    "dayInLife": {
      "morning": "Getting dressed is often the first challenge of [NAME]'s day. The seam on a sock feels wrong. The waistband is too tight. The label in the shirt is scratching. These are not preferences or fussiness — they are genuine sensory experiences that feel as urgent and uncomfortable to [NAME] as a stone in your shoe feels to you (except there are several of them at once and they don't go away). When you add the time pressure of a school morning, the sensory discomfort meets emotional overload and the result can be tears, refusal, or a full shutdown before the day has even started.",
      "school": "The school environment is one of the most sensorily demanding places [NAME] spends time. Fluorescent lights, echoing corridors, the noise of thirty children in a classroom, the chaos of the canteen, the unexpected fire drill — each of these is a significant sensory event for [NAME], and they stack up across the day. By mid-morning, [NAME]'s sensory budget may already be running low. What teachers see is a child who is increasingly irritable, withdrawn, or reactive. What is actually happening is a nervous system that has been absorbing more input than it can process.",
      "afterSchool": "[NAME] arrives home having spent the entire day managing a sensory environment that was not designed for [HIS/HER/THEIR] nervous system. The spines may already be up. [HE/SHE/THEY] may be irritable, tearful, or completely shut down. Not because anything bad happened, but because the accumulated sensory load of a normal school day has used up every bit of [HIS/HER/THEIR] regulatory capacity. What [NAME] needs at this moment is sensory relief.",
      "bedtime": "Bedtime can be either the easiest or the hardest part of [NAME]'s day, depending on how much sensory load has accumulated. On a good day, the quiet and predictability of bedtime is exactly what [NAME]'s nervous system craves — and [HE/SHE/THEY] will settle with surprising ease. On a hard day, the emotions that were held in all day finally arrive, and bedtime becomes the moment when everything surfaces — the noise that hurts, the touch that startled, the moment that felt unfair."
    },
    "drains": [
      "Loud, unpredictable, or chaotic environments",
      "Clothing or textures that feel physically uncomfortable",
      "Being told [HIS/HER/THEIR] sensory experience isn't real or is exaggerated",
      "Sudden changes, surprises, or transitions without warning",
      "Being asked to \"calm down\" when overwhelmed",
      "Crowded social situations with high sensory demand",
      "Feeling like [HIS/HER/THEIR] sensitivity is a problem"
    ],
    "fuels": [
      "Calm, predictable spaces with controlled sensory input",
      "Soft, familiar fabrics and the freedom to choose what feels right",
      "Adults who take [HIS/HER/THEIR] sensory needs seriously without question",
      "Advance notice of what is coming and time to prepare",
      "A safe, quiet space to decompress without demands",
      "One-on-one time or small groups in quiet settings",
      "Being valued for [HIS/HER/THEIR] depth, empathy, and perception"
    ],
    "overwhelm": "[NAME]'s overwhelm typically follows a recognisable pattern: sensory input builds, the emotional system activates, and the spines go up. What this looks like from the outside varies — it might be tears, anger, withdrawal, refusal, or a combination of all four in quick succession. What is happening on the inside is always the same: [NAME]'s nervous system has received more input than it can process, and the emotional response to that overload is arriving at full intensity.\nIn these moments, the single most important thing is to reduce sensory input immediately. Turn off the lights or move to a quieter space. Lower your voice. Stop talking if possible — words are additional sensory input. Offer physical comfort only if [NAME] wants it (some children in sensory overload cannot tolerate touch; others crave deep pressure like a tight hug). Do not ask [NAME] to explain what is wrong. [HIS/HER/THEIR] brain does not have the capacity to narrate the experience while it is still happening.\nReduce sensory input first — that's the actual intervention, not the conversation you want to have. Move to a quieter space, lower your voice, turn off a light. If [NAME] wants physical contact, a firm sustained hold works better than a gentle touch — deep pressure is genuinely regulating for this nervous system in a way that light touch often isn't. If they can't tolerate touch at all right now, just stay close and stay quiet. Don't ask what's wrong. Once the environment is calmer, the nervous system will follow (usually faster than you expect).",
    "affirmations": [
      { "when": "When a sensory experience has caused a reaction and [NAME] can see you're not sure whether to take it seriously", "say": "\"I believe you. If it hurts, it hurts.\"" },
      { "when": "When the sensitivity keeps creating friction and [NAME] is starting to feel like it's a flaw", "say": "\"Your sensitivity is one of the things that makes you extraordinary.\"" },
      { "when": "When something (clothing, food, environment) is being forced and the resistance is building", "say": "\"We'll find things that feel right for your body. We don't have to force it.\"" },
      { "when": "When everyone else is recovering through noise and activity and [NAME] needs the exact opposite", "say": "\"Some people need movement to reset. You need stillness. Neither is wrong.\"" },
      { "when": "When the day has clearly cost more than it should have and [NAME] can't explain why they're so depleted", "say": "\"The world is louder for you than it is for most people. That's real, and I see it.\"" }
    ],
    "doNotSay": [
      { "when": "A sound, a crowd, or an environment has triggered a reaction that seems excessive", "insteadOf": "\"It's just a noise. You're overreacting.\"", "tryThis": "\"That was really loud for you. Let's move somewhere quieter.\"" },
      { "when": "Getting dressed is a battle and time is running out", "insteadOf": "\"Every other child wears the uniform. Just put it on.\"", "tryThis": "\"Let's find a way to make it comfortable. What part feels the worst?\"" },
      { "when": "You're worried about how [NAME] will manage in a world that won't always accommodate them", "insteadOf": "\"You need to toughen up.\"", "tryThis": "\"Your sensitivity picks up things other people miss. That's a real strength.\"" },
      { "when": "The emotional weather has shifted and there's no obvious external cause", "insteadOf": "\"Stop being so moody.\"", "tryThis": "\"Something is bothering your body or your feelings. Can you help me understand what?\"" },
      { "when": "The reaction feels out of proportion and you're struggling to validate it", "insteadOf": "\"It's not a big deal.\"", "tryThis": "\"It feels like a big deal to you, and that matters.\"" }
    ],
    "closingLine": "[NAME] is a Storm Hedgehog. And the world needs more of them.",
    "whatHelps": {
      "aboutChild": "What helps is reducing the sensory load before it becomes emotional overload. Cut labels out of clothes, choose soft fabrics, keep a small kit of sensory supports ready, and prepare for known problem settings like supermarkets, assemblies, or busy classrooms before they start. Give [NAME] a way to block or escape input early - headphones, a quiet corner, a break card, a seat on the edge, a hoodie, a fidget, or permission to step out with an adult before the system tips over.",
      "hiddenGift": "Find one area where sensitivity becomes a strength rather than a liability: music, art, animals, caring for other people, and invest in it seriously. When you see the sensitivity working in their favour, name it directly and specifically. Not \"well done\" but \"You noticed something there that most people would have missed completely.\" That's the message [NAME] needs to hear often enough to actually believe it.",
      "brain": "The single most useful thing you can do is learn [NAME]'s specific triggers before they become a crisis. Spend a week noticing what was happening in the environment right before things went wrong (the lighting, the noise level, the texture of what they were wearing, how long they'd been in a busy space). Once you know the triggers, you can reduce them proactively rather than managing the fallout after the fact.",
      "morning": "Lay out clothes the night before, ideally ones [NAME] has already approved as comfortable. Remove all labels. Choose soft fabrics and seamless socks. If a particular item is refused on the day, trust the sensory experience and switch it (the battle is not worth the cost to [NAME]'s nervous system).",
      "school": "If your school is receptive, ask for noise-cancelling headphones during independent work, a quiet space [NAME] can access when overwhelmed, and a 5-minute heads-up before transitions like assemblies or PE.",
      "afterSchool": "Create a predictable decompression routine. A quiet room, dim lighting, a favourite blanket or soft toy, maybe calm music or an audiobook. Give [NAME] 20 to 30 minutes of low-sensory time before asking anything of [HIM/HER/THEM].",
      "bedtime": "A consistent, low-stimulation bedtime routine that [NAME] can predict completely. Dim lighting, soft pyjamas, the same sequence every night. If emotions arrive, sit with them quietly rather than trying to fix them. A simple \"That was a hard day for your body and your feelings. You're safe now\" can be enough to help [NAME] let go and rest.",
      "overwhelm": "Reduce sensory input first - that's the actual intervention, not the conversation you want to have. Move to a quieter space, lower your voice, turn off a light. If [NAME] wants physical contact, a firm sustained hold works better than a gentle touch - deep pressure is genuinely regulating for this nervous system in a way that light touch often isn't. If they can't tolerate touch at all right now, just stay close and stay quiet. Don't ask what's wrong. Once the environment is calmer, the nervous system will follow (usually faster than you expect)."
    }
  },
  "bull": {
    "archetypeId": "bull",
    "title": "THE FEARLESS BULL",
    "innerVoiceQuote": "I'm brave enough to move first. I'm still learning how to put brakes on that bravery.",
    "animalDescription": "The Bull is one of the most powerful animals on earth — built for action, built for force, built to charge. It does not pause at the edge of the field to consider its options. It does not weigh the consequences of moving forward. It sees something that needs a response and it responds — immediately, completely, and with every ounce of energy it has. The Bull is not reckless in its own mind. It is simply doing what its body and its instincts were designed to do: act. This particular Bull is the Fearless one — the one who is already moving before the thought has finished forming, already in the middle of the action before anyone else has decided whether the action is a good idea. Not careless. Not looking for trouble. Just wired to go, and wired to go now, with a body and an emotional system that follow through before the logical brain has had time to weigh in.",
    "aboutChild": "[NAME] is the child who jumps before looking, speaks before thinking, and is halfway across the room before you have finished saying \"don't.\" This is not defiance. It is not a lack of respect. It is the neurological reality of a brain where the gap between impulse and action is extraordinarily narrow — so narrow that by the time the thought \"maybe I shouldn't\" arrives, the body has already committed. [NAME] is genuinely surprised, every time, by the consequences of [HIS/HER/THEIR] actions. Not because [HE/SHE/THEY] doesn't understand consequences in theory. But because consequences feel abstract and distant to [NAME]'s brain until they are actually happening. The future, for [NAME], is not real enough to compete with the present moment. And the present moment is very, very loud.\nThis means accidents are frequent and genuinely unintended. The broken glass, the scraped knee, the knocked-over sibling, the blurted comment that hurt someone's feelings — none of these were planned. [NAME] did not decide to be careless. [HIS/HER/THEIR] brain simply moved faster than [HIS/HER/THEIR] ability to anticipate what would happen next. The remorse afterward is real. The confusion about how it happened is real. And the cycle of act-consequence-regret-repeat is one of the most exhausting features of [NAME]'s daily life, for [NAME] and for the adults around [HIM/HER/THEM]. What [NAME] needs is not more warnings. [HE/SHE/THEY] needs external structures that slow the gap between impulse and action — and adults who understand that the impulse is neurological, not a character flaw.",
    "hiddenGift": "The same impulsivity that creates so much difficulty in structured environments is also one of [NAME]'s most extraordinary qualities. [NAME] is genuinely brave. Not performatively brave — genuinely, instinctively, physically brave in a way that most children are not. [HE/SHE/THEY] will try the thing no one else will try. [HE/SHE/THEY] will go first. [HE/SHE/THEY] will say the honest thing in a room full of people dancing around it. [HE/SHE/THEY] will throw [HIMSELF/HERSELF/THEMSELVES] into a new experience with total commitment and zero hesitation. This is not recklessness — it is courage that has not yet learned its own boundaries. In the right environment, with the right support, [NAME]'s fearlessness becomes leadership. [HIS/HER/THEIR] directness becomes integrity. [HIS/HER/THEIR] bias toward action becomes the ability to get things done when everyone else is still deliberating. The world does not have enough people willing to move first. [NAME] was born to be one of them.",
    "aboutBrain": "[NAME]'s profile is shaped by two areas where [HIS/HER/THEIR] brain works differently.",
    "brainSections": [
      {
        "title": "Hyperactivity and Impulsivity",
        "content": "[NAME]'s brain operates with a significantly reduced gap between impulse and action. In most children, there is a brief neurological pause between \"I want to do this\" and actually doing it — a fraction of a second where the brain checks the idea against likely outcomes. In [NAME]'s brain, that pause is either very short or effectively absent. The impulse arrives and the body follows, often simultaneously. This is not a choice. It is the way [NAME]'s inhibitory system is wired. Research on ADHD consistently shows that the brain's braking system (the prefrontal cortex's ability to interrupt an impulse before it becomes an action) develops on a different timeline in children with this profile."
      },
      {
        "title": "Emotional Regulation",
        "content": "When [NAME] is excited, the excitement fuels the impulsivity: the idea feels so good, so urgent, so alive that waiting becomes neurologically impossible. When [NAME] is frustrated, the frustration bypasses reasoning entirely and goes straight to action — a thrown object, a shoved sibling, a door slammed with full force. When [NAME] is joyful, the joy is expressed physically, loudly, and with total abandon. In every case, the emotional system is adding fuel to an engine that already has no brakes. The behaviour is not the problem. The behaviour is the symptom of two neurological systems: impulsivity and emotional intensity, working together without sufficient moderation."
      }
    ],
    "dayInLife": {
      "morning": "[NAME] wakes up ready to move. Within minutes of being awake [HE/SHE/THEY] has already done something at full speed — jumped off the bed, run into a sibling's room, knocked something over on the way to the kitchen. None of this is intentional disruption. [NAME]'s body is simply online before [HIS/HER/THEIR] executive brain is, and the morning is a series of impulses acted on before anyone — including [NAME] — has had time to think. Breakfast may involve a spill, a blurted statement, or a conflict with a sibling that escalated from zero to ten in under a second. What helps: reduce the number of decisions and physical obstacles in the morning. A clear, short routine (eat, dress, bag, door) with one step at a time keeps the impulses channelled. If [NAME] has physical energy to burn, a brief burst of intense movement before leaving the house (star jumps, running up and down the hallway, skipping) can take the edge off. Channel the energy rather than trying to contain it.",
      "school": "The classroom asks [NAME] to do the thing [HIS/HER/THEIR] brain finds hardest: wait. Wait to be called on. Wait for instructions to finish. Wait for [HIS/HER/THEIR] turn. Wait before starting. Every one of these waiting moments is a direct demand on the braking system that is [NAME]'s greatest area of neurological difference. [HE/SHE/THEY] will call out answers, leave [HIS/HER/THEIR] seat, touch things without permission, and start activities before the instructions are finished — not to be disruptive, but because the impulse to act is genuinely stronger than the ability to wait. What helps: if your school is receptive, ask for movement breaks built into the day, a fidget tool at [NAME]'s desk, and a private signal between [NAME] and the teacher that means \"pause and check in with me before you act.\" Seating near the teacher also helps — proximity provides the external braking that [NAME]'s internal system is still building.",
      "afterSchool": "[NAME] has spent the entire school day suppressing impulses, and when [HE/SHE/THEY] arrives home, the containment ends. The energy and the impulsivity that were held in all day release at once. This might look like running through the house, roughhousing with siblings, or an immediate emotional reaction to something minor. This is not [NAME] choosing to be difficult at home. This is a nervous system that has been holding itself together all day and has finally reached a safe space to let go. What helps: provide a physical outlet immediately. Before homework, before questions about the day, before any demands. Twenty minutes of vigorous, unstructured physical activity (trampoline, bike ride, ball games, running) gives [NAME]'s body what it has been needing all day. After the physical release, [NAME] will be significantly more regulated and capable of sitting down for calmer activities.",
      "bedtime": "Bedtime requires [NAME] to do something [HIS/HER/THEIR] brain finds deeply unnatural: transition from high energy to stillness. The impulse to keep going — one more game, one more story, one more thing — is genuine, not strategic. [NAME]'s brain does not have a natural wind-down sequence in the way that many children's brains do. What helps: a physical wind-down 30 minutes before bed (stretching, yoga, a warm bath) followed by a predictable, low-stimulation routine. Keep the steps the same every night so [NAME]'s brain begins to associate the sequence with sleep. If [NAME] is still physically restless in bed, deep pressure (a weighted blanket, firm back rub, or tight tuck-in) can help the nervous system settle. A brief bedtime check-in — \"What was the best part of today? What was the hardest?\" — gives [NAME] a contained space to process without the conversation expanding into something that re-energises [HIM/HER/THEM]."
    },
    "drains": [
      "Being expected to wait without something to do",
      "Consequences delivered as punishment rather than learning",
      "Environments that require stillness and silence for long periods",
      "Being labelled as \"the naughty one\" or \"the rough one\"",
      "Multi-step instructions with no physical engagement",
      "Feeling like [HIS/HER/THEIR] energy and directness are problems",
      "Shame after an accident or impulsive moment"
    ],
    "fuels": [
      "Movement and action built into the structure of the day",
      "Adults who separate the impulse from the intention",
      "Regular, legitimate physical outlets throughout the day",
      "Being recognised for courage, honesty, and willingness to try",
      "Hands-on, active learning with clear, immediate steps",
      "An environment that values action, bravery, and honest expression",
      "An adult who says \"I know you didn't mean for that to happen. Let's fix it together.\""
    ],
    "overwhelm": "[NAME]'s overwhelm is fast, physical, and often alarming to the adults around [HIM/HER/THEM]. When the emotional and impulsive systems overload at the same time — a frustration that is too big, a consequence that feels too unfair, an excitement that has nowhere to go — the result is an explosion of physical energy that can look like aggression but is actually a nervous system discharging at full capacity. Thrown objects, physical outbursts, shouted words that [NAME] does not mean and will genuinely regret — all of these are the impulsive system operating without any braking at all, fuelled by an emotional intensity that has overwhelmed every moderating system [NAME] has.\nIn these moments, safety comes first. Remove anything dangerous from reach. Create physical space. Do not try to reason, lecture, or ask questions — [NAME]'s reasoning brain is offline. Lower your voice rather than raising it. If [NAME] will accept it, firm physical grounding (a tight hug, hands on shoulders, or sitting together on the floor) can help the nervous system find a baseline. If [NAME] does not want touch, simply stay close, stay calm, and wait. The storm will pass. It always does.\nAfter the overwhelm has passed, repair matters enormously. [NAME] almost certainly feels ashamed of what happened, even if [HE/SHE/THEY] cannot say so. A calm, connecting conversation — \"That was a big moment. Your body took over. That happens sometimes. Let's talk about what we can try next time\" — teaches [NAME] that the impulse is not who [HE/SHE/THEY] is, and that the relationship is not broken by the explosion. Over time, you can build a shared vocabulary: \"I can see the bull starting to charge. Do you want to take a break before it gets too big?\" This gives [NAME] an early-warning system and a dignified exit before the overwhelm takes over.",
    "affirmations": [
      { "when": "After an impulsive moment has caused damage and [NAME] is drowning in remorse", "say": "\"Your body moved before your brain could catch up. That's how your wiring works. It doesn't make you bad.\"" },
      { "when": "When the fearlessness and directness keep getting treated as problems rather than qualities", "say": "\"Your courage is one of the things I love most about you.\"" },
      { "when": "When the same pattern keeps repeating and everyone is losing faith that anything will change", "say": "\"We're going to build a braking system together. It takes time and that's okay.\"" },
      { "when": "In the immediate aftermath of an accident, before shame has a chance to take hold", "say": "\"I know you didn't mean for that to happen. Let's fix it together.\"" },
      { "when": "When [NAME] is starting to believe the energy and intensity are things to be ashamed of", "say": "\"You don't have to be less. You just need the right track to run on.\"" }
    ],
    "doNotSay": [
      { "when": "Something has happened and there was clearly no forethought involved", "insteadOf": "\"Why didn't you think before you did that?\"", "tryThis": "\"Your brain moved fast. Let's talk about what happened and what to try next time.\"" },
      { "when": "Another thing has been broken or knocked over", "insteadOf": "\"You're always breaking things.\"", "tryThis": "\"That was an accident. Let's clean it up together.\"" },
      { "when": "The impulsivity is constant and your patience is gone", "insteadOf": "\"You need to learn to control yourself.\"", "tryThis": "\"Your body has a lot of energy. Let's find it somewhere safe to go.\"" },
      { "when": "You've said the same thing so many times you've lost count", "insteadOf": "\"How many times do I have to tell you?\"", "tryThis": "\"Your brain needs a different kind of reminder. Let's figure out what works.\"" },
      { "when": "A physical incident has genuinely frightened you", "insteadOf": "\"You're going to seriously hurt someone one day.\"", "tryThis": "\"I want to keep everyone safe, including you. Let's build a plan for when things move too fast.\"" }
    ],
    "closingLine": "[NAME] is a Fearless Bull. And the world needs more of them.",
    "whatHelps": {
      "aboutChild": "More warnings don't work - the brain that couldn't catch the impulse the first time won't catch it the tenth time either. What works is building physical structure into the environment before the impulse has a chance to fire. In practice that means slowing the body down before the chaos, not after it. Before entering a situation where impulse control matters (a shop, a family dinner, a sibling's bedroom) give [NAME] one clear, concrete rule and say it out loud together: \"One thing we're doing in there is keeping our hands to ourselves.\" If something goes wrong, skip the lecture and go straight to the repair: \"What do we do now?\" keeps [NAME] moving forward rather than drowning in remorse that leads nowhere.",
      "hiddenGift": "Find the environments where going first is an advantage and put [NAME] in them deliberately: sport, drama, debate, anything with a physical or competitive edge where the bias toward action is the whole point. When [NAME] does something brave that others wouldn't, name it directly and specifically: not \"good job\" but \"You were the only one who put their hand up and you were right.\" Over time, the goal is to help [NAME] develop a clear and proud identity around courage, so that when the impulse system fires in the wrong direction, you have something real to appeal to: \"That's not the kind of brave you are.\" That distinction between reckless and genuinely courageous is one [NAME] can understand and will respond to, but only once the courage has been consistently recognised.",
      "brain": "The braking system is the part of the brain that's still developing, so your job right now is to be the external brake - not by stopping [NAME] after the fact, but by slowing the environment down before the impulse fires. That means fewer transitions, fewer unpredictable situations, and a consistent physical outlet built into every single day without exception. A child whose body has already discharged its energy has a marginally longer pause between impulse and action. On the emotional side, the key insight is that the emotion arrives before the behaviour, which means your window to intervene is in the feeling, not the action. Learn to read [NAME]'s early escalation signals and intervene there. Not with a warning, but with a redirect: \"I can see you're getting fired up, let's take this outside.\"",
      "morning": "Reduce the number of decisions and physical obstacles in the morning. A clear, short routine (eat, dress, bag, door) with one step at a time keeps the impulses channelled. If [NAME] has physical energy to burn, a brief burst of intense movement before leaving the house (star jumps, running up and down the hallway, skipping) can take the edge off. Channel the energy rather than trying to contain it.",
      "school": "If your school is receptive, ask for movement breaks built into the day, a fidget tool at [NAME]'s desk, and a private signal between [NAME] and the teacher that means \"pause and check in with me before you act.\" Seating near the teacher also helps, proximity provides the external braking that [NAME]'s internal system is still building.",
      "afterSchool": "Provide a physical outlet immediately. Before homework, before questions about the day, before any demands. 20 minutes of vigorous, unstructured physical activity (trampoline, bike ride, ball games, running) gives [NAME]'s body what it has been needing all day. After the physical release, [NAME] will be significantly more regulated and capable of sitting down for calmer activities.",
      "bedtime": "A physical wind-down 30 minutes before bed (stretching, yoga, a warm bath) followed by a predictable, low-stimulation routine. Keep the steps the same every night so [NAME]'s brain begins to associate the sequence with sleep. If [NAME] is still physically restless in bed, deep pressure (a weighted blanket, firm back rub, or tight tuck-in) can help the nervous system settle. A brief bedtime check-in: \"What was the best part of today? What was the hardest?\", gives [NAME] a contained space to process without the conversation expanding into something that re-energises [HIM/HER/THEM].",
      "overwhelm": "After the overwhelm has passed, repair matters enormously. [NAME] almost certainly feels ashamed of what happened, even if [HE/SHE/THEY] cannot say so. A calm, connecting conversation teaches [NAME] that the impulse is not who [HE/SHE/THEY] is, and that the relationship is not broken by the explosion. Over time, you can build a shared vocabulary: \"I can see the bull starting to charge. Do you want to take a break before it gets too big?\" This gives [NAME] an early-warning system and a dignified exit before the overwhelm takes over."
    }
  },
  "deer": {
    "archetypeId": "deer",
    "title": "THE GENTLE DEER",
    "innerVoiceQuote": "\"I feel the world so deeply that sometimes I need help finding my way through it.\" \u2014 [NAME]",
    "animalDescription": "The deer is one of the most alert and socially attuned creatures in the natural world. It lives by reading the environment - every shift in sound, every movement at the edge of the group, every signal of safety or danger. It stays connected by staying aware. It does not move through the world heavily. It moves lightly, carefully, responsively, always taking in more than most others realize. This particular deer is the Gentle one - the one whose heart is open, whose awareness is constant, and whose nervous system is so finely tuned that [HE/SHE/THEY] feels everything around [HIM/HER/THEM] at full volume.\n\nThe same sensitivity that makes [NAME] warm, thoughtful, and deeply responsive also makes daily life harder than it looks. [HE/SHE/THEY] notices small changes in tone, expression, inclusion, and mood long before other children do. [HE/SHE/THEY] feels the atmosphere of a room almost immediately. But when the brain is also struggling with attention, emotional regulation, and follow-through, that sensitivity can become overwhelming. [NAME] wants very much to stay connected, to stay with the group, to stay steady - but [HIS/HER/THEIR] system is constantly being pulled by everything it notices and everything it feels. What looks like overreacting, withdrawal, distraction, or social missteps is often the result of a child whose whole system is working overtime just to feel safe, keep up, and not lose [HIMSELF/HERSELF/THEMSELVES] along the way.",
    "aboutChild": "[NAME] is one of the most deeply feeling, socially motivated children you will ever meet. [HE/SHE/THEY] needs other people - not as a preference but as a neurological requirement. Connection is not something [NAME] enjoys. It is something [NAME] runs on. But [NAME]'s brain works against [HIM/HER/THEM] at every turn. The attention drifts, so [HE/SHE/THEY] misses the social cue. The executive function lags, so [HE/SHE/THEY] can't keep up with the group plan. The emotions hit so hard that every small rejection feels like being left behind by the entire herd. And the social awareness means [HE/SHE/THEY] notices all of it - every glance, every whisper, every moment [HE/SHE/THEY] fell out of step.\n\nThis creates a painful loop at the heart of [NAME]'s daily life. The thing [NAME] wants most - genuine, sustained connection with peers - is made harder by the very systems that drive [HIS/HER/THEIR] desire for it. [HE/SHE/THEY] forgets what a friend told [HIM/HER/THEM] yesterday. [HE/SHE/THEY] misses the shift in tone that means someone has had enough. [HE/SHE/THEY] can't organise the logistics of being a reliable friend - the texts, the plans, the follow-through. And every one of these small stumbles registers emotionally as evidence that [HE/SHE/THEY] doesn't belong. The child who wants connection more than almost anything is the child who is most devastated when connection breaks down. And [NAME] feels that gap every single time.",
    "hiddenGift": "The emotional depth and social awareness that make [NAME]'s daily life so difficult are the same qualities that make [HIM/HER/THEM] one of the most genuinely warm, empathetic, and life-giving people in any room. [NAME] reads rooms. [HE/SHE/THEY] senses when someone else is struggling. [HE/SHE/THEY] cares about fairness, loyalty, and inclusion in ways that many adults haven't yet developed. When a new child arrives at school looking lost, [NAME] is often the first to walk over. When a friend is sad, [NAME] is the one who notices before anyone else.\n\nWhen [NAME] is excited about you, about your idea, about what you just said - that excitement is completely real and completely infectious. The right friends, the ones who appreciate [HIS/HER/THEIR] depth, who find [HIS/HER/THEIR] warmth nourishing rather than overwhelming, will love [NAME] with an intensity that most people never experience. Those friendships exist. [NAME] just needs support finding them and sustaining them.",
    "aboutBrain": "[NAME]'s profile is shaped by four areas where [HIS/HER/THEIR] brain works differently.",
    "brainSections": [
      {
        "title": "Inattention",
        "content": "[NAME]'s brain struggles to stay anchored in the present moment, particularly during tasks that don't generate enough emotional or social interest. The attention drifts not because [NAME] doesn't care, but because the brain's dopamine system doesn't sustain focus on things that feel routine. In social situations, this means [HE/SHE/THEY] may miss cues, lose track of conversations, or forget what was said moments ago."
      },
      {
        "title": "Emotional Intensity",
        "content": "[NAME] experiences emotions at a significantly higher volume than most children [HIS/HER/THEIR] age. Rejection, exclusion, and social failure hit with a force that is genuinely disproportionate to the event but entirely proportionate to [NAME]'s inner experience. The emotional system floods fast and takes longer to return to baseline, which means small social disappointments can feel catastrophic."
      },
      {
        "title": "Executive Function",
        "content": "[NAME]'s internal management system - the part of the brain that plans, organises, sequences, and follows through - requires significantly more support than most children [HIS/HER/THEIR] age. This affects everything from keeping track of friendships to managing homework to remembering what was agreed yesterday. The gap between intention and execution is wide, and it shows up in every area of daily life."
      },
      {
        "title": "Social Drive",
        "content": "[NAME]'s need for social connection is neurologically intense. [HE/SHE/THEY] is not just socially motivated - [HE/SHE/THEY] is socially dependent in a way that goes beyond preference. [HE/SHE/THEY] reads emotional atmospheres with remarkable accuracy, but the combination of inattention and executive lag means [HE/SHE/THEY] often can't act on what [HE/SHE/THEY] perceives in time to get the social response right."
      }
    ],
    "dayInLife": {
      "morning": "[NAME] wakes up already tuned in to the emotional atmosphere of the house. If something feels off - tension between parents, a sibling in a bad mood, a rushed tone - [HE/SHE/THEY] absorbs it immediately and it colours everything that follows. Getting ready requires holding a sequence of steps in working memory while simultaneously managing the emotional weight of whatever [HE/SHE/THEY] has already picked up. A forgotten lunch box or a missing shoe isn't just a logistical problem - it becomes evidence that [HE/SHE/THEY] can't keep up, and the emotional response arrives before the problem is even solved.",
      "school": "[NAME] spends much of the school day navigating two invisible workloads simultaneously: the academic demands of the classroom and the social dynamics of the peer group. [HE/SHE/THEY] is tracking who said what at break, who looked away during group work, whether the teacher's tone meant something. Meanwhile, the attention drifts during instructions, the executive system can't hold the multi-step task, and by the time [HE/SHE/THEY] realises [HE/SHE/THEY] has missed something, the class has moved on. The social cost of asking for help feels higher than the academic cost of staying lost.",
      "afterSchool": "[NAME] arrives home carrying the full emotional weight of the school day. Every social interaction has been filed and is now being replayed. The moment someone didn't include [HIM/HER/THEM]. The joke that might have been about [HIM/HER/THEM]. The friend who seemed distant. [HE/SHE/THEY] needs to process all of this before homework or chores become possible. Pushing demands too early will meet either emotional flooding or complete withdrawal.",
      "bedtime": "Bedtime is when the day's unprocessed social and emotional content arrives in full. [NAME] replays conversations, worries about tomorrow's dynamics, and asks questions that reveal how much [HE/SHE/THEY] has been carrying. This is not stalling. This is a nervous system that has been holding everything together all day and finally has space to feel it. A few minutes of calm, non-judgmental listening can make the difference between a settled night and hours of anxious wakefulness."
    },
    "drains": [
      "Unstructured group social situations with shifting dynamics",
      "Being corrected or embarrassed in front of peers",
      "Multi-step instructions delivered verbally once",
      "Feeling excluded, forgotten, or invisible",
      "Having to manage social logistics alone (planning, texting, remembering)",
      "Being told [HE/SHE/THEY] is \"too sensitive\" or \"too much\"",
      "Rushing through transitions without warning",
      "Comparison to peers who seem socially effortless"
    ],
    "fuels": [
      "One-on-one time or small, predictable groups",
      "Private, gentle feedback delivered without shame",
      "One step at a time with visual support",
      "Being given a role or purpose in the group",
      "Help with the logistics of friendship \u2014 reminders, scripts, facilitated invitations",
      "Recognition that [HIS/HER/THEIR] depth of feeling is a strength, not a flaw",
      "Extra time and advance warning before changes",
      "An adult who celebrates [HIS/HER/THEIR] warmth while building [HIS/HER/THEIR] scaffolding"
    ],
    "overwhelm": "[NAME]'s overwhelm is deeply social and deeply emotional. It arrives when the gap between wanting connection and failing at connection becomes too painful to hold. The trigger might look small from the outside - a friend choosing someone else at lunch, a group project where [NAME] felt invisible, a text that wasn't returned. But for [NAME], each of these activates the full weight of every similar experience stored in emotional memory.\n\nWhen overwhelmed, [NAME] may withdraw completely, become tearful and inconsolable, or lash out in ways that seem disproportionate. What is happening underneath is a nervous system that has been running at full sensitivity all day, tracking every social signal, absorbing every emotional shift, and has finally reached the point where it cannot hold any more. The child who tries hardest to stay connected is the child who falls apart most completely when connection breaks.\n\nIn these moments, do not try to reason or problem-solve. Move close, speak softly, and simply be present. [NAME] needs to feel that the connection with you is still intact before [HE/SHE/THEY] can begin to recover from whatever connection just broke elsewhere.",
    "affirmations": [
      { "when": "After a social disappointment that feels enormous and you can see the shame arriving", "say": "\"That really hurt. And it makes sense that it did.\"" },
      { "when": "When [NAME] is convinced nobody likes [HIM/HER/THEM] because of one difficult interaction", "say": "\"One hard moment doesn't mean you've lost everything. The people who matter are still there.\"" },
      { "when": "When the sensitivity is being treated as the problem rather than the strength it actually is", "say": "\"The way you feel things is not a flaw. It's one of the best things about you.\"" },
      { "when": "When [NAME] has missed a social cue or forgotten a social commitment and is drowning in guilt", "say": "\"Your brain works differently, not worse. We'll find ways to make it easier.\"" },
      { "when": "On a hard day when everything feels like evidence that [HE/SHE/THEY] doesn't belong", "say": "\"You belong. Not because you're perfect at it, but because you care more than almost anyone.\"" }
    ],
    "doNotSay": [
      { "when": "A social rejection has hit hard and you want to help [NAME] move on", "insteadOf": "\"Just find other friends.\"", "tryThis": "\"That really hurt. Tell me what happened, and we'll figure it out together.\"" },
      { "when": "The emotional response seems bigger than the situation warrants", "insteadOf": "\"You're overreacting.\"", "tryThis": "\"I can see this feels really big right now. I'm right here.\"" },
      { "when": "You're frustrated by how much social dynamics dominate [NAME]'s world", "insteadOf": "\"Stop worrying so much about what everyone thinks.\"", "tryThis": "\"Your friendships matter to you. Let's talk about what's going on.\"" },
      { "when": "[NAME] has forgotten something again and the pattern is exhausting", "insteadOf": "\"If you actually cared, you'd remember.\"", "tryThis": "\"I know you care. Your brain just needs more support to keep track. Let's build a system.\"" },
      { "when": "The sensitivity is constant and you're running out of patience", "insteadOf": "\"You're too sensitive.\"", "tryThis": "\"You feel things deeply. That's not a weakness, even when it's hard.\"" }
    ],
    "closingLine": "[NAME] is a Gentle Deer. And the world needs more of them.",
    "whatHelps": {
      "aboutChild": "Keep social groups small and predictable where possible. Give [NAME] a defined role in group settings so [HE/SHE/THEY] has a clear way to contribute. Help with the logistics of friendship - send the text together, plan the playdate, rehearse the conversation. The social skills are there; the executive scaffolding to use them consistently is what needs support.",
      "hiddenGift": "Help [NAME] find the friendships where the depth is matched. One or two close friends who appreciate [HIS/HER/THEIR] warmth are worth more than a large group where [HE/SHE/THEY] has to perform. When you see the empathy and social awareness working well, name it: \"You noticed she was upset before anyone else did. That's a real gift.\"",
      "brain": "Give one instruction at a time and check understanding before moving on. Use visual supports for multi-step tasks. Before social situations, preview what to expect and rehearse one specific skill. After social situations, debrief gently: \"What went well? What felt hard?\" Build the self-monitoring skills the brain isn't yet supplying automatically.",
      "morning": "Reduce the emotional load before it stacks up. A calm, predictable morning routine with visual prompts removes the need to hold steps in memory. Check the emotional temperature early: \"How are you feeling this morning?\" A one-minute check-in can prevent a thirty-minute meltdown.",
      "school": "Ask the teacher for a buddy system or a defined social role during group work. A quiet signal that means \"I need a break\" gives [NAME] a way to manage overwhelm without public embarrassment. Written instructions alongside verbal ones help the attention gaps.",
      "afterSchool": "Give [NAME] 15-20 minutes of emotional decompression before any demands. Let [HIM/HER/THEM] talk about the social content of the day first - that processing has to happen before homework becomes possible. Listen without fixing.",
      "bedtime": "A brief, calm check-in: \"Anything sitting heavy from today?\" Let [NAME] talk without solving. Two minutes of genuine listening can release enough emotional weight for sleep to arrive. If anxiety about tomorrow is present, preview the next day briefly: \"Here's what's happening tomorrow\" reduces the unknown.",
      "overwhelm": "Move close, speak softly, and stay present. Do not try to reason or minimise. [NAME] needs to feel that your connection is intact before [HE/SHE/THEY] can recover from whatever connection just broke elsewhere. After the storm, come back together: \"That was hard. I'm still right here.\""
    }
  },
  "owl": {
    "archetypeId": "owl",
    "title": "THE KEEN OWL",
    "innerVoiceQuote": "\"I see everything that's happening between people. I just can't always find my place in it.\" \u2014 [NAME]",
    "animalDescription": "The Owl is one of nature's most perceptive creatures. It sees in the dark what others cannot see in daylight. It watches, it listens, it processes with extraordinary precision - and it does so quietly, from a distance, taking in far more than anyone around it realises. This particular Owl is the Keen one - the one whose social awareness is remarkably sharp, whose ability to read people is genuine and advanced, but whose attention system means the insights arrive unevenly, sometimes brilliantly on target, sometimes a beat too late.",
    "aboutChild": "[NAME] is a child who notices the social world with unusual clarity but struggles to stay consistently present within it. [HE/SHE/THEY] reads emotional atmospheres, picks up on subtle dynamics between people, and often understands social situations at a level beyond [HIS/HER/THEIR] years. But the attention system that should keep [HIM/HER/THEM] anchored in the moment drifts, and when it drifts, the social thread is lost. [NAME] may miss the punchline, lose track of the conversation, or zone out at precisely the moment the group shifted direction.\n\nThis creates a specific kind of frustration: [NAME] understands people deeply but can't always show up for them reliably. [HE/SHE/THEY] knows what a good friend does but can't always execute it in real time. The social insight is genuine. The follow-through is where the brain's wiring creates a gap.",
    "hiddenGift": "[NAME]'s combination of social perception and reflective depth makes [HIM/HER/THEM] one of the most insightful children in any room. [HE/SHE/THEY] sees patterns in relationships that others miss entirely. [HE/SHE/THEY] understands why people behave the way they do at a level that is genuinely unusual for [HIS/HER/THEIR] age. In one-on-one settings, [NAME]'s ability to connect is remarkable - the depth of understanding, the quality of listening, the emotional intelligence are all real. These are the foundations of someone who will be sought out for wisdom, counsel, and genuine understanding throughout [HIS/HER/THEIR] life.",
    "aboutBrain": "[NAME]'s profile is shaped by two areas where [HIS/HER/THEIR] brain works differently.",
    "brainSections": [
      {
        "title": "Inattention",
        "content": "[NAME]'s brain struggles to maintain consistent focus, particularly in group settings where multiple social streams compete for attention. The drift is quiet - [NAME] doesn't disrupt, [HE/SHE/THEY] simply fades. The brain's anchor to the present moment loosens without warning, and by the time [NAME] returns, the social context has moved on. This makes group dynamics particularly challenging, because the social rules change while [NAME] is away."
      },
      {
        "title": "Social Awareness",
        "content": "[NAME]'s social processing is genuinely advanced - [HE/SHE/THEY] reads people with accuracy and depth that most children [HIS/HER/THEIR] age cannot match. The challenge is that this awareness operates unevenly: brilliant and perceptive when attention is engaged, completely offline when the drift takes over. The result is a child who alternates between remarkable social insight and puzzling social disconnection, sometimes within the same conversation."
      }
    ],
    "dayInLife": {
      "morning": "[NAME]'s mornings are typically quiet. [HE/SHE/THEY] is not the child who creates chaos - [HE/SHE/THEY] is the child who drifts through the routine at [HIS/HER/THEIR] own pace, often lost in thought, needing gentle re-anchoring at each step. The anxiety about social situations at school may already be present, showing up as reluctance or quiet withdrawal rather than overt resistance.",
      "school": "The classroom is where [NAME]'s profile creates the most invisible difficulty. [HE/SHE/THEY] sits quietly, appears to be listening, and then has no idea what was just said. In group work, [HE/SHE/THEY] may contribute a brilliant observation and then completely miss the next three exchanges. Socially, [NAME] understands the dynamics but can't always track them in real time, leading to moments of disconnection that peers may interpret as disinterest.",
      "afterSchool": "[NAME] arrives home needing to process the social complexity of the day. [HE/SHE/THEY] may have specific observations about what happened between people, questions about social dynamics, or quiet worry about interactions that didn't go as expected. This processing is genuine intellectual and emotional work, and it needs space before other demands arrive.",
      "bedtime": "[NAME]'s active mind continues processing social observations well into the evening. [HE/SHE/THEY] may ask surprisingly insightful questions about relationships, fairness, or human behaviour. This is not stalling - it is a mind that sees deeply and needs help knowing what to do with what it sees."
    },
    "drains": [
      "Large, fast-moving group dynamics where the social thread shifts quickly",
      "Being called on or put on the spot when attention has drifted",
      "Environments where social expectations are implicit rather than stated",
      "Feeling like [HIS/HER/THEIR] quiet nature is being mistaken for not caring",
      "Multi-step social situations with no time to process",
      "Being told to \"just join in\" without support for how",
      "Noisy, overstimulating environments that fragment attention further"
    ],
    "fuels": [
      "One-on-one or very small group settings where depth is possible",
      "Time to observe before being expected to participate",
      "Explicit social expectations explained in advance",
      "Adults who recognise that quiet does not mean disengaged",
      "A defined role in group settings that plays to [HIS/HER/THEIR] observational strengths",
      "Gentle re-anchoring without shame when attention drifts",
      "Recognition that [HIS/HER/THEIR] social perception is a genuine strength"
    ],
    "overwhelm": "[NAME]'s overwhelm is quiet and easy to miss. When the social demands exceed what [HIS/HER/THEIR] attention system can track, [NAME] withdraws - not dramatically, but completely. [HE/SHE/THEY] goes inside, becomes unreachable, and may appear simply switched off. The overwhelm is the result of trying to process social complexity with an attention system that keeps cutting out.\n\nIn these moments, reduce demands and move close. A quiet presence, a simple question when [HE/SHE/THEY] is ready, and no pressure to explain what happened are the most effective responses. [NAME] will come back when the system has had time to reset.",
    "affirmations": [
      { "when": "When [NAME] has drifted and missed something socially important", "say": "\"Your brain wandered. That's not a character flaw - it's just how your attention works.\"" },
      { "when": "When [NAME]'s quiet nature is being misread as not caring", "say": "\"I know you see more than you say. That's a strength, not a problem.\"" },
      { "when": "When [NAME] feels like [HE/SHE/THEY] can't keep up with the social pace around [HIM/HER/THEM]", "say": "\"You don't have to be the loudest to be the most important person in the room.\"" },
      { "when": "When group situations feel overwhelming and [NAME] wants to withdraw", "say": "\"It's okay to need a smaller world. The best connections happen there anyway.\"" },
      { "when": "After a day of trying to keep up and feeling like [HE/SHE/THEY] failed", "say": "\"You understand people better than almost anyone I know. That matters more than keeping up.\"" }
    ],
    "doNotSay": [
      { "when": "You can see [NAME] has drifted during a conversation or group activity", "insteadOf": "\"You weren't even listening.\"", "tryThis": "\"Let me catch you up. Here's where we are.\"" },
      { "when": "[NAME] is hanging back while other children are joining in", "insteadOf": "\"Just go and play with them.\"", "tryThis": "\"Would it help to watch for a bit first? I'll be right here.\"" },
      { "when": "[NAME]'s quietness worries you", "insteadOf": "\"Why don't you have more friends?\"", "tryThis": "\"Tell me about the people you feel most comfortable with.\"" },
      { "when": "A social situation didn't go well and you want to help", "insteadOf": "\"You need to try harder to fit in.\"", "tryThis": "\"What felt hard about that? Let's figure out one thing to try differently next time.\"" },
      { "when": "The drift is constant and you're losing patience", "insteadOf": "\"You're always in your own world.\"", "tryThis": "\"I can see you went somewhere interesting. Want to tell me about it?\"" }
    ],
    "closingLine": "[NAME] is a Keen Owl. And the world needs more of them.",
    "whatHelps": {
      "aboutChild": "Keep social settings small and predictable. Give [NAME] time to observe before expecting participation. Debrief social situations afterwards - [NAME] often understands what happened better in reflection than in real time. Help [HIM/HER/THEM] identify one or two close friendships to invest in rather than managing a large group.",
      "hiddenGift": "Give [NAME] opportunities to use the social perception as a strength: mediating, advising, noticing what others miss. When [HE/SHE/THEY] makes an insightful observation about someone, name it: \"That was really perceptive. Most people wouldn't have noticed that.\"",
      "brain": "Use [NAME]'s name before giving instructions. Keep directions to one step at a time. In social situations, preview what to expect and give [HIM/HER/THEM] a specific focus: \"Watch for when someone looks like they want to join in.\" After the event, review: \"What did you notice?\" This builds the bridge between perception and participation.",
      "morning": "A calm, low-stimulation morning with a predictable routine. If school anxiety is present, preview the day briefly: \"Here's what's happening today.\" Don't force conversation - [NAME] may need quiet to prepare for the social demands ahead.",
      "school": "A seat near the teacher for gentle re-anchoring. A buddy system or paired work rather than large groups. Written instructions alongside verbal ones. Permission to take a moment before responding - [NAME]'s best answers come with a short delay.",
      "afterSchool": "Let [NAME] debrief the social content of the day before anything else. Ask open questions: \"What did you notice today?\" and let the observations come. This is how [NAME] processes, and it needs to happen before homework is possible.",
      "bedtime": "A quiet check-in that honours [NAME]'s observations: \"What are you thinking about?\" Don't rush the answer. The depth of what [NAME] shares at bedtime often reveals how much [HE/SHE/THEY] has been carrying silently all day.",
      "overwhelm": "Reduce demands and move close. Don't ask [NAME] to explain what happened - just be present. A quiet space, minimal words, and patience. [NAME] will come back when the system has reset, and will often be able to articulate what happened with surprising clarity once [HE/SHE/THEY] is calm."
    }
  },
  "octopus": {
    "archetypeId": "octopus",
    "title": "THE VIVID OCTOPUS",
    "innerVoiceQuote": "\"I feel everything, notice everything, and my body never stops. It's a lot to be me.\" \u2014 [NAME]",
    "animalDescription": "The Octopus is one of the most extraordinary creatures on earth - simultaneously processing information through eight independently moving arms, each one sensing, exploring, and responding to the environment in real time. It is never doing just one thing. It is always doing everything at once, and every input is arriving at full intensity. This particular Octopus is the Vivid one - the one whose every channel is open, every sense is heightened, every emotion is amplified, and whose remarkable brain is processing it all simultaneously with a capacity that is as exhausting as it is impressive.",
    "aboutChild": "[NAME] is the child for whom everything is turned up. The attention scatters across every stimulus at once. The body cannot stay still. The senses take in more than most nervous systems are built to handle. The emotions arrive at full volume and without warning. The executive system can't organise, prioritise, or sequence fast enough to keep up with everything else that's happening. And the social world, which [NAME] cares about deeply, becomes one more channel competing for bandwidth in a system that is already running at full capacity.\n\nLiving with [NAME] is like living with a child who is experiencing the world at twice the resolution and twice the speed of everyone around [HIM/HER/THEM]. The brilliance is real. The overwhelm is equally real. And the gap between what [NAME] is capable of and what [NAME] can consistently deliver is one of the most confusing and frustrating features of daily life for everyone involved.",
    "hiddenGift": "[NAME] takes in more, feels more, and processes more than almost any child [HIS/HER/THEIR] age. That is not a limitation - it is an extraordinary capacity that the world hasn't yet learned to accommodate. When even one or two of [NAME]'s channels are properly supported, the output is remarkable: creative, deeply felt, socially perceptive, physically dynamic, and genuinely original. The child who seems to struggle with everything is actually a child who is doing everything at once - and the goal is not to turn channels off but to help [NAME] manage the volume on each one.",
    "aboutBrain": "[NAME]'s profile is shaped by six areas where [HIS/HER/THEIR] brain works differently.",
    "brainSections": [
      {
        "title": "Inattention",
        "content": "[NAME]'s attention scatters across multiple inputs simultaneously rather than filtering and focusing. Everything feels equally important and equally urgent, making sustained focus on any single task exceptionally difficult."
      },
      {
        "title": "Hyperactivity",
        "content": "[NAME]'s body operates at a consistently elevated baseline. The movement is constant and neurologically driven - it is how [HIS/HER/THEIR] nervous system stays regulated, not a choice or a behaviour problem."
      },
      {
        "title": "Sensory Processing",
        "content": "[NAME]'s senses are turned up higher than average across multiple channels. Sounds, textures, lights, and crowded environments create a sensory load that compounds everything else."
      },
      {
        "title": "Emotional Regulation",
        "content": "[NAME]'s emotions arrive fast, hit hard, and take longer to settle. When combined with sensory overload and attentional scatter, the emotional system becomes the point where everything converges and overflows."
      },
      {
        "title": "Executive Function",
        "content": "[NAME]'s internal organisational system is working overtime just to manage the volume of input arriving from every other channel. Planning, sequencing, and follow-through are significantly compromised because the management system is already at capacity."
      },
      {
        "title": "Social Drive",
        "content": "[NAME] cares deeply about connection and reads social situations with genuine sensitivity, but the combination of all other systems competing for bandwidth means social interactions are unpredictable - sometimes brilliant, sometimes overwhelming."
      }
    ],
    "dayInLife": {
      "morning": "[NAME]'s mornings are a collision of every system at once. The clothing feels wrong. The sounds are too loud. The body is already moving. The emotions are already high. The sequence of getting ready requires executive function that is already overwhelmed by sensory and emotional input. A single unexpected change can tip the entire morning.",
      "school": "School asks [NAME] to sit still (hyperactivity), focus on one thing (attention), manage sensory input (processing), regulate emotions (emotional intensity), follow multi-step plans (executive function), and navigate social dynamics (social drive) - all at once, all day. Every system is under demand simultaneously, which is why school is both the most important and the most exhausting part of [NAME]'s day.",
      "afterSchool": "[NAME] arrives home having spent every available resource. The containment of school ends and everything releases at once - the movement, the emotions, the sensory overload, the social processing. This is not bad behaviour. This is a system that has been running at maximum capacity for hours and has finally reached a safe space to discharge.",
      "bedtime": "Settling for sleep requires turning down every channel simultaneously - and each channel resists independently. The body is still moving, the senses are still processing, the emotions are still running, and the mind is still racing. A multi-sensory wind-down routine that addresses each channel in sequence is essential: physical calming first, then sensory reduction, then emotional check-in, then quiet."
    },
    "drains": [
      "Environments that are simultaneously loud, bright, crowded, and socially demanding",
      "Being expected to regulate all systems at once without support",
      "Long days with no break from sensory and social stimulation",
      "Multi-step instructions delivered in a busy environment",
      "Being told to calm down without being helped to",
      "Feeling like [HE/SHE/THEY] is too much in every direction at once",
      "Comparison to children who seem to manage effortlessly",
      "Days with no physical outlet and no quiet space"
    ],
    "fuels": [
      "A structured environment that reduces decisions and unpredictability",
      "Regular movement breaks and sensory relief built into the day",
      "One demand at a time with support for the first step",
      "Adults who understand that every system is running at once",
      "A calm, predictable home base to return to",
      "Small, contained social settings rather than large groups",
      "Being recognised for the extraordinary capacity that underlies the struggle",
      "A sensory toolkit available at all times (headphones, fidgets, weighted blanket)"
    ],
    "overwhelm": "[NAME]'s overwhelm can look like anything - tears, rage, shutdown, escalating physical movement, sensory meltdown, social withdrawal, or all of the above in rapid succession. When multiple systems overload simultaneously, the result is a full nervous system crisis. The trigger may appear small, but the accumulated load behind it is enormous.\n\nIn these moments, reduce everything. Fewer words, less light, less sound, less expectation. Create a safe, contained space. Stay close but don't demand interaction. Address the body first (movement or deep pressure), then the senses (quiet, dim), then the emotions (simple acknowledgment), and only then, once everything has settled, the conversation.",
    "affirmations": [
      { "when": "When everything seems to be going wrong at once and [NAME] is overwhelmed by the sheer volume of it all", "say": "\"You're dealing with more than most people can see. I know that, and I'm proud of how hard you try.\"" },
      { "when": "When [NAME] feels like [HE/SHE/THEY] is too much or too difficult", "say": "\"You're not too much. You're experiencing too much. There's a big difference.\"" },
      { "when": "When the gap between capability and output is frustrating everyone", "say": "\"I can see what you're capable of. We'll build the support to let it show.\"" },
      { "when": "After a full meltdown when shame is arriving", "say": "\"Your system got overloaded. That's not your fault. We'll figure out what tipped it.\"" },
      { "when": "On a day when nothing seemed to work", "say": "\"Tomorrow is a new day with a new budget. We start fresh.\"" }
    ],
    "doNotSay": [
      { "when": "Everything is escalating and you're overwhelmed too", "insteadOf": "\"What is WRONG with you?\"", "tryThis": "\"Your system is overloaded. Let's turn things down together.\"" },
      { "when": "The behaviour seems extreme and you can't find the cause", "insteadOf": "\"There's no reason to act like this.\"", "tryThis": "\"Something has tipped over. Let's figure out what your body needs.\"" },
      { "when": "You're exhausted by the intensity of every single day", "insteadOf": "\"Why can't you just be normal?\"", "tryThis": "\"I know your world is louder than everyone else's. I'm not going anywhere.\"" },
      { "when": "Other parents seem to have it so much easier", "insteadOf": "\"Other kids don't do this.\"", "tryThis": "\"You're wired differently. That's not wrong, it's just harder right now.\"" },
      { "when": "A public meltdown has left you embarrassed and drained", "insteadOf": "\"You embarrassed me.\"", "tryThis": "\"That was tough for both of us. Let's talk about what we can do differently next time.\"" }
    ],
    "closingLine": "[NAME] is a Vivid Octopus. And the world needs more of them.",
    "whatHelps": {
      "aboutChild": "Think in terms of total load, not individual behaviours. Every channel that's reduced gives the others more capacity. A quiet room gives better emotional regulation. A movement break gives better focus. Comfortable clothes give a calmer body. The strategy is always: reduce load on one system to free up capacity for the others.",
      "hiddenGift": "Find the moments when [NAME]'s full-spectrum processing is an asset rather than a problem - creative work, outdoor exploration, one-on-one conversation, artistic expression - and invest in them. When everything is working together rather than competing, the result is extraordinary.",
      "brain": "One system at a time. Address the most activated channel first: if the body is moving, start with movement. If emotions are high, start with acknowledgment. If senses are overloaded, start with reducing input. Don't try to fix everything at once - triage like you would in an emergency.",
      "morning": "Reduce the morning to its absolute minimum. Clothes chosen the night before (sensory-friendly). Quiet environment. One step at a time. No rushing. Movement before leaving the house if possible. Every variable you can remove from the morning is one less thing for an already overwhelmed system to manage.",
      "school": "Work with the school to create a sensory-friendly plan: headphones for independent work, movement breaks, a quiet space for overwhelm, written instructions, and a trusted adult [NAME] can go to. The goal is to reduce the total environmental load enough that learning becomes possible.",
      "afterSchool": "Expect nothing for the first 30 minutes. Let [NAME] discharge however [HE/SHE/THEY] needs to - movement, quiet, sensory comfort. Only after the system has settled should any demands arrive. Build a predictable post-school routine that [NAME] can rely on every day.",
      "bedtime": "Address each channel in sequence: physical calming first (stretching, bath, deep pressure), then sensory reduction (dim lights, quiet, familiar textures), then emotional check-in (brief, non-judgmental), then sleep. Same sequence every night. Predictability is the most powerful tool you have.",
      "overwhelm": "Reduce everything simultaneously: fewer words, less light, less sound, less expectation. Create a safe, contained space. Stay close. Address the body first, then the senses, then the emotions, and only then the conversation. The order matters."
    }
  },
  "swan": {
    "archetypeId": "swan",
    "title": "THE GRACEFUL SWAN",
    "innerVoiceQuote": "\"I hold everything together on the surface. Underneath, I'm paddling harder than anyone knows.\" \u2014 [NAME]",
    "animalDescription": "The Swan moves across the water with a grace that hides the relentless effort happening beneath the surface. To the world, she appears calm, composed, and effortlessly beautiful. What no one sees are the legs working constantly underneath, the ceaseless paddling that keeps her moving forward while appearing serene. This particular Swan is the Graceful one - the girl who holds herself together at school, who masks her struggles behind social awareness and quiet compliance, and who falls apart only when she finally reaches the safety of home.",
    "aboutChild": "[NAME] is the girl who appears to be coping. She sits quietly in class, follows social rules, and works hard to meet expectations. Teachers describe her as lovely but sometimes distant. What nobody sees is the extraordinary effort it takes to maintain that surface. Underneath, [NAME] is managing drifting attention, intense emotions, executive function gaps, and a deep need for social connection that feels perpetually at risk.\n\n[NAME]'s presentation is shaped by the way girls with this profile often learn to compensate: through masking, people-pleasing, and internalising the struggle. The cost of this compensation is invisible to everyone except the people she trusts most - and it arrives, daily, as the door closes behind her at home.",
    "hiddenGift": "[NAME]'s ability to read social situations, to empathise deeply, and to hold herself together under extraordinary internal pressure is not just compensation - it is genuine emotional intelligence. She notices what others miss, cares with an intensity that is rare, and brings a depth of feeling to her relationships that will be one of her greatest strengths as she grows. The same girl who falls apart at home is the girl who held a friend's hand during a hard moment at school. That capacity for connection and compassion is real.",
    "aboutBrain": "[NAME]'s profile is shaped by four areas where her brain works differently.",
    "brainSections": [
      {
        "title": "Inattention",
        "content": "[NAME]'s attention drifts quietly rather than disruptively. She doesn't call out or leave her seat - she simply goes somewhere else inside her head. This inattentive presentation is more common in girls and is frequently missed because it doesn't create problems for anyone except [NAME] herself."
      },
      {
        "title": "Emotional Intensity",
        "content": "[NAME] feels emotions at a volume that is significantly higher than her peers, but she has learned to contain them in public. The containment costs energy, and by the end of the school day, the emotional reserves are empty. What arrives at home is everything that was held in all day."
      },
      {
        "title": "Executive Function",
        "content": "[NAME]'s organisational system requires significantly more support than it appears to from the outside. She compensates through anxiety-driven hyper-vigilance - constantly checking, worrying, and over-preparing - which masks the underlying executive gap but creates its own exhaustion."
      },
      {
        "title": "Social Drive",
        "content": "[NAME]'s need for social belonging is intense, and the fear of social failure drives much of her masking behaviour. She monitors friendships with constant vigilance, reads social cues with remarkable accuracy, and adjusts her behaviour to maintain acceptance - often at the cost of her own needs and authenticity."
      }
    ],
    "dayInLife": {
      "morning": "[NAME]'s mornings may be marked by anxiety about the social and academic demands ahead. She may take a long time choosing clothes, worry about a friendship dynamic, or become tearful over something that seems small but represents the weight of anticipated difficulty. The executive effort of getting organised competes with the emotional weight of what's coming.",
      "school": "[NAME] holds it together at school through sheer effort. She follows the rules, manages her friendships, and appears to cope. But the attention drifts during lessons, the emotional regulation takes constant energy, and the social monitoring never switches off. By afternoon, she is running on empty - and the work she produces may not reflect what she actually knows because the executive system is too depleted to organise her thoughts onto paper.",
      "afterSchool": "The mask comes off. [NAME] may cry, rage, refuse, or collapse into complete withdrawal. This is afterschool restraint collapse, and it is one of the most reliable features of the girl presentation of ADHD. Everything that was held in all day releases at once, and it releases at home because home is safe. This is not a reflection of your parenting. It is a reflection of how much effort [NAME] expends to appear okay everywhere else.",
      "bedtime": "Bedtime is when [NAME]'s anxiety about social and academic performance arrives in full. She replays the day, worries about tomorrow, and processes the emotions that were suppressed since morning. The perfectionism and the fear of failure are loudest at night, and she needs calm, patient presence to help her let go of the day."
    },
    "drains": [
      "The constant effort of masking and appearing to cope",
      "Social dynamics that feel unpredictable or exclusionary",
      "Academic tasks that require sustained executive effort after a long day of compensating",
      "Being told she's fine because she doesn't look like she's struggling",
      "Perfectionism-driven anxiety about getting things wrong",
      "Feeling like she has to hold everything together for everyone",
      "Comparison to peers who seem to manage without effort",
      "Not being believed when she says she's struggling"
    ],
    "fuels": [
      "Adults who see past the surface and acknowledge the effort underneath",
      "Permission to not be okay - to struggle visibly without consequence",
      "One-on-one time that is calm, connected, and free of demands",
      "Support with organisation that doesn't feel like criticism",
      "Safe spaces to express the emotions she has been containing",
      "Small, predictable social settings where she doesn't have to perform",
      "Recognition that the masking itself is the problem, not the child underneath",
      "An adult who says \"I know how hard you're working. You don't have to do it all alone.\""
    ],
    "overwhelm": "[NAME]'s overwhelm often looks like a complete collapse after a period of appearing perfectly fine. The transition from 'coping' to 'not coping' can be sudden and alarming, because the containment was using every available resource and there was nothing left in reserve. When the mask drops, the flood that follows is the accumulated weight of hours or days of suppressed difficulty.\n\nIn these moments, do not try to identify the specific trigger - it is rarely just one thing. Simply be present, be calm, and let the pressure release. Say: \"You've been holding so much. You don't have to hold it anymore.\" The recovery happens through connection, not through problem-solving.",
    "affirmations": [
      { "when": "When [NAME] seems fine but you can sense the effort underneath", "say": "\"I know you're working harder than anyone can see. I see it, and I'm proud of you.\"" },
      { "when": "After the mask drops and the emotions flood out", "say": "\"You don't have to hold it together for me. This is what home is for.\"" },
      { "when": "When perfectionism is driving anxiety and nothing feels good enough", "say": "\"Done is better than perfect. And you are already enough.\"" },
      { "when": "When the social monitoring is exhausting her and she feels like she can't be herself", "say": "\"The people who really matter want the real you. Not the performance.\"" },
      { "when": "When she feels like she's falling behind despite trying harder than anyone", "say": "\"Effort like yours should be celebrated, not invisible. I celebrate it.\"" }
    ],
    "doNotSay": [
      { "when": "She seems to be coping and you're relieved", "insteadOf": "\"See, you're fine!\"", "tryThis": "\"How are you really doing underneath?\"" },
      { "when": "The afterschool meltdown is intense and you're struggling to understand", "insteadOf": "\"But you were fine at school!\"", "tryThis": "\"I know you held it together all day. You're safe to let go now.\"" },
      { "when": "The emotional response seems disproportionate", "insteadOf": "\"It's not that big a deal.\"", "tryThis": "\"It feels big right now. I'm here.\"" },
      { "when": "You want to encourage her to toughen up", "insteadOf": "\"You need to be stronger.\"", "tryThis": "\"You are already so much stronger than anyone knows. Let me help carry some of it.\"" },
      { "when": "The perfectionism is preventing her from starting something", "insteadOf": "\"Just do your best.\"", "tryThis": "\"Let's do the worst version first. We can fix it later.\"" }
    ],
    "closingLine": "[NAME] is a Graceful Swan. And the world needs more of them.",
    "whatHelps": {
      "aboutChild": "The most important thing you can do is see past the mask. Don't take 'fine' at face value. Create daily moments where [NAME] has explicit permission to not be okay. Reduce the performance pressure at home - home should be the place where she doesn't have to hold it together.",
      "hiddenGift": "Name the emotional intelligence as a strength, not a survival mechanism. When [NAME] notices someone else's feelings, says something kind, or holds space for a friend, tell her: \"That's a real gift. Not everyone can do that.\" Over time, help her direct that gift outward instead of using it all up on self-monitoring.",
      "brain": "Watch for the quiet signs of struggle that the school may miss: declining grades despite effort, social withdrawal, increasing anxiety, physical complaints. Advocate for assessment and support - girls with this profile are systematically under-identified because their distress is internalised.",
      "morning": "Reduce decisions and emotional load. Prepare everything the night before. Check in on emotional temperature early: \"How are you feeling about today?\" If anxiety is present, acknowledge it without trying to fix it: \"That sounds hard. You'll get through it, and I'll be here after.\"",
      "school": "Work with the school to ensure [NAME]'s quiet struggles are recognised. Request preferential seating, written instructions, and check-ins with a trusted adult. The fact that she doesn't disrupt the class doesn't mean she doesn't need support.",
      "afterSchool": "Expect the restraint collapse and plan for it. Give [NAME] 20-30 minutes of no demands after school. Let the emotions come out without trying to fix or redirect them. Provide sensory comfort and connection. Only after she has discharged should homework or other demands arrive.",
      "bedtime": "A calm, connected check-in that gives [NAME] space to put down what she's been carrying. \"What's sitting heavy tonight?\" Don't rush to solutions. Sometimes just being heard is enough to let her sleep.",
      "overwhelm": "Do not try to identify the trigger. Be present, be calm, and let the pressure release. Say: \"You've been holding so much. You don't have to hold it anymore.\" The recovery happens through connection, not through problem-solving."
    }
  },
  "bunny": {
    "archetypeId": "bunny",
    "title": "THE DREAMY BUNNY",
    "innerVoiceQuote": "\"I'm always somewhere else in my head. It's beautiful there, but I keep missing what's happening here.\" \u2014 [NAME]",
    "animalDescription": "The Bunny moves softly through the world, gentle and alert, always sensing the environment but easily startled by what she finds there. She is warm, watchful, and deeply feeling - and when the world becomes too much, she freezes or retreats to the safety of her burrow. This particular Bunny is the Dreamy one - the girl whose rich inner world is her greatest comfort and her greatest obstacle, whose feelings run deep and whose attention drifts like clouds across a wide, open sky.",
    "aboutChild": "[NAME] is the girl who drifts. Not loudly, not disruptively - she simply goes somewhere else inside her head, quietly and completely, while the world carries on around her. She is deeply feeling, easily overwhelmed by her own emotions, and struggles to organise the steps between wanting to do something and actually doing it. Teachers may describe her as sweet but scattered, present but not quite there.\n\nWhat makes [NAME]'s profile particularly hard to identify is that she doesn't cause problems. She sits quietly, she tries hard, and she masks her confusion with compliance. The attention gaps, the emotional flooding, and the executive dysfunction are all happening beneath a surface that looks fine - and the cost of maintaining that surface is carried entirely by [NAME] herself.",
    "hiddenGift": "[NAME]'s inner world is rich, vivid, and genuinely creative. The mind that drifts during maths class is the same mind that creates entire worlds, stories, and ideas with extraordinary depth and originality. Her emotional sensitivity makes her one of the most empathetic, caring, and intuitively kind people in any room. When she is given time, space, and the right support, the work [NAME] produces reflects a quality of thought and feeling that is genuinely exceptional.",
    "aboutBrain": "[NAME]'s profile is shaped by three areas where her brain works differently.",
    "brainSections": [
      {
        "title": "Inattention",
        "content": "[NAME]'s attention drifts quietly and constantly. She doesn't disrupt - she disappears. The brain's hold on the present moment is loose, and without sufficient stimulation or novelty, it slides into internal thought without warning. This inattentive presentation is more common in girls and is frequently missed because it doesn't create classroom problems."
      },
      {
        "title": "Emotional Intensity",
        "content": "[NAME] experiences emotions at a significantly higher volume than most children her age, and those emotions take longer to settle. The combination of emotional flooding and inattention means that when a feeling arrives, it can completely hijack focus and leave [NAME] unable to function until the emotional wave has passed."
      },
      {
        "title": "Executive Function",
        "content": "[NAME]'s internal management system requires significantly more support than it appears to. The gap between knowing what to do and being able to initiate, sequence, and complete it is wide - and it shows up in forgotten homework, lost belongings, and an inability to get started without external help."
      }
    ],
    "dayInLife": {
      "morning": "[NAME]'s mornings are slow and dreamy. She drifts through the routine, losing time in thoughts, in objects she finds along the way, in the texture of her jumper or the pattern on the wall. Getting dressed becomes a twenty-minute exercise not because she's resistant but because the brain keeps floating away from the task. An emotional wobble - a wrong tone, a sibling conflict, a worry about school - can derail the entire morning.",
      "school": "[NAME] sits at her desk looking attentive while her mind is three rooms away. She misses instructions, loses her place in group work, and often has no idea what the class has moved on to. She compensates by watching other children and piecing together what she missed, a strategy that works sometimes and quietly exhausts her every day. The emotional weight of feeling behind and confused adds to the cognitive load.",
      "afterSchool": "[NAME] arrives home depleted - emotionally, cognitively, and executively. She may be tearful, irritable, or completely withdrawn. Homework feels impossible not because she can't do it but because the brain that has been drifting and managing emotions all day has nothing left for organised output. She needs decompression, not demands.",
      "bedtime": "The quiet of bedtime is when [NAME]'s mind generates most freely. Worries, ideas, memories, and tomorrow's anxieties arrive without invitation. The emotions that were managed during the day may surface now, and [NAME] may need patient, calm companionship to help her set them down."
    },
    "drains": [
      "Multi-step tasks with no clear starting point",
      "Open-ended time with no gentle structure",
      "Emotional situations she doesn't have language for",
      "Being rushed when her brain and body need more time",
      "Feeling like she should be managing things other girls manage easily",
      "Being described as lazy or not trying hard enough",
      "Academic demands immediately after school with no recovery time",
      "Loud, busy environments that fragment her already loose attention"
    ],
    "fuels": [
      "One instruction at a time with gentle check-ins",
      "Unstructured creative time where the dreaming is an asset",
      "Adults who see the effort underneath the quiet surface",
      "Calm, predictable routines that reduce executive demands",
      "Emotional validation before redirection",
      "Permission to take things at her own pace without shame",
      "A quiet buddy or one close friend rather than a large group",
      "An adult who says \"I know you're trying. I see it.\""
    ],
    "overwhelm": "[NAME]'s overwhelm arrives quietly. She doesn't explode - she fades. The eyes go blank, the body stills, and she retreats somewhere inside where the demands can't reach. This is a nervous system shutting down in the face of accumulated cognitive, emotional, and executive overload. It is not defiance. It is not laziness. It is a child who has reached the limit of what her system can process.\n\nIn these moments, stop all demands. Move close. Speak quietly. A hand on the shoulder, a simple \"I'm here,\" and patience. She will come back when the system has had time to reset. The conversation and the task can wait.",
    "affirmations": [
      { "when": "After drifting, a hard moment, or forgetting something important", "say": "\"Your brain works differently. That's not a flaw - it's just something we work with together.\"" },
      { "when": "When she seems embarrassed by how different her experience is from her peers", "say": "\"Your imagination and your feelings are some of the best things about you.\"" },
      { "when": "When the effort is invisible and she feels like nobody notices how hard she tries", "say": "\"I see how hard you're working. Even when nobody else can tell.\"" },
      { "when": "When she can't start something and the frustration is building", "say": "\"Let's find the first tiny step together. Just one.\"" },
      { "when": "On a day when everything felt like too much", "say": "\"You don't have to be perfect at any of it. You just have to keep going, and I'll help.\"" }
    ],
    "doNotSay": [
      { "when": "She's drifted again and you're frustrated", "insteadOf": "\"You never pay attention.\"", "tryThis": "\"Let me bring you back. Here's where we are.\"" },
      { "when": "Homework hasn't started and the evening is disappearing", "insteadOf": "\"You've had all afternoon!\"", "tryThis": "\"Let's start together. I'll sit with you for the first five minutes.\"" },
      { "when": "The emotions seem disproportionate", "insteadOf": "\"It's not worth getting so upset about.\"", "tryThis": "\"That hit hard. Tell me about it.\"" },
      { "when": "Other girls her age seem to manage without this level of support", "insteadOf": "\"Other girls don't need this much help.\"", "tryThis": "\"Everyone's brain is different. Yours just needs a different kind of support.\"" },
      { "when": "She seems checked out and you can't reach her", "insteadOf": "\"What is wrong with you?\"", "tryThis": "\"You've gone quiet. I'll be right here when you're ready to come back.\"" }
    ],
    "closingLine": "[NAME] is a Dreamy Bunny. And the world needs more of them.",
    "whatHelps": {
      "aboutChild": "Give one instruction at a time. Stay nearby for the start of tasks. Use visual checklists instead of spoken sequences. Don't interpret the quiet surface as 'fine' - check in regularly with genuine curiosity about how she's really doing underneath.",
      "hiddenGift": "Protect the creative time fiercely. When [NAME] is absorbed in drawing, writing, building, or imagining, that is not wasted time - it is the mind working at its best. Give it space. Afterwards, celebrate what she made: \"Tell me about this\" is more powerful than \"Well done.\"",
      "brain": "Make eye contact and use her name before instructions. Keep them to one step at a time. Ask her to repeat back what she heard. For tasks, give a concrete first action rather than a general instruction. Stay nearby for the first few minutes - the brain needs a co-pilot to get started.",
      "morning": "One step at a time, with gentle re-anchoring between each one. Lay everything out the night before to reduce the executive load. If an emotional wobble arrives, acknowledge it briefly and then redirect: \"That sounds hard. Let's talk about it in the car. Right now - shoes.\"",
      "school": "Advocate for written instructions, check-ins with a trusted adult, and preferential seating. The quiet, compliant presentation often means [NAME]'s needs go unrecognised. Make sure the school knows that looking fine and being fine are not the same thing.",
      "afterSchool": "Give [NAME] 20-30 minutes of recovery before any demands. Let her choose how to decompress - quiet play, drawing, a snack in a calm space. Homework comes after recovery, not instead of it.",
      "bedtime": "A predictable, calm sequence. Low lights, soft textures, same routine every night. If the mind is racing, give it something low-key to hold onto: an audiobook or soft music. A brief emotional check-in: \"Anything on your mind tonight?\"",
      "overwhelm": "Stop all demands. Move close. Speak quietly. Don't ask her to explain - the narration can come later. Be present, be patient, and trust that the system will reset if given time and safety."
    }
  },
  "tender_hedgehog": {
    "archetypeId": "tender_hedgehog",
    "title": "THE TENDER HEDGEHOG",
    "innerVoiceQuote": "\"Everything is louder for me. But I feel the beautiful things more deeply too.\" \u2014 [NAME]",
    "animalDescription": "The Hedgehog is one of nature's most misunderstood creatures. From the outside she appears prickly, defensive, difficult to get close to. But underneath those spines is one of the softest, most gentle animals you will ever encounter. The spines are protection - a nervous system's response to a world that arrives too fast, too loud, and too sharp. This particular Hedgehog is the Tender one - the girl whose softness is her defining quality, whose spines only appear when the world has pushed too hard, and whose inner life is so rich and so sensitive that the harshness of everyday environments is genuinely painful.",
    "aboutChild": "[NAME] is the girl who feels the world through her skin. Clothes that other children wear without thought can feel unbearable. Sounds that other children barely notice can feel physically painful. Crowded, noisy environments that other children find exciting can feel genuinely threatening. And because [NAME] also experiences emotions at a higher intensity than most, the sensory overwhelm doesn't stay in the body - it floods directly into the emotional system, creating reactions that look disproportionate from the outside but are entirely proportionate to what [NAME] is actually experiencing.\n\nThe girl presentation of this profile adds an additional layer: [NAME] has often learned to mask the sensory distress, to push through discomfort rather than express it, to appear fine while her nervous system is screaming. The cost of this masking is carried privately, and it arrives as meltdowns at home, as increasing anxiety, or as a growing avoidance of the environments that cause the most pain.",
    "hiddenGift": "The sensitivity that makes the world so challenging for [NAME] is also the source of her most remarkable qualities. She notices beauty others walk past. She feels music, art, and nature at a depth that is genuinely moving. Her empathy is not performed - it is felt, fully and physically. In calm, safe environments, [NAME] is one of the warmest, most perceptive, and most genuinely kind people in any room. She doesn't need to be toughened up. She needs a world that honours the depth of what she feels.",
    "aboutBrain": "[NAME]'s profile is shaped by two areas where her brain works differently.",
    "brainSections": [
      {
        "title": "Sensory Processing",
        "content": "[NAME]'s brain receives sensory input at a significantly higher intensity than most children her age. The volume knob on her sensory system is set higher than average, and it does not have a manual override. What other children tolerate without thought can feel genuinely painful or overwhelming to [NAME]'s nervous system. This is neurological, not behavioural - it cannot be reasoned away or toughened out."
      },
      {
        "title": "Emotional Regulation",
        "content": "When sensory overload combines with emotional intensity, the two systems amplify each other. A sensory trigger creates physical distress, which immediately activates the emotional system, which responds with an intensity that matches the sensory pain rather than the external event. The girl presentation often adds masking on top - containing the reaction in public and releasing it in private, which creates exhaustion and anxiety over time."
      }
    ],
    "dayInLife": {
      "morning": "Getting dressed is often the first challenge. The seam on a sock feels wrong. The waistband is too tight. The fabric scratches. These are not preferences - they are genuine sensory experiences that feel as urgent to [NAME] as a stone in your shoe feels to you. When you add time pressure and the anticipation of a sensorily demanding school day, the morning can become overwhelming before it has properly begun.",
      "school": "The school environment is one of the most sensorily demanding places [NAME] spends time. She may appear to be coping, but underneath she is managing a constant stream of sensory input that other children process automatically. By mid-morning, her sensory budget may already be running low. The emotional reactions that follow - irritability, tearfulness, withdrawal - are not moodiness. They are the overflow of a system that has been absorbing more than it can process.",
      "afterSchool": "[NAME] arrives home having spent the entire day managing sensory input that was not designed for her nervous system. She may be tearful, irritable, or completely shut down. What she needs is sensory relief: quiet, familiar textures, dim lighting, and time without demands.",
      "bedtime": "Bedtime can be one of the better parts of [NAME]'s day if the environment is right - quiet, soft, predictable. On a hard day, the emotions that were masked all day may finally surface, and [NAME] needs patient presence rather than problem-solving."
    },
    "drains": [
      "Loud, unpredictable, or chaotic environments",
      "Clothing or textures that feel physically uncomfortable",
      "Being told her sensory experience isn't real or that she's overreacting",
      "Sudden changes or transitions without warning",
      "Having to mask sensory distress to appear normal",
      "Crowded social situations with high sensory demand",
      "Feeling like her sensitivity is something to be ashamed of"
    ],
    "fuels": [
      "Calm, predictable spaces with controlled sensory input",
      "Soft, familiar fabrics and the freedom to choose what feels right on her body",
      "Adults who take her sensory experience seriously without question",
      "Advance notice of what is coming and time to prepare",
      "A safe, quiet space to decompress without demands",
      "Permission to feel things deeply without being told to toughen up",
      "Being valued for her depth, empathy, and gentleness"
    ],
    "overwhelm": "[NAME]'s overwhelm follows a recognisable pattern: sensory input builds, the emotional system activates, and the spines go up. In the girl presentation, this may be preceded by a period of visible effort to contain the reaction - appearing fine while the internal pressure builds. When it finally breaks, the flood is the accumulated weight of everything that was held in.\n\nReduce sensory input first. That is the intervention. Move to a quieter space, lower your voice, dim the lights. If [NAME] wants physical contact, a firm, sustained hold works better than a light touch. If she can't tolerate touch, stay close and stay quiet. Don't ask what's wrong. Once the environment is calmer, the nervous system will follow.",
    "affirmations": [
      { "when": "When a sensory experience has caused a reaction and [NAME] feels ashamed of it", "say": "\"I believe you. If it hurts, it hurts. We don't have to question that.\"" },
      { "when": "When the sensitivity keeps creating friction and she's starting to feel like it's a flaw", "say": "\"Your tenderness is one of the things that makes you extraordinary.\"" },
      { "when": "When she has been masking all day and the cost is visible", "say": "\"You don't have to pretend here. This is where you can be exactly as you are.\"" },
      { "when": "When she needs the opposite of what everyone else seems to need", "say": "\"Some people need noise to feel alive. You need quiet. Neither is wrong.\"" },
      { "when": "When the day has cost more than it should have", "say": "\"The world is louder for you. That's real, and I see how brave you are in it.\"" }
    ],
    "doNotSay": [
      { "when": "A sensory trigger has caused a reaction that seems excessive", "insteadOf": "\"It's just a noise. Stop overreacting.\"", "tryThis": "\"That was really uncomfortable for you. Let's find somewhere quieter.\"" },
      { "when": "Getting dressed is a battle and time is running out", "insteadOf": "\"Every other girl wears it. Just put it on.\"", "tryThis": "\"Let's find something that feels okay on your body. What part feels the worst?\"" },
      { "when": "You want her to be tougher", "insteadOf": "\"You need to toughen up.\"", "tryThis": "\"Your sensitivity picks up things other people miss entirely. That's a real strength.\"" },
      { "when": "The emotional weather has shifted and there's no obvious cause", "insteadOf": "\"Stop being so dramatic.\"", "tryThis": "\"Something is bothering your body or your feelings. Can you help me find what?\"" },
      { "when": "The reaction seems out of proportion", "insteadOf": "\"It's really not a big deal.\"", "tryThis": "\"It feels like a big deal to you, and that matters to me.\"" }
    ],
    "closingLine": "[NAME] is a Tender Hedgehog. And the world needs more of them.",
    "whatHelps": {
      "aboutChild": "Cut labels out of clothes. Choose soft fabrics. Keep a sensory kit ready. Prepare for known problem settings before they start. Give [NAME] a way to manage or escape sensory input early - headphones, a quiet corner, a break card, permission to step out before the system tips over.",
      "hiddenGift": "Find the areas where sensitivity becomes a strength: music, art, animals, caring for others. When you see it working, name it directly: \"You noticed something there that most people would have missed completely.\" That message, repeated often enough, becomes part of how she sees herself.",
      "brain": "Learn [NAME]'s specific sensory triggers. Spend a week noticing what was happening in the environment before things went wrong. Once you know the triggers, you can reduce them proactively rather than managing the fallout afterwards. The pattern is almost always there if you look for it.",
      "morning": "Lay out approved clothes the night before. Remove all labels. If an item is refused on the day, trust the sensory experience and switch it. The battle is not worth the cost to her nervous system, and the morning will go more smoothly without it.",
      "school": "Ask for noise-cancelling headphones during independent work, a quiet space she can access when overwhelmed, and advance warning before transitions. Make sure the school understands that the quiet, compliant presentation does not mean she is coping.",
      "afterSchool": "A predictable decompression routine. Quiet room, dim lighting, favourite blanket, calm music or audiobook. Give [NAME] 20-30 minutes of low-sensory time before any demands. The nervous system needs to reset before anything else is possible.",
      "bedtime": "A consistent, low-stimulation routine that [NAME] can predict completely. Dim lighting, soft pyjamas, same sequence every night. If emotions surface, sit with them quietly. \"That was a hard day for your body and your feelings. You're safe now.\"",
      "overwhelm": "Reduce sensory input first. Move to a quieter space, lower your voice, dim the lights. If she wants touch, make it firm and sustained. If she doesn't, stay close and stay quiet. Don't ask questions. The environment calming down is what allows the nervous system to follow."
    }
  },
  "hidden_firefly": {
    "archetypeId": "hidden_firefly",
    "title": "THE HIDDEN FIREFLY",
    "innerVoiceQuote": "\"My light is real. I just don't always know when it's safe to let it show.\" \u2014 [NAME]",
    "animalDescription": "The Firefly carries its own light - a glow that appears and disappears, visible one moment and hidden the next. It does not shine constantly or predictably. It shines when conditions are right, when the environment is safe enough, when the darkness around it makes the light worth the risk. This particular Firefly is the Hidden one - the girl whose brilliance, warmth, and emotional depth are absolutely real but often invisible, tucked away behind the effort of managing a brain and a social world that don't always cooperate.",
    "aboutChild": "[NAME] is the girl whose light flickers. When she feels safe, connected, and understood, she is warm, funny, deeply caring, and genuinely brilliant. But the combination of emotional intensity, executive dysfunction, and social vulnerability means those moments of shining are interrupted by stretches of struggle, withdrawal, or overwhelm that can make her seem inconsistent, unreliable, or hard to reach.\n\n[NAME] cares desperately about her friendships and her place in the social world. She feels every social slight, every exclusion, every moment of disconnect at a volume that is genuinely painful. But the executive system can't reliably maintain the logistics of friendship - the texts, the plans, the follow-through - and the emotional intensity means small setbacks can trigger responses that push people away rather than drawing them closer. The girl who wants most to belong is the girl who finds belonging hardest to sustain.",
    "hiddenGift": "[NAME]'s emotional depth, social sensitivity, and creative intelligence are genuine and extraordinary. When she trusts the environment, the light is unmistakable - warm, perceptive, deeply connected, and profoundly kind. She feels things at a depth that will make her an extraordinary friend, partner, creator, and human being. The goal is not to make the light constant - it is to make the world safe enough that it can appear more often and stay longer.",
    "aboutBrain": "[NAME]'s profile is shaped by three areas where her brain works differently.",
    "brainSections": [
      {
        "title": "Emotional Intensity",
        "content": "[NAME] experiences emotions faster, harder, and longer than most children her age. The gap between trigger and full emotional response is very short, and the return to baseline takes significantly longer. In the girl presentation, this often combines with masking - containing the emotional experience in public and releasing it in private, which creates exhaustion and anxiety."
      },
      {
        "title": "Executive Function",
        "content": "[NAME]'s internal organisational system is significantly behind her emotional and social development. She knows what she wants to do and often understands exactly what a situation requires, but the system that translates understanding into action - planning, initiating, sequencing, following through - doesn't deliver reliably. This creates a persistent gap between intention and execution."
      },
      {
        "title": "Social Drive",
        "content": "[NAME]'s need for connection is intense and genuine. She monitors social dynamics with constant vigilance, reads emotional atmospheres with accuracy, and adjusts her behaviour to maintain acceptance. The cost is that authenticity is sacrificed for belonging, and the effort of social monitoring depletes the resources available for everything else."
      }
    ],
    "dayInLife": {
      "morning": "[NAME]'s mornings are shaped by whatever emotional residue she is carrying from the night before or whatever social anxiety she is anticipating for the day ahead. Getting organised requires executive function that is already competing with emotional management. A worry about a friendship dynamic or a school situation can consume all available bandwidth and make the practical demands of the morning feel impossible.",
      "school": "[NAME] spends much of the school day managing two invisible workloads: the academic demands and the social performance. She is tracking friendships, monitoring her place in the group, and managing emotions - all while trying to learn. The executive system can't reliably support both, and something always gives. Often it is the academic work that suffers, because the social and emotional demands feel more urgent.",
      "afterSchool": "[NAME] arrives home carrying the full weight of the day's social and emotional labour. The mask drops, and what was held together at school releases at home. She may be tearful, withdrawn, or intensely reactive. This is genuine exhaustion, not attitude. She needs connection and recovery before anything else is asked of her.",
      "bedtime": "Bedtime is when [NAME]'s unprocessed emotions arrive. The friendship that felt uncertain, the moment she felt excluded, the thing she said that she's not sure landed right. She replays, worries, and processes at a level of detail that can delay sleep significantly. She needs calm, non-judgmental companionship to help her set it all down."
    },
    "drains": [
      "Social situations where her place feels uncertain or at risk",
      "The constant effort of masking emotions and appearing to cope",
      "Executive demands on top of emotional and social demands",
      "Feeling like her inconsistency means she's not trying hard enough",
      "Being told she's too emotional or too sensitive",
      "Friendship dynamics that shift without explanation",
      "Academic expectations that don't account for the invisible workload she carries",
      "Comparison to girls who seem to manage everything effortlessly"
    ],
    "fuels": [
      "Safe, trusting relationships where she can be fully herself",
      "Adults who see past the mask and recognise the effort underneath",
      "Help with the logistics of daily life - plans, reminders, gentle scaffolding",
      "Permission to feel things deeply without shame",
      "Small, stable social settings where the dynamics are predictable",
      "Creative outlets where emotions become something beautiful rather than overwhelming",
      "Recognition that the light is real, even when it's hidden",
      "An adult who says \"I see who you are. And she's wonderful.\""
    ],
    "overwhelm": "[NAME]'s overwhelm is emotional at its core, triggered when the gap between wanting to succeed socially and feeling like she's failing becomes unbearable. The response may be tears, withdrawal, rage, or a combination that shifts rapidly. What is happening underneath is a nervous system that has been managing emotional intensity, social monitoring, and executive demands all day and has reached the point of collapse.\n\nIn these moments, connection is the intervention. Move close, speak softly, and let her know the relationship is safe. \"I'm not going anywhere. You don't have to hold it together.\" Don't try to fix the trigger - just be present through the storm. The recovery happens when [NAME] feels genuinely held, not when the problem is solved.",
    "affirmations": [
      { "when": "When the light has been hidden all day and she's exhausted from the effort", "say": "\"I see you. The real you. And she's wonderful.\"" },
      { "when": "When a friendship has hurt her and she's questioning her own worth", "say": "\"The way you love people is not the problem. It's one of the best things about you.\"" },
      { "when": "When the gap between effort and output is making her feel like a failure", "say": "\"You're working harder than anyone can see. That effort matters, even when the results don't show it yet.\"" },
      { "when": "When she feels like nobody understands what it costs her to get through a day", "say": "\"I know how much it takes. And I'm proud of you for showing up every single time.\"" },
      { "when": "On a day when the light felt very far away", "say": "\"Your light doesn't go out. Sometimes it just needs a safe place to come back.\"" }
    ],
    "doNotSay": [
      { "when": "The emotions are big and you're struggling to validate them", "insteadOf": "\"You're being too dramatic.\"", "tryThis": "\"That felt really big. Tell me what happened.\"" },
      { "when": "The inconsistency is frustrating and you want her to be more reliable", "insteadOf": "\"You can do it when you want to, so why don't you always?\"", "tryThis": "\"Some days your brain has more to work with than others. That's okay.\"" },
      { "when": "Social drama is constant and you're exhausted by it", "insteadOf": "\"Stop worrying about what everyone thinks.\"", "tryThis": "\"Your friendships matter to you. Let's talk about what's going on.\"" },
      { "when": "She's masking and you want her to just be honest", "insteadOf": "\"Just tell me what's wrong!\"", "tryThis": "\"You don't have to explain. I'm just going to sit here with you.\"" },
      { "when": "The effort seems invisible and you're worried about her future", "insteadOf": "\"You need to try harder.\"", "tryThis": "\"You're already trying so hard. Let's find what makes it easier.\"" }
    ],
    "closingLine": "[NAME] is a Hidden Firefly. And the world needs more of them.",
    "whatHelps": {
      "aboutChild": "Create environments where [NAME] feels safe enough to let the light show. That means predictable, low-judgment, high-connection settings where she doesn't have to perform. Help with the executive logistics - the plans, the reminders, the step-by-step scaffolding - so her energy can go to the emotional and social work that matters most to her.",
      "hiddenGift": "When the light appears, name it. \"That thing you just did, that kindness, that insight, that creative idea - that's the real you. And she's extraordinary.\" The more often [NAME] hears that her authentic self is valued, the less energy she'll spend hiding it.",
      "brain": "Help with the executive gap by providing external structure: visual schedules, reminders, breaking tasks into one step at a time. For emotional regulation, teach her to name what she's feeling before it floods: \"I'm starting to feel overwhelmed\" is a skill that can be practised when things are calm.",
      "morning": "Check the emotional temperature before anything else: \"How are you feeling about today?\" If anxiety is present, acknowledge it and move on: \"That sounds hard. You'll get through it.\" Keep the routine predictable and the decisions minimal.",
      "school": "Work with the school to ensure the invisible workload is recognised. The quiet, socially aware girl who appears fine is often the one most in need of support. Request check-ins with a trusted adult, written instructions, and permission to take a break when overwhelmed.",
      "afterSchool": "Give [NAME] 20-30 minutes of connection and recovery before demands arrive. Let her talk about the social content of the day if she wants to, or let her decompress in silence if she needs that instead. Follow her lead.",
      "bedtime": "A calm check-in that gives [NAME] space to unload: \"What's sitting heavy tonight?\" Listen without fixing. If the social replaying is intense, gently redirect: \"That's enough for tonight. Tomorrow is a fresh start.\" Keep the routine soft, predictable, and warm.",
      "overwhelm": "Connection is the intervention. Move close, speak softly, and let her know the relationship is safe. Don't try to fix the trigger. Be present through the storm. The recovery happens when [NAME] feels genuinely held."
    }
  },
  "panda": {
    "archetypeId": "panda",
    "title": "THE CLOUDY PANDA",
    "innerVoiceQuote": "\"I was just about to do it, and then I had the most incredible idea and I had to follow it immediately, obviously.\" \u2014 [NAME]",
    "animalDescription": "The Panda is one of nature's most gentle, warm, and loveable creatures, but famously clumsy, operating on its own schedule, and seemingly unaware of how much time has passed since it last moved from one spot to the next. It is built for softness, not speed. For depth, not efficiency. For connection, not performance. This particular Panda is the Cloudy one. On clear days, [NAME] is warm, creative, emotionally rich, and genuinely wonderful company. But when the cloud rolls in, and it rolls in without warning, focus, emotions, and frustration combine into a fog that is as confusing for [NAME] as it is for everyone around [HIM/HER/THEM]. The loop is reliable and painful: drift \u2192 miss something \u2192 realise \u2192 emotionally crash \u2192 deeper fog.",
    "aboutChild": "[NAME] is the child who starts the morning with good intentions but ends up standing in the hallway with one shoe on, staring at nothing, having completely lost the thread of what [HE/SHE/THEY] was doing. The brain drifted. The shoe was forgotten. The next step disappeared. And now [HE/SHE/THEY] is stuck, not because [HE/SHE/THEY] doesn't care, but because the executive system that was supposed to carry [HIM/HER/THEM] from intention to action simply let go without warning.\nThis is the child who appears \"more capable than [HE/SHE/THEY] performs,\" which makes the adults around [HIM/HER/THEM] expect more, push harder, and feel more frustrated when the gap between what [NAME] clearly can do and what [NAME] actually does remains stubbornly wide. That gap is not a choice. It is the central feature of this profile, and understanding it changes everything.",
    "hiddenGift": "[NAME] has a depth of feeling that most people take a lifetime to develop. [HE/SHE/THEY] notices when someone in the room is sad before anyone else has registered it. [HE/SHE/THEY] cares about fairness with a sincerity that is impossible to fake. [HE/SHE/THEY] feels things with a richness and a texture that most adults have long since learned to suppress. Combined with a wandering mind that makes unexpected connections between ideas that nobody else thought to link, [NAME] sees the world from an angle that is genuinely original. The creativity is not separate from the struggle. It is the same brain, working the same way, producing both the difficulty and the brilliance.",
    "aboutBrain": "[NAME]'s profile is shaped by three areas where [HIS/HER/THEIR] brain works differently, and the critical insight is that these three systems feed each other.",
    "brainSections": [
      {
        "title": "Attention System",
        "content": "[NAME]'s attention system acts as an inconsistent filter. Rather than smoothly prioritising what matters and screening out what doesn't, [HIS/HER/THEIR] brain lets everything in with roughly equal weight, or suddenly screens out exactly the thing [HE/SHE/THEY] needed to hear. The result is a child who can be completely absorbed in something fascinating one moment and completely disconnected from something important the next. This is not a choice. It is the brain's filtering system operating unreliably, and it affects every part of [NAME]'s day."
      },
      {
        "title": "Executive Function",
        "content": "[NAME]'s executive function, the brain's internal management system for planning, sequencing, initiating, and completing tasks, is developing on a significantly slower timeline than [HIS/HER/THEIR] peers. The gap between knowing what to do and being able to make [HIMSELF/HERSELF/THEMSELVES] do it is wide, persistent, and genuinely frustrating for [NAME]. [HE/SHE/THEY] is not choosing to avoid or delay. [HIS/HER/THEIR] brain is not generating the activation energy needed to begin, and every time that gap is noticed by an adult, the emotional cost compounds."
      },
      {
        "title": "Emotional Regulation",
        "content": "[NAME]'s emotional system runs hot. Feelings arrive with full force and no filter, landing with an intensity that overwhelms [HIS/HER/THEIR] ability to moderate, process, or redirect them before they are already fully expressed. Frustration does not build gradually. It arrives complete. Disappointment does not settle slowly. It crashes. And shame, which is the emotion [NAME] encounters most frequently in the gap between intention and execution, accumulates silently until it becomes the background noise of [HIS/HER/THEIR] daily experience."
      }
    ],
    "dayInLife": {
      "morning": "The morning is a collision between sequencing demands and emotional weight. [NAME] knows what needs to happen: get dressed, eat breakfast, pack bag, leave. But holding that sequence in working memory while managing the emotional residue of yesterday (or the anxiety about today) is more than [HIS/HER/THEIR] executive system can reliably handle at 7:30am. One thing goes wrong, a missing sock, a sibling's comment, a change to the plan, and the emotional system floods, the executive system stalls, and [NAME] is standing in the hallway unable to move forward.",
      "school": "School is where the gap is most visible and most painful. [NAME] arrives carrying whatever emotional weight the morning produced, and the classroom immediately asks [HIM/HER/THEM] to do the three things [HIS/HER/THEIR] brain finds hardest: sustain attention, follow multi-step instructions, and regulate frustration when things don't go well. Teachers often describe [NAME] as \"so capable but doesn't apply [HIMSELF/HERSELF/THEMSELVES],\" which is both accurate and deeply incomplete. The capability is genuine. The application requires executive resources that are genuinely not yet available at the level the classroom demands.",
      "afterSchool": "[NAME] arrives home with an empty tank. The effort of holding it together at school, managing the attention, the emotions, the social demands, has used everything [HE/SHE/THEY] had. What remains is a child who is tired, emotionally fragile, and profoundly low on the resources needed to do anything further. Tears, refusal, irritability, or complete withdrawal are not [NAME] being difficult. They are [NAME] being depleted. The tank needs to refill before anything else can be asked of it.",
      "bedtime": "Bedtime is when the final processing happens. Everything that was unresolved during the day, every small failure, every moment of shame, every interaction that didn't go the way [NAME] wanted, rises to the surface in the quiet. [HIS/HER/THEIR] brain, freed from the demands of the day, begins replaying, reviewing, and feeling everything it didn't have time to feel earlier. [NAME] may become tearful, anxious, clingy, or unable to settle, not because [HE/SHE/THEY] is avoiding sleep, but because the unresolved feelings of the day have finally found a moment to arrive."
    },
    "drains": [
      "Multi-step instructions delivered verbally",
      "Time pressure and rushing",
      "Being reminded of past mistakes",
      "Overstimulating environments when emotionally loaded",
      "Tasks that feel too big to start",
      "Unexpected changes to the plan",
      "Being told \"you're not trying\"",
      "Comparison to siblings or peers who \"just get on with it\""
    ],
    "fuels": [
      "One step at a time with visual support",
      "Extra time built into transitions",
      "Being acknowledged for effort, not just results",
      "Calm spaces to decompress after hard moments",
      "Tasks broken into visible, small steps",
      "Advance warning and predictable routines",
      "Being told \"I know this is hard and I'm here\"",
      "Recognition that their brain works differently, not worse"
    ],
    "overwhelm": "[NAME]'s overwhelm arrives when the three systems collide simultaneously: attention has drifted, something has been missed, the emotional response to that failure floods in, and the executive system cannot organise a recovery. The result is a child who appears to shut down completely, or who erupts with a frustration that seems wildly disproportionate to whatever just happened. It is not disproportionate to [NAME]'s experience, which is the accumulated weight of drift, failure, and shame arriving all at once.\nIn these moments, do not try to reason, redirect, or problem-solve. [NAME]'s prefrontal cortex is temporarily offline. What [HE/SHE/THEY] needs is a calm, regulated adult nearby who reduces demands to zero and simply stays present. A quiet voice, a hand on the shoulder, a sentence like \"I'm here. We don't need to fix anything right now.\" Once the emotional flood recedes, [NAME] will come back, often surprisingly quickly, and will be ready to reconnect. The repair conversation matters enormously, but it can only happen after the storm.",
    "affirmations": [
      { "when": "After a moment of shame, when [NAME] has realised [HE/SHE/THEY] drifted and missed something important", "say": "\"Your brain wandered. That's not a character flaw. It's just how your brain works sometimes.\"" },
      { "when": "When frustration has taken over and [NAME] is upset with [HIMSELF/HERSELF/THEMSELVES]", "say": "\"I can see how hard this feels. You don't have to be perfect to be amazing.\"" },
      { "when": "When [NAME] feels invisible because the struggle is quiet, not loud", "say": "\"I see how hard you're working, even when nobody else notices.\"" },
      { "when": "When emotional intensity has overwhelmed [HIM/HER/THEM] and [HE/SHE/THEY] feels broken", "say": "\"Feeling things deeply is not a weakness. It's one of your greatest strengths.\"" },
      { "when": "When [NAME] compares [HIMSELF/HERSELF/THEMSELVES] to peers who seem to manage easily", "say": "\"Your brain works differently. That doesn't mean it works worse. It means you need different support.\"" },
      { "when": "When [NAME] is convinced [HE/SHE/THEY] will never get it right", "say": "\"You are not behind. You are building something most people never develop, and it takes time.\"" },
      { "when": "At the end of a hard day when everything felt like too much", "say": "\"Tomorrow is a clean start. And I'll be right here for it.\"" }
    ],
    "doNotSay": [
      {
        "when": "[NAME] has forgotten something important and you're frustrated",
        "insteadOf": "\"How could you forget? I just told you.\"",
        "tryThis": "\"Let's try again. One step at a time, I'll help you.\""
      },
      {
        "when": "[NAME] is crying over something that seems small",
        "insteadOf": "\"It's not that big a deal.\"",
        "tryThis": "\"I can see that hit you hard. I'm here.\""
      },
      {
        "when": "The gap between capability and output is making you question effort",
        "insteadOf": "\"You're not even trying.\"",
        "tryThis": "\"I know you want to do well. Let's figure out what's getting in the way.\""
      },
      {
        "when": "[NAME] is reacting emotionally and you need it to stop",
        "insteadOf": "\"Stop overreacting.\"",
        "tryThis": "\"That feeling is real. Let's ride it out together.\""
      },
      {
        "when": "A sibling is managing better and the comparison is obvious",
        "insteadOf": "\"Why can't you be more like your brother/sister?\"",
        "tryThis": "\"You have your own strengths. We'll find the support that fits you.\""
      },
      {
        "when": "[NAME] has lost focus again and you've run out of patience",
        "insteadOf": "\"You're so distracted all the time.\"",
        "tryThis": "\"Let's bring you back. What's the one thing we're doing right now?\""
      },
      {
        "when": "You're worried about [NAME]'s future and it slips out",
        "insteadOf": "\"You'll never manage on your own if you can't even do this.\"",
        "tryThis": "\"We're building skills together. You don't have to have it all figured out yet.\""
      }
    ],
    "closingLine": "[NAME] is a Cloudy Panda. And the world needs more of them.",
    "whatHelps": {
      "aboutChild": "The most important shift is to stop expecting [NAME] to bridge the gap between intention and action alone. [HE/SHE/THEY] cannot yet. Build external scaffolding: visual checklists, one instruction at a time, a calm adult nearby during transitions. Acknowledge effort before results. And when the gap shows up, respond with support, not frustration.",
      "hiddenGift": "Give the depth of feeling a good place to land. Let [NAME] care for animals, make art, write stories, comfort a friend. When the emotional richness is pointed at something meaningful, it stops being a problem and starts being a superpower. Name it when you see it: \"The way you noticed that about your friend, that's extraordinary.\"",
      "brain": "The three systems feed each other, so intervene at the earliest point. Reduce sensory and emotional load before asking for focus. Break tasks into single visible steps. Stay nearby for the first minute of any task. And when the emotional system floods, stop everything else and deal with the feeling first. The task can wait. The feeling cannot.",
      "morning": "Prepare everything possible the night before. Give one instruction at a time and wait for completion before giving the next. Build in extra time so rushing doesn't add emotional pressure. A visual checklist on the wall removes the need for verbal reminders and the conflict they create.",
      "school": "Share this document with [NAME]'s teacher. The key accommodations are: written instructions alongside verbal ones, permission to take a brief break when emotionally overwhelmed, a quiet signal for when [NAME] needs help but doesn't want to draw attention, and recognition that the gap between capability and output is neurological, not motivational.",
      "afterSchool": "Give [NAME] 20-30 minutes of zero demands when [HE/SHE/THEY] gets home. No homework, no questions, no tasks. A snack, a quiet space, and the freedom to do nothing. Once the tank has partially refilled, approach homework with small steps, a timer, and your presence nearby for the first few minutes.",
      "bedtime": "A calm, predictable routine with a brief emotional check-in: \"Anything sitting heavy from today?\" Let [NAME] talk without fixing or problem-solving. If the feelings are intense, validate and contain: \"That sounds really hard. We'll come back to it tomorrow if you need to. Right now, your job is just to rest.\"",
      "overwhelm": "When the three systems collide, stop everything. Reduce demands to zero. Stay close, stay calm, stay quiet. Do not try to reason or redirect. Once the flood recedes, reconnect gently: \"That was really hard. I'm proud of you for getting through it.\" The repair conversation is where the real learning happens."
    }
  },
  "firefly": {
    "archetypeId": "firefly",
    "title": "THE SPARK FIREFLY",
    "innerVoiceQuote": "\"I feel things deeply, think beautifully, and still struggle to show it the way I mean to.\" \u2014 [NAME]",
    "animalDescription": "The Firefly glows from within, sudden, beautiful, impossible to fake. It appears on its own schedule. You cannot make a firefly shine on command, and you cannot predict when the light will come. But when it does, it stops everything around it. This particular Firefly is the Spark, the one whose emotional depth, social warmth, and creative brilliance flash with real intensity but whose ability to organise, sustain, and direct that brilliance is still catching up. The light is real. The wiring that delivers it is still being built.",
    "aboutChild": "[NAME] is the child who surprises you. [HE/SHE/THEY] can sit quietly through an entire class and then say something so perceptive that every adult in the room stops. [HE/SHE/THEY] can spend twenty minutes struggling to start a piece of work and then produce something genuinely creative, insightful, or beautiful. [HE/SHE/THEY] can be so emotionally attuned to the people around [HIM/HER/THEM] that it takes your breath away, and then completely unable to organise [HIMSELF/HERSELF/THEMSELVES] to get out the door on time.\nThis profile is confusing to adults because [NAME] doesn't look like a typical struggling child. [HE/SHE/THEY] is articulate, socially aware, emotionally intelligent. The assumption is that a child this capable should be able to manage the basics. But the basics, the executive basics of organising, initiating, sustaining, and completing, are precisely where [NAME]'s brain needs the most support.",
    "hiddenGift": "[NAME] has a combination of emotional intelligence and social awareness that is genuinely rare in a child. [HE/SHE/THEY] reads the room before most adults do. [HE/SHE/THEY] picks up on emotional undercurrents that are invisible to everyone else. [HE/SHE/THEY] makes connections between ideas that are unexpected and often brilliant, not through deliberate analysis but through an intuitive process that happens faster than [HE/SHE/THEY] can explain. When the right environment exists, calm, supported, low-pressure, [NAME]'s output is extraordinary. The goal is not to create that brilliance. It already exists. The goal is to build the scaffolding that lets it show up reliably.",
    "aboutBrain": "[NAME]'s profile is shaped by three areas where [HIS/HER/THEIR] brain works differently, and the result is a loop that explains much of [HIS/HER/THEIR] daily experience.",
    "brainSections": [
      {
        "title": "Emotional Intensity",
        "content": "[NAME] feels things with a depth and speed that overwhelms [HIS/HER/THEIR] ability to moderate or redirect those feelings before they take over. Joy is ecstatic. Disappointment is devastating. Shame arrives instantly and completely. This is not sensitivity in the colloquial sense. It is a neurological reality: [NAME]'s emotional responses are faster, bigger, and longer-lasting than [HIS/HER/THEIR] peers', and they consume cognitive resources that would otherwise be available for other things."
      },
      {
        "title": "Executive Function",
        "content": "[NAME]'s executive system, the brain's capacity to plan, initiate, sequence, and sustain effort on tasks, is developing on a significantly slower timeline than [HIS/HER/THEIR] intellectual and emotional development. The result is a child who can understand a concept brilliantly but cannot organise the steps to demonstrate that understanding. Who can articulate exactly what needs to happen but cannot make [HIMSELF/HERSELF/THEMSELVES] begin. The gap between insight and execution is wide, persistent, and deeply frustrating for [NAME]."
      },
      {
        "title": "Social Drive",
        "content": "[NAME]'s social brain is highly active. [HE/SHE/THEY] is drawn to people, fascinated by relationships, and genuinely energised by connection. This is a strength, but it also creates a competing demand on cognitive resources that are already stretched thin. When the executive system fails and overwhelm arrives, [NAME] often pours [HIS/HER/THEIR] remaining energy into social connection at the expense of practical tasks, not because [HE/SHE/THEY] is avoiding work, but because connection is where [HIS/HER/THEIR] brain feels most competent and most alive."
      }
    ],
    "dayInLife": {
      "morning": "Mornings are slow for [NAME], not from laziness but from the weight of processing. Yesterday's emotions are still being sorted. Today's anxieties are already forming. The executive demands of the morning routine, getting dressed, eating, packing, leaving, require [HIM/HER/THEM] to make decisions and initiate actions at a time when [HIS/HER/THEIR] brain is still warming up. Indecision is common. So is quiet withdrawal or sudden emotional flare-ups that seem to come from nowhere but are actually yesterday's unfinished business arriving at the worst possible moment.",
      "school": "School presents [NAME] with a paradox. [HE/SHE/THEY] is well-liked, socially skilled, and emotionally perceptive, qualities that make [HIM/HER/THEM] popular and valued by peers and teachers alike. But [HIS/HER/THEIR] work output doesn't match [HIS/HER/THEIR] capability, and the gap is visible to everyone. Teachers describe [NAME] as \"so bright but inconsistent,\" \"lovely but needs to apply [HIMSELF/HERSELF/THEMSELVES],\" or \"clearly capable but the work doesn't show it.\" These descriptions are accurate but incomplete. The capability is real. The executive bridge between capability and output is where the support is needed.",
      "afterSchool": "[NAME] arrives home carrying the emotional and social weight of the entire day. The friendships, the interactions, the small moments of connection and disconnection, all of these have been processed at high intensity and are still being carried. [NAME] may be quiet, withdrawn, or tearful in a way that doesn't seem to have a clear cause. The cause is cumulative: six hours of emotional and social processing on top of executive effort that depleted [HIS/HER/THEIR] reserves hours ago.",
      "bedtime": "Bedtime is when [NAME]'s deepest processing happens. Everything rises to the surface: the social interaction that didn't go right, the task that felt impossible, the moment of shame when the gap between what [HE/SHE/THEY] wanted to do and what [HE/SHE/THEY] managed to do was visible. [NAME]'s brain does not release these easily. They replay, they intensify, they demand attention. This is not [NAME] avoiding sleep. This is a brain doing the emotional work it didn't have space for during the day."
    },
    "drains": [
      "Tasks that require sustained organisation without support",
      "Social conflict or friendship instability",
      "Being judged for inconsistent output",
      "Having to manage multiple deadlines alone",
      "Environments where emotional expression is unwelcome",
      "Being perceived as lazy or unmotivated",
      "Rapid social changes with no time to process",
      "Open-ended tasks with no clear starting point"
    ],
    "fuels": [
      "Tasks broken into steps with someone nearby to help initiate",
      "Stable, deep, one-on-one friendships",
      "Recognition that ability and execution are different things",
      "External scaffolding \u2014 checklists, reminders, interim check-ins",
      "Safe spaces to feel and process without being told to 'get over it'",
      "Being seen for the effort that happens inside, not just the output",
      "Advance warning and time to emotionally prepare for transitions",
      "A clear first step and permission to do just that much"
    ],
    "overwhelm": "[NAME]'s overwhelm arrives when the emotional intensity, the executive failure, and the social pressure converge. The light goes out. [NAME] may shut down completely, becoming quiet, unreachable, and apparently blank, or [HE/SHE/THEY] may redirect all remaining energy into social connection, becoming intensely focused on a friendship or a conversation as a way of avoiding the thing that has become too much.\nIn these moments, do not push for productivity. The executive system is offline. Instead, offer connection without demand: \"I can see today has been really hard. You don't have to do anything right now.\" Stay close. Be patient. When [NAME] is ready, and [HE/SHE/THEY] will be, offer one small, achievable step back toward the task. Not the whole thing. Just the first step. The spark will return. It always does.",
    "affirmations": [
      { "when": "When the gap between what [NAME] knows [HE/SHE/THEY] can do and what [HE/SHE/THEY] managed to produce is painfully visible", "say": "\"I know there's more inside you than what showed up on that page. I've seen it.\"" },
      { "when": "When [NAME] feels like [HE/SHE/THEY] is failing because the output doesn't match the insight", "say": "\"Your brain works in bursts. That's not a flaw. It's just a different rhythm.\"" },
      { "when": "When social difficulty is making everything else harder", "say": "\"Friendships are complicated. You're not doing it wrong. You're doing it deeply.\"" },
      { "when": "When [NAME] is overwhelmed and has shut down", "say": "\"You don't have to be on right now. I'll be here when you're ready.\"" },
      { "when": "When the emotional weight of the day is visible and heavy", "say": "\"You carry a lot. I see that. And I'm carrying some of it with you.\"" },
      { "when": "When [NAME] is frustrated with [HIMSELF/HERSELF/THEMSELVES] for not being able to just do the thing", "say": "\"Knowing and doing are different skills. You have one. We'll build the other.\"" },
      { "when": "At the end of a day when the spark was invisible", "say": "\"The light is still there. It doesn't go away just because today was hard.\"" }
    ],
    "doNotSay": [
      {
        "when": "[NAME] hasn't started a task despite clearly understanding it",
        "insteadOf": "\"You obviously know how to do it, so just do it.\"",
        "tryThis": "\"I know you understand it. Let's get the first step done together.\""
      },
      {
        "when": "[NAME] is emotionally overwhelmed and you need [HIM/HER/THEM] to move on",
        "insteadOf": "\"You need to get over this and focus.\"",
        "tryThis": "\"Take the time you need. I'll be here when you're ready to start.\""
      },
      {
        "when": "The social world is consuming all of [NAME]'s energy",
        "insteadOf": "\"Stop worrying about your friends and focus on your work.\"",
        "tryThis": "\"I can see the friendship stuff is weighing on you. Let's deal with that first, then tackle the work.\""
      },
      {
        "when": "Inconsistency is frustrating and you're losing patience",
        "insteadOf": "\"You did it perfectly yesterday, why can't you do it today?\"",
        "tryThis": "\"Yesterday was a good day for your brain. Today is harder. That's okay.\""
      },
      {
        "when": "[NAME] appears to be doing nothing",
        "insteadOf": "\"Stop being so lazy.\"",
        "tryThis": "\"I can see you're stuck. Let me sit with you for the first bit.\""
      },
      {
        "when": "You're worried about [NAME]'s future performance",
        "insteadOf": "\"You'll never get anywhere if you can't organise yourself.\"",
        "tryThis": "\"Organisation is a skill. We'll build it together, one step at a time.\""
      },
      {
        "when": "[NAME] has poured energy into a friendship instead of a task",
        "insteadOf": "\"You always have time for your friends but never for your homework.\"",
        "tryThis": "\"I know people matter to you. Let's find time for both.\""
      }
    ],
    "closingLine": "[NAME] is a Spark Firefly. And the world needs more of them.",
    "whatHelps": {
      "aboutChild": "Stop expecting the output to match the insight on its own. Build the bridge: sit with [NAME] for the first few minutes of any task, provide a clear first step, and stay nearby. Recognise that the inconsistency is neurological, not motivational. On good days, celebrate. On hard days, support. Both are real.",
      "hiddenGift": "Give the emotional intelligence a legitimate role. Let [NAME] mentor younger children, mediate conflicts, create art, write stories, care for animals. The perceptiveness and empathy are real skills. When they have a purpose, they stop being a distraction and become a source of genuine confidence.",
      "brain": "Address the executive gap with external scaffolding: visual checklists, one-step-at-a-time instructions, a parent or teacher who checks in at intervals rather than expecting sustained independent work. For emotional intensity, teach [NAME] to name what [HE/SHE/THEY] is feeling before it floods: practise when things are calm so the skill is available when they are not.",
      "morning": "Reduce decisions the night before. Check the emotional temperature first: \"How are you feeling about today?\" If something is sitting heavy, acknowledge it briefly and move on. Keep the routine predictable and the expectations simple. One step at a time.",
      "school": "Work with the school to recognise that [NAME]'s capability and [NAME]'s output are not the same thing, and that the gap between them is where the support needs to go. Request written instructions alongside verbal ones, interim check-ins on longer tasks, and permission for [NAME] to take a brief emotional break when needed.",
      "afterSchool": "Give [NAME] 20 minutes of low-demand connection when [HE/SHE/THEY] gets home. Let [HIM/HER/THEM] talk about the social content of the day or decompress in silence. Follow [HIS/HER/THEIR] lead. Once the emotional tank has partially refilled, approach homework with small steps and your presence nearby.",
      "bedtime": "A calm check-in that gives [NAME] space to process: \"What's sitting heavy tonight?\" Listen without fixing. If the replaying is intense, gently contain: \"That's enough for tonight. We can come back to it tomorrow.\" Keep the routine soft, warm, and predictable.",
      "overwhelm": "When the spark goes out, don't try to reignite it immediately. Offer connection without demand. Stay close. Be patient. When [NAME] is ready, offer one small step. Not the whole task. Just the beginning. The spark will return. It always does."
    }
  },
  "penguin": {
    "archetypeId": "penguin",
    "title": "THE WANDERING PENGUIN",
    "innerVoiceQuote": "\"I start with every intention of getting there. Then my brain takes the scenic route.\" \u2014 [NAME]",
    "animalDescription": "The Penguin is a deeply social creature, living in colonies of thousands, huddling together for warmth, sharing duties, bonding for life. But famously clumsy on land. Waddles. Trips. Falls over. In water, a completely different animal: fast, graceful, precise, breathtakingly capable. The gap between land and water is everything. This particular Penguin is the Wandering one. [NAME] loves [HIS/HER/THEIR] colony deeply, wants to be in the middle of everything, and keeps getting lost on the way there. Not because [HE/SHE/THEY] doesn't care. Because the brain that carries the warmth also carries the drift.",
    "aboutChild": "[NAME] is the child everyone likes and nobody can rely on yet. Warm, friendly, genuinely interested in people. [HE/SHE/THEY] wants to be a good friend, remember the plan, show up on time, bring the right thing. [HE/SHE/THEY] means every word of every promise, right up until [HIS/HER/THEIR] brain drifts somewhere else and the promise simply disappears from working memory.\n[NAME] doesn't look like [HE/SHE/THEY] needs help. There are no meltdowns, no hyperactivity, no obvious signs of struggle. Just a gentle, persistent pattern of not quite managing: homework incomplete, belongings lost, plans forgotten, conversations half-finished. The adults around [HIM/HER/THEM] tend to assume [NAME] will grow out of it, or that a bit more effort would close the gap. The gap is neurological, and effort alone will not close it.",
    "hiddenGift": "[NAME] has a social warmth that cannot be taught. [HE/SHE/THEY] makes people feel welcome without effort, strategy, or agenda. There is a genuineness to [NAME]'s interest in others that is immediately felt and deeply valued by the people around [HIM/HER/THEM]. Combined with a wandering mind that drifts through ideas and perspectives other people never visit, [NAME] sees the world from angles nobody else considered. The warmth and the wandering are the same quality expressed in different domains, and both are genuinely rare.",
    "aboutBrain": "[NAME]'s profile is shaped by three areas where [HIS/HER/THEIR] brain works differently.",
    "brainSections": [
      {
        "title": "Inattention",
        "content": "[NAME]'s brain has a significantly looser grip on the present moment than most children [HIS/HER/THEIR] age. It drifts quietly, without warning, and without [NAME] noticing it has happened until the drift is complete. This is not a failure of effort or interest. It is a brain whose dopamine regulation system does not maintain consistent engagement with tasks that lack novelty, urgency, or genuine personal interest. The result is a child who can be fully present one moment and completely absent the next, with no awareness of the transition between the two."
      },
      {
        "title": "Executive Function",
        "content": "[NAME]'s executive system, the brain's capacity to hold information in working memory, sequence steps, track commitments, and follow through on intentions, is developing on a slower timeline than [HIS/HER/THEIR] social and verbal intelligence would suggest. This creates the painful gap that defines this profile: [NAME] can articulate exactly what [HE/SHE/THEY] intended to do and genuinely cannot explain why it didn't happen. The intention was real. The executive system simply did not carry it through."
      },
      {
        "title": "Social Drive",
        "content": "[NAME]'s social brain is highly active and genuinely skilled. [HE/SHE/THEY] reads social cues accurately, responds warmly, and is drawn to connection in a way that is both a strength and a complication. The social drive creates the commitments that the executive system then fails to deliver on, producing a painful loop: makes social commitment \u2192 brain doesn't encode the details \u2192 forgets or partially remembers \u2192 friend is let down \u2192 [NAME] doesn't fully understand why things keep going wrong."
      }
    ],
    "dayInLife": {
      "morning": "The morning is a quiet drift. [NAME] gets up with every intention of following the routine, and somewhere between the bedroom and the bathroom, five minutes pass without [HIM/HER/THEM] noticing. [HE/SHE/THEY] is standing half-dressed, not distressed, not distracted by anything specific, just somewhere else. The brain wandered and took [HIM/HER/THEM] with it. No urgency, no drama, just a gentle, persistent failure to arrive at the next step on time.",
      "school": "[NAME] is well-liked at school. Teachers describe [HIM/HER/THEM] as pleasant, friendly, and cooperative. But the homework is incomplete, the notes are half-finished, and the conversation with the person next to [HIM/HER/THEM] somehow became more absorbing than the lesson without [NAME] deciding to let that happen. [HE/SHE/THEY] is not deliberately socialising instead of working. [HIS/HER/THEIR] brain simply gravitates toward the thing that is most alive in the room, and that is almost always a person.",
      "afterSchool": "[NAME] wants to talk, connect, and process the social content of the day. This is not avoidance of homework. It is [HIS/HER/THEIR] social brain doing the work it finds most important. The friendships, the conversations, the micro-interactions of the school day are all being reviewed and processed. Once this social processing has been given space, [NAME] is often more available for other demands, but rushing past it will leave [HIM/HER/THEM] distracted and unsettled.",
      "bedtime": "Bedtime is generally calmer for [NAME] than for many children with ADHD. The wandering brain drifts from thought to thought, but without the emotional intensity or physical restlessness that makes settling hard for other profiles. [NAME] may take a while to fall asleep, but it is usually a peaceful process, the brain gently touring its own landscape rather than fighting to be still."
    },
    "drains": [
      "Long verbal instructions with no visual support",
      "Being expected to manage logistics alone",
      "Repetitive, low-stimulation tasks",
      "Being called forgetful, careless, or unreliable",
      "Isolation (working alone for extended periods)",
      "Open-ended tasks with no clear starting point",
      "Consequences for forgetting that feel like punishment",
      "Adults who mistake the drift for not caring"
    ],
    "fuels": [
      "Written or visual step-by-step guides",
      "External scaffolding \u2014 checklists, reminders, a parent or teacher who checks in",
      "Tasks with social connection or genuine interest built in",
      "Recognition that intentions are real even when follow-through fails",
      "Collaborative, social work environments",
      "A clear first step and a visible endpoint",
      "Systems that help catch things before they fall",
      "Adults who see the warmth and the effort underneath the fog"
    ],
    "overwhelm": "[NAME]'s overwhelm is among the quietest on this list. It does not arrive as a storm or an explosion. It arrives as a deeper fog: the drift becomes more complete, the presence fades further, and [NAME] becomes genuinely unreachable, not through emotion but through absence. [HE/SHE/THEY] is still physically present, still pleasant, still apparently fine, but the connection to the task, the conversation, or the moment has been lost entirely.\nThe risk with this profile is that overwhelm goes unnoticed because it is so quiet. [NAME] does not demand attention when struggling. [HE/SHE/THEY] simply fades. The adults around [HIM/HER/THEM] need to watch for the signs: increased forgetting, longer drifts, a growing gap between commitments and follow-through, a subtle withdrawal from the social connections that normally energise [HIM/HER/THEM]. When you see these signs, reduce demands, increase support, and reconnect gently: \"I notice you seem a bit far away today. What do you need?\"",
    "affirmations": [
      { "when": "When [NAME] has forgotten something and can see the disappointment on your face", "say": "\"I know you meant to remember. Your brain just let it go. That's not your fault.\"" },
      { "when": "When a friend has been let down and [NAME] feels terrible about it", "say": "\"You care about your friends more than almost anyone I know. We'll find ways to help your brain keep up with your heart.\"" },
      { "when": "When the drift has cost [NAME] something important and shame is setting in", "say": "\"You're not careless. Your brain just works on a different channel sometimes.\"" },
      { "when": "When [NAME] feels like [HE/SHE/THEY] keeps failing at the same things", "say": "\"We haven't found the right system yet. But we will.\"" },
      { "when": "When [NAME] is comparing [HIMSELF/HERSELF/THEMSELVES] to friends who seem to manage effortlessly", "say": "\"You bring things to your friendships that no system can teach. That matters more than you know.\"" },
      { "when": "When the pattern feels permanent and [NAME] is losing hope", "say": "\"This is not who you are forever. This is where we are right now, and it will change.\"" },
      { "when": "At the end of a day when the drift was constant and nothing landed", "say": "\"Tomorrow we try again. And I'll be right beside you.\"" }
    ],
    "doNotSay": [
      {
        "when": "[NAME] has forgotten a commitment and a friend is hurt",
        "insteadOf": "\"You're so unreliable.\"",
        "tryThis": "\"I know you care. Let's set up a system so your brain can keep track of the things that matter to you.\""
      },
      {
        "when": "The same thing has been forgotten for the third time this week",
        "insteadOf": "\"How many times do I have to tell you?\"",
        "tryThis": "\"Telling isn't working for your brain. Let's try writing it down or setting a reminder.\""
      },
      {
        "when": "[NAME] seems to be drifting through the day with no urgency",
        "insteadOf": "\"You don't even care.\"",
        "tryThis": "\"I know you care. Your brain just doesn't send the urgency signal. Let's create one together.\""
      },
      {
        "when": "You've watched [NAME] socialise instead of completing a task",
        "insteadOf": "\"Stop chatting and get on with it.\"",
        "tryThis": "\"I can see you're enjoying the conversation. Let's finish this one thing first, then you can go back to it.\""
      },
      {
        "when": "[NAME] is standing in the middle of a room having clearly forgotten why [HE/SHE/THEY] went there",
        "insteadOf": "\"What are you even doing?\"",
        "tryThis": "\"Lost the thread? That happens. You were going to [specific task].\""
      },
      {
        "when": "The gentle drifting is wearing you down over time",
        "insteadOf": "\"You're never going to manage on your own.\"",
        "tryThis": "\"You're building skills every day. I'll be the scaffolding until you don't need it.\""
      },
      {
        "when": "[NAME]'s belongings are scattered and lost again",
        "insteadOf": "\"You're so careless with your things.\"",
        "tryThis": "\"Let's find one place for everything and make it a habit together.\""
      }
    ],
    "closingLine": "[NAME] is a Wandering Penguin. And the world needs more of them.",
    "whatHelps": {
      "aboutChild": "Build the scaffolding that [NAME]'s brain cannot yet build for itself. Written reminders, visual checklists, phone alarms, a parent who checks in rather than expects independent follow-through. Accept that the warmth and the drift are the same brain, and support both.",
      "hiddenGift": "Give the social warmth a purpose: peer mentoring, welcoming new students, caring for younger children. When [NAME]'s natural gift for connection has a legitimate role, it stops being a distraction and becomes a source of genuine pride and confidence.",
      "brain": "For inattention: keep instructions short, written, and visible. For executive function: provide one step at a time and check completion before giving the next. For social drive: build social connection into tasks where possible (working with a partner, teaching back, collaborative projects) rather than fighting against it.",
      "morning": "A visual checklist on the wall removes the need to hold the sequence in memory. Stay nearby during the routine, not to nag, but to gently re-anchor when the drift happens. Keep the environment low-stimulation and the decisions minimal.",
      "school": "Share this document with [NAME]'s teacher. The most helpful accommodations are: written instructions alongside verbal ones, a buddy system for tracking homework, permission to work with a partner where possible, and recognition that the drift is neurological, not attitudinal.",
      "afterSchool": "Give [NAME] time to talk about the social content of the day before asking for anything else. Fifteen minutes of genuine listening (\"Tell me about lunch\") fills the social processing need and frees up cognitive resources for homework afterward.",
      "bedtime": "Keep the routine gentle and predictable. [NAME] often settles more easily than other profiles, but benefits from a brief connection: \"Anything on your mind?\" followed by calm, quiet winding down.",
      "overwhelm": "Watch for the quiet signs: increased forgetting, longer drifts, subtle withdrawal. When you see them, reduce demands, increase support, and reconnect gently. [NAME] will not ask for help. You need to notice and offer it."
    }
  },
  "eagle": {
    "archetypeId": "eagle",
    "title": "THE SKY EAGLE",
    "innerVoiceQuote": "\"The whole picture comes easily to me. The pieces take more work.\" \u2014 [NAME]",
    "animalDescription": "The Eagle sees further than almost any creature on earth. From hundreds of metres above the ground, it spots movement invisible to every other animal. Patterns, distances, possibilities that don't exist at ground level. It was built for altitude, for vision, for seeing the whole landscape at once while everything else is focused on the patch of ground in front of it. This particular Eagle is the Sky one, always up there, scanning, processing, already three moves ahead. And the details at ground level, the small steps, the sequence, the careful execution, those are harder to see from up here.",
    "aboutChild": "[NAME] is the child who already knows how the story ends before anyone else has finished reading the first chapter. [HE/SHE/THEY] sees connections, possibilities, and outcomes with breathtaking speed, and then loses [HIS/HER/THEIR] shoes on the way out the door. The gap between what [NAME] can clearly see and what [NAME] can reliably produce is one of the hardest things about this profile, and also one of the most hopeful, because it means the capability is not in question. The delivery system is.\n[NAME] is often described as brilliant but frustrating, gifted but underperforming, full of potential but unable to follow through. Every one of these descriptions captures something real. And every one of them misses the central point: [NAME]'s brain was built for altitude, and the world keeps asking [HIM/HER/THEM] to operate at ground level.",
    "hiddenGift": "[NAME] sees things others don't. Not the details, the big things. The pattern underneath the surface. The connection between two ideas that nobody else thought to link. The outcome that is obvious to [HIM/HER/THEM] and invisible to everyone else. Genuine big-picture thinking combined with fast, instinctive processing is extraordinarily valuable and remarkably rare. Most people learn to see patterns through years of experience. [NAME] arrives at them intuitively, instantly, and with a confidence that is often completely justified.",
    "aboutBrain": "[NAME]'s profile is shaped by three areas where [HIS/HER/THEIR] brain works differently.",
    "brainSections": [
      {
        "title": "Attention",
        "content": "[NAME]'s attention system is wired for the big picture. [HIS/HER/THEIR] brain naturally gravitates toward patterns, concepts, and overarching themes, and disengages from routine, detail-oriented, or repetitive tasks with remarkable speed. This is not a failure of attention. It is attention operating at a different altitude. [NAME] is paying attention, just not to the thing the environment is asking [HIM/HER/THEM] to focus on. The worksheet, the step-by-step process, the careful sequential work, these feel like being asked to walk when [HIS/HER/THEIR] brain was built to fly."
      },
      {
        "title": "Hyperactivity",
        "content": "[NAME]'s nervous system operates at an elevated baseline speed. [HIS/HER/THEIR] brain processes information quickly, [HIS/HER/THEIR] body needs regular physical outlet, and [HIS/HER/THEIR] internal experience is one of constant forward momentum. This is not restlessness for the sake of it. It is a brain that requires movement and stimulation to stay regulated, and that finds enforced stillness genuinely costly."
      },
      {
        "title": "Executive Function",
        "content": "Executive function is the bridge between knowing and doing, between seeing the destination and navigating the steps to get there. For [NAME], this bridge is significantly behind [HIS/HER/THEIR] intellectual development. [HE/SHE/THEY] can see the endpoint with extraordinary clarity and genuinely cannot organise the steps to reach it. The vision is vivid. The execution requires support that [HIS/HER/THEIR] brain cannot yet provide on its own."
      }
    ],
    "dayInLife": {
      "morning": "[NAME] is already moving, already thinking, already processing by the time the day formally begins. [HE/SHE/THEY] is aware of what needs to happen, [HE/SHE/THEY] can see the morning routine as a whole, but [HE/SHE/THEY] cannot sequence the individual steps without support. The result is a child who is clearly awake, clearly active, clearly capable, and somehow not dressed, not fed, and not ready to leave. The vision of \"ready for school\" exists. The executive steps to get there do not fire in order.",
      "school": "[NAME] understands concepts brilliantly. [HE/SHE/THEY] grasps the principle behind the lesson faster than most of [HIS/HER/THEIR] peers and is already thinking about implications and connections while the class is still working through the basics. But the worksheet is unfinished. The instructions were half-followed. The details were skipped because the brain that sees the whole picture finds it genuinely difficult to care about the individual pieces. Teachers see inconsistency. What is actually happening is a brain operating at a different altitude than the task requires.",
      "afterSchool": "[NAME] arrives home still running high. The brain is still processing at speed, the body still needs outlet, and the executive function that was stretched thin all day is now depleted. This is when the gap between vision and execution is widest: [NAME] can tell you exactly what homework needs to be done, exactly why it matters, and exactly how [HE/SHE/THEY] would approach it, and then sit in front of it unable to begin. The engine is running. The steering needs support.",
      "bedtime": "[NAME]'s brain does not switch off easily at bedtime. It is still at altitude, still scanning, still making connections and forming ideas. This is not defiance or avoidance. It is a brain that was built for sustained high-speed processing and does not have a natural deceleration sequence. [NAME] may want to talk about ideas, ask big questions, or suddenly remember something important. The brain is still working. It needs a gentle, predictable landing sequence."
    },
    "drains": [
      "Detail-oriented tasks with no visible bigger purpose",
      "Long periods of required stillness with no physical outlet",
      "Multi-step instructions given all at once",
      "Being criticised for mistakes that feel minor",
      "Environments that reward compliance over capability",
      "Being asked to slow down without being given a reason",
      "Feeling like potential is going to waste"
    ],
    "fuels": [
      "Understanding the big picture before tackling the details",
      "Regular movement built into the structure of the day",
      "One clear step at a time delivered just before it is needed",
      "Acknowledgment of what went right alongside what needs improving",
      "Environments that make room for speed, vision and big ideas",
      "Understanding why slowing down serves the goal they care about",
      "Consistent external scaffolding that bridges vision and execution"
    ],
    "overwhelm": "[NAME]'s overwhelm arrives when the gap between what [HE/SHE/THEY] can see and what [HE/SHE/THEY] can produce becomes unbearable. [HE/SHE/THEY] knows exactly what the finished product should look like. [HE/SHE/THEY] can see it with complete clarity. And [HE/SHE/THEY] cannot get there. The frustration of being trapped at ground level when [HIS/HER/THEIR] brain lives at altitude is genuinely painful, and when it reaches its peak, [NAME] may erupt with frustration, shut down entirely, or abandon the task with a dismissive \"it's stupid\" that masks the real feeling: \"I can't make it match what I see.\"\nIn these moments, do not try to motivate with the big picture. [NAME] already sees it, that's the problem. Instead, shrink the task to the smallest possible step: \"Just write the first line.\" \"Just do this one part.\" Remove the weight of the whole and make the next action tiny, immediate, and achievable. Once [NAME] is moving, the momentum often carries. The hardest part is always the first step down from altitude.",
    "affirmations": [
      { "when": "When the gap between vision and execution is making [NAME] feel like a failure", "say": "\"You see things most people don't even know are there. That's not nothing, that's extraordinary.\"" },
      { "when": "When details have been missed and frustration is building", "say": "\"The big picture is your superpower. The details are just a skill we're building.\"" },
      { "when": "When [NAME] is restless and the environment is demanding stillness", "say": "\"Your body needs to move. That's not a problem, it's just how you're built.\"" },
      { "when": "When the world feels too slow and [NAME] feels trapped", "say": "\"I know your brain moves fast. We'll find the places where that speed is exactly what's needed.\"" },
      { "when": "At the end of a hard day when nothing seemed to land", "say": "\"The things you see, the way you think, those don't go away on a hard day. They're still there.\"" }
    ],
    "doNotSay": [
      {
        "when": "Details have been skipped and the work is incomplete",
        "insteadOf": "\"If you'd just pay attention to the details you'd be fine.\"",
        "tryThis": "\"You got the big idea. Let's go back and fill in the pieces together.\""
      },
      {
        "when": "[NAME] can't sit still and you're running out of patience",
        "insteadOf": "\"Why can't you just sit still and concentrate?\"",
        "tryThis": "\"Let's take a movement break and come back to this.\""
      },
      {
        "when": "The potential is obvious and the output is not matching it",
        "insteadOf": "\"You could be top of the class if you just tried.\"",
        "tryThis": "\"I see what you're capable of. Let's build the systems that let it show up.\""
      },
      {
        "when": "[NAME] has abandoned a task in frustration",
        "insteadOf": "\"You always give up when it gets hard.\"",
        "tryThis": "\"The task felt too far from what you could see in your head. Let's make it smaller.\""
      },
      {
        "when": "[NAME] is rushing through something and making careless mistakes",
        "insteadOf": "\"Slow down and do it properly.\"",
        "tryThis": "\"Your brain moves fast. Let's catch the pieces it skipped.\""
      }
    ],
    "closingLine": "[NAME] is a Sky Eagle. And the world needs more of them.",
    "whatHelps": {
      "aboutChild": "Always start with the big picture. Tell [NAME] why something matters before asking [HIM/HER/THEM] to do it. Then deliver the steps one at a time, just before they are needed. The vision is the motivation. The scaffolding is the bridge. Provide both.",
      "hiddenGift": "Give the big-picture thinking real problems to solve. Let [NAME] strategise, plan, debate, design. When [HIS/HER/THEIR] mind has a worthy challenge, the focus and the energy align naturally. Protect those moments fiercely.",
      "brain": "For attention: connect every detail-level task to the bigger picture it serves. For hyperactivity: build movement into the day as a feature, not a concession. For executive function: one step at a time, delivered just before it is needed, with a calm adult nearby to bridge the gap.",
      "morning": "Tell [NAME] the plan for the morning in one sentence (\"We need to be out the door by 8:15\"), then deliver each step individually. A visual checklist helps. Movement between steps (star jumps, a quick run up the stairs) helps the body regulate and the brain reset for the next task.",
      "school": "Ask the school to connect tasks to bigger concepts before diving into details. A brief \"here's why this matters\" before a worksheet changes everything for [NAME]. Request permission for movement breaks and fidget tools, and recognise that incomplete worksheets may reflect altitude, not absence.",
      "afterSchool": "Give [NAME] a physical outlet first: 15 minutes of hard exercise before homework. Then sit with [HIM/HER/THEM] for the first step of each task. Once moving, [NAME] often doesn't need you. It's the start that needs support.",
      "bedtime": "Build a gentle landing sequence: dim lights, calm music, a brief conversation about the day's ideas (not problems), and a predictable routine. Let [NAME]'s brain come down gradually rather than demanding an abrupt stop.",
      "overwhelm": "Shrink the task. Remove the weight of the whole. Make the next action tiny, immediate, and achievable. \"Just this one part. Nothing else.\" Once [NAME] is moving, the momentum usually carries. The hardest part is always the first step."
    }
  },
  "bear": {
    "archetypeId": "bear",
    "title": "THE BRAVE BEAR",
    "innerVoiceQuote": "\"Sometimes my energy gets ahead of my good ideas.\" \u2014 [NAME]",
    "animalDescription": "The Bear is one of the most powerful creatures in the natural world, strong, fast, instinctive, and capable of extraordinary tenderness. It can run at speeds that surprise everything around it, climb what looks unclimbable, and protect what it loves with a ferocity that stops the world in its tracks. This particular Bear is the Brave one, brave because [HE/SHE/THEY] faces every single day with a brain that is running too fast, feeling too much, losing track of too many things, and struggling to organise any of it, and [HE/SHE/THEY] keeps going anyway.",
    "aboutChild": "[NAME] is the child who lives at full volume. [HE/SHE/THEY] moves fast, feels hard, forgets often, and reacts before thinking. [HIS/HER/THEIR] brain is running four systems at high speed with none of them fully under control yet. What looks like a whirlwind from the outside is, from [NAME]'s perspective, just normal: this is the only speed [HIS/HER/THEIR] brain knows.\nThe adults around [NAME] are often exhausted, and understandably so. The combination of physical energy, emotional intensity, executive disorganisation, and attentional inconsistency means that every day brings multiple moments where something has gone wrong, been forgotten, been broken, or been said too loudly. But [NAME] is not trying to be difficult. [HE/SHE/THEY] is trying to navigate a world that moves at a speed [HIS/HER/THEIR] brain cannot quite match, with tools that are not yet fully built.",
    "hiddenGift": "[NAME] has an extraordinary combination of qualities: energetic, passionate, emotionally courageous, and physically capable. [HE/SHE/THEY] throws [HIMSELF/HERSELF/THEMSELVES] into things with a wholeness that most people lose by adulthood. The energy that exhausts you today is the same energy that will power [HIM/HER/THEM] through challenges most people would quit. The emotional intensity that creates the hardest moments is the same intensity that makes [NAME] fiercely loyal, deeply caring, and impossible to ignore. These are not separate qualities. They are the same quality, expressed in different moments.",
    "aboutBrain": "[NAME]'s profile is shaped by four areas where [HIS/HER/THEIR] brain works differently, and all four interact to create the daily experience that defines this profile.",
    "brainSections": [
      {
        "title": "Hyperactivity",
        "content": "[NAME]'s body operates at a consistently elevated baseline. Movement is not optional, it is neurologically necessary. [HIS/HER/THEIR] brain requires physical activity to stay regulated, and enforced stillness is not restful but genuinely effortful. The fidgeting, the running, the inability to sit through a meal without moving are not choices. They are [NAME]'s nervous system doing what it needs to do to stay functional."
      },
      {
        "title": "Inattention",
        "content": "[NAME]'s attention system is inconsistent. It can lock onto something fascinating with extraordinary intensity and then completely disconnect from something routine without warning. Instructions are heard but not encoded. Steps are started but not finished. Details are noticed and then immediately lost. The brain is not absent. It is present in unpredictable bursts that make sustained, sequential work genuinely difficult."
      },
      {
        "title": "Emotional Intensity",
        "content": "[NAME]'s emotional responses arrive faster, hit harder, and last longer than [HIS/HER/THEIR] logical brain can manage. There is almost no gap between trigger and reaction. Frustration becomes fury. Disappointment becomes despair. Excitement becomes explosion. This is not a behavioural choice. It is a neurological pattern in which the emotional system consistently outpaces the moderating systems that would normally slow it down."
      },
      {
        "title": "Executive Function",
        "content": "[NAME]'s executive function, the brain's capacity to plan, sequence, organise, and regulate, is the system that would normally coordinate all of the above into managed, directed behaviour. For [NAME], this system is still developing significantly behind [HIS/HER/THEIR] age. The result is that when the body moves, the brain misses information. When something goes wrong, the emotional system floods. And when the emotional system floods, the executive function that would normally organise a recovery simply cannot keep up. The loop is reliable and painful: body moves \u2192 brain misses info \u2192 something goes wrong \u2192 emotional system floods \u2192 executive function can't organise recovery \u2192 erupts or shuts down."
      }
    ],
    "dayInLife": {
      "morning": "The engine is already running before [NAME] opens [HIS/HER/THEIR] eyes. The body is moving, the brain is active, and the morning routine, the one thing that requires the most executive control, arrives at the moment when [NAME] has the least of it. Getting dressed, eating, packing, and leaving the house requires sequential, organised, calm effort. [NAME] has energy in abundance. What [HE/SHE/THEY] does not have is the internal system to point that energy at the right tasks in the right order.",
      "school": "The classroom demands everything [NAME] struggles with most: sitting still, sustaining attention, managing frustration, waiting for a turn, following multi-step instructions, and producing organised output. [NAME] is not failing at school because [HE/SHE/THEY] lacks intelligence or motivation. [HE/SHE/THEY] is failing at the specific set of demands that happen to be the exact areas where [HIS/HER/THEIR] brain needs the most support. The mismatch between what school asks for and what [NAME] can currently deliver is daily, visible, and painful.",
      "afterSchool": "After school is physical chaos and emotional release. Everything that was held in, sat on, and suppressed during the school day comes out at once. The body needs to discharge. The emotions need to land. The executive function that was stretched beyond its limits all day has nothing left. This is not [NAME] being difficult. This is [NAME] being a Brave Bear who has been in a cage for six hours and has finally been let out.",
      "bedtime": "Bedtime is the hardest transition of the day because it asks [NAME] to do the one thing [HIS/HER/THEIR] nervous system finds most difficult: stop. Be still. Lie still. The body that has been in motion all day does not have a natural deceleration sequence. The brain that has been processing at speed does not have an off switch. The emotions that have been accumulating have nowhere left to go except into the quiet, and the quiet amplifies everything."
    },
    "drains": [
      "Being required to sit still for extended periods",
      "Multi-step verbal instructions",
      "Consequences delivered in anger or frustration",
      "Being told they are \"bad\" or \"naughty\"",
      "Tasks that feel too big or too long",
      "Unexpected changes to the plan",
      "Being compared to calmer, more organised siblings or peers",
      "Environments with no physical outlet"
    ],
    "fuels": [
      "Regular movement breaks and physical outlets built into the day",
      "One step at a time with visual support",
      "Calm, private, brief consequences with a clear path back",
      "Being told their brain works differently, not defectively",
      "Tasks broken into short, visible chunks with breaks",
      "Advance warning and predictable routines",
      "Recognition of their unique strengths \u2014 energy, courage, passion",
      "Access to movement, sport, physical play every single day"
    ],
    "overwhelm": "[NAME]'s overwhelm arrives as escalation: bigger, louder, faster, more. The body moves more. The voice gets louder. The emotions intensify. The behaviour becomes more erratic. This is not [NAME] choosing to be difficult. It is a nervous system that has reached its limit and is discharging through the only channels available: physical movement and emotional expression.\nIn these moments, do not match the escalation. Do not raise your voice. Do not add consequences. Do not demand stillness. All of these will increase the load on a system that is already past its capacity. Instead, reduce demands to zero. If possible, provide a physical outlet: a run outside, a punching bag, jumping, anything that lets the body discharge safely. Speak quietly, move slowly, and stay nearby without crowding. Once the physical storm passes, [NAME] will return to baseline faster than you might expect, often ready to reconnect and try again with genuine willingness. The recovery, when handled well, is remarkably quick.",
    "affirmations": [
      { "when": "After an eruption, when [NAME] is coming back to baseline and shame is arriving", "say": "\"That was your brain, not your character. You are not a bad kid.\"" },
      { "when": "When the energy and intensity are wearing everyone out, including [NAME]", "say": "\"Your energy is one of the best things about you. It just needs the right place to go.\"" },
      { "when": "When [NAME] has been told [HE/SHE/THEY] is too much, too loud, or too wild", "say": "\"You are not too much. The world just hasn't caught up with your speed yet.\"" },
      { "when": "When things have gone wrong again and [NAME] feels like [HE/SHE/THEY] can't do anything right", "say": "\"You did a hundred things today. Some of them went wrong. Most of them didn't. I noticed.\"" },
      { "when": "When the courage it takes to face another day is invisible to everyone else", "say": "\"I see how brave you are. Every single day. And I am so proud of you.\"" },
      { "when": "When [NAME] is frustrated with [HIMSELF/HERSELF/THEMSELVES] for losing control again", "say": "\"Your brain runs fast and feels big. We're building the systems to match. It takes time.\"" }
    ],
    "doNotSay": [
      {
        "when": "[NAME] has erupted and the situation has escalated",
        "insteadOf": "\"You're being so naughty.\"",
        "tryThis": "\"Your brain got too full. Let's get some of that energy out safely.\""
      },
      {
        "when": "The physical energy is relentless and you're exhausted",
        "insteadOf": "\"Why can't you just calm down?\"",
        "tryThis": "\"Your body needs to move. Let's find somewhere for that energy to go.\""
      },
      {
        "when": "[NAME] has reacted before thinking and something has gone wrong",
        "insteadOf": "\"Why didn't you think before you did that?\"",
        "tryThis": "\"Your body moved before your brain caught up. That happens. Let's fix what we can.\""
      },
      {
        "when": "You're comparing [NAME] to a calmer child and it slips out",
        "insteadOf": "\"Why can't you be more like [sibling/friend]?\"",
        "tryThis": "\"You're built differently. That's not worse, it's just different, and it needs different support.\""
      },
      {
        "when": "The intensity feels unmanageable and you're at your limit",
        "insteadOf": "\"I can't deal with you anymore.\"",
        "tryThis": "\"I need a minute to reset. Then I'm coming back and we'll figure this out together.\""
      },
      {
        "when": "[NAME] has forgotten something important in the chaos",
        "insteadOf": "\"You never remember anything.\"",
        "tryThis": "\"Your brain was busy with a lot of things. Let's put a system in place so this one doesn't slip again.\""
      }
    ],
    "closingLine": "[NAME] is a Brave Bear. And the world needs more of them.",
    "whatHelps": {
      "aboutChild": "Channel, don't suppress. Build movement into every part of the day as a feature, not a concession. One instruction at a time. Short tasks with visible endpoints and physical breaks between them. And when things go wrong, respond to the brain, not the behaviour. The behaviour is the output. The brain is where the support needs to go.",
      "hiddenGift": "Find the environments where the energy, the passion, and the courage are assets: sport, outdoor education, physical challenges, performance, leadership roles in active settings. When [NAME] is in the right context, the support needs look completely different because the strengths are doing the work.",
      "brain": "Physical activity before cognitive demands. Always. A 15-minute burst of intense movement (running, trampolining, climbing) before homework, before difficult conversations, before anything that requires sitting and concentrating. This temporarily raises the dopamine levels that [NAME]'s brain is short on and makes the next 30-45 minutes significantly more manageable.",
      "morning": "A visual routine removes the need for verbal instructions and the conflict they create. Lay everything out the night before. Build in a physical outlet before leaving the house if possible (even five minutes of jumping or running). Keep the morning calm, predictable, and as decision-free as possible.",
      "school": "Share this document with [NAME]'s teacher. The key accommodations: regular movement breaks, a fidget tool, permission to stand during independent work, one instruction at a time, and a private, pre-agreed signal when [NAME] is reaching [HIS/HER/THEIR] limit. The goal is to prevent the escalation, not manage it after it has arrived.",
      "afterSchool": "Give [NAME] 20-30 minutes of unrestricted physical activity before any demands arrive. Trampoline, bike, run, whatever gets the body moving at intensity. This is not a reward. It is a neurological necessity that makes everything that follows more possible.",
      "bedtime": "Start the wind-down 30-45 minutes before bed. Cut screens, roughhousing, and stimulating content. Use the same sequence every night: physical cool-down, bath or shower, quiet time (reading together, calm music), then lights out. If [NAME] still can't settle, a weighted blanket or a quiet audiobook can give the brain something to hold onto.",
      "overwhelm": "Do not match the escalation. Lower your voice, reduce demands, provide a physical outlet. Once the storm passes, reconnect gently and briefly: \"That was hard. I'm here. We're okay.\" Save the conversation for later. The learning happens in the calm, not in the chaos."
    }
  },
  "bee": {
    "archetypeId": "bee",
    "title": "THE BUZZY BEE",
    "innerVoiceQuote": "\"My brain goes where the energy is, and the energy is usually people.\" \u2014 [NAME]",
    "animalDescription": "The Bee is one of nature's most essential creatures, constantly in motion, visiting flower after flower, carrying energy and life wherever it goes. It doesn't choose to be busy. It is built this way, wired for movement, for connection, for the relentless transfer of something vital from one place to the next. The Buzzy Bee is the one who is everywhere at once, talking to everyone, starting everything, finishing almost nothing, and somehow making the whole garden more vibrant just by being in it.",
    "aboutChild": "[NAME] is the child who knows everyone's name, is in the middle of every conversation, and has forgotten what [HE/SHE/THEY] was supposed to be doing three times since this sentence started. Socially magnetic, warm, funny, energetic, genuinely interested in people, and completely unable to stay on task when there is a person in the room to connect with. The social drive is so strong that every person in the room is more interesting than whatever is on the whiteboard.\n[NAME]'s energy is genuine and infectious. [HE/SHE/THEY] fills any space [HE/SHE/THEY] enters with warmth and movement and conversation. The adults around [HIM/HER/THEM] find this both endearing and exhausting, often in the same moment. The challenge is not the energy itself, it is that the energy is almost entirely directed toward social connection, and the executive systems that would normally help [NAME] manage, direct, and contain that energy are still significantly behind.",
    "hiddenGift": "[NAME] is a connector. [HE/SHE/THEY] brings people together, starts conversations that wouldn't have happened otherwise, introduces children who would never have met, and fills any room with energy that is genuinely infectious. The social intelligence is real, the warmth is real, and the ability to make people feel included and energised is a gift that cannot be taught or manufactured. The energy that teachers find exhausting is the same energy that will make [NAME] extraordinary in the right context: leadership, teamwork, communication, community-building, performance.",
    "aboutBrain": "[NAME]'s profile is shaped by four areas where [HIS/HER/THEIR] brain works differently, and all four feed into the buzzing, connecting, starting-everything-finishing-nothing pattern that defines [HIS/HER/THEIR] daily experience.",
    "brainSections": [
      {
        "title": "Hyperactivity",
        "content": "[NAME]'s body and brain are in constant motion. But the hyperactivity is not just physical, it is verbal. [NAME] talks constantly, not because [HE/SHE/THEY] chooses to, but because [HIS/HER/THEIR] brain processes the world through language and social interaction. The talking is not the problem. It is the brain's primary regulation strategy, and suppressing it without providing an alternative is like removing a tool without replacing it."
      },
      {
        "title": "Inattention",
        "content": "[NAME]'s brain disengages from non-social tasks with remarkable speed. It is not that [HE/SHE/THEY] cannot pay attention. It is that [HIS/HER/THEIR] brain allocates attention according to social energy rather than task importance. The lesson on the whiteboard is competing with the person sitting next to [HIM/HER/THEM], and the person wins every time, not because [NAME] is being rude, but because [HIS/HER/THEIR] brain is wired to prioritise connection over content."
      },
      {
        "title": "Executive Function",
        "content": "[NAME]'s executive system is still developing significantly slower than [HIS/HER/THEIR] social and verbal abilities. The capacity to plan, organise, sequence, initiate, and complete tasks independently is well behind what the classroom and the home expect. [NAME] can talk brilliantly about what needs to happen and genuinely cannot make [HIMSELF/HERSELF/THEMSELVES] do it without external support."
      },
      {
        "title": "Social Drive",
        "content": "[NAME] is drawn to people with a joyfulness and an intensity that is both [HIS/HER/THEIR] greatest strength and [HIS/HER/THEIR] most significant complicating factor. The social drive creates the energy. The hyperactivity amplifies it. The inattention redirects it away from tasks. And the executive function cannot organise the recovery. The loop is reliable: buzzes toward social connection \u2192 attention drifts or hyperactivity takes over \u2192 misses a cue, talks too much, does something impulsive \u2192 social interaction stumbles \u2192 executive function can't organise repair \u2192 buzzes to next connection."
      }
    ],
    "dayInLife": {
      "morning": "[NAME] is already buzzing before [HIS/HER/THEIR] feet hit the floor. The mouth is talking, the body is moving, and the morning routine is the last thing on [HIS/HER/THEIR] mind. Every person in the house is a potential conversation. Every interaction is more interesting than getting dressed. The morning routine requires sequential, quiet, independent execution, and [NAME] is built for none of those things. What helps: a visual checklist, one step at a time, and as few conversations as possible until the routine is done. Save the social connection for after the tasks are complete.",
      "school": "The classroom is where the mismatch is sharpest. [NAME] is socially energised in an environment that demands quiet, independent, sustained focus. [HE/SHE/THEY] is drawn to every person in the room while being asked to focus on the task at [HIS/HER/THEIR] desk. The result is a child who is constantly talking, constantly connecting, constantly starting and not finishing, and genuinely unable to understand why this keeps causing problems. [NAME] is not trying to disrupt. [HE/SHE/THEY] is trying to connect, and the environment is not set up for that.",
      "afterSchool": "[NAME] arrives home bursting with social content: who said what, who did what, who is friends with whom, what happened at lunch. This is not avoidance. It is [NAME]'s social brain doing the work it finds most important. The talking, the sharing, the processing of the day's social interactions is genuinely restorative for [NAME]. Once it has been given space, [HE/SHE/THEY] is often more available for other demands. Physical release alongside social sharing is the ideal combination.",
      "bedtime": "Bedtime is the hardest wind-down of the day. [NAME]'s brain is still connecting, still processing, still buzzing with the social energy of the day. The body that has been in motion all day does not want to stop. The mouth that has been talking all day has not run out of things to say. The transition to quiet and stillness requires a gradual, predictable deceleration that the brain cannot generate on its own."
    },
    "drains": [
      "Extended periods of sitting still and working in silence",
      "Being told to stop talking without an alternative outlet",
      "Multi-step instructions delivered verbally once",
      "Being responsible for logistics they cannot manage yet",
      "Isolation as punishment",
      "Being labelled \"the disruptive one\"",
      "Open-ended tasks with no visible endpoint",
      "Environments with no people and no stimulation"
    ],
    "fuels": [
      "Movement breaks, physical outlets, and active learning",
      "A specific, legitimate time when talking will be welcomed",
      "One step at a time with visual support",
      "External scaffolding \u2014 checklists, reminders, an adult who helps organise",
      "Structured social time as reward and regulation",
      "Being recognised as the connector, the energiser",
      "Clear, short tasks with a timer and a finish line",
      "Collaborative, active, social environments where energy is an asset"
    ],
    "overwhelm": "[NAME]'s overwhelm arrives as amplification. Everything gets bigger: the talking gets louder, the movement gets faster, the behaviour gets more erratic, and the ability to read social cues, which is normally one of [NAME]'s strengths, starts to fail. [HE/SHE/THEY] talks too much, stands too close, misses the signal that someone has had enough. The social intelligence that normally guides [HIM/HER/THEM] is offline, and what remains is pure energy with no direction.\nIn these moments, do not isolate [NAME]. Isolation removes the one thing that regulates [HIM/HER/THEM]: connection. Instead, redirect the energy. A physical task with a social component (\"Help me carry these to the kitchen\"), a brief one-on-one conversation (\"Tell me one thing about today\"), or a structured physical outlet (\"Ten star jumps, then we talk\") can bring [NAME] back to baseline faster than any consequence. Once the energy has been channeled, [NAME] is often immediately ready to try again.",
    "affirmations": [
      { "when": "When [NAME] has been told to stop talking and feels silenced", "say": "\"Your voice matters. We just need to find the right moment for it.\"" },
      { "when": "When the energy has caused a problem and [NAME] feels like [HE/SHE/THEY] is always in trouble", "say": "\"Your energy is not the problem. We just need to point it somewhere good.\"" },
      { "when": "When [NAME] has been labelled the disruptive one and it's starting to stick", "say": "\"You are the one who makes the room come alive. That is a gift, not a problem.\"" },
      { "when": "When social connection has come at the expense of a task and [NAME] feels torn", "say": "\"Caring about people is one of your best qualities. We'll find time for both.\"" },
      { "when": "When [NAME] is frustrated that [HIS/HER/THEIR] brain won't let [HIM/HER/THEM] sit still and focus", "say": "\"Your brain is built for movement and connection. That's not broken, that's brilliant in the right setting.\"" },
      { "when": "When the day has been full of corrections and very little praise", "say": "\"I noticed the good things today too. You brought energy to everything you touched.\"" },
      { "when": "When [NAME] feels like [HE/SHE/THEY] doesn't fit the way school wants [HIM/HER/THEM] to", "say": "\"School isn't set up for your kind of brain yet. That doesn't mean your brain is wrong.\"" },
      { "when": "At the end of a hard day when the buzzing caused more problems than connections", "say": "\"Tomorrow is a new day with new people to connect with. And you'll be great at it.\"" }
    ],
    "doNotSay": [
      {
        "when": "[NAME] is talking when [HE/SHE/THEY] should be working",
        "insteadOf": "\"Stop talking.\"",
        "tryThis": "\"I can see you have things to say. Let's finish this first, and then I want to hear all of it.\""
      },
      {
        "when": "The energy is disrupting everyone around [HIM/HER/THEM]",
        "insteadOf": "\"You're always disrupting the class.\"",
        "tryThis": "\"Your energy is big right now. Let's find a way to use it.\""
      },
      {
        "when": "[NAME] has been socialising instead of completing a task",
        "insteadOf": "\"You spend all your time talking and none of it working.\"",
        "tryThis": "\"People are your thing. Let's get this done first, then you can connect.\""
      },
      {
        "when": "You're exhausted by the constant noise and movement",
        "insteadOf": "\"You're exhausting.\"",
        "tryThis": "\"I need a quiet moment. Then I'm all yours.\""
      },
      {
        "when": "[NAME] can't sit still and it's been a long day for everyone",
        "insteadOf": "\"Why can't you just sit down and be quiet?\"",
        "tryThis": "\"Your body needs to move. Let's find the right place for that.\""
      },
      {
        "when": "The impulsive social behaviour has caused a problem",
        "insteadOf": "\"Think before you speak.\"",
        "tryThis": "\"That came out before your brain caught up. Let's talk about what you meant.\""
      },
      {
        "when": "Isolation has been used as a consequence and it's making things worse",
        "insteadOf": "\"Go to your room until you can behave.\"",
        "tryThis": "\"Let's take a break together. Then we'll reset.\""
      },
      {
        "when": "Nothing has been finished and the day is almost over",
        "insteadOf": "\"You haven't done a single thing today.\"",
        "tryThis": "\"Let's pick one thing and finish just that. One thing done is a win.\""
      }
    ],
    "closingLine": "[NAME] is a Buzzy Bee. And the world needs more of them.",
    "whatHelps": {
      "aboutChild": "Don't fight the social drive, use it. Build social connection into tasks wherever possible: working with a partner, teaching back, collaborative projects. Use structured social time as a reward and a regulation tool. And provide the external scaffolding (checklists, timers, one step at a time) that [NAME]'s executive system cannot yet generate independently.",
      "hiddenGift": "Give [NAME] a legitimate role as a connector: greeting new students, leading group activities, organising social events, mentoring younger children. When the social energy has a purpose, it stops being a problem and becomes a genuine leadership quality.",
      "brain": "For hyperactivity: movement breaks built into the day as a feature, not a concession. For inattention: keep non-social tasks short, timed, and immediately followed by a social reward. For executive function: one step at a time, visual support, and an adult nearby. For social drive: build connection into the structure rather than treating it as a distraction.",
      "morning": "A visual checklist, minimal conversation, one step at a time. Save the social connection for after the routine is done. Use it as a reward: \"Get dressed and then tell me about your dream.\" The social energy is the fuel. Use it to power the morning, not derail it.",
      "school": "Share this document with [NAME]'s teacher. The key accommodations: a designated time when talking is legitimate (partner work, class discussion), a movement break every 20-30 minutes, a visual timer for independent tasks, and recognition that the social energy is a strength that needs channeling, not suppression.",
      "afterSchool": "Give [NAME] 15-20 minutes of social sharing and physical release before any demands. Let [HIM/HER/THEM] talk about the day while moving (a walk, a bike ride, a trampoline session). Once the social and physical needs have been met, homework becomes more possible.",
      "bedtime": "Start winding down 30 minutes before bed. Reduce social stimulation gradually: from conversation to quiet reading to lights out. A calm, one-on-one connection (not a group, not a screen) gives the social brain something to settle on. Keep the routine the same every night.",
      "overwhelm": "Do not isolate. Redirect. A physical task, a brief one-on-one conversation, a structured outlet. Once the energy has been channeled, [NAME] is usually ready to try again immediately. The recovery is fast when the connection is maintained."
    }
  },
  "red_panda": {
    "archetypeId": "red_panda",
    "title": "THE RED PANDA",
    "innerVoiceQuote": "\"I come close gently, because the world can feel loud before it feels safe.\" \u2014 [NAME]",
    "animalDescription": "The Red Panda lives high in the quiet canopy of mountain forests, moving slowly, deliberately, almost always alone or in a pair. It does not seek the centre of attention. It watches, listens, and takes in the world from a safe distance before deciding whether to come closer. But when it does come closer, the connection is extraordinarily gentle, warm, and complete. This particular Red Panda is drawn to people, fascinated by friendships, genuinely longing to be part of the group. But the sensory reality of being close to other people overwhelms the nervous system before the connection can take root.",
    "aboutChild": "[NAME] is the child who lights up when invited to a birthday party and then spends most of it sitting on the edge. Not shyness, [HE/SHE/THEY] genuinely wants to be there. But the moment [HE/SHE/THEY] walked through the door and the noise, lights, movement, and unpredictability hit [HIS/HER/THEIR] sensory system, the excitement was replaced by distress. [NAME] is caught between two competing needs: connection and sensory safety. Both are real, both are urgent, and they pull in opposite directions.\nThe adults around [NAME] often misread this as shyness, antisocial behaviour, or a lack of interest in other children. None of these are true. [NAME] wants to connect as much as any child. More, in some ways, because [HE/SHE/THEY] has spent so much time watching from the edge that [HE/SHE/THEY] understands the value of connection with a clarity that children who have it easily never develop.",
    "hiddenGift": "The same sensitivity that makes crowds overwhelming makes [NAME] one of the most attuned, empathetic, and emotionally perceptive children you will ever meet. [HE/SHE/THEY] reads people with extraordinary accuracy. [HE/SHE/THEY] notices when someone is sad before they've said a word. [HE/SHE/THEY] picks up on tone, expression, and body language that most adults miss. In one-on-one settings, [NAME] is warm, funny, generous, and profoundly good company. [HE/SHE/THEY] does not need a wide social circle. [HE/SHE/THEY] needs a small number of people who understand [HIS/HER/THEIR] pace and value depth over volume.",
    "aboutBrain": "[NAME]'s profile is shaped by two areas where [HIS/HER/THEIR] brain works differently, and understanding how they interact transforms the way you interpret [HIS/HER/THEIR] social behaviour.",
    "brainSections": [
      {
        "title": "Sensory Processing",
        "content": "[NAME]'s sensory processing operates at a significantly higher intensity than most children [HIS/HER/THEIR] age. Sound, light, movement, touch, and the unpredictable energy of groups are all processed at a volume that is genuinely overwhelming. This is not a preference or a personality trait. It is a neurological reality: [NAME]'s nervous system receives more sensory information, processes it more deeply, and reaches its limit faster than the systems of [HIS/HER/THEIR] peers. Environments that feel perfectly normal to twenty other children can feel, to [NAME], like standing in the middle of a storm."
      },
      {
        "title": "Social Awareness",
        "content": "[NAME]'s social awareness is genuinely high. [HE/SHE/THEY] reads social cues accurately, understands group dynamics intuitively, and is emotionally attuned to the people around [HIM/HER/THEM] with a precision that is rare in a child. But here is the critical point: this social skill can only operate in low-sensory environments. In a quiet room with one friend, [NAME] is socially confident, verbally skilled, and genuinely warm. In a noisy room with twenty children, [NAME] appears withdrawn, disconnected, and unable to participate. The social capability has not changed. The sensory environment has made it inaccessible."
      }
    ],
    "dayInLife": {
      "morning": "[NAME] needs a gentle start. The sensory demands of the morning, bright lights, loud voices, the texture of clothing, the unpredictability of siblings, are all processed at high intensity. A calm, predictable routine with minimal sensory surprises gives [NAME]'s nervous system the best possible start. Rushing, shouting, sudden changes, or a chaotic environment will fill [NAME]'s sensory cup before the day has even begun.",
      "school": "School is where the tension between social desire and sensory limits is most visible. [NAME] wants to be part of things. [HE/SHE/THEY] watches the group with genuine longing, understands exactly what is happening socially, and may even move toward the edge of the group. But the noise, the movement, the unpredictability of twenty-five children in a confined space overwhelm [HIS/HER/THEIR] sensory system before the social connection can take hold. Teachers see a withdrawn child. What is actually happening is a child whose social system is fully operational but whose sensory system has shut the door.",
      "afterSchool": "[NAME] arrives home depleted. The sensory cost of the school day, hours of processing noise, light, movement, and social energy at high intensity, has used everything [HE/SHE/THEY] had. [NAME] needs low-sensory recovery: a quiet room, familiar textures, minimal demands, and time. Do not front-load the afternoon with activities, homework, or social plans. The tank is empty and needs to refill before anything else is possible.",
      "bedtime": "Bedtime is often the best part of [NAME]'s day. The house is quiet. The stimulation is low. The connection is one-on-one. This is the environment where [NAME]'s social warmth, verbal skill, and emotional depth are fully available. Protect this time fiercely. A calm, unhurried bedtime with genuine connection is one of the most powerful tools you have for building [NAME]'s confidence, processing the day, and strengthening your relationship."
    },
    "drains": [
      "Crowded, noisy social environments",
      "Being forced to join group activities without a way out",
      "Being labelled as shy, antisocial, or unfriendly",
      "Social situations with no advance warning or preparation",
      "Losing friendships because they can't sustain the sensory cost",
      "Feeling like something is wrong with them for needing to leave",
      "Environments where participation is the only measure of engagement"
    ],
    "fuels": [
      "One-on-one or small-group connection in quiet settings",
      "The option to participate at their own pace, with a dignified exit available",
      "Adults who understand that the desire for connection and the need for sensory safety can coexist",
      "Knowing what to expect before arriving, including who will be there and how long it will last",
      "Support in finding friends who match their pace and value depth over volume",
      "Being told that leaving when overwhelmed is self-awareness, not failure",
      "Adults who recognise that watching from the edge is also a form of being there"
    ],
    "overwhelm": "[NAME]'s overwhelm arrives as withdrawal. When the sensory load exceeds what [HIS/HER/THEIR] nervous system can process, [NAME] retreats, not angrily, not dramatically, but quietly and completely. [HE/SHE/THEY] may go silent, move to the edge of the room, cover [HIS/HER/THEIR] ears, or simply leave. This is not rudeness or rejection. It is a nervous system that has reached its limit and is protecting itself the only way it knows how.\nThe danger is that adults interpret this withdrawal as a choice or a behaviour to be corrected. Pushing [NAME] back into the environment that overwhelmed [HIM/HER/THEM] will make the overwhelm worse and the recovery longer. What [NAME] needs is permission to withdraw, a safe space to recover, and a calm adult who understands that the withdrawal is the coping strategy, not the problem. Once the sensory system has had time to reset, [NAME] will often return on [HIS/HER/THEIR] own, ready to try again at [HIS/HER/THEIR] own pace.",
    "affirmations": [
      { "when": "When [NAME] has left a social situation and feels like [HE/SHE/THEY] failed", "say": "\"Leaving when it's too much is one of the smartest things you can do. I'm proud of you for knowing yourself that well.\"" },
      { "when": "When [NAME] has been called shy and feels like something is wrong with [HIM/HER/THEM]", "say": "\"You're not shy. You're careful. And there's nothing wrong with that.\"" },
      { "when": "When the desire to connect is visible but the sensory cost is too high", "say": "\"I know you want to be in there. We'll find the way that works for you.\"" },
      { "when": "When [NAME] has had a genuinely good one-on-one interaction and needs to hear it mattered", "say": "\"The way you are with people, one person at a time, is one of the most special things about you.\"" },
      { "when": "When the world feels too loud and [NAME] feels too different", "say": "\"Your sensitivity is not a weakness. It's how you see things other people miss.\"" },
      { "when": "At the end of a day when the sensory world won and connection lost", "say": "\"Some days are louder than your brain can handle. That's not your fault. Tomorrow we try again.\"" }
    ],
    "doNotSay": [
      {
        "when": "[NAME] is sitting on the edge of a group activity watching but not joining",
        "insteadOf": "\"Just go and join in, you'll be fine.\"",
        "tryThis": "\"I can see you're watching. That's okay. You can join when you're ready, or not. Both are fine.\""
      },
      {
        "when": "[NAME] wants to leave a social situation",
        "insteadOf": "\"We just got here, you can't leave already.\"",
        "tryThis": "\"If it's too much, let's step outside for a minute and see how you feel.\""
      },
      {
        "when": "[NAME] has been quiet all day and you're worried about socialisation",
        "insteadOf": "\"You need to make more friends.\"",
        "tryThis": "\"You have your own way of connecting with people. Let's find the settings where that works best.\""
      },
      {
        "when": "[NAME] is covering [HIS/HER/THEIR] ears or retreating from noise",
        "insteadOf": "\"It's not that loud, stop being dramatic.\"",
        "tryThis": "\"I believe you that it's too loud. Let's find somewhere quieter.\""
      },
      {
        "when": "You're frustrated that [NAME] can't do what other children seem to manage easily",
        "insteadOf": "\"Other kids cope with this just fine.\"",
        "tryThis": "\"Your nervous system works differently. That doesn't make you less capable, it just means you need different support.\""
      }
    ],
    "closingLine": "[NAME] is a Red Panda. And the world needs more of them.",
    "whatHelps": {
      "aboutChild": "The single most important thing is to stop measuring [NAME]'s social success by the same standards as other children. [HE/SHE/THEY] does not need a wide social circle. [HE/SHE/THEY] needs one or two friends who match [HIS/HER/THEIR] pace. Create opportunities for low-sensory social connection: one friend at a time, in a quiet setting, with a clear plan and an exit strategy.",
      "hiddenGift": "Give [NAME]'s perceptiveness a role: caring for animals, creating art, writing stories, one-on-one mentoring. The empathy and emotional depth are extraordinary and need legitimate outlets. In the right setting, [NAME] is one of the most socially skilled children in the room.",
      "brain": "Reduce sensory load first, then ask for social engagement. Never the other way around. Identify [NAME]'s specific sensory triggers (noise, crowds, lighting, textures) and reduce them proactively. Noise-cancelling headphones, a quiet space to retreat to, and advance warning before sensory-intensive environments all make a significant difference.",
      "morning": "Keep mornings calm, predictable, and low-sensory. Same routine every day. Soft lighting, quiet conversation, no surprises. Let [NAME] wake up gradually and build into the day at [HIS/HER/THEIR] own pace.",
      "school": "Work with the school to provide: a quiet space [NAME] can retreat to when overwhelmed, permission to wear noise-cancelling headphones during independent work, a seat away from high-traffic areas, and structured opportunities for one-on-one or small-group interaction rather than large group activities.",
      "afterSchool": "Give [NAME] low-sensory recovery time before anything else. A quiet room, a preferred activity, minimal demands. Once the nervous system has settled, [NAME] is often ready for gentle connection, but on [HIS/HER/THEIR] terms.",
      "bedtime": "Protect bedtime as connection time. This is when [NAME] is most available, most verbal, most warm. Keep it calm, unhurried, and one-on-one. A brief check-in (\"What was the best bit of today? What was the hardest?\") followed by quiet reading or soft music is ideal.",
      "overwhelm": "Do not push [NAME] back into the environment that overwhelmed [HIM/HER/THEM]. Provide a safe, quiet space. Stay nearby without crowding. Let [HIM/HER/THEM] come back on [HIS/HER/THEIR] own terms. And when [HE/SHE/THEY] does come back, welcome [HIM/HER/THEM] without commentary: \"Glad you're back. No rush.\""
    }
  }
} as Record<string, ArchetypeReportTemplate>;

export function getReportTemplate(
  archetypeId: string,
): ArchetypeReportTemplate | null {
  return REPORT_TEMPLATES[archetypeId] ?? null;
}

export function getAllReportTemplates(): Record<string, ArchetypeReportTemplate> {
  return REPORT_TEMPLATES;
}
