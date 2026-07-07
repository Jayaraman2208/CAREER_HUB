import { useAuth } from "../context/AuthContext";
import { upsertUser } from "../lib/db";
import { Button, Card, SectionTitle, Badge } from "../components/ui";
import { cn } from "../utils/cn";

const PLANS = [
  {
    name: "Free" as const,
    price: "₹0",
    period: "forever",
    features: [
      "Coding arena (all problems)",
      "Aptitude trainer with methods",
      "Online compiler (5 languages)",
      "Basic mock interview questions",
    ],
    color: "slate",
  },
  {
    name: "Pro" as const,
    price: "₹499",
    period: "per month",
    features: [
      "Everything in Free",
      "Company-based training tracks",
      "Full interview question bank",
      "Priority resume templates",
      "Detailed analytics",
    ],
    color: "cyan",
    popular: true,
  },
  {
    name: "Premium" as const,
    price: "₹999",
    period: "per month",
    features: [
      "Everything in Pro",
      "1:1 mentor mock interviews",
      "Personalized study plan",
      "Placement guarantee support",
      "Lifetime updates",
    ],
    color: "violet",
  },
];

export default function Pricing() {
  const { user, refresh } = useAuth();

  function choose(plan: "Free" | "Pro" | "Premium") {
    if (!user) return;
    user.plan = plan;
    upsertUser(user);
    refresh();
  }

  return (
    <div>
      <SectionTitle
        title="Subscription Plans"
        subtitle="Company-based training for individuals and teams. Switch any time."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {PLANS.map((p) => {
          const active = user?.plan === p.name;
          return (
            <Card
              key={p.name}
              className={cn(
                "relative flex flex-col",
                p.popular && "border-cyan-400/40 ring-1 ring-cyan-400/30",
              )}
            >
              {p.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge color="cyan">Most Popular</Badge>
                </div>
              )}
              <h3 className="text-lg font-bold text-white">{p.name}</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-black text-white">{p.price}</span>
                <span className="text-sm text-slate-500">/{p.period}</span>
              </div>
              <ul className="mt-5 flex-1 space-y-2.5">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                    <span className="text-emerald-400">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                className="mt-6 w-full"
                variant={active ? "outline" : p.popular ? "primary" : "outline"}
                disabled={active}
                onClick={() => choose(p.name)}
              >
                {active ? "✓ Current Plan" : `Choose ${p.name}`}
              </Button>
            </Card>
          );
        })}
      </div>

      <Card className="mt-6">
        <h3 className="mb-2 text-lg font-bold text-white">
          🏢 Enterprise / College Packages
        </h3>
        <p className="text-sm text-slate-400">
          Training entire batches? We offer bulk licenses, an admin dashboard for
          progress tracking, and custom company-specific question banks. Contact
          the platform administrator for a tailored quote.
        </p>
      </Card>
    </div>
  );
}
