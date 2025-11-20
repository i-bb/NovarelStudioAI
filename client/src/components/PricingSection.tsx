import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

export default function PricingSection() {
  const plans = [
    {
      name: "Free",
      tagline: "Try Novarel Studio for free",
      price: "$0",
      period: "",
      badge: null,
      features: [
        "Up to 10 clips/month",
        "720p export quality",
        "Basic AI detection",
        "TikTok & Instagram Reels",
        "3-day video storage",
        "Community support",
      ],
      cta: "Start Free",
      popular: false,
    },
    {
      name: "Creator",
      tagline: "For serious content creators",
      price: "$49",
      period: "/month",
      badge: "MOST POPULAR",
      features: [
        "Unlimited clips",
        "4K export quality",
        "Advanced AI detection",
        "All platforms (TikTok, IG, YouTube)",
        "Unlimited storage",
        "Custom branding",
        "Priority support",
        "Schedule posts",
      ],
      cta: "Get Started",
      popular: true,
    },
    {
      name: "Streamer",
      tagline: "For professional streamers & teams",
      price: "$149",
      period: "/month",
      badge: null,
      features: [
        "Everything in Creator",
        "Multi-stream support",
        "Team collaboration (5 seats)",
        "API access",
        "White-label exports",
        "Dedicated account manager",
        "99.9% uptime SLA",
        "Custom integrations",
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="relative py-24 bg-background overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-accent/5" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary border-primary/20 text-xs font-semibold">
            PRICING — CHOOSE YOUR PLAN
          </Badge>
          <h2 className="text-5xl font-cursive text-foreground mb-4">
            LEVEL UP YOUR CONTENT GAME
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Select the perfect plan for your streaming empire. All plans include 24/7 automated clipping.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative overflow-hidden hover-elevate transition-all ${
                plan.popular
                  ? "border-primary/50 shadow-xl shadow-primary/20 scale-105"
                  : "border-border"
              }`}
              data-testid={`card-pricing-${plan.name.toLowerCase()}`}
            >
              {/* Popular Badge */}
              {plan.badge && (
                <div className="absolute top-0 right-0 left-0">
                  <div className="bg-gradient-to-r from-primary to-accent text-white text-xs font-bold text-center py-2 uppercase tracking-wide">
                    {plan.badge}
                  </div>
                </div>
              )}

              <CardHeader className={plan.badge ? "mt-8" : ""}>
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-2xl font-cursive text-foreground">
                    {plan.name}
                  </CardTitle>
                </div>
                <CardDescription className="text-sm text-muted-foreground">
                  {plan.tagline}
                </CardDescription>
                
                {/* Price */}
                <div className="mt-6 mb-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-cursive text-foreground">{plan.price}</span>
                    {plan.period && (
                      <span className="text-lg text-muted-foreground">{plan.period}</span>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Features List */}
                <div className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3" data-testid={`feature-${plan.name.toLowerCase()}-${idx}`}>
                      <div className="mt-0.5">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                          <Check className="w-3 h-3 text-primary" strokeWidth={3} />
                        </div>
                      </div>
                      <span className="text-sm text-foreground/80">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  className={`w-full font-semibold ${
                    plan.popular
                      ? "bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg shadow-primary/30"
                      : ""
                  }`}
                  variant={plan.popular ? "default" : "outline"}
                  size="lg"
                  data-testid={`button-${plan.name.toLowerCase()}-cta`}
                >
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Footer Note */}
        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            All plans include AI-powered clipping, automatic publishing, and 24/7 monitoring. No credit card required for free plan.
          </p>
        </div>
      </div>
    </section>
  );
}
