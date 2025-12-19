import { useState, useMemo } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Zap, Check, Crown, Sparkles, Loader2 } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { useLocation, Link, useSearch } from "wouter";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api/api";
import { getErrorMessage } from "@/lib/getErrorMessage";

type PlanInfo = {
  name: string;
  tagline: string;
  price: string;
  credits: string;
  features: string[];
  badge?: string;
};

const planDetails: Record<
  string,
  {
    name: string;
    tagline: string;
    badge?: string;
    features: string[];
    tiers: { credits: string; monthlyPrice: number; annualPrice: number }[];
  }
> = {
  starter: {
    name: "Starter",
    tagline: "Try NovarelStudio on nights and weekends",
    features: [
      "Up to 10 clips / month",
      "720p exports",
      "Basic moment detection",
      "1 connected platform",
      "3-day clip history",
    ],
    tiers: [{ credits: "10 clips/month", monthlyPrice: 0, annualPrice: 0 }],
  },
  creator: {
    name: "Creator",
    tagline: "For channels that treat streaming like a job",
    badge: "Most picked by full-time creators",
    features: [
      "4K exports",
      "Advanced chat + audio detection",
      "Instagram Reels auto-posting",
      "Unlimited clip archive",
      "Basic branding presets",
      "Email support",
    ],
    tiers: [
      { credits: "60 clips/month", monthlyPrice: 35, annualPrice: 23 },
      { credits: "120 clips/month", monthlyPrice: 55, annualPrice: 36 },
      { credits: "200 clips/month", monthlyPrice: 75, annualPrice: 49 },
      { credits: "300 clips/month", monthlyPrice: 95, annualPrice: 62 },
    ],
  },
  studio: {
    name: "Studio",
    tagline: "For partnered channels and small teams",
    badge: "For serious growth pushes",
    features: [
      "Everything in Creator",
      "Multi-channel & multi-game workspaces",
      "Team access (up to 5 seats)",
      "API + webhooks",
      "Custom caption + template setup",
      "Priority support and check-ins",
    ],
    tiers: [
      { credits: "150 clips/month", monthlyPrice: 100, annualPrice: 65 },
      { credits: "250 clips/month", monthlyPrice: 150, annualPrice: 98 },
      { credits: "350 clips/month", monthlyPrice: 200, annualPrice: 130 },
      { credits: "450 clips/month", monthlyPrice: 275, annualPrice: 179 },
    ],
  },
};

const STATIC_PLAN_ID_MAP: Record<string, number> = {
  starter: 2,
  creator: 1,
  studio: 3,
};

