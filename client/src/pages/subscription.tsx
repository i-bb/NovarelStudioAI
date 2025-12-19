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
import { Check } from "lucide-react";
import logoImage from "@assets/ChatGPT Image Nov 26, 2025, 05_11_54 PM_1764195119264.png";
import { Badge } from "@/components/ui/badge";
import { plans } from "@/lib/common";
import PaymentSuccessModal from "@/components/PaymentSuccessModal";
import api from "@/lib/api/api";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { getErrorMessage } from "@/lib/getErrorMessage";

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

export default function Subscription() {
  const [, navigate] = useLocation();
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">(
    "monthly"
  );
  const [creatorTier, setCreatorTier] = useState(0);
  const [studioTier, setStudioTier] = useState(0);
  const [loadingUser, setLoadingUser] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [stripeSessionId, setStripeSessionId] = useState<string | null>(null);
  const [sessionDetails, setSessionDetails] = useState<any>(null);
  const [subsPlans, setSubsPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [loadingPlanId, setLoadingPlanId] = useState<number | null>(null);

  // Active plan state
  const [activePlanId, setActivePlanId] = useState("starter");
  const { refreshUser } = useAuth();

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const getSubscriptionPlans = async () => {
    try {
      setLoadingPlans(true);
      const response: any = await api.getSubscriptionPlans();

      // setSubsPlans(response.plans);
      setSubsPlans(response.plans.sort((a: any, b: any) => a.price - b.price));
    } finally {
      setLoadingPlans(false);
    }
  };

  const handleSubscribe = async (planId: number) => {
    try {
      setLoadingPlanId(planId);
      const response = await api.purchaseSubscription(planId || 0);
      const checkoutUrl = response?.checkout_url;

      if (!checkoutUrl) throw new Error("Stripe checkout URL missing!");
      window.location.href = checkoutUrl;
    } catch (error: any) {
      toast?.({
        description: getErrorMessage(error || "Something went wrong!"),
        variant: "destructive",
      });
    } finally {
      setLoadingPlanId(null);
    }
  };

  // ⭐ PURE MOCK NAVIGATION, NO API, NO STRIPE
  const handlePlanSelect = (planId: string) => {
    setActivePlanId(planId); // mark selected plan as active
    const tier = getSelectedTier(planId);
    const params = new URLSearchParams();

    params.set("plan", planId);
    if (planId !== "starter") {
      params.set("tier", tier.toString());
      params.set("billing", billingPeriod);
    }

    // Navigate locally (mock)
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
      return billingPeriod === "monthly"
        ? `$${tier.monthlyPrice}`
        : `$${tier.annualPrice}`;
    }
    return billingPeriod === "monthly"
      ? plan.fixedMonthlyPrice
      : plan.fixedAnnualPrice;
  };

  const getAnnualBilling = (plan: Plan) => {
    if (plan.creditTiers) {
      const tier = plan.creditTiers[getSelectedTier(plan.id)];
      return `$${tier.annualPrice * 12} billed annually`;
    }
    return null;
  };

  const getClipsPerDay = (plan: Plan) => {
    if (plan.creditTiers)
      return plan.creditTiers[getSelectedTier(plan.id)].clipsPerDay;
    return null;
  };

  const extractSessionIdFromURL = () => {
    let sessionId = null;
    const rawQuery = window.location.search.replace("?", "");
    const parts = rawQuery.split(/[?&]/);
    for (const p of parts) {
      if (p.startsWith("session_id=")) sessionId = p.replace("session_id=", "");
    }
    return sessionId;
  };

  // Load Stripe session and plans
  useEffect(() => {
    const sessionId = extractSessionIdFromURL();
    if (sessionId) setStripeSessionId(sessionId);

    getSubscriptionPlans();
  }, []);

  // Fetch user and handle subscription success
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoadingUser(true);

        const response = await api.userDetails();
        const activePlan = response?.active_plan;

        if (activePlan?.id) {
          const matchedPlan = plans.find((p) => p.planId === activePlan.id);

          if (matchedPlan) {
            setActivePlanId(matchedPlan.id); // "starter" | "creator" | "studio"
          }
        }

        // 🔥 If returning from Stripe AND subscription is active
        if (stripeSessionId) {
          // 🔥 Update global auth
          await refreshUser();

          setSessionDetails({
            planName: activePlan?.name,
            date: activePlan?.start_date,
          });

          setShowSuccess(true);

          // Remove session_id from URL
          window.history.replaceState({}, "", "/subscription");
        }
      } catch (error: any) {
        toast({
          description:
            error?.response?.data?.description || "Error loading user data",
          variant: "destructive",
        });
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUserData();
  }, [stripeSessionId]);

  const isPageLoading = loadingPlans || loadingUser;

  return (
    <>
      {isPageLoading && (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      )}

      <section id="pricing" className="relative pb-10">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          <div className="mb-12 flex flex-col items-center text-center">
            <img
              src={logoImage}
              alt="NovarelStudio"
              className="w-24 h-24 mb-6 grayscale self-start"
              style={{ clipPath: "circle(38% at center)" }}
            />

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold">
              Pay for the clips that actually move your channel
            </h2>

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

          {/* PLANS */}
          <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={`relative flex h-full flex-col rounded-3xl border bg-black/70 backdrop-blur-xl ${
                  activePlanId === plan.id
                    ? "border-green-500 ring-2 ring-green-500/40"
                    : plan.popular
                    ? "border-white/40"
                    : "border-white/10"
                }`}
              >
                <CardHeader>
                  {plan.badge && (
                    <span className="inline-block text-[10px] bg-white/10 px-2 py-1 rounded-full border border-white/20">
                      {plan.badge}
                    </span>
                  )}

                  {activePlanId === plan.id && (
                    <Badge className="absolute top-4 right-4 bg-green-500 text-white px-2 py-0.5 text-[10px]">
                      Active Plan
                    </Badge>
                  )}

                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.tagline}</CardDescription>

                  <div className="mt-4">
                    <div className="text-3xl font-semibold">
                      {getPrice(plan)}
                    </div>

                    {billingPeriod === "annual" && plan.creditTiers && (
                      <p className="text-xs mt-1">{getAnnualBilling(plan)}</p>
                    )}
                  </div>

                  {plan.creditTiers && (
                    <div className="mt-4">
                      <p className="text-xs mb-2">1 credit = 1 clip</p>
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
                          {plan.creditTiers.map((tier, index) => (
                            <SelectItem key={index} value={index.toString()}>
                              {tier.credits}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </CardHeader>

                <CardContent>
                  {plan.creditTiers && (
                    <div className="flex items-center gap-2">
                      <Check className="h-3 w-3 text-emerald-300" />
                      <span>{getClipsPerDay(plan)}</span>
                    </div>
                  )}

                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Check className="h-3 w-3 text-emerald-300" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </CardContent>

                <CardFooter>
                  <Button
                    className="w-full rounded-full"
                    disabled={
                      activePlanId === plan.id || loadingPlanId === plan.planId
                    }
                    // onClick={() => handlePlanSelect(plan.id)}
                    onClick={() => {
                      if (plan.id === "starter") {
                        handlePlanSelect(plan.id);
                      } else {
                        handleSubscribe(plan.planId);
                      }
                    }}
                  >
                    {loadingPlanId === plan.planId
                      ? "Redirecting..."
                      : plan.cta}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {showSuccess && sessionDetails && (
        <PaymentSuccessModal
          open={showSuccess}
          sessionId={stripeSessionId}
          date={formatDate(sessionDetails.date)}
          planName={sessionDetails.planName}
          onClose={() => {
            setShowSuccess(false);
            window.location.href = "/dashboard";
          }}
        />
      )}
    </>
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
