export default function SubscriptionPanel({ subscription, onPlanChange }) {
  const currentPlan = subscription?.plan || "free";

  return (
    <div className="space-y-3">
      <div className="section-title">Subscription</div>
      <div className="text-sm text-slate-600">
        Current plan:{" "}
        <span className="font-semibold text-slate-800">{currentPlan}</span>
      </div>
      <div className="flex gap-2">
        {["free", "pro", "team"].map((plan) => (
          <button
            key={plan}
            className="btn btn-secondary"
            onClick={() => onPlanChange(plan)}
            disabled={plan === currentPlan}
          >
            {plan}
          </button>
        ))}
      </div>
    </div>
  );
}
