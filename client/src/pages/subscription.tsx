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
import PaymentSuccessModal from "@/components/PaymentSuccessModal";
import api from "@/lib/api/api";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { TransformApiResponseToPlans } from "@/lib/MapApiPlans";
import { getExpiryLabel } from "@/lib/utils";

/* ================= TYPES ================= */

export type CreditTier = {
  credits: string;
  clipsPerDay: string;
  monthlyPrice: number;
  annualPrice: number;
  planId: number;
  clipLimit: number;
};

export type Plan = {
  id: string;
  name: string;
  tagline: string;
  badge: string | null;
  features: string[];
  cta: string;
  popular: boolean;
  creditTiers: CreditTier[] | null;
  planId?: number;
  fixedMonthlyPrice?: number;
  fixedAnnualPrice?: number;
  // ✅ NEW
  clipLimit?: number;
};

/* ================= COMPONENT ================= */

export default function Subscription() {
  const { refreshUser } = useAuth();

  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">(
    "monthly"
  );
  const [creatorTier, setCreatorTier] = useState(0);
  const [studioTier, setStudioTier] = useState(0);

  const [plans, setPlans] = useState<Plan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [loadingPlanId, setLoadingPlanId] = useState<number | null>(null);

  const [activePlan, setActivePlan] = useState<any>(null);
  const [activePlanId, setActivePlanId] = useState<number | null>(null);
  const [activePlanStatus, setActivePlanStatus] = useState<
    "active" | "inactive" | null
  >(null);
  const [activePlanEndDate, setActivePlanEndDate] = useState<string | null>(
    null
  );
  const [expiredPlanId, setExpiredPlanId] = useState<number | null>(null);

  const [showSuccess, setShowSuccess] = useState(false);
  const [stripeSessionId, setStripeSessionId] = useState<string | null>(null);
  const [sessionDetails, setSessionDetails] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [hasUsedStarter, setHasUsedStarter] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  /* ================= HELPERS ================= */

  const isCurrentSubscription = (plan: Plan) => {
    if (!hasActiveSubscription || !activePlanId) return false;

    // Starter (no tiers)
    if (!plan.creditTiers && plan.planId) {
      return plan.planId === activePlanId;
    }

    // Tiered plans → selected tier only
    if (plan.creditTiers) {
      return getSelectedTierPlanId(plan) === activePlanId;
    }

    return false;
  };

  const isExpiredPlanMatch = (plan: Plan) => {
    if (!expiredPlanId) return false;

    // Starter / fixed-price plan
    if (!plan.creditTiers && plan.planId) {
      return plan.planId === expiredPlanId;
    }

    // Tier-based plans → selected tier only
    if (plan.creditTiers) {
      const selectedIndex = getSelectedTier(plan.id);
      return plan.creditTiers[selectedIndex]?.planId === expiredPlanId;
    }

    return false;
  };

  const hasActiveSubscription =
    Boolean(activePlanId) && activePlanStatus === "active";

  const getSelectedTier = (planId: string) => {
    if (planId === "creator") return creatorTier;
    if (planId === "studio") return studioTier;
    return 0;
  };

  const setSelectedTier = (planId: string, value: number) => {
    if (planId === "creator") setCreatorTier(value);
    if (planId === "studio") setStudioTier(value);
  };

  const getActiveTierIndex = (plan: Plan) => {
    if (!plan.creditTiers || !hasActiveSubscription) return null;

    return plan.creditTiers.findIndex((tier) => tier.planId === activePlanId);
  };

  const getSelectedTierPlanId = (plan: Plan) => {
    if (!plan.creditTiers) return null;

    const selectedIndex = getSelectedTier(plan.id);
    return plan.creditTiers[selectedIndex]?.planId ?? null;
  };

  const isPlanActive = (plan: Plan) => {
    if (!hasActiveSubscription) return false;

    // Fixed-price plan (starter)
    if (!plan.creditTiers && plan.planId) {
      return activePlanId === plan.planId;
    }

    // Tier-based plans
    if (plan.creditTiers) {
      return getSelectedTierPlanId(plan) === activePlanId;
    }

    return false;
  };

  const getPrice = (plan: Plan) => {
    if (plan.creditTiers) {
      const tier = plan.creditTiers[getSelectedTier(plan.id)];
      return `$${tier.monthlyPrice}`;
    }
    return `$${plan.fixedMonthlyPrice}`;
  };

  const getAnnualBilling = (plan: Plan) => {
    if (plan.creditTiers && billingPeriod === "annual") {
      const tier = plan.creditTiers[getSelectedTier(plan.id)];
      return `$${tier.annualPrice} billed annually`;
    }
    return null;
  };

  const getClipsPerDay = (plan: Plan) => {
    if (plan.creditTiers) {
      return plan.creditTiers[getSelectedTier(plan.id)].clipsPerDay;
    }
    return null;
  };

  const getSubscriptionPlans = async () => {
    try {
      setLoadingPlans(true);
      const response: any = await api.getSubscriptionPlansByInterval(
        billingPeriod === "monthly" ? "month" : "year"
      );
      setPlans(TransformApiResponseToPlans(response));
    } catch (error) {
      toast({
        description: getErrorMessage(error || "Something went wrong!"),
        variant: "destructive",
      });
    } finally {
      setLoadingPlans(false);
    }
  };

  const handleSubscribe = async (planId: number) => {
    try {
      setLoadingPlanId(planId);
      const response = await api.purchaseSubscription(planId);
      window.location.href = response.checkout_url;
    } catch (error) {
      toast({
        description: getErrorMessage(error || "Something went wrong!"),
        variant: "destructive",
      });
    } finally {
      setLoadingPlanId(null);
    }
  };

  const handleCancelSubscription = async () => {
    try {
      setCancelling(true);

      const response = await api.cancelSubscription();

      toast({
        description: response.message || "Subscription cancelled",
      });

      setActivePlan(null);
      setActivePlanId(null);
      setHasUsedStarter(true); // still true — starter cannot be reused

      await refreshUser();
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: getErrorMessage(error),
      });
    } finally {
      setCancelling(false);
    }
  };

  const getBackendActivePlan = () => {
    if (!hasActiveSubscription || !activePlanId) return null;

    return plans.find((plan) => {
      // Starter
      if (!plan.creditTiers && plan.planId) {
        return plan.planId === activePlanId;
      }

      // Tiered plans
      if (plan.creditTiers) {
        return plan.creditTiers.some((t) => t.planId === activePlanId);
      }

      return false;
    });
  };

  const handlePlanSelect = async (plan: Plan) => {
    if (isCurrentSubscription(plan)) {
      await handleCancelSubscription();
      return;
    }

    if (hasActiveSubscription) {
      const activePlan = getBackendActivePlan();
      if (!activePlan) return;

      if (plan.id === activePlan.id && plan.creditTiers) {
        const backendActiveTierIndex = plan.creditTiers.findIndex(
          (t) => t.planId === activePlanId
        );

        const selectedTierIndex = getSelectedTier(plan.id);

        if (
          backendActiveTierIndex !== -1 &&
          selectedTierIndex < backendActiveTierIndex
        ) {
          toast({
            variant: "destructive",
            description:
              "Please cancel your current subscription before downgrading.",
          });
          return;
        }
      }
    }

    // ───────────────── Starter ─────────────────
    if (plan.id === "starter" && plan.planId) {
      handleSubscribe(plan.planId);
      return;
    }

    // ───────────────── Tiered plans ─────────────────
    if (plan.creditTiers) {
      const tier = plan.creditTiers[getSelectedTier(plan.id)];
      handleSubscribe(tier.planId);
    }
  };

  const PLAN_RANK: Record<string, number> = {
    starter: 0,
    creator: 1,
    studio: 2,
  };

  const getPlanRank = (plan: Plan) => PLAN_RANK[plan.id] ?? -1;

  const isLowerPlan = (plan: Plan) => {
    if (!hasActiveSubscription) return false;

    const activePlan = plans.find((p) => isPlanActive(p));
    if (!activePlan) return false;

    return getPlanRank(plan) < getPlanRank(activePlan);
  };

  const isHigherPlan = (plan: Plan) => {
    if (!hasActiveSubscription) return false;

    const activePlan = plans.find((p) => isPlanActive(p));
    if (!activePlan) return false;

    return getPlanRank(plan) > getPlanRank(activePlan);
  };

  const isPlanDisabled = (plan: Plan) => {
    if (plan.id === "starter" && hasUsedStarter && !isPlanActive(plan)) {
      return true;
    }

    if (hasActiveSubscription && isLowerPlan(plan)) {
      return true;
    }

    return false;
  };

  const isTierUpgrade = (plan: Plan) => {
    if (!plan.creditTiers || !activePlanId) return false;

    const activeTierIndex = getActiveTierIndex(plan);
    if (activeTierIndex === null) return false;

    const selectedTierIndex = getSelectedTier(plan.id);

    return selectedTierIndex > activeTierIndex;
  };

  const getButtonLabel = (plan: Plan) => {
    if (isCurrentSubscription(plan)) return "Cancel";

    if (hasActiveSubscription && isTierUpgrade(plan)) return "Upgrade";

    if (hasActiveSubscription && isHigherPlan(plan)) return "Upgrade";

    if (plan.id === "starter" && hasUsedStarter) return "Unavailable";

    return plan.cta;
  };

  /* ================= EFFECTS ================= */

  useEffect(() => {
    getSubscriptionPlans();
  }, [billingPeriod]);

  useEffect(() => {
    if (!plans.length || !hasActiveSubscription) return;

    plans.forEach((plan) => {
      if (!plan.creditTiers) return;

      const matchedTierIndex = plan.creditTiers.findIndex(
        (tier) => tier.planId === activePlanId
      );

      if (matchedTierIndex !== -1) {
        setSelectedTier(plan.id, matchedTierIndex);
      }
    });
  }, [plans, activePlanId, hasActiveSubscription]);

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

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoadingUser(true);
        const res = await api.userDetails();
        if (res?.active_plan?.id) {
          setActivePlan(res.active_plan);
          setActivePlanId(res.active_plan.id);
          setActivePlanStatus(res.active_plan.status);
          setActivePlanEndDate(res.active_plan.end_date);
          setExpiredPlanId(res.active_plan.id);

          // starter is considered used if user ever purchased anything
          if (res.active_plan.has_purchased_any_plan) {
            setHasUsedStarter(true);
          }
        }

        if (stripeSessionId) {
          await refreshUser();
          setSessionDetails({
            planName: res?.active_plan?.name,
            date: res?.active_plan?.start_date,
          });
          setShowSuccess(true);
          window.history.replaceState({}, "", "/subscription");
        }
      } finally {
        setLoadingUser(false);
      }
    };

    loadUser();
  }, [stripeSessionId]);

  const isTierActive = (tierPlanId: number) => {
    return hasActiveSubscription && tierPlanId === activePlanId;
  };

  const getSelectedTierLabel = (plan: Plan) => {
    if (!plan.creditTiers) return "";
    return plan.creditTiers[getSelectedTier(plan.id)]?.credits;
  };

  // const formatDate = (isoDate: string) => {
  //   return new Date(isoDate).toLocaleDateString("en-US", {
  //     month: "short",
  //     day: "numeric",
  //     year: "numeric",
  //   });
  // };

  // const getExpiryLabel = (isoDate: string) => {
  //   const today = new Date();
  //   today.setHours(0, 0, 0, 0);

  //   const expiry = new Date(isoDate);
  //   expiry.setHours(0, 0, 0, 0);

  //   if (expiry.getTime() === today.getTime()) {
  //     return "Expiring today";
  //   }

  //   if (expiry > today) {
  //     return `Expiring on ${formatDate(isoDate)}`;
  //   }

  //   return `Expired on ${formatDate(isoDate)}`;
  // };

  /* ================= RENDER ================= */

  if (loadingPlans || loadingUser) {
    return <div className="text-center py-20">Loading...</div>;
  }

  return (
    <>
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <img
            src={logoImage}
            alt="NovarelStudio"
            className="w-24 h-24 mb-6 grayscale self-start"
            style={{ clipPath: "circle(38% at center)" }}
          />
          <h2 className="text-4xl font-semibold">
            Pay for the clips that move your channel
          </h2>
          <div className="flex justify-center gap-2 mt-4">
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

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            return (
              <Card
                key={plan.id}
                className={`relative ${
                  isPlanActive(plan)
                    ? "border-green-500 ring-2 ring-green-500/40"
                    : "border-white/10"
                }`}
              >
                <CardHeader>
                  {plan.badge && (
                    <span className="inline-block text-[10px] mt-2 bg-white/10 px-2 py-1 rounded-full border border-white/20">
                      {plan.badge}
                    </span>
                  )}
                  {isPlanActive(plan) && (
                    <Badge className="absolute top-2 right-4 bg-green-500">
                      Active Plan
                    </Badge>
                  )}
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.tagline}</CardDescription>
                  <div className="text-3xl font-bold mt-3">
                    {getPrice(plan)}
                  </div>

                  {activePlanEndDate && isExpiredPlanMatch(plan) && (
                    <p
                      className={`text-xs mt-1 ${
                        getExpiryLabel(activePlanEndDate).startsWith("Expired")
                          ? "text-red-400"
                          : "text-white/70"
                      }`}
                    >
                      {getExpiryLabel(activePlanEndDate)}
                    </p>
                  )}
                  {getAnnualBilling(plan) && (
                    <p className="text-xs mt-1">{getAnnualBilling(plan)}</p>
                  )}
                </CardHeader>

                <CardContent>
                  {plan.id === "starter" && plan.clipLimit && (
                    <div className="border border-input rounded-md px-[12px] py-[8px]">
                      <p className="text-[14px] text-white leading-[20px]">
                        Upto {plan.clipLimit.toLocaleString()} clips/month
                      </p>
                    </div>
                  )}
                  {plan.creditTiers && (
                    <Select
                      value={getSelectedTier(plan.id).toString()}
                      onValueChange={(v) => setSelectedTier(plan.id, Number(v))}
                    >
                      <SelectTrigger>
                        <SelectValue asChild>
                          <span>{getSelectedTierLabel(plan)}</span>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {plan.creditTiers.map((tier, i) => {
                          const isActiveTier = isTierActive(tier.planId);

                          return (
                            <SelectItem
                              key={i}
                              value={i.toString()}
                              textValue={tier.credits}
                              disabled={
                                hasActiveSubscription &&
                                getActiveTierIndex(plan) !== null &&
                                i < getActiveTierIndex(plan)!
                              }
                            >
                              <div className="flex items-center justify-between w-full">
                                <span>{tier.credits}</span>

                                {isActiveTier && (
                                  <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                                    Current
                                  </span>
                                )}
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  )}

                  {plan.features.map((f, i) => (
                    <div key={i} className="flex gap-2 mt-2">
                      <Check className="w-4 h-4 text-green-400" />
                      <span>{f}</span>
                    </div>
                  ))}
                </CardContent>

                <CardFooter>
                  <Button
                    className="w-full"
                    // disabled={isPlanActive(plan)}
                    disabled={isPlanDisabled(plan)}
                    onClick={() => handlePlanSelect(plan)}
                  >
                    {/* {isPlanActive(plan) ? "Current Plan" : plan.cta} */}
                    {getButtonLabel(plan)}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </section>

      {showSuccess && sessionDetails && (
        <PaymentSuccessModal
          open={showSuccess}
          sessionId={stripeSessionId}
          date={sessionDetails.date}
          planName={sessionDetails.planName}
          onClose={() => (window.location.href = "/dashboard")}
        />
      )}
    </>
  );
}

/* ================= BILLING TOGGLE ================= */

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
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-xs ${
        active ? "bg-white text-black" : "bg-white/10 text-white"
      }`}
    >
      {label}
    </button>
  );
}
