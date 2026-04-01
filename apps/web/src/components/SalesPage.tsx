import { useEffect, useRef, useCallback, useState, useMemo } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { ARCHETYPES, getReportTemplate, renderReportTemplate, computeTraitProfile } from "@adhd-parenting-quiz/shared";
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
  email?: string;
}

/* ─── Countdown Timer ───────────────────────────────────────────────────── */
const TIMER_KEY = "adhd_offer_timer_end";
const TIMER_DURATION = 10 * 60 * 1000; // 10 minutes

function CountdownTimer({ onGetReport }: { onGetReport?: () => void }) {
  const [timeLeft, setTimeLeft] = useState<number>(() => {
    const stored = sessionStorage.getItem(TIMER_KEY);
    if (stored) {
      const end = parseInt(stored, 10);
      const left = end - Date.now();
      if (left > 0) return left;
    }
    const end = Date.now() + TIMER_DURATION;
    sessionStorage.setItem(TIMER_KEY, String(end));
    return TIMER_DURATION;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const stored = sessionStorage.getItem(TIMER_KEY);
      if (!stored) return;
      const left = Math.max(0, parseInt(stored, 10) - Date.now());
      setTimeLeft(left);
      if (left === 0) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);
  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");

  return (
    <div className="bg-gradient-to-r from-violet-100 to-purple-100 px-5 py-3.5 flex items-center justify-between gap-3 shadow-md border-b border-purple-200">
      {/* Left: timer */}
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-base leading-none">⏳</span>
        <div className="flex flex-col leading-tight">
          <span className="text-[10px] uppercase tracking-widest font-semibold text-purple-500">Discount expires in:</span>
          <span className="font-mono font-bold text-xl tracking-widest leading-none text-gray-900">
            {mm}<span className="text-purple-400 mx-0.5">:</span>{ss}
          </span>
        </div>
      </div>
      {/* Right: CTA */}
      <button
        type="button"
        onClick={onGetReport}
        className="bg-harbor-primary text-white font-bold text-sm px-4 py-2.5 rounded-xl whitespace-nowrap active:scale-95 transition-all flex-shrink-0 shadow-sm hover:opacity-90 cursor-pointer"
      >
        Get Report →
      </button>
    </div>
  );
}

/* ─── Latest Results Ticker ──────────────────────────────────────────────── */
const LATEST_RESULTS = [
  { name: "Donna", flag: "🇺🇸", archetype: "Dreamy Koala" },
  { name: "Sophia", flag: "🇬🇧", archetype: "Fierce Tiger" },
  { name: "Jane", flag: "🇺🇸", archetype: "Fierce Tiger" },
  { name: "Martina", flag: "🇮🇹", archetype: "Flash Hummingbird" },
  { name: "Maria", flag: "🇩🇪", archetype: "Gentle Elephant" },
  { name: "Annika", flag: "🇸🇪", archetype: "Observing Meerkat" },
  { name: "Camille", flag: "🇫🇷", archetype: "Clever Fox" },
  { name: "Lisa", flag: "🇦🇹", archetype: "Wise Owl" },
  { name: "Anna", flag: "🇬🇧", archetype: "Playful Dolphin" },
  { name: "Elena", flag: "🇪🇸", archetype: "Dreamy Koala" },
  { name: "Kate", flag: "🇮🇪", archetype: "Clever Fox" },
  { name: "Katarina", flag: "🇭🇷", archetype: "Wild Stallion" },
  { name: "Laura", flag: "🇳🇱", archetype: "Fierce Tiger" },
  { name: "Ingrid", flag: "🇳🇴", archetype: "Gentle Elephant" },
  { name: "Amanda", flag: "🇬🇧", archetype: "Fierce Tiger" },
  { name: "Christine", flag: "🇺🇸", archetype: "Brave Bull" },
  { name: "Petra", flag: "🇨🇿", archetype: "Sensitive Hedgehog" },
  { name: "Isabelle", flag: "🇧🇪", archetype: "Quick Rabbit" },
  { name: "Eva", flag: "🇩🇰", archetype: "Dreamy Koala" },
  { name: "Sarah", flag: "🇨🇦", archetype: "Observing Meerkat" },
  { name: "Marta", flag: "🇵🇱", archetype: "Flash Hummingbird" },
];

function LatestResultsTicker() {
  const [visibleIndex, setVisibleIndex] = useState(0);
  const VISIBLE_COUNT = 3;

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleIndex((prev) => (prev + 1) % LATEST_RESULTS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const visibleItems = useMemo(() => {
    const items = [];
    for (let i = 0; i < VISIBLE_COUNT; i++) {
      items.push(LATEST_RESULTS[(visibleIndex + i) % LATEST_RESULTS.length]);
    }
    return items;
  }, [visibleIndex]);

  return (
    <div className="space-y-2">
      <p className="text-[10px] uppercase tracking-widest font-bold text-harbor-text/40 text-center mb-1">🔴 Live results</p>
      {visibleItems.map((item, i) => (
        <div
          key={`${item.name}-${visibleIndex + i}`}
          className="bg-white rounded-xl border border-harbor-text/10 px-4 py-3 flex items-center gap-3"
          style={{ animation: "fadeSlideIn 0.4s ease-out" }}
        >
          <span className="text-xl flex-shrink-0">{item.flag}</span>
          <p className="text-sm text-harbor-text leading-snug">
            <strong>{item.name}</strong> just ordered. Child's ADHD Personality Type:{" "}
            <strong className="text-harbor-primary">{item.archetype}</strong>
          </p>
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
        {[0, 1].map((set) => (
          <div key={set} className="flex gap-12 items-center flex-shrink-0">
            {LOGO_IMAGES.map((logo, i) => (
              <img key={i} src={logo.src} alt={logo.alt} className="h-6 w-auto object-contain flex-shrink-0 opacity-40 grayscale" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Payment Logos ─────────────────────────────────────────────────────── */
function PaymentLogos() {
  const logos = [
    { src: "/payments/visa.svg", alt: "Visa" },
    { src: "/payments/mastercard.png", alt: "Mastercard" },
    { src: "/payments/paypal.png", alt: "PayPal" },
    { src: "/payments/amex.jpg", alt: "American Express" },
    { src: "/payments/discover.jpg", alt: "Discover" },
  ];
  return (
    <div className="text-center space-y-1.5">
      <p className="text-xs font-bold text-harbor-text/60 flex items-center justify-center gap-1.5">
        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
        Pay safe &amp; secure
      </p>
      <div className="flex items-center justify-center gap-2">
        {logos.map((logo) => (
          <img key={logo.alt} src={logo.src} alt={logo.alt} className="h-4 w-auto object-contain" />
        ))}
      </div>
      <p className="text-[10px] text-harbor-text/40">🔒 All transactions are secure and encrypted</p>
    </div>
  );
}

/* ─── Main SalesPage ────────────────────────────────────────────────────── */
export default function SalesPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Preview mode
  const searchParams = new URLSearchParams(location.search);
  const previewParam = searchParams.get("preview");
  const isPreview = previewParam !== null;
  if (isPreview) {
    const previewId = previewParam || "koala";
    sessionStorage.setItem("wildprint_childName", "Emma");
    sessionStorage.setItem("wildprint_childGender", "My Daughter");
    sessionStorage.setItem("wildprint_archetypeId", previewId);
    sessionStorage.setItem("wildprint_email", "test@example.com");
    sessionStorage.setItem("wildprint_responses", JSON.stringify({
      caregiverType: "Mom", childAgeRange: "6-8", childGender: "My Daughter",
      adhdJourney: "Formally diagnosed", childName: "Emma",
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

  const state = (location.state ?? {}) as LocationState;
  const responses = state.responses ?? JSON.parse(sessionStorage.getItem("wildprint_responses") ?? "null");
  const childName = state.childName ?? sessionStorage.getItem("wildprint_childName") ?? "your child";
  const childGender = state.childGender ?? sessionStorage.getItem("wildprint_childGender") ?? "";
  const email = state.email ?? sessionStorage.getItem("wildprint_email") ?? "";
  const rawArchetypeId = state.archetypeId ?? sessionStorage.getItem("wildprint_archetypeId") ?? "";

  const archetypeId = (() => {
    let id = rawArchetypeId;
    if (!id && responses && Object.keys(responses).length > 0) {
      const profile = computeTraitProfile(responses as Record<string, unknown>, childGender);
      id = profile.archetypeId;
      sessionStorage.setItem("wildprint_archetypeId", id);
    }
    if (id) {
      const gL = (childGender ?? "").toLowerCase();
      if (gL.includes("girl") || gL.includes("daughter")) {
        const variants: Record<string, string> = { deer: "swan", panda: "bunny", hedgehog: "tender_hedgehog", firefly: "hidden_firefly" };
        return variants[id] ?? id;
      }
    }
    return id;
  })();

  const archetype = ARCHETYPES.find((a) => a.id === archetypeId) ?? ARCHETYPES[0];

  // Archetype-specific accent colors for the blurred report preview
  const ARCHETYPE_COLORS: Record<string, { text: string; divider: string }> = {
    koala:       { text: "text-blue-600",    divider: "bg-blue-300" },
    hummingbird: { text: "text-green-600",   divider: "bg-green-300" },
    tiger:       { text: "text-orange-600",  divider: "bg-orange-300" },
    meerkat:     { text: "text-yellow-600",  divider: "bg-yellow-300" },
    stallion:    { text: "text-amber-600",   divider: "bg-amber-300" },
    fox:         { text: "text-orange-700",  divider: "bg-orange-400" },
    rabbit:      { text: "text-pink-600",    divider: "bg-pink-300" },
    elephant:    { text: "text-slate-600",   divider: "bg-slate-300" },
    dolphin:     { text: "text-cyan-600",    divider: "bg-cyan-300" },
    hedgehog:    { text: "text-stone-600",   divider: "bg-stone-300" },
    bull:        { text: "text-red-600",     divider: "bg-red-300" },
    red_panda:   { text: "text-rose-600",    divider: "bg-rose-300" },
  };
  const archetypeColor = ARCHETYPE_COLORS[archetypeId] ?? { text: "text-harbor-primary", divider: "bg-harbor-primary/30" };

  const reportTemplate = useMemo(() => {
    const raw = getReportTemplate(archetypeId);
    if (!raw) return null;
    return renderReportTemplate(raw, { name: childName || "your child", gender: childGender || "" });
  }, [archetypeId, childName, childGender]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const buyRef = useRef<HTMLDivElement>(null);

  const firedRef = useRef(false);
  useEffect(() => {
    if (!archetypeId || firedRef.current) return;
    firedRef.current = true;
    const vcEventId = generateEventId();
    // Client-side pixel
    trackPixelEvent("ViewContent", { content_type: "quiz_result", content_category: "adhd_profile" }, vcEventId);
    // Server-side CAPI with same event ID for deduplication
    void api.post("/api/guest/view-content", {
      eventId: vcEventId,
      sourceUrl: window.location.href,
      fbp: getFbp(),
      fbc: getFbc(),
      ...(email ? { email } : {}),
    }).catch(() => { /* non-critical */ });
  }, [archetypeId]);

  const scrollToBuy = useCallback(() => {
    buyRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  const handleBuy = useCallback(async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const eventId = generateEventId();

      // Guard — pdfUrl must exist before we allow checkout.
      // It was set during email capture (OnboardingPage) after a confirmed API call.
      // If it's missing here, the submission never landed — block the redirect.
      const pdfUrlConfirmed = sessionStorage.getItem("wildprint_pdfUrl");
      if (!pdfUrlConfirmed) {
        setSubmitError("We couldn't save your report — please refresh the page and try again.");
        setIsSubmitting(false);
        return;
      }

      trackPixelEvent("Lead", { content_category: "adhd_report" }, eventId);
      trackPixelEvent("InitiateCheckout", { value: 17.0, currency: "USD", num_items: 1, content_category: "adhd_report" }, generateEventId());
      trackFunnelEvent("checkout_started");

      // pdfUrl is already in sessionStorage from email capture step
      const pdfUrl = sessionStorage.getItem("wildprint_pdfUrl") ?? "";

      const checkoutUrl = import.meta.env.VITE_CHECKOUT_URL;
      if (checkoutUrl) {
        const params = new URLSearchParams();
        params.set("email", email);
        params.set("childName", childName);
        params.set("archetype", archetypeId);
        params.set("archetype_name", archetype.typeName);
        params.set("gender", childGender ?? "");
        if (pdfUrl) params.set("pdfUrl", pdfUrl);
        const fbp = getFbp();
        const fbc = getFbc();
        if (fbp) params.set("_fbp", fbp);
        if (fbc) params.set("_fbc", fbc);
        const separator = checkoutUrl.includes("?") ? "&" : "?";
        const redirectUrl = `${checkoutUrl}${separator}${params.toString()}`;
        trackFunnelEvent("wp_checkout_redirect");
        // Small delay so InitiateCheckout pixel fires before browser navigates away
        setTimeout(() => { window.location.href = redirectUrl; }, 300);
      } else {
        navigate("/thank-you", { replace: true });
      }
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  }, [isSubmitting, email, responses, childName, childGender, archetypeId, archetype, navigate]);

  if (!responses || !archetypeId) return <Navigate to="/" replace />;

  // Pronouns
  const name = childName || "Your child";
  const gL = (childGender ?? "").toLowerCase();
  const isMale = gL.includes("son") || gL.includes("boy");
  const isFemale = gL.includes("daughter") || gL.includes("girl");
  const heShe = isMale ? "he" : isFemale ? "she" : "they";
  const himHer = isMale ? "him" : isFemale ? "her" : "them";

  const WHAT_CHANGES = [
    {
      bold: `You'll finally understand why ${name} reacts the way ${heShe} does`,
      sub: "Explained in plain language, not clinical jargon",
    },
    {
      bold: `You'll see exactly how ADHD shows up in ${name}'s everyday life`,
      sub: "Four common scenarios and suggestions what to do",
    },
    {
      bold: "You'll stop guessing what works and what doesn't",
      sub: `With a practical reference table of what drains ${name} vs. what fuels ${himHer}`,
    },
    {
      bold: `You'll know exactly what to say when ${name} is struggling`,
      sub: "And the 5 things you should never say",
    },
    {
      bold: `You'll discover ${name}'s hidden strength`,
      sub: `The quality most people around ${himHer} completely miss`,
    },
    {
      bold: "You'll have word-for-word scripts",
      sub: `To boost ${name}'s self-esteem in the moments that matter most`,
    },
  ];

  return (
    <div className="min-h-screen bg-harbor-bg">
      {/* Sticky timer bar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <CountdownTimer onGetReport={scrollToBuy} />
      </div>
      {/* Spacer so content doesn't hide behind fixed timer */}
      <div className="h-[60px]" />

      <div className="max-w-lg w-full mx-auto px-[10px] py-10 space-y-10">

        {/* ── Section 1: Headline ── */}
        <div className="text-center space-y-2 px-[10px]">
          <h1 className="text-3xl font-bold text-harbor-primary leading-tight">
            There's a reason {name} does what {heShe} does.
          </h1>
          <p className="text-harbor-text/70 text-lg leading-snug">
            It's all inside {heShe === "he" ? "his" : heShe === "she" ? "her" : "their"} ADHD Personality Report…
          </p>
        </div>

        {/* ── Section 2: Blurred Report Preview ── */}
        <div className="relative rounded-sm border border-harbor-text/10 shadow-xl overflow-hidden bg-white">
          <div className="bg-white px-6 py-3 flex items-center justify-between border-b border-harbor-text/[0.08]">
            <span className="text-[10px] text-harbor-text/40 uppercase tracking-widest font-semibold">{new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
            <span className="text-[10px] text-harbor-text/30">{name}'s unique profile</span>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center">
                <AnimalIcon id={archetypeId} className="max-w-full max-h-full" />
              </div>
              <div>
                <h3 className={`text-xl font-bold leading-tight uppercase tracking-wide ${archetypeColor.text}`}>
                  {archetype.typeName}
                </h3>
                {reportTemplate && (
                  <p className="text-xs text-harbor-text/50 mt-0.5 italic">"{reportTemplate.innerVoiceQuote}"</p>
                )}
              </div>
            </div>
            <div>
              <p className={`text-[10px] uppercase tracking-widest font-bold mb-1 ${archetypeColor.text}`}>About {name}</p>
              <div className={`w-8 h-0.5 mb-2 ${archetypeColor.divider}`} />
              <p className="text-sm text-harbor-text leading-relaxed">
                {reportTemplate ? reportTemplate.aboutChild.slice(0, 300) + "..." : `${name}'s brain operates with a unique combination of strengths and challenges...`}
              </p>
            </div>
            {reportTemplate && (
              <div>
                <p className={`text-[10px] uppercase tracking-widest font-bold mb-1 ${archetypeColor.text}`}>Creating the right environment for {name}</p>
                <div className={`w-8 h-0.5 mb-2 ${archetypeColor.divider}`} />
                <div className="grid grid-cols-2 gap-2 mb-1">
                  <p className="text-[9px] uppercase tracking-wider font-bold text-red-500/70">What drains {name}</p>
                  <p className="text-[9px] uppercase tracking-wider font-bold text-green-600/70">What fuels {name}</p>
                </div>
                {reportTemplate.drains.slice(0, 5).map((d, i) => {
                  const f = reportTemplate.fuels[i] ?? "";
                  const isBlurred = i >= 3;
                  return (
                    <div key={i} className={`grid grid-cols-2 gap-2 ${isBlurred ? "blur-[3px] select-none" : ""}`}>
                      <p className="text-xs text-harbor-text/70 leading-relaxed flex items-start gap-1.5 mb-1">
                        <span className="text-red-400 mt-0.5 flex-shrink-0">✕</span> {d}
                      </p>
                      <p className="text-xs text-harbor-text/70 leading-relaxed flex items-start gap-1.5 mb-1">
                        <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span> {f}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          {/* Blur gradient + unlock button */}
          <div className="relative flex items-center justify-center -mt-6 pt-2 pb-4 bg-gradient-to-b from-transparent to-white">
            <button
              type="button"
              onClick={scrollToBuy}
              className="bg-green-500 hover:bg-green-600 active:scale-[0.98] text-white rounded-xl px-5 py-3 flex items-center gap-2 transition-all shadow-md font-semibold text-sm cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Unlock the full report
            </button>
          </div>
        </div>

        {/* ── Section 3: What changes after ── */}
        <div className="space-y-4 p-5">
          <h2 className="text-xl font-bold text-harbor-primary text-center leading-snug">
            What changes after you read {name}'s report:
          </h2>
          <ul className="space-y-4">
            {WHAT_CHANGES.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-0.5 flex-shrink-0 text-harbor-primary font-bold text-base leading-none">→</span>
                <div>
                  <p className="text-harbor-text text-sm font-semibold leading-snug">{item.bold}</p>
                  <p className="text-harbor-text/55 text-sm leading-snug">{item.sub}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Section 5: Product Box ── */}
        <div ref={buyRef} className="rounded-2xl border-2 border-violet-200 shadow-lg overflow-hidden bg-gradient-to-b from-violet-50 to-purple-50">
          <div className="p-6 space-y-4">
            <p className="font-extrabold text-2xl text-gray-900 leading-snug text-center">{name}'s Full ADHD Personality Report</p>
            {/* Archetype + Animal */}
            <div className="flex flex-col items-center gap-2">
              <p className="text-xs font-bold uppercase tracking-widest text-harbor-primary/70">{archetype.typeName}</p>
              <div className="w-20 h-20 flex items-center justify-center">
                <AnimalIcon id={archetypeId} className="max-w-full max-h-full" />
              </div>
            </div>

            {/* What's inside */}
            <p className="text-sm font-bold text-harbor-text">What's inside:</p>
            <ul className="space-y-2 text-sm text-harbor-text">
              {[
                `The neuroscience behind ${name}'s specific profile`,
                `"A Day in ${name}'s Life" with practical tips`,
                `What drains ${name} vs. what fuels ${heShe === "he" ? "him" : heShe === "she" ? "her" : "them"}`,
                "What to say and what never to say",
                `${name}'s hidden gift`,
                `What ${name} needs to hear most`,
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-3 h-3 text-green-600" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            {/* Pricing */}
            <div className="space-y-1">
              <p className="text-sm text-harbor-text/50 text-center">Regular price: <span className="line-through">$49</span></p>
              <div className="flex items-end justify-center gap-2 overflow-visible pl-10">
                <p className="text-base font-bold text-gray-900 leading-none mb-1">Your price today:</p>
                <span className="relative pr-10">
                  <span className="text-3xl font-extrabold text-green-600 leading-none">$19</span>
                  <span className="bg-red-500 text-white text-[9px] font-bold px-1 py-0.5 rounded absolute -top-2 -right-2">61%&nbsp;OFF</span>
                </span>
              </div>
            </div>

            <p className="text-center text-harbor-text/60 text-sm italic">
              Less than a single parenting book — written specifically about <strong>your</strong> child.
            </p>

            {submitError && (
              <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2 text-center">{submitError}</p>
            )}

            <button
              type="button"
              onClick={() => void handleBuy()}
              disabled={isSubmitting}
              className="w-full rounded-xl bg-harbor-primary hover:opacity-90 text-white px-5 py-4 font-bold text-lg active:scale-[0.98] transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? "Processing…" : "Get Personalized Report →"}
            </button>

            <div className="flex items-center justify-center gap-2 text-sm font-bold text-gray-900">
              ✅ 14-day money-back guarantee
            </div>

            <PaymentLogos />
          </div>
        </div>

        {/* ── Section 6: Money-Back Badge ── */}
        <div className="bg-gray-50 rounded-2xl border border-gray-200 shadow-sm p-6 text-center space-y-3">
          <img
            src="https://www.adhdparenting.com/wp-content/uploads/2026/01/money-back-guarantee.png"
            alt="100% Money-Back Guarantee"
            className="h-28 object-contain mx-auto"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
          <h3 className="text-xl font-bold text-gray-900">100% Money-Back Guarantee</h3>
          <p className="text-gray-700 text-sm leading-relaxed">
            If the report doesn't feel like it was written specifically about your child, email us in the next 14 days and we'll refund you — no questions asked.
          </p>
        </div>

        {/* ── Section 7: 3 Testimonials (Fiona, Vanessa, Tamara) ── */}
        <div className="space-y-3">
          {[
            { title: "By page 3, I burst into tears.", quote: "But those were tears of awareness after knowing that there's nothing wrong with any of us, but only wired differently. And unconditional love is the answer to almost any issue.", name: "Fiona" },
            { title: '"How do they know who I am?!"', quote: "My son took the assessment with me so I could make sure the questions were answered accurately. He read the final report and said, 'How do they know who I am?!'. Absolutely priceless!", name: "Vanessa" },
            { title: "He's not alone.", quote: "This report made me realize that Harry isn't alone and his traits fit a pattern and type that just need the right kind of support.", name: "Tamara" },
          ].map((t, i) => (
            <div key={i} className="px-1 py-2 space-y-1.5 border-b border-harbor-text/10 last:border-0">
              <div className="flex gap-0.5 mb-1">
                {[...Array(5)].map((_, j) => (
                  <svg key={j} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                ))}
              </div>
              <p className="text-sm font-bold text-gray-900">{t.title}</p>
              <p className="text-sm text-harbor-text/70 leading-relaxed">"{t.quote}"</p>
              <p className="text-xs font-bold text-harbor-primary">— {t.name}</p>
            </div>
          ))}
        </div>

        {/* ── Section 8: Authority Badge ── */}
        <div className="bg-white rounded-2xl border border-harbor-text/10 shadow-sm p-6 space-y-4 text-center">
          <img src="/flow/authority-badge.webp" alt="Authority badge" className="w-[120px] h-[120px] object-contain mx-auto" />
          <h3 className="text-lg font-bold text-harbor-primary">Created by ADHD specialists</h3>
          <p className="text-harbor-text text-sm leading-relaxed">
            With over 40 years of combined clinical experience. This isn't a generic personality assessment. Every question, every profile, and every recommendation is grounded in decades of real work with real ADHD families.
          </p>
        </div>

        {/* ── Section 9: Trustpilot (no box) ── */}
        <div className="text-center space-y-3">
          <h3 className="text-xl font-bold text-gray-900">Trusted by 111,813 parents worldwide</h3>
          <div className="flex items-center justify-center">
            <img src="/trustpilot-stars.png" alt="Trustpilot stars" className="h-12 object-contain" />
          </div>
        </div>

        {/* ── Section 10: Rating Breakdown ── */}
        <div className="bg-white rounded-2xl border border-harbor-text/10 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-3xl font-bold text-harbor-primary">4.9 stars</p>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              ))}
            </div>
          </div>
          <div className="space-y-2.5 border-t border-harbor-text/10 pt-4">
            {[
              { label: "Report accuracy", score: "4.8", fill: 80 },
              { label: "Practical ideas", score: "4.7", fill: 70 },
              { label: "Report design", score: "4.9", fill: 90 },
              { label: "Overall experience", score: "4.9", fill: 90 },
              { label: "Would recommend", score: "5.0", fill: 100 },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between gap-3">
                <span className="text-sm text-harbor-text flex-1">{row.label}</span>
                <div className="flex gap-0.5">
                  {[...Array(4)].map((_, i) => (
                    <svg key={i} className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  ))}
                  <svg className="w-3.5 h-3.5" viewBox="0 0 20 20">
                    <defs>
                      <linearGradient id={`grad-${row.label.replace(/ /g, "")}`} x1="0" x2="1" y1="0" y2="0">
                        <stop offset={`${row.fill}%`} stopColor="#facc15" />
                        <stop offset={`${row.fill}%`} stopColor="#e5e7eb" />
                      </linearGradient>
                    </defs>
                    <path fill={`url(#grad-${row.label.replace(/ /g, "")})`} d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                </div>
                <span className="text-sm font-bold text-harbor-primary w-7 text-right">{row.score}</span>
              </div>
            ))}
          </div>
        </div>


        {/* ── Section 12: Featured In ── */}
        <div className="space-y-3 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-harbor-text/40">Created with experts featured in</p>
          <LogoMarquee />
        </div>

        {/* ── Section 13: Latest Results ── */}
        <LatestResultsTicker />

        {/* ── Section 14: Repeat Product Box ── */}
        <div className="rounded-2xl border-2 border-violet-200 shadow-lg overflow-hidden bg-gradient-to-b from-violet-50 to-purple-50">
          <div className="p-6 space-y-4">
            <p className="font-extrabold text-2xl text-gray-900 leading-snug text-center">{name}'s Full ADHD Personality Report</p>
            <div className="flex flex-col items-center gap-2">
              <p className="text-xs font-bold uppercase tracking-widest text-harbor-primary/70">{archetype.typeName}</p>
              <div className="w-20 h-20 flex items-center justify-center">
                <AnimalIcon id={archetypeId} className="max-w-full max-h-full" />
              </div>
            </div>

            {/* What's inside */}
            <p className="text-sm font-bold text-harbor-text">What's inside:</p>
            <ul className="space-y-2 text-sm text-harbor-text">
              {[
                `The neuroscience behind ${name}'s specific profile`,
                `"A Day in ${name}'s Life" with practical tips`,
                `What drains ${name} vs. what fuels ${heShe === "he" ? "him" : heShe === "she" ? "her" : "them"}`,
                "What to say and what never to say",
                `${name}'s hidden gift`,
                `What ${name} needs to hear most`,
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-3 h-3 text-green-600" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="space-y-1">
              <p className="text-sm text-harbor-text/50 text-center">Regular price: <span className="line-through">$49</span></p>
              <div className="flex items-end justify-center gap-2 overflow-visible pl-10">
                <p className="text-base font-bold text-gray-900 leading-none mb-1">Your price today:</p>
                <span className="relative pr-10">
                  <span className="text-3xl font-extrabold text-green-600 leading-none">$19</span>
                  <span className="bg-red-500 text-white text-[9px] font-bold px-1 py-0.5 rounded absolute -top-2 -right-2">61%&nbsp;OFF</span>
                </span>
              </div>
            </div>
            <p className="text-center text-harbor-text/60 text-sm">
              Less than a single parenting book — written specifically about <strong>{name}</strong>.
            </p>
            {submitError && (
              <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2 text-center">{submitError}</p>
            )}
            <button
              type="button"
              onClick={() => void handleBuy()}
              disabled={isSubmitting}
              className="w-full rounded-xl bg-harbor-primary hover:opacity-90 text-white px-5 py-4 font-bold text-lg active:scale-[0.98] transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? "Processing…" : "Get Personalized Report →"}
            </button>
            <div className="flex items-center justify-center gap-2 text-sm font-bold text-gray-900">
              ✅ 14-day money-back guarantee
            </div>
            <PaymentLogos />
          </div>
        </div>

        {/* ── Section 15: Final Money-Back Badge ── */}
        <div className="bg-gray-50 rounded-2xl border border-gray-200 shadow-sm p-6 text-center space-y-3">
          <img
            src="https://www.adhdparenting.com/wp-content/uploads/2026/01/money-back-guarantee.png"
            alt="100% Money-Back Guarantee"
            className="h-28 object-contain mx-auto"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
          <h3 className="text-xl font-bold text-gray-900">100% Money-Back Guarantee</h3>
          <p className="text-gray-700 text-sm leading-relaxed">
            If the report doesn't feel like it was written specifically about your child, email us in the next 14 days and we'll refund you — no questions asked.
          </p>
        </div>

      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
