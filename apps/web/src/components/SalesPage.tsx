import React, { useEffect, useRef, useCallback, useState, useMemo } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { ARCHETYPES, getReportTemplate, renderReportTemplate, computeTraitProfile } from "@adhd-parenting-quiz/shared";
import type { ArchetypeReportTemplate } from "@adhd-parenting-quiz/shared";
import { trackPixelEvent, generateEventId, getFbp, getFbc } from "../lib/fbq";
import { trackFunnelEvent } from "../lib/analytics";
import { AnimalIcon } from "../lib/animalImages";
import { api } from "../lib/api";
import type { OnboardingResponses } from "../types/onboarding";

/* ─── Types ─────────────────────────────────────────────────────────────── */

interface LocationState {
  responses?: OnboardingResponses;
  childName?: string;
  childGender?: string;
  archetypeId?: string;
}

/* ─── Animated Counter ──────────────────────────────────────────────────── */

function AnimatedCounter({ base }: { base: number }) {
  const [count, setCount] = useState(base);
  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => prev + 1);
    }, Math.random() * 5000 + 5000); // +1 every 3-7 seconds
    return () => clearInterval(interval);
  }, []);
  return <>{count.toLocaleString()}</>;
}

/* ─── Latest Results Ticker ─────────────────────────────────────────────── */

/* ─── Randomised social-proof data ─────────────────────────────────────── */
const NAMES = [
  "Martina", "Maria", "Annika", "Camille", "Lisa", "Anna", "Elena", "Kate",
  "Katarina", "Laura", "Ingrid", "Amanda", "Christine", "Petra", "Isabelle",
  "Eva", "Sarah", "Marta", "Sofia", "Emma", "Olivia", "Chloe", "Hana",
  "Yuki", "Priya", "Aisha", "Fatima", "Zara", "Nina", "Lucia",
  "Freya", "Astrid", "Nadia", "Lena", "Julia", "Clara", "Bianca", "Gemma",
  "Rachel", "Natalie", "Heidi", "Margot", "Signe", "Anja", "Monika",
  "Donna", "Sophia", "Mei", "Tatiana", "Yara", "Dina", "Reem", "Leila", "Mia",
];

const FLAGS = [
  "🇮🇹", "🇩🇪", "🇸🇪", "🇫🇷", "🇦🇹", "🇬🇧", "🇪🇸", "🇮🇪", "🇭🇷", "🇳🇱",
  "🇳🇴", "🇺🇸", "🇨🇿", "🇧🇪", "🇩🇰", "🇨🇦", "🇵🇱", "🇦🇺", "🇳🇿", "🇨🇭",
  "🇵🇹", "🇬🇷", "🇷🇴", "🇧🇬", "🇫🇮", "🇸🇰", "🇸🇮", "🇱🇹", "🇱🇻", "🇪🇪",
  "🇮🇸", "🇿🇦", "🇧🇷", "🇲🇽", "🇦🇷", "🇯🇵", "🇰🇷", "🇮🇳", "🇮🇱", "🇦🇪",
  "🇸🇬", "🇲🇾", "🇹🇭", "🇵🇭", "🇨🇴", "🇨🇱",
];

const ARCHETYPE_NAMES = [
  "Dreamy Koala", "Flash Hummingbird", "Fierce Tiger", "Observing Meerkat",
  "Wild Stallion", "Clever Fox", "Busy Rabbit", "Just Elephant",
  "Splashy Dolphin", "Storm Hedgehog", "Fearless Bull", "Red Panda",
  "Keen Owl", "Cloudy Panda", "Spark Firefly", "Wandering Penguin",
  "Sky Eagle", "Gentle Deer", "Brave Bear", "Buzzy Bee", "Vivid Octopus",
  "Graceful Swan", "Dreamy Bunny", "Tender Hedgehog", "Hidden Firefly",
];

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateLatestResults(count: number) {
  const names = shuffleArray(NAMES).slice(0, count);
  const flags = shuffleArray(FLAGS);
  const types = shuffleArray(ARCHETYPE_NAMES);
  return names.map((name, i) => ({
    name,
    flag: flags[i % flags.length],
    archetype: types[i % types.length],
  }));
}

const LATEST_RESULTS = generateLatestResults(20);

