import { useEffect, useState } from "react";
import { trackFunnelEvent } from "../../lib/analytics";

const ALREADY_SUBMITTED = "ALREADY_SUBMITTED";

export default function EmailCaptureScreen({
  childName,
  onSubmit,
  isLoading = false,
  error = null,
}: {
  childName: string;
  onSubmit: (email: string) => void;
  isLoading?: boolean;
  error?: string | null;
}) {
  const [email, setEmail] = useState("");

  useEffect(() => {
    trackFunnelEvent("step_viewed", 45);
  }, []);

  const isAlreadySubmitted = error === ALREADY_SUBMITTED;
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = () => {
    if (!isValid || isLoading) return;
    onSubmit(email.trim());
  };

  return (
    <div className="min-h-[100dvh] bg-harbor-bg flex items-center justify-center px-6 py-12 overflow-y-auto">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold text-harbor-primary leading-snug">
            Where should we send {childName}'s report?
          </h1>
        </div>

        <div className="rounded-2xl border border-harbor-text/10 shadow-sm p-7 space-y-5 text-center" style={{ backgroundColor: "#faf5e8" }}>
          {/* Illustration */}
          <div className="flex justify-center">
            <img
              src="/flow/computer-letter.webp"
              alt="Send results"
              className="h-40 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>

          {/* Already-submitted notice — replaces input when triggered */}
          {isAlreadySubmitted ? (
            <div className="rounded-xl bg-amber-50 border border-amber-200 px-5 py-4 text-left space-y-1">
              <p className="text-sm font-semibold text-amber-800">
                📬 Report already sent!
              </p>
              <p className="text-sm text-amber-700 leading-relaxed">
                We already sent a report to <span className="font-medium">{email}</span>. Check your inbox (and spam folder) — it should be there.
              </p>
            </div>
          ) : (
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit();
              }}
              placeholder="Your email"
              autoFocus
              className="w-full rounded-xl border-2 border-harbor-text/10 focus:border-harbor-primary focus:ring-0 outline-none px-4 py-3.5 text-base text-harbor-text placeholder:text-harbor-text/30 transition-colors bg-white"
            />
          )}

          <p className="text-xs text-harbor-text/40 leading-relaxed">
            We respect your privacy and are committed to protecting your personal data.
          </p>

          {error && !isAlreadySubmitted && (
            <p className="text-sm text-red-500 font-medium">
              {error} — please try again.
            </p>
          )}

          {isAlreadySubmitted ? (
            <button
              type="button"
              onClick={() => {
                // Let them try a different email
                window.location.reload();
              }}
              className="w-full rounded-xl border-2 border-harbor-primary text-harbor-primary px-5 py-4 font-semibold text-base hover:bg-harbor-primary/5 active:scale-[0.98] transition-all cursor-pointer"
            >
              Use a different email
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!isValid || isLoading}
              className="w-full rounded-xl bg-harbor-primary text-white px-5 py-4 font-semibold text-base hover:opacity-90 active:scale-[0.98] transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? "Preparing your report…" : error ? "Try again" : "Continue"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
