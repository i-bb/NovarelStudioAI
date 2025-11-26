import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, ChevronDown } from "lucide-react";
import logoImage from "@assets/ChatGPT Image Nov 26, 2025, 05_11_54 PM_1764195119264.png";

type CreditTier = {
  credits: string;
  clipsPerDay: string;
  monthlyPrice: number;
  annualPrice: number;
};

type Plan = {
  id: string;
  name: string;
  tagline: string;
  badge: string | null;
  bullet: string;
  features: string[];
  cta: string;
  popular: boolean;
  creditTiers: CreditTier[] | null;
  fixedMonthlyPrice?: string;
  fixedAnnualPrice?: string;
};

export default function PricingSection() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">("monthly");
  const [creatorTier, setCreatorTier] = useState(0);
  const [studioTier, setStudioTier] = useState(0);

  const plans: Plan[] = [
    {
      id: "starter",
      name: "Starter",
      tagline: "Try NovarelStudio on nights and weekends.",
      badge: null,
      bullet: "Best if you're testing the waters.",
      features: [
        "Up to 10 clips / month",
        "720p exports",
        "Basic moment detection",
        "1 connected platform",
        "3-day clip history",
      ],
      cta: "Start free",
      popular: false,
      creditTiers: null,
      fixedMonthlyPrice: "$0",
      fixedAnnualPrice: "$0",
    },
    {
      id: "creator",
      name: "Creator",
      tagline: "For channels that treat streaming like a job.",
      badge: "Most picked by full-time creators",
      bullet: "Best if you stream 3–6 nights a week.",
      features: [
        "4K exports",
        "Advanced chat + audio detection",
        "Instagram Reels auto-posting",
        "Unlimited clip archive",
        "Basic branding presets",
        "Email support",
      ],
      cta: "Use on my next stream",
      popular: true,
      creditTiers: [
        { credits: "60 clips/month", clipsPerDay: "About 2 clips/day", monthlyPrice: 35, annualPrice: 23 },
        { credits: "120 clips/month", clipsPerDay: "About 4 clips/day", monthlyPrice: 55, annualPrice: 36 },
        { credits: "200 clips/month", clipsPerDay: "About 7 clips/day", monthlyPrice: 75, annualPrice: 49 },
        { credits: "300 clips/month", clipsPerDay: "About 10 clips/day", monthlyPrice: 95, annualPrice: 62 },
      ],
    },
    {
      id: "studio",
      name: "Studio",
      tagline: "For partnered channels and small teams.",
      badge: "For serious growth pushes",
      bullet: "Best if you run multiple channels or games.",
      features: [
        "Everything in Creator",
        "Multi-channel & multi-game workspaces",
        "Team access (up to 5 seats)",
        "API + webhooks",
        "Custom caption + template setup",
        "Priority support and check-ins",
      ],
      cta: "Talk to the team",
      popular: false,
      creditTiers: [
        { credits: "150 clips/month", clipsPerDay: "About 5 clips/day", monthlyPrice: 100, annualPrice: 65 },
        { credits: "250 clips/month", clipsPerDay: "About 8 clips/day", monthlyPrice: 150, annualPrice: 98 },
        { credits: "350 clips/month", clipsPerDay: "About 12 clips/day", monthlyPrice: 200, annualPrice: 130 },
        { credits: "450 clips/month", clipsPerDay: "About 15 clips/day", monthlyPrice: 275, annualPrice: 179 },
      ],
    },
  ];

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
      const price = billingPeriod === "monthly" ? tier.monthlyPrice : tier.annualPrice;
      return `$${price}`;
    }
    return billingPeriod === "monthly" ? plan.fixedMonthlyPrice : plan.fixedAnnualPrice;
  };

  const getAnnualBilling = (plan: Plan) => {
    if (plan.creditTiers) {
      const tier = plan.creditTiers[getSelectedTier(plan.id)];
      const annual = tier.annualPrice * 12;
      return `$${annual} billed annually`;
    }
    return null;
  };

  const getClipsPerDay = (plan: Plan) => {
    if (plan.creditTiers) {
      const tier = plan.creditTiers[getSelectedTier(plan.id)];
      return tier.clipsPerDay;
    }
    return null;
  };

  return (
    <section id="pricing" className="relative py-20">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(88,28,135,0.5),_transparent_60%),radial-gradient(circle_at_bottom,_rgba(16,185,129,0.2),_transparent_60%)] opacity-70" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
        <div className="mb-12 flex flex-col items-center text-center">
          <img src={logoImage} alt="NovarelStudio" className="w-24 h-24 rounded-3xl mb-6 opacity-80 mix-blend-screen self-start" />
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground mb-4">
            Pay for the clips that actually move your channel
          </h2>
          <p className="max-w-2xl text-sm sm:text-base text-muted-foreground/90 mb-8">
            All tiers include always-on clipping. Pick how aggressive you want NovarelStudio to be about turning streams into posts.
          </p>
          <div className="flex flex-col items-center gap-3">
            <div className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-black/60 p-1">
              <BillingToggleButton
                active={billingPeriod === "monthly"}
                onClick={() => setBillingPeriod("monthly")}
                label="Monthly"
                testId="button-billing-monthly"
              />
              <BillingToggleButton
                active={billingPeriod === "annual"}
                onClick={() => setBillingPeriod("annual")}
                label="Annual"
                testId="button-billing-annual"
              />
            </div>
            <div className="inline-flex items-center gap-2 text-[11px] text-muted-foreground">
              <span className="rounded-full bg-emerald-400/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">Save 35%</span>
              on annual billing
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative flex h-full flex-col overflow-hidden rounded-3xl border bg-black/70 backdrop-blur-xl transition-transform duration-200 ${
                plan.popular
                  ? "border-white/40 shadow-[0_20px_70px_rgba(15,23,42,0.95)] md:-translate-y-2"
                  : "border-white/10"
              }`}
              data-testid={`card-pricing-${plan.id}`}
            >
              <CardHeader className={`pb-4 ${plan.badge ? 'pt-5' : 'pt-8'}`}>
                {plan.badge && (
                  <div className="flex justify-end mb-3">
                    <span className="inline-flex items-center rounded-full bg-white/10 px-2 sm:px-3 py-1 text-[8px] sm:text-[10px] font-medium uppercase tracking-[0.12em] sm:tracking-[0.18em] text-slate-100 border border-white/30 text-center leading-tight">
                      {plan.badge}
                    </span>
                  </div>
                )}
                <CardTitle className="mb-1 text-xl font-semibold text-foreground">{plan.name}</CardTitle>
                <CardDescription className="text-xs sm:text-sm text-muted-foreground/90">
                  {plan.tagline}
                </CardDescription>

                <div className="mt-5">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-display font-semibold text-foreground">
                      {getPrice(plan)}
                    </span>
                    {plan.creditTiers && <span className="text-xs sm:text-sm text-muted-foreground">/month</span>}
                  </div>
                  {billingPeriod === "annual" && plan.creditTiers && (
                    <p className="mt-1 text-[11px] text-muted-foreground/80">{getAnnualBilling(plan)}</p>
                  )}
                  <p className="mt-2 text-[11px] text-muted-foreground/90">{plan.bullet}</p>
                </div>

                {plan.creditTiers && (
                  <div className="mt-4">
                    <p className="text-[11px] text-muted-foreground mb-2">1 credit = 1 clip</p>
                    <Select
                      value={getSelectedTier(plan.id).toString()}
                      onValueChange={(value) => setSelectedTier(plan.id, parseInt(value))}
                    >
                      <SelectTrigger 
                        className="w-full bg-black/60 border-white/15 text-sm text-foreground"
                        data-testid={`select-credits-${plan.id}`}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-black/95 border-white/15 backdrop-blur-xl">
                        {plan.creditTiers.map((tier, idx) => (
                          <SelectItem 
                            key={idx} 
                            value={idx.toString()}
                            className="text-sm text-foreground hover:bg-white/10"
                            data-testid={`option-credits-${plan.id}-${idx}`}
                          >
                            {tier.credits}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardHeader>

              <CardContent className="flex-1 space-y-3 pb-4">
                <div className="space-y-2.5">
                  {plan.creditTiers && (
                    <div
                      className="flex items-start gap-2.5"
                      data-testid={`feature-${plan.id}-clips-per-day`}
                    >
                      <span className="mt-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary/20">
                        <Check className="h-2.5 w-2.5 text-primary" strokeWidth={3} />
                      </span>
                      <span className="text-xs sm:text-sm text-foreground font-medium">{getClipsPerDay(plan)}</span>
                    </div>
                  )}
                  {plan.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5"
                      data-testid={`feature-${plan.id}-${idx}`}
                    >
                      <span className="mt-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-400/10">
                        <Check className="h-2.5 w-2.5 text-emerald-300" strokeWidth={3} />
                      </span>
                      <span className="text-xs sm:text-sm text-foreground/85">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>

              <CardFooter className="pt-0 pb-5 px-4 sm:px-6">
                <Button
                  className={`w-full rounded-full text-[11px] sm:text-xs md:text-sm font-semibold ${
                    plan.popular
                      ? "bg-white text-black hover:bg-slate-100 shadow-[0_16px_60px_rgba(15,23,42,0.95)]"
                      : "bg-black/60 text-foreground border border-white/25 hover:bg-black"
                  }`}
                  variant={plan.popular ? "default" : "outline"}
                  size="sm"
                  data-testid={`button-${plan.id}-cta`}
                >
                  <span className="truncate">{plan.cta}</span>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center gap-1 text-[11px] sm:text-xs text-muted-foreground/85 text-center">
          <p>All plans include clipping, automated posting and 24/7 monitoring of your streams.</p>
          <p>No credit card required for Starter. Upgrade once you&apos;re happy with what lands in your feeds.</p>
        </div>
      </div>
    </section>
  );
}

function BillingToggleButton({
  active,
  onClick,
  label,
  testId,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  testId: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-testid={testId}
      className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-medium transition-colors ${
        active ? "bg-white text-black" : "bg-transparent text-muted-foreground"
      }`}
    >
      {label}
    </button>
  );
}
