export default function CredibilityScreen({
  onContinue,
}: {
  onContinue: () => void;
}) {
  return (
    <div className="min-h-[100dvh] bg-harbor-bg flex items-center justify-center px-6 py-12 overflow-y-auto">
      <div className="max-w-md w-full space-y-6">
        <div className="bg-white rounded-2xl border border-harbor-text/10 shadow-sm p-7 space-y-5 text-center">
          <img
            src="/flow/Our Team no Juhi.png"
            alt="ADHD Parenting team"
            className="w-full rounded-xl object-cover"
          />

          <h2 className="text-xl font-bold text-harbor-primary leading-snug">
            This assessment was built by the team behind ADHD Parenting
          </h2>

          <p className="text-harbor-text leading-relaxed">
            Trusted by thousands of parents through our courses, ebooks,
            webinars, coaching and the World's Largest ADHD Parenting Summit
            with 300.000+ participants.
          </p>

          <div className="flex items-center justify-center gap-2">
            <img
              src="/flow/credibility-people.png"
              alt="Satisfied parents"
              className="h-6 object-contain"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
            <p className="text-harbor-text/50 text-sm font-semibold">
              111,813+ satisfied parents
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onContinue}
          className="w-full rounded-xl bg-harbor-primary text-white px-5 py-4 font-semibold text-base hover:opacity-90 active:scale-[0.98] transition-all shadow-sm"
        >
          I'm ready →
        </button>
      </div>
    </div>
  );
}
