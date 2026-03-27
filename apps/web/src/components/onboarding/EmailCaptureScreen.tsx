import { useState } from "react";

export default function EmailCaptureScreen({
  childName,
  onSubmit,
}: {
  childName: string;
  onSubmit: (email: string) => void;
}) {
  const [email, setEmail] = useState("");

  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = () => {
    if (!isValid) return;
    onSubmit(email.trim());
  };

  return (
    <div className="min-h-[100dvh] flex items-center justify-center px-6 py-12 overflow-y-auto" style={{ backgroundColor: "#faf5e8" }}>
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold text-harbor-primary leading-snug">
            Where should we send {childName}'s report?
          </h1>
        </div>

        <div className="bg-white rounded-2xl border border-harbor-text/10 shadow-sm p-7 space-y-5 text-center">
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

          {/* Email input */}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
            placeholder="Your email"
            autoFocus
            className="w-full rounded-xl border-2 border-harbor-text/10 focus:border-harbor-primary focus:ring-0 outline-none px-4 py-3.5 text-base text-harbor-text placeholder:text-harbor-text/30 transition-colors"
          />

          <p className="text-xs text-harbor-text/40 leading-relaxed">
            We respect your privacy and are committed to protecting your personal data.
          </p>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isValid}
            className="w-full rounded-xl bg-harbor-primary text-white px-5 py-4 font-semibold text-base hover:opacity-90 active:scale-[0.98] transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
