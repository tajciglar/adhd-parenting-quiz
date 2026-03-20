export function TrustPilotReview() {
  return (
    <div className="flex flex-col items-center space-y-3 mb-6 mt-[-24px] md:mt-0">
      {/* ADHD Parenting logo */}
      <img
        src="/adhd-parenting-logo.png"
        alt="ADHD Parenting"
        className="h-16 object-contain"
      />

      {/* Trustpilot rating */}
      <div className="flex flex-col items-center space-y-1">
        <img
          src="/trustpilot-stars.png"
          alt="Trustpilot 5 stars"
          className="h-8 object-contain"
        />
        <p className="text-xs text-harbor-text/50">
          111.813+ satisfied customers
        </p>
      </div>
    </div>
  );
}
