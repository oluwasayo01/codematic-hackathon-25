interface Plan {
  name: string;
  price: string;
  features: string[];
  highlighted?: boolean;
}

const plans: Plan[] = [
  {
    name: "Starter",
    price: "Free",
    features: ["Limited Challenges", "Basic Progress Tracking", "Community Access"],
  },
  {
    name: "Pro",
    price: "$9 / month",
    highlighted: true,
    features: [
      "Daily Personalized Challenges",
      "Full Performance Analytics",
      "AI-Powered Feedback",
      "Priority Support",
    ],
  },
  {
    name: "Elite",
    price: "$19 / month",
    features: [
      "Everything in Pro",
      "One-on-One Coaching Sessions",
      "Advanced Speaking Score Reports",
    ],
  },
];

export function PricingCards() {
  return (
    <div className="grid gap-6 md:grid-cols-3 mt-10">
      {plans.map((plan) => (
        <div
          key={plan.name}
          className={`p-6 rounded-xl border shadow-sm ${
            plan.highlighted
              ? "border-blue-600 shadow-md bg-blue-50"
              : "border-gray-200"
          }`}
        >
          <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
          <p className="text-3xl font-semibold mb-4">{plan.price}</p>

          <ul className="space-y-2 text-gray-600 mb-6">
            {plan.features.map((feature) => (
              <li key={feature}>• {feature}</li>
            ))}
          </ul>

          <button
            className={`w-full py-2 rounded font-medium transition ${
              plan.highlighted
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "border border-gray-300 hover:bg-gray-100"
            }`}
          >
            Get Started
          </button>
        </div>
      ))}
    </div>
  );
}