export default function SignupPage() {
  const [, setLocation] = useLocation();
  const search = useSearch();
  const params = new URLSearchParams(search);

  const planParam = params.get("plan") || "starter";
  const tierParam = Math.max(0, parseInt(params.get("tier") || "0"));
  const billingParam = (params.get("billing") || "monthly") as
    | "monthly"
    | "annual";
  const emailParam = params.get("email") || "";

  console.log("planParam", planParam);

  const [name, setName] = useState("");
  const [email, setEmail] = useState(emailParam);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();

  const selectedPlanInfo = useMemo((): PlanInfo => {
    const planDef = planDetails[planParam] || planDetails.starter;
    const tier = planDef.tiers[tierParam] || planDef.tiers[0];
    const price =
      billingParam === "monthly" ? tier.monthlyPrice : tier.annualPrice;

    return {
      name: planDef.name,
      tagline: planDef.tagline,
      price: price === 0 ? "Free" : `$${price}/mo`,
      credits: tier.credits,
      features: planDef.features,
      badge: planDef.badge,
    };
  }, [planParam, tierParam, billingParam]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast({ title: "Name is required", variant: "destructive" });
      return;
    }
    if (!email.trim()) {
      toast({ title: "Email is required", variant: "destructive" });
      return;
    }
    if (password.length < 8) {
      toast({
        description: "Password is too short. Minimum 8 characters",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.signup({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      // Save auth
      localStorage.setItem("auth_token", response?.access_token);
      localStorage.setItem("auth_user", JSON.stringify(response.user));

      toast({ description: "Your account has been created successfully" });

      // ───────────────────────────────
      // STARTER PLAN → NO STRIPE
      // ───────────────────────────────
      if (planParam === "starter") {
        const updatedUser = {
          ...response.user,
          active_plan: {
            id: STATIC_PLAN_ID_MAP.starter,
            slug: "starter",
            name: "Starter",
            status: "Active",
          },
        };

        localStorage.setItem("auth_user", JSON.stringify(updatedUser));

        setLocation("/dashboard");
        return;
      }

      const planId = STATIC_PLAN_ID_MAP[planParam];

      if (!planId) {
        throw new Error("Invalid subscription plan selected");
      }

      const subRes = await api.purchaseSubscription(planId);

      if (subRes?.checkout_url) {
        window.location.href = subRes.checkout_url;
        return;
      }

      throw new Error("Failed to initiate subscription checkout");
    } catch (error: any) {
      toast({
        description: getErrorMessage(
          error,
          "Failed to create account. Please try again."
        ),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    toast({
      title: "Coming Soon",
      description: "Google signup will be available soon!",
    });
  };

  return (
    <AppLayout>
      <main className="flex flex-col min-h-screen bg-gradient-to-b from-background via-background/95 to-black/95 pt-24">
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-4xl grid md:grid-cols-2 gap-6">
            {/* Plan Summary */}
            <Card className="p-6 bg-black/60 border-white/10 backdrop-blur-xl order-2 md:order-1">
              <div className="flex items-center gap-2 mb-4">
                {planParam === "studio" ? (
                  <Crown className="w-5 h-5 text-yellow-400" />
                ) : planParam === "creator" ? (
                  <Sparkles className="w-5 h-5 text-primary" />
                ) : (
                  <Zap className="w-5 h-5 text-emerald-400" />
                )}
                <h2 className="font-display text-xl font-semibold">
                  {selectedPlanInfo.name} Plan
                </h2>
                {selectedPlanInfo.badge && (
                  <Badge variant="secondary" className="ml-2 text-[10px]">
                    {selectedPlanInfo.badge}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                {selectedPlanInfo.tagline}
              </p>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-display font-semibold">
                  {selectedPlanInfo.price}
                </span>
                {planParam !== "starter" && (
                  <span className="text-sm text-muted-foreground">
                    {billingParam === "annual" && " (billed annually)"}
                  </span>
                )}
              </div>
              <div className="bg-white/5 rounded-lg p-3 mb-4">
                <p className="text-sm font-medium">
                  {selectedPlanInfo.credits}
                </p>
              </div>
              <div className="space-y-2">
                {selectedPlanInfo.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-400/10">
                      <Check
                        className="h-2.5 w-2.5 text-emerald-300"
                        strokeWidth={3}
                      />
                    </span>
                    <span className="text-sm text-foreground/85">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-white/10">
                <Link
                  href="/pricing"
                  className="text-sm text-primary hover:text-primary/80"
                >
                  Choose a different plan
                </Link>
              </div>
            </Card>

            {/* Signup Form */}
            <Card className="p-8 bg-black/60 border-white/10 backdrop-blur-xl order-1 md:order-2">
              <div className="flex flex-col items-center mb-8">
                <div className="relative mb-4">
                  <div className="absolute inset-0 bg-primary/20 blur-xl" />
                  <Zap
                    className="w-12 h-12 text-primary relative z-10"
                    fill="currentColor"
                  />
                </div>
                <h1 className="font-display text-3xl font-semibold mb-2">
                  {planParam === "starter"
                    ? "Start your journey"
                    : "Complete your signup"}
                </h1>
                <p className="text-sm text-muted-foreground text-center">
                  {planParam === "starter"
                    ? "Turn your streams into viral clips automatically"
                    : "Create your account to continue with checkout"}
                </p>
              </div>

              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Name
                  </label>
                  <Input
                    id="name"
                    placeholder="Jane Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isLoading}
                    // required
                    className="bg-black/40 border-white/20"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@yourchannel.gg"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    required
                    className="bg-black/40 border-white/20"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    required
                    className="bg-black/40 border-white/20"
                  />
                  <p className="text-xs text-muted-foreground">
                    Must be at least 8 characters
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 font-semibold"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : planParam === "starter" ? (
                    "Create Account"
                  ) : (
                    "Create Account & Continue to Payment"
                  )}
                </Button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-black/60 px-3 text-muted-foreground">
                    or
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                onClick={handleGoogleSignup}
                disabled={isLoading}
                className="w-full h-11 gap-3 border-white/20 bg-white/5 hover:bg-white/10"
              >
                <FcGoogle className="h-5 w-5" />
                Continue with Google
              </Button>

              <p className="mt-4 text-xs text-muted-foreground text-center">
                By signing up, you agree to our Terms of Service and Privacy
                Policy
              </p>

              <div className="mt-6 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-primary hover:text-primary/80 font-semibold"
                >
                  Sign in
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </AppLayout>
  );
}
