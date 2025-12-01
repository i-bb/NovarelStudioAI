import { useState, useEffect, useMemo } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Zap, Loader2, Check, Crown, Sparkles } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "@/hooks/useAuth";
import { useLocation, Link, useSearch } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type PlanInfo = {
  name: string;
  tagline: string;
  price: string;
  priceId?: string;
  credits: string;
  features: string[];
  badge?: string;
};

const planDetails: Record<string, { name: string; tagline: string; badge?: string; features: string[]; tiers: { credits: string; monthlyPrice: number; annualPrice: number }[] }> = {
  starter: {
    name: "Starter",
    tagline: "Try NovarelStudio on nights and weekends",
    features: ["Up to 10 clips / month", "720p exports", "Basic moment detection", "1 connected platform", "3-day clip history"],
    tiers: [{ credits: "10 clips/month", monthlyPrice: 0, annualPrice: 0 }],
  },
  creator: {
    name: "Creator",
    tagline: "For channels that treat streaming like a job",
    badge: "Most picked by full-time creators",
    features: ["4K exports", "Advanced chat + audio detection", "Instagram Reels auto-posting", "Unlimited clip archive", "Basic branding presets", "Email support"],
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
    features: ["Everything in Creator", "Multi-channel & multi-game workspaces", "Team access (up to 5 seats)", "API + webhooks", "Custom caption + template setup", "Priority support and check-ins"],
    tiers: [
      { credits: "150 clips/month", monthlyPrice: 100, annualPrice: 65 },
      { credits: "250 clips/month", monthlyPrice: 150, annualPrice: 98 },
      { credits: "350 clips/month", monthlyPrice: 200, annualPrice: 130 },
      { credits: "450 clips/month", monthlyPrice: 275, annualPrice: 179 },
    ],
  },
};

