import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

export default function PricingSection() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">("monthly");

  const plans = [
    {
      id: "starter",
      name: "Starter",
      tagline: "Try NovarelStudio on nights and weekends.",
      monthlyPrice: "$0",
      annualPrice: "$0",
      period: "",
      annualBilling: null,
      badge: null,
      bullet: "Best if you&apos;re testing the waters.",
      features: [
        "Up to 10 AI clips / month",
        "720p exports",
        "Basic moment detection",
        "1 connected platform",
        "3-day clip history",
      ],
      cta: "Start free",
      popular: false,
    },
    {
      id: "creator",
      name: "Creator",
      tagline: "For channels that treat streaming like a job.",
      monthlyPrice: "$49",
      annualPrice: "$32",
      period: "/month",
      annualBilling: "$382 billed annually",
      badge: "Most picked by full-time creators",
      bullet: "Best if you stream 3–6 nights a week.",
      features: [
        "Up to 5 clips / day",
        "4K exports",
        "Advanced chat + audio detection",
        "Instagram Reels auto-posting",
        "Unlimited clip archive",
        "Basic branding presets",
        "Email support",
      ],
      cta: "Use on my next stream",
      popular: true,
    },
    {
      id: "studio",
      name: "Studio",
      tagline: "For partnered channels and small teams.",
      monthlyPrice: "$149",
      annualPrice: "$97",
      period: "/month",
      annualBilling: "$1,162 billed annually",
      badge: "For serious growth pushes",
      bullet: "Best if you run multiple channels or games.",
      features: [
        "Up to 12 clips / day",
        "Everything in Creator",
        "Multi-channel & multi-game workspaces",
        "Team access (up to 5 seats)",
        "API + webhooks",
        "Custom caption + template setup",
        "Priority support and check-ins",
      ],
      cta: "Talk to the team",
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="relative py-20">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(79,70,229,0.35),_transparent_60%),radial-gradient(circle_at_bottom,_rgba(16,185,129,0.2),_transparent_60%)] opacity-70" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
        <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <Badge
              variant="secondary"
              className="mb-3 bg-black/60 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground border border-white/20"
            >
              Pricing
            </Badge>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-foreground mb-3">
              Pay for the clips that actually move your channel
            </h2>
            <p className="max-w-xl text-sm sm:text-base text-muted-foreground/90">
              All tiers include always-on clipping. Pick how aggressive you want NovarelStudio to be about turning streams into posts.
            </p>
          </div>
          <div className="flex flex-col items-start sm:items-end gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/60 px-2 py-1 text-[11px] text-muted-foreground">
              <span className="rounded-full bg-emerald-400/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">Save 35%</span>
              on annual billing
            </div>
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
              {plan.badge && (
                <div className="absolute inset-x-4 top-4 z-10 flex justify-end">
                  <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-slate-100 border border-white/30">
                    {plan.badge}
                  </span>
                </div>
              )}

              <CardHeader className="pt-8 pb-4">
                <CardTitle className="mb-1 text-xl font-semibold text-foreground">{plan.name}</CardTitle>
                <CardDescription className="text-xs sm:text-sm text-muted-foreground/90">
                  {plan.tagline}
                </CardDescription>

                <div className="mt-5">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-display font-semibold text-foreground">
                      {billingPeriod === "monthly" ? plan.monthlyPrice : plan.annualPrice}
                    </span>
                    {plan.period && <span className="text-xs sm:text-sm text-muted-foreground">{plan.period}</span>}
                  </div>
                  {billingPeriod === "annual" && plan.annualBilling && (
                    <p className="mt-1 text-[11px] text-muted-foreground/80">{plan.annualBilling}</p>
                  )}
                  <p className="mt-2 text-[11px] text-muted-foreground/90">{plan.bullet}</p>
                </div>
              </CardHeader>

              <CardContent className="flex-1 space-y-3 pb-4">
                <div className="space-y-2.5">
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

              <CardFooter className="pt-0 pb-5 px-6">
                <Button
                  className={`w-full rounded-full text-xs sm:text-sm font-semibold ${
                    plan.popular
                      ? "bg-white text-black hover:bg-slate-100 shadow-[0_16px_60px_rgba(15,23,42,0.95)]"
                      : "bg-black/60 text-foreground border border-white/25 hover:bg-black"
                  }`}
                  variant={plan.popular ? "default" : "outline"}
                  size="sm"
                  data-testid={`button-${plan.id}-cta`}
                >
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center gap-1 text-[11px] sm:text-xs text-muted-foreground/85 text-center">
          <p>All plans include AI-powered clipping, automated posting and 24/7 monitoring of your streams.</p>
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
