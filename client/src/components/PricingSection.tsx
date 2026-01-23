import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import logoImage from "@assets/ChatGPT Image Nov 26, 2025, 05_11_54 PM_1764195119264.png";
import api from "@/lib/api/api";
import { toast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { Plan, TransformApiResponseToPlans } from "@/lib/MapApiPlans";
import { Check } from "lucide-react";

export default function PricingSection() {
  const [, navigate] = useLocation();

  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">(
    "monthly"
  );

  const [plansByBilling, setPlansByBilling] = useState<{
    monthly: Plan[];
    annual: Plan[];
  }>({
    monthly: [],
    annual: [],
  });

  const [creatorTier, setCreatorTier] = useState(0);
  const [studioTier, setStudioTier] = useState(0);
  const [loading, setLoading] = useState(true);

  const plans = plansByBilling[billingPeriod];

  /* ---------------- LOAD PLANS ---------------- */
  useEffect(() => {
    const loadPlans = async () => {
      try {
        setLoading(true);

        const [monthlyRes, annualRes] = await Promise.all([
          api.getSubscriptionPlansByInterval("month"),
          api.getSubscriptionPlansByInterval("year"),
        ]);

        setPlansByBilling({
          monthly: TransformApiResponseToPlans(monthlyRes),
          annual: TransformApiResponseToPlans(annualRes),
        });
      } catch (err) {
        toast({
          description: getErrorMessage(err || "Failed to load plans"),
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadPlans();
  }, []);

  /* ---------------- SAME SIGNUP FLOW (NO CHANGE) ---------------- */
  const handlePlanSelect = (planId: string) => {
    const tier = getSelectedTier(planId);
    const params = new URLSearchParams();

    params.set("plan", planId);
    if (planId !== "starter") {
      params.set("tier", tier.toString());
      params.set("billing", billingPeriod);
    }

    navigate(`/signup?${params.toString()}`);
  };

  const getSelectedTier = (planId: string) => {
    if (planId === "creator") return creatorTier;
    if (planId === "studio") return studioTier;
    return 0;
  };

  const setSelectedTier = (planId: string, value: number) => {
    if (planId === "creator") setCreatorTier(value);
    if (planId === "studio") setStudioTier(value);
  };

  const getPrice = (plan: Plan) => {
    if (plan.creditTiers) {
      const tier = plan.creditTiers[getSelectedTier(plan.id)];
      if (billingPeriod === "annual") {
        return `$${tier.monthlyPrice}/month`;
      } else {
        return `$${tier.price}/month`;
      }
    }
    return `$${plan.fixedMonthlyPrice}`;
  };

  const getAnnualBilling = (plan: Plan) => {
    if (plan.creditTiers && billingPeriod === "annual") {
      const tier = plan.creditTiers[getSelectedTier(plan.id)];
      return `$${tier.price} billed annually`;
    }
    return null;
  };

  const getDailyClipLimit = (plan: Plan) => {
    // Starter plan (no tiers)
    if (!plan.creditTiers) {
      return plan.dailyPostingLimit
        ? `${plan.dailyPostingLimit} clips/day Posting Limit`
        : null;
    }

    // Tier-based plans
    const tier = plan.creditTiers[getSelectedTier(plan.id)];
    return tier?.dailyPostingLimit
      ? `${tier.dailyPostingLimit} clips/day Posting Limit`
      : null;
  };

  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  /* ---------------- UI (UNCHANGED) ---------------- */
  return (
    <section id="pricing" className="relative pb-10">
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="mb-12 flex flex-col items-center text-center">
          <div className="flex-col lg:flex-row flex mt-8 items-center justify-items-center gap-4">
            <img
              src={logoImage}
              alt="NovarelStudio"
              className="w-24 h-24 grayscale self-center lg:self-start"
              style={{ clipPath: "circle(38% at center)" }}
            />

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold">
              Pay for the clips that actually move your channel
            </h2>
          </div>

          <div className="flex gap-2 mt-4">
            <BillingToggleButton
              active={billingPeriod === "monthly"}
              onClick={() => setBillingPeriod("monthly")}
              label="Monthly"
            />
            <BillingToggleButton
              active={billingPeriod === "annual"}
              onClick={() => setBillingPeriod("annual")}
              label="Annual"
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto">
          {plans.map((plan) => {
            return (
              <Card
                key={plan.id}
                className="relative flex h-full flex-col rounded-3xl border bg-black/70 backdrop-blur-xl border-white/10"
              >
                <CardHeader>
                  {plan.badge && (
                    <span className="inline-block text-[10px] bg-white/10 px-2 py-1 rounded-full border border-white/20">
                      {plan.badge}
                    </span>
                  )}

                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.tagline}</CardDescription>

                  <div className="mt-4">
                    <div className="text-3xl font-semibold">
                      {getPrice(plan)}
                    </div>

                    {plan.id !== "starter" && (
                      <p className="text-[14px]">1 credit = 1 clip</p>
                    )}
                    {billingPeriod === "annual" && plan.creditTiers && (
                      <p className="text-xs mt-1">{getAnnualBilling(plan)}</p>
                    )}
                  </div>

                  {plan.creditTiers && (
                    <Select
                      value={getSelectedTier(plan.id).toString()}
                      onValueChange={(v) =>
                        setSelectedTier(plan.id, parseInt(v))
                      }
                    >
                      <SelectTrigger className="w-full bg-black/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {plan.creditTiers.map((tier, i) => (
                          <SelectItem key={i} value={i.toString()}>
                            {tier.credits}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </CardHeader>

                <CardContent className="flex-1">
                  <div className="flex items-center gap-4 py-1">
                    <CheckBadge color="purple" />
                    <span className="text-[14px] text-gray-400">
                      {getDailyClipLimit(plan)}
                    </span>
                  </div>
                  {plan.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-4 py-1">
                      <CheckBadge color="emerald" />
                      <span className="text-[14px] text-gray-400">{f}</span>
                    </div>
                  ))}
                </CardContent>

                <CardFooter>
                  <Button
                    className="w-full border-none bg-primary text-primary-foreground hover:bg-primary/60"
                    onClick={() => handlePlanSelect(plan.id)}
                  >
                    {plan.cta}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function BillingToggleButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      className={`px-3 py-1 rounded-full text-xs ${
        active ? "bg-white text-black" : "bg-white/10 text-white/70"
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

function CheckBadge({ color = "emerald" }: { color?: "emerald" | "purple" }) {
  const colorMap = {
    emerald: "bg-emerald-500/20 text-emerald-300",
    purple: "bg-purple-500/20 text-purple-300",
  };

  return (
    <span
      className={`flex h-5 w-5 items-center justify-center rounded-full ${colorMap[color]}`}
    >
      <Check className="h-3 w-3" />
    </span>
  );
}