function LatestResultsTicker() {
  const [visibleIndex, setVisibleIndex] = useState(0);
  const VISIBLE_COUNT = 3;

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleIndex((prev) => (prev + 1) % LATEST_RESULTS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const visible = useMemo(() => {
    const items = [];
    for (let i = 0; i < VISIBLE_COUNT; i++) {
      items.push(LATEST_RESULTS[(visibleIndex + i) % LATEST_RESULTS.length]);
    }
    return items;
  }, [visibleIndex]);

  return (
    <div className="space-y-2">
      {visible.map((item, i) => (
        <div
          key={`${item.name}-${visibleIndex + i}`}
          className="bg-white rounded-xl border border-harbor-text/10 px-4 py-3 flex items-center gap-3"
          style={{ animation: "fadeSlideIn 0.4s ease-out" }}
        >
          <span className="text-xl">{item.flag}</span>
          <div className="text-sm text-harbor-text">
            <strong>{item.name}</strong> just ordered. Child's ADHD Personality Type:{" "}
            <strong className="text-harbor-primary">{item.archetype}</strong>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Logo Marquee ──────────────────────────────────────────────────────── */

const LOGO_IMAGES = [
  { src: "/logoMarque/Time.png", alt: "TIME" },
  { src: "/logoMarque/WashingtonPost.png", alt: "Washington Post" },
  { src: "/logoMarque/HuffPost.png", alt: "HuffPost" },
  { src: "/logoMarque/TheGuardian.webp", alt: "The Guardian" },
  { src: "/logoMarque/Aleteia.png", alt: "Aleteia" },
  { src: "/logoMarque/atlantic.png", alt: "The Atlantic" },
  { src: "/logoMarque/forbes.png", alt: "Forbes" },
  { src: "/logoMarque/ScientificAmerican.png", alt: "Scientific American" },
  { src: "/logoMarque/BBC.png", alt: "BBC" },
  { src: "/logoMarque/USAToday.webp", alt: "USA Today" },
  { src: "/logoMarque/NewYorkTimes.png", alt: "New York Times" },
  { src: "/logoMarque/TedX.png", alt: "TEDx" },
];

function LogoMarquee() {
  return (
    <div className="overflow-hidden relative">
      <div className="flex animate-marquee w-max gap-12 items-center">
        {/* Two identical sets side by side for seamless loop */}
        {[0, 1].map((set) => (
          <div key={set} className="flex gap-12 items-center flex-shrink-0">
            {LOGO_IMAGES.map((logo, i) => (
              <img
                key={i}
                src={logo.src}
                alt={logo.alt}
                className="h-6 w-auto object-contain flex-shrink-0 opacity-40 grayscale"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Trustpilot Stars Image ────────────────────────────────────────────── */

function TrustpilotStars({ className = "h-8" }: { className?: string }) {
  return (
    <img
      src="/trustpilot-stars.png"
      alt="Trustpilot 5 stars"
      className={`${className} object-contain`}
    />
  );
}

/* ─── Star Rating (fallback) ───────────────────────────────────────────── */

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex gap-0.5 text-yellow-400 text-lg">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i}>{i < Math.round(rating) ? "★" : "☆"}</span>
      ))}
    </span>
  );
}

/* ─── Email/Name Form ───────────────────────────────────────────────────── */

function LeadForm({
  email,
  setEmail,
  parentName,
  setParentName,
  onSubmit,
  isSubmitting,
  submitError,
}: {
  email: string;
  setEmail: (v: string) => void;
  parentName: string;
  setParentName: (v: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  submitError: string | null;
}) {
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && parentName.trim().length > 0;

  return (
    <div className="space-y-3">
      <input
        type="text"
        value={parentName}
        onChange={(e) => setParentName(e.target.value)}
        placeholder="Your name"
        disabled={isSubmitting}
        className="w-full rounded-xl border border-harbor-text/20 bg-white px-4 py-3 text-harbor-text placeholder:text-harbor-text/30 focus:outline-none focus:ring-2 focus:ring-harbor-primary/30 focus:border-harbor-primary transition"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && isValid) onSubmit();
        }}
        placeholder="Your email address"
        disabled={isSubmitting}
        className="w-full rounded-xl border border-harbor-text/20 bg-white px-4 py-3 text-harbor-text placeholder:text-harbor-text/30 focus:outline-none focus:ring-2 focus:ring-harbor-primary/30 focus:border-harbor-primary transition"
      />

      {submitError && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2 text-center">
          {submitError}
        </p>
      )}

      <button
        type="button"
        onClick={onSubmit}
        disabled={!isValid || isSubmitting}
        className="w-full rounded-xl bg-harbor-primary text-white px-5 py-4 font-semibold text-base hover:opacity-90 active:scale-[0.98] transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Preparing your report…" : "Go to Step #2 →"}
      </button>

      <p className="text-xs text-center text-harbor-text/40">
        Your information is safe. We don't spam or sell data, ever.
      </p>
    </div>
  );
}

/* ─── Main SalesPage ────────────────────────────────────────────────────── */

export default function SalesPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Preview mode: ?preview or ?preview=tiger injects mock data
  const searchParams = new URLSearchParams(location.search);
  const previewParam = searchParams.get("preview");
  const isPreview = previewParam !== null;
  if (isPreview) {
    const previewId = previewParam || "koala";
    sessionStorage.setItem("wildprint_childName", "Emma");
    sessionStorage.setItem("wildprint_childGender", "A Girl");
    sessionStorage.setItem("wildprint_archetypeId", previewId);
    sessionStorage.setItem("wildprint_responses", JSON.stringify({
      caregiverType: "Mom", childAgeRange: "6-8", childGender: "A Girl",
      adhdJourney: "Formally diagnosed", childName: "Emma", learningEnvironment: "School (public or private)",
      inattentive_0: 3, inattentive_1: 4, inattentive_2: 3, inattentive_3: 3,
      inattentive_4: 4, inattentive_5: 3, inattentive_6: 4,
      hyperactive_0: 1, hyperactive_1: 1, hyperactive_2: 0, hyperactive_3: 1,
      hyperactive_4: 1, hyperactive_5: 0, hyperactive_6: 1,
      sensory_0: 1, sensory_1: 0, sensory_2: 1, sensory_3: 1,
      sensory_4: 0, sensory_5: 1, sensory_6: 0,
      emotional_0: 2, emotional_1: 1, emotional_2: 2, emotional_3: 1,
      emotional_4: 2, emotional_5: 1,
      executive_function_0: 4, executive_function_1: 3, executive_function_2: 4,
      executive_function_3: 3, executive_function_4: 4, executive_function_5: 3,
      social_0: 1, social_1: 1, social_2: 0, social_3: 1, social_4: 1, social_5: 0,
    }));
  }

  // Get data from navigation state or sessionStorage fallback
  const state = (location.state ?? {}) as LocationState;
  const responses = state.responses ?? JSON.parse(sessionStorage.getItem("wildprint_responses") ?? "null");
  const childName = state.childName ?? sessionStorage.getItem("wildprint_childName") ?? "your child";
  const childGender = state.childGender ?? sessionStorage.getItem("wildprint_childGender") ?? "";
  const rawArchetypeId = state.archetypeId ?? sessionStorage.getItem("wildprint_archetypeId") ?? "";
  // Compute archetype from responses if not stored (e.g. console testing)
  const archetypeId = (() => {
    let id = rawArchetypeId;
    if (!id && responses && Object.keys(responses).length > 0) {
      const profile = computeTraitProfile(responses as Record<string, unknown>, childGender);
      id = profile.archetypeId;
      // Store for future reads
      sessionStorage.setItem("wildprint_archetypeId", id);
    }
    // Ensure girl variant is applied
    if (id && childGender === "A Girl") {
      const variants: Record<string, string> = { deer: "swan", panda: "bunny", hedgehog: "tender_hedgehog", firefly: "hidden_firefly" };
      return variants[id] ?? id;
    }
    return id;
  })();

  const archetype = ARCHETYPES.find((a) => a.id === archetypeId) ?? ARCHETYPES[0];

  // Get rendered report template for preview content
  const reportTemplate = useMemo(() => {
    const raw = getReportTemplate(archetypeId);
    if (!raw) return null;
    return renderReportTemplate(raw, { name: childName || "your child", gender: childGender || "" });
  }, [archetypeId, childName, childGender]);

  // Form state
  const [email, setEmail] = useState("");
  const [parentName, setParentName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Refs for scroll targets
  const emailFormRef = useRef<HTMLDivElement>(null);

  // Track ViewContent on mount
  const firedRef = useRef(false);
  useEffect(() => {
    if (!archetypeId || firedRef.current) return;
    firedRef.current = true;
    trackPixelEvent(
      "ViewContent",
      { content_type: "quiz_result", content_category: "adhd_profile" },
      generateEventId(),
    );
  }, [archetypeId]);

  const scrollToForm = useCallback(() => {
    emailFormRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && parentName.trim().length > 0;
    if (!valid) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const eventId = generateEventId();

      // Submit quiz to API (this saves to DB, sends CAPI Lead, syncs AC)
      const result = (await api.post("/api/guest/submit", {
        email,
        responses,
        childName,
        childGender,
        fbc: getFbc(),
        fbp: getFbp(),
        eventSourceUrl: window.location.href,
      })) as { report: ArchetypeReportTemplate; submissionId?: string; pdfUrl?: string };

      // Client-side Lead event
      trackPixelEvent("Lead", { content_category: "adhd_report" }, eventId);
      trackFunnelEvent("optin_completed");

      // Store data for ThankYouPage
      sessionStorage.setItem("wildprint_email", email);
      sessionStorage.setItem("wildprint_childName", childName);
      sessionStorage.setItem("wildprint_childGender", childGender);
      if (result.report) sessionStorage.setItem("wildprint_report", JSON.stringify(result.report));
      if (result.pdfUrl) sessionStorage.setItem("wildprint_pdfUrl", result.pdfUrl);

      // Redirect to WP checkout or internal checkout
      const wpCheckoutUrl = import.meta.env.VITE_WP_CHECKOUT_URL;
      if (wpCheckoutUrl) {
        const params = new URLSearchParams();
        params.set("billing_first_name", parentName);
        params.set("billing_email", email);
        params.set("kids_name", childName);
        params.set("archetype", archetypeId);
        const fbp = getFbp();
        const fbc = getFbc();
        if (fbp) params.set("_fbp", fbp);
        if (fbc) params.set("_fbc", fbc);

        const separator = wpCheckoutUrl.includes("?") ? "&" : "?";
        trackFunnelEvent("wp_checkout_redirect");
        window.location.href = `${wpCheckoutUrl}${separator}${params.toString()}`;
      } else {
        // Fallback: test mode — go to thank you
        navigate("/thank-you", { replace: true });
      }
    } catch (err) {
      if (err instanceof Error && err.message === "already_submitted") {
        setSubmitError("This email has already been used. Please try a different email or check your inbox.");
      } else {
        setSubmitError(
          err instanceof Error ? err.message : "Something went wrong. Please try again.",
        );
      }
      setIsSubmitting(false);
    }
  }, [isSubmitting, email, parentName, responses, childName, childGender, archetypeId, navigate]);

  // If no quiz data, redirect to start
  if (!responses || !archetypeId) return <Navigate to="/" replace />;

  const name = childName ?? "Your child";
  const genderLower = (childGender ?? "").toLowerCase();
  const objPronoun = genderLower.includes("boy") ? "him" : genderLower.includes("girl") ? "her" : "them";

  const WHATS_INSIDE: { title: React.ReactNode; desc: string }[] = [
    { title: <>The neuroscience behind {name}'s specific profile</>, desc: "Explained in plain language, not clinical jargon" },
    { title: <>"A Day in {name}'s Life"</>, desc: "Four common scenarios and suggestions what to do" },
    { title: <>What drains {name} vs. what fuels {objPronoun}</>, desc: "A practical reference table you'll come back to every week" },
    { title: <>What to say and what never to say</>, desc: `Especially when ${name} is struggling` },
    { title: <>{name}'s hidden gift</>, desc: `The quality most people around ${objPronoun} completely miss` },
    { title: <>"What {name} needs to hear most"</>, desc: `Five word-for-word scripts to boost ${name}'s self-esteem` },
  ];

  const REVIEWS = [
    {
      text: "The assessment nailed my son's ADHD personality! It's like having a guide to understanding my son better.",
      stars: 5,
    },
    {
      text: "Skeptical at first, but the accuracy amazed me. It's helping me parent my daughter the way she needs.",
      stars: 5,
    },
    {
      text: "What I learned about my child boosted my confidence in parenting.",
      stars: 5,
    },
  ];

  const HERES_WHAT_YOU_GET = [
    { icon: "📋", text: "Comprehensive ADHD personality report" },
    { icon: "🧩", text: "Detailed descriptions with DOs and DON'Ts for one of the 15 ADHD child personalities" },
    { icon: "🚫", text: "5 things you should NEVER say to your child (and what to say instead)" },
    { icon: "💬", text: `5 phrases ${name} loves to hear` },
  ];

  return (
    <div className="min-h-screen bg-harbor-bg overflow-y-auto">
      <div className="max-w-lg w-full mx-auto px-6 py-16 space-y-10">

        {/* ── Section 1: Header ── */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-harbor-primary leading-tight">
            Your Child's ADHD Personality Report is ready!
          </h1>
        </div>

        {/* ── Section 2: Blurred Report Preview (looks like real PDF) ── */}
        <div className="relative rounded-2xl border border-harbor-text/10 shadow-sm overflow-hidden bg-white">
          {/* Report header bar */}
          <div className="bg-harbor-primary/5 px-6 py-3 flex items-center justify-between border-b border-harbor-text/8">
            <span className="text-[10px] text-harbor-text/40 uppercase tracking-widest font-semibold">
              ADHD Personality Report
            </span>
            <span className="text-[10px] text-harbor-text/30">
              {name}'s unique profile
            </span>
          </div>

          {/* Report content mimicking PDF layout */}
          <div className="p-6 space-y-4">
            {/* Title + animal row */}
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center">
                <AnimalIcon id={archetypeId} className="max-w-full max-h-full" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-harbor-primary leading-tight uppercase tracking-wide">
                  {archetype.typeName}
                </h3>
                {reportTemplate && (
                  <p className="text-xs text-harbor-text/50 mt-0.5 italic">
                    "{reportTemplate.innerVoiceQuote}"
                  </p>
                )}
              </div>
            </div>

            {/* About section preview */}
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-harbor-primary/70 mb-1">
                About {name}
              </p>
              <div className="w-8 h-0.5 bg-harbor-primary/30 mb-2" />
              <p className="text-sm text-harbor-text leading-relaxed">
                {reportTemplate ? reportTemplate.aboutChild.slice(0, 300) + "..." : `${name}'s brain operates with a unique combination of strengths and challenges...`}
              </p>
            </div>

            {/* Drains / Fuels preview */}
            {reportTemplate && (
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-harbor-primary/70 mb-1">
                  Creating the right environment for {name}
                </p>
                <div className="w-8 h-0.5 bg-harbor-primary/30 mb-2" />
                {/* Table header */}
                <div className="grid grid-cols-2 gap-2 mb-1">
                  <p className="text-[9px] uppercase tracking-wider font-bold text-red-500/70">What drains {name}</p>
                  <p className="text-[9px] uppercase tracking-wider font-bold text-green-600/70">What fuels {name}</p>
                </div>
                {/* Paired rows — 3 clear, 2 blurred, then stop */}
                {reportTemplate.drains.slice(0, 5).map((d, i) => {
                  const f = reportTemplate.fuels[i] ?? "";
                  const isBlurred = i >= 3;
                  return (
                    <div key={i} className={`grid grid-cols-2 gap-2 ${isBlurred ? "blur-[3px] select-none" : ""}`}>
                      <p className="text-xs text-harbor-text/70 leading-relaxed flex items-start gap-1.5 mb-1">
                        <span className="text-red-400 mt-0.5 flex-shrink-0">&#10005;</span> {d}
                      </p>
                      <p className="text-xs text-harbor-text/70 leading-relaxed flex items-start gap-1.5 mb-1">
                        <span className="text-green-500 mt-0.5 flex-shrink-0">&#10003;</span> {f}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Blur gradient + unlock button */}
          <div className="relative flex items-center justify-center py-4 bg-gradient-to-b from-white/40 to-white">
            <button
              type="button"
              onClick={scrollToForm}
              className="bg-harbor-primary/5 border border-harbor-primary/15 rounded-xl px-5 py-3 flex items-center gap-2 hover:bg-harbor-primary/10 active:scale-[0.98] transition-all cursor-pointer"
            >
              <svg className="w-4 h-4 text-harbor-primary/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span className="text-sm font-medium text-harbor-primary/70">Unlock the full report</span>
            </button>
          </div>
        </div>

        {/* ── Section 3: What's Inside (green checks) ── */}
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-widest text-harbor-text/40">
            What's inside {name}'s full ADHD Personality report
          </p>
          <ul className="space-y-3">
            {WHATS_INSIDE.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="w-3 h-3 text-green-600" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <div>
                  <span className="text-harbor-text text-sm font-semibold leading-relaxed">
                    {item.title}
                  </span>
                  <span className="text-harbor-text/60 text-sm leading-relaxed block">
                    {item.desc}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Section 4: Trust Badges ── */}
        <div className="space-y-3">
          <div className="bg-white rounded-xl border border-harbor-text/10 p-4 space-y-1.5">
            <p className="text-xs font-semibold text-harbor-primary">🧠 Built by ADHD specialists with over 40 years of combined clinical
              experience.</p>
            <p className="text-harbor-text text-xs italic leading-relaxed">
               This isn’t a generic personality assessment. Every question, every profile, and every recommendation
              is grounded in decades of real work with real ADHD families.
            </p>
          </div>
          <div className="bg-white rounded-xl border border-harbor-text/10 p-4 space-y-1.5">
            <p className="text-xs font-semibold text-harbor-primary">✅ 100% satisfaction guarantee</p>
            <p className="text-harbor-text text-xs italic leading-relaxed">
              If the report doesn't feel like it was written specifically about
              your child, email us and we'll refund you, no questions asked.
            </p>
          </div>
        </div>

        {/* ── Section 5: CTA Heading + Counter ── */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-harbor-primary leading-tight">
            Uncover Your Child's ADHD Personality Type!
          </h2>
          <p className="text-harbor-text font-semibold">
            <span className="text-harbor-primary tabular-nums">
              <AnimatedCounter base={12496} />
            </span>{" "}
            reports ordered!
          </p>
        </div>

        {/* ── Section 6: Email/Name Form (first instance) ── */}
        <div ref={emailFormRef}>
          <LeadForm
            email={email}
            setEmail={setEmail}
            parentName={parentName}
            setParentName={setParentName}
            onSubmit={() => void handleSubmit()}
            isSubmitting={isSubmitting}
            submitError={submitError}
          />
        </div>

        {/* ── Section 7: Here's What You'll Get ── */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-harbor-primary text-center">
            Here's what you'll get
          </h3>
          <div className="space-y-3">
            {HERES_WHAT_YOU_GET.map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-white rounded-xl border border-harbor-text/10 p-4">
                <span className="text-2xl flex-shrink-0">{item.icon}</span>
                <span className="text-harbor-text text-sm leading-relaxed font-medium">
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Section 8: Featured In (Logo Marquee) ── */}
        <div className="space-y-3 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-harbor-text/40">
            Created with experts featured in
          </p>
          <LogoMarquee />
        </div>

        {/* ── Section 9: Reviews ── */}
        <div className="space-y-4">
          <div className="text-center space-y-2">
            <h2 className="text-sm font-semibold text-harbor-text/60">
              Rated <span className="text-harbor-primary font-bold">4.9/5</span> by our customers
            </h2>
            <Stars rating={5} />
          </div>
          <div className="space-y-3">
            {REVIEWS.map((review, i) => (
              <div key={i} className="bg-white rounded-xl border border-harbor-text/10 p-4 space-y-2">
                <Stars rating={review.stars} />
                <p className="text-harbor-text text-sm italic leading-relaxed">
                  "{review.text}"
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Section 10: Trustpilot-style Trust Bar ── */}
        <div className="text-center space-y-2">
          <p className="text-harbor-text font-semibold text-sm">
            Trusted by over <strong>110,000 people</strong>  worldwide
          </p>
          <TrustpilotStars className="h-10 mx-auto" />
          <span className="text-harbor-primary font-bold">4.9/5</span>
        </div>

        {/* ── Section 11: Latest Results ── */}
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-widest text-harbor-text/40 text-center">
            Latest results
          </p>
          <LatestResultsTicker />
        </div>

        {/* ── Section 12: Repeat CTA + Form ── */}
        <div className="space-y-4">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-harbor-primary leading-tight">
              Uncover Your Child's ADHD Personality Type!
            </h2>
            <p className="text-harbor-text font-semibold">
              <span className="text-harbor-primary tabular-nums">
                <AnimatedCounter base={12496} />
              </span>{" "}
              reports ordered!
            </p>
          </div>

          <LeadForm
            email={email}
            setEmail={setEmail}
            parentName={parentName}
            setParentName={setParentName}
            onSubmit={() => void handleSubmit()}
            isSubmitting={isSubmitting}
            submitError={submitError}
          />
        </div>

      </div>

      {/* ── Global Animations ── */}
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: none; }
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
      `}</style>
    </div>
  );
}