export default function SignupPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);

  const planParam = params.get("plan") || "starter";
  const tierParam = parseInt(params.get("tier") || "0");
  const billingParam = (params.get("billing") || "monthly") as "monthly" | "annual";
  const emailParam = params.get("email") || "";

  const [channelName, setChannelName] = useState("");
  const [email, setEmail] = useState(emailParam);
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const { data: plansData } = useQuery<{ products: any[] }>({
    queryKey: ["/api/plans"],
    enabled: planParam !== "starter",
  });

  const selectedPlanInfo = useMemo((): PlanInfo => {
    const planDef = planDetails[planParam] || planDetails.starter;
    const tier = planDef.tiers[tierParam] || planDef.tiers[0];
    const price = billingParam === "monthly" ? tier.monthlyPrice : tier.annualPrice;

    let priceId: string | undefined;
    if (plansData?.products && planParam !== "starter") {
      const product = plansData.products.find(
        (p) => p.metadata?.plan_type === planParam && p.metadata?.tier === tierParam.toString()
      );
      if (product?.prices) {
        const priceObj = product.prices.find((p: any) => 
          p.recurring?.interval === (billingParam === "monthly" ? "month" : "year")
        );
        priceId = priceObj?.id;
      }
    }

    return {
      name: planDef.name,
      tagline: planDef.tagline,
      price: price === 0 ? "Free" : `$${price}/mo`,
      priceId,
      credits: tier.credits,
      features: planDef.features,
      badge: planDef.badge,
    };
  }, [planParam, tierParam, billingParam, plansData]);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      setLocation("/dashboard");
    }
  }, [isAuthenticated, isLoading, setLocation]);

  const signupMutation = useMutation({
    mutationFn: async (data: { email: string; password: string; channelName?: string; plan?: string; planTier?: number; billingPeriod?: string }) => {
      const response = await apiRequest("POST", "/api/auth/signup", data);
      return response.json();
    },
    onSuccess: async (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });

      if (planParam !== "starter" && selectedPlanInfo.priceId) {
        try {
          const checkoutResponse = await apiRequest("POST", "/api/checkout", {
            priceId: selectedPlanInfo.priceId,
            plan: planParam,
            tier: tierParam,
            billing: billingParam,
          });
          const { url } = await checkoutResponse.json();
          if (url) {
            window.location.href = url;
            return;
          }
        } catch (error) {
          console.error("Checkout redirect error:", error);
          toast({
            title: "Account created!",
            description: "Please complete your subscription in the dashboard.",
          });
        }
      } else {
        toast({
          title: "Account created!",
          description: "Welcome to NovarelStudio",
        });
      }
      setLocation("/dashboard");
    },
    onError: (error: Error) => {
      toast({
        title: "Signup failed",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
    },
  });

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    if (password.length < 8) {
      toast({
        title: "Password too short",
        description: "Password must be at least 8 characters",
        variant: "destructive",
      });
      return;
    }
    signupMutation.mutate({
      email,
      password,
      channelName: channelName || undefined,
      plan: planParam,
      planTier: tierParam,
      billingPeriod: billingParam,
    });
  };

  const handleGoogleSignup = () => {
    toast({
      title: "Coming Soon",
      description: "Google signup will be available soon!",
    });
  };

  if (isLoading) {
    return (
      <AppLayout>
        <main className="flex flex-col min-h-screen bg-gradient-to-b from-background via-background/95 to-black/95 pt-24">
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </main>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <main className="flex flex-col min-h-screen bg-gradient-to-b from-background via-background/95 to-black/95 pt-24">
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-4xl grid md:grid-cols-2 gap-6">
            <Card className="p-6 bg-black/60 border-white/10 backdrop-blur-xl order-2 md:order-1">
              <div className="flex items-center gap-2 mb-4">
                {planParam === "studio" ? (
                  <Crown className="w-5 h-5 text-yellow-400" />
                ) : planParam === "creator" ? (
                  <Sparkles className="w-5 h-5 text-primary" />
                ) : (
                  <Zap className="w-5 h-5 text-emerald-400" />
                )}
                <h2 className="font-display text-xl font-semibold text-foreground">
                  {selectedPlanInfo.name} Plan
                </h2>
                {selectedPlanInfo.badge && (
                  <Badge variant="secondary" className="ml-2 text-[10px]">
                    {selectedPlanInfo.badge}
                  </Badge>
                )}
              </div>

              <p className="text-sm text-muted-foreground mb-4">{selectedPlanInfo.tagline}</p>

              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-display font-semibold text-foreground">
                  {selectedPlanInfo.price}
                </span>
                {planParam !== "starter" && (
                  <span className="text-sm text-muted-foreground">
                    {billingParam === "annual" && " (billed annually)"}
                  </span>
                )}
              </div>

              <div className="bg-white/5 rounded-lg p-3 mb-4">
                <p className="text-sm font-medium text-foreground">{selectedPlanInfo.credits}</p>
              </div>

              <div className="space-y-2">
                {selectedPlanInfo.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-400/10">
                      <Check className="h-2.5 w-2.5 text-emerald-300" strokeWidth={3} />
                    </span>
                    <span className="text-sm text-foreground/85">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-white/10">
                <Link href="/#pricing" className="text-sm text-primary hover:text-primary/80">
                  Choose a different plan
                </Link>
              </div>
            </Card>

            <Card className="p-8 bg-black/60 border-white/10 backdrop-blur-xl order-1 md:order-2">
              <div className="flex flex-col items-center mb-8">
                <div className="relative mb-4">
                  <div className="absolute inset-0 bg-primary/20 blur-xl" />
                  <Zap className="w-12 h-12 text-primary relative z-10" fill="currentColor" />
                </div>
                <h1 className="font-display text-3xl font-semibold text-foreground mb-2">
                  {planParam === "starter" ? "Start your journey" : "Complete your signup"}
                </h1>
                <p className="text-sm text-muted-foreground text-center">
                  {planParam === "starter"
                    ? "Turn your streams into viral clips automatically"
                    : "Create your account to continue with checkout"}
                </p>
              </div>

              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="channelName" className="text-sm font-medium text-foreground">
                    Channel name
                  </label>
                  <Input
                    id="channelName"
                    type="text"
                    placeholder="YourChannelName"
                    value={channelName}
                    onChange={(e) => setChannelName(e.target.value)}
                    className="bg-black/40 border-white/20"
                    data-testid="input-name"
                    disabled={signupMutation.isPending}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-foreground">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@yourchannel.gg"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-black/40 border-white/20"
                    data-testid="input-email"
                    disabled={signupMutation.isPending}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-foreground">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-black/40 border-white/20"
                    data-testid="input-password"
                    disabled={signupMutation.isPending}
                  />
                  <p className="text-xs text-muted-foreground">Must be at least 8 characters</p>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 font-semibold"
                  data-testid="button-signup"
                  disabled={signupMutation.isPending}
                >
                  {signupMutation.isPending ? (
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
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-black/60 px-3 text-muted-foreground">or</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleSignup}
                className="w-full h-11 gap-3 border-white/20 bg-white/5 hover:bg-white/10"
                data-testid="button-google-signup"
                disabled={signupMutation.isPending}
              >
                <FcGoogle className="h-5 w-5" />
                Continue with Google
              </Button>

              <p className="mt-4 text-xs text-muted-foreground text-center">
                By signing up, you agree to our Terms of Service and Privacy Policy
              </p>

              <div className="mt-6 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:text-primary/80 font-semibold" data-testid="link-login">
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
