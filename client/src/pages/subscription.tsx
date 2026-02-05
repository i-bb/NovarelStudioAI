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
import { Check, CircleAlert } from "lucide-react";
import logoImage from "@assets/ChatGPT Image Nov 26, 2025, 05_11_54 PM_1764195119264.png";
import { Badge } from "@/components/ui/badge";
import PaymentSuccessModal from "@/components/PaymentSuccessModal";
import api from "@/lib/api/api";
import { toast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { Plan, TransformApiResponseToPlans } from "@/lib/MapApiPlans";
import { getExpiryLabel } from "@/lib/utils";
import { useAuth } from "@/hooks/AuthContext";
import { trackEvent } from "@/lib/ga";
import CancelSubscriptionModal from "@/components/CancelSubscriptionModal";

export default function Subscription() {
  const { refreshUser } = useAuth();

  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">(
    "monthly"
  );

  const [creatorTier, setCreatorTier] = useState(0);
  const [studioTier, setStudioTier] = useState(0);

  const [loadingPlans, setLoadingPlans] = useState(true);
  const [plansByInterval, setPlansByInterval] = useState<{
    monthly: Plan[];
    annual: Plan[];
  }>({
    monthly: [],
    annual: [],
  });

  const [activePlanId, setActivePlanId] = useState<number | null>(null);
  const [activePlanStatus, setActivePlanStatus] = useState<
    "active" | "inactive" | null
  >(null);
  const [activePlanEndDate, setActivePlanEndDate] = useState<string | null>(
    null
  );
  const [expiredPlanId, setExpiredPlanId] = useState<number | null>(null);
  const [activeInterval, setActiveInterval] = useState<string | null>(null);

  const [showSuccess, setShowSuccess] = useState(false);
  const [stripeSessionId, setStripeSessionId] = useState<string | null>(null);
  const [sessionDetails, setSessionDetails] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [hasUsedStarter, setHasUsedStarter] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [loadingPlanId, setLoadingPlanId] = useState<number | null>(null);
  const [userLoaded, setUserLoaded] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  /* ================= DERIVED ================= */

  const selctedPlans =
    billingPeriod === "monthly"
      ? plansByInterval.monthly
      : plansByInterval.annual;

  const hasActiveSubscription =
    Boolean(activePlanId) && activePlanStatus === "active";

  const isBillingDowngradeBlocked =
    hasActiveSubscription &&
    activeInterval === "year" &&
    billingPeriod === "monthly";

  const PLAN_RANK: Record<string, number> = {
    starter: 0,
    creator: 1,
    studio: 2,
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

  const getSelectedTierPlanId = (plan: Plan) =>
    plan.creditTiers?.[getSelectedTier(plan.id)]?.planId ?? null;

  const activeBackendPlan = selctedPlans.find((plan) => {
    if (!hasActiveSubscription) return false;

    if (!plan.creditTiers && plan.planId) {
      return plan.planId === activePlanId;
    }

    return plan.creditTiers?.some((t) => t.planId === activePlanId);
  });

  const getActiveTierIndex = (plan: Plan) => {
    if (!plan.creditTiers || !activePlanId) return null;
    return plan.creditTiers.findIndex((t) => t.planId === activePlanId);
  };

  const isTierDowngrade = (plan: Plan) => {
    if (!hasActiveSubscription) return false;
    if (!plan.creditTiers) return false;
    if (plan.id !== activeBackendPlan?.id) return false;

    const activeIndex = getActiveTierIndex(plan);
    if (activeIndex === null) return false;

    return getSelectedTier(plan.id) < activeIndex;
  };

  const isPlanActive = (plan: Plan) => {
    if (!hasActiveSubscription) return false;

    if (!plan.creditTiers && plan.planId) {
      return plan.planId === activePlanId;
    }

    return getSelectedTierPlanId(plan) === activePlanId;
  };

  const isExpiredPlanMatch = (plan: Plan) => {
    if (!expiredPlanId) return false;

    if (!plan.creditTiers && plan.planId) {
      return plan.planId === expiredPlanId;
    }

    return plan.creditTiers?.some((t) => t.planId === expiredPlanId);
  };

  const isTierUpgrade = (plan: Plan) => {
    const activeIndex = getActiveTierIndex(plan);
    if (activeIndex === null) return false;
    return getSelectedTier(plan.id) > activeIndex;
  };

  const isHigherPlan = (plan: Plan) =>
    activeBackendPlan && PLAN_RANK[plan.id] > PLAN_RANK[activeBackendPlan.id];

  const isLowerPlan = (plan: Plan) =>
    activeBackendPlan && PLAN_RANK[plan.id] < PLAN_RANK[activeBackendPlan.id];

  const isPlanDisabled = (plan: Plan) => {
    // 🔴 Billing downgrade: annual → monthly

    if (isBillingDowngradeBlocked) {
      return true;
    }

    if (plan.id === "starter" && hasUsedStarter && !isPlanActive(plan)) {
      return true;
    }

    if (hasActiveSubscription && isLowerPlan(plan)) {
      return true;
    }

    if (isTierDowngrade(plan)) {
      return true;
    }

    return false;
  };

  const getButtonLabel = (plan: Plan) => {
    // 🔴 Billing downgrade blocked
    if (isBillingDowngradeBlocked) {
      return "Unavailable";
    }

    if (isPlanActive(plan)) return "Cancel Subscription";

    if (hasActiveSubscription && isLowerPlan(plan)) {
      return "Unavailable";
    }

    if (hasActiveSubscription && isTierUpgrade(plan)) {
      return "Upgrade";
    }

    if (isTierDowngrade(plan)) {
      return "Unavailable";
    }

    if (hasActiveSubscription && isHigherPlan(plan)) {
      return "Upgrade";
    }

    if (plan.id === "starter" && hasUsedStarter) {
      return "Unavailable";
    }

    return plan.cta;
  };

  const getButtonClass = (label: string) => {
    switch (label.toLowerCase()) {
      case "cancel subscription":
        return "bg-red-900 border-none hover:bg-red-800 text-white";
      case "upgrade":
        return "bg-primary border-none hover:bg-primary/60 text-white";
      case "unavailable":
        return "bg-gray-500 border-none text-white cursor-not-allowed";
      case "subscribe":
        return "bg-primary text-primary-foreground hover:bg-primary/60";
      default:
        return "";
    }
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

  const isTierActive = (tierPlanId: number) => {
    return hasActiveSubscription && tierPlanId === activePlanId;
  };

  const getSelectedTierLabel = (plan: Plan) => {
    if (!plan.creditTiers) return "";
    const index = getSelectedTier(plan.id);
    return plan.creditTiers[index]?.credits ?? "";
  };

  const shouldShowExpiry = (plan: Plan) => {
    if (!hasActiveSubscription || !activePlanEndDate) return false;

    // Non-tiered plans
    if (!plan.creditTiers && plan.planId) {
      return plan.planId === activePlanId;
    }

    // Tiered plans
    return getSelectedTierPlanId(plan) === activePlanId;
  };

  /* ================= API ================= */

  const fetchAllPlans = async () => {
    try {
      setLoadingPlans(true);

      const [monthlyRes, annualRes] = await Promise.all([
        api.getSubscriptionPlansByInterval("month"),
        api.getSubscriptionPlansByInterval("year"),
      ]);

      setPlansByInterval({
        monthly: TransformApiResponseToPlans(monthlyRes),
        annual: TransformApiResponseToPlans(annualRes),
      });
    } catch (e: any) {
      toast({
        variant: "destructive",
        description: getErrorMessage(e),
      });
    } finally {
      setLoadingPlans(false);
    }
  };

  const handleSubscribe = async (planId: number) => {
    try {
      setLoadingPlanId(planId);
      const res = await api.purchaseSubscription(planId);
      // 🔔 GA EVENT — CHECKOUT START
      trackEvent("checkout_start", {
        source: "subscription_page",
        plan_id: planId,
        billing_period: billingPeriod,
      });
      window.location.href = res.checkout_url;
    } catch (e: any) {
      toast({
        variant: "destructive",
        description: getErrorMessage(e),
      });
    } finally {
      setLoadingPlanId(null);
    }
  };

  const handleCancelSubscription = async () => {
    try {
      setCancelling(true);
      const res = await api.cancelSubscription();
      toast({ description: res.message });
      setActivePlanId(null);
      setHasUsedStarter(true);
      await refreshUser();
    } catch (e: any) {
      toast({
        variant: "destructive",
        description: getErrorMessage(e),
      });
    } finally {
      setCancelling(false);
    }
  };

  const handlePlanSelect = async (plan: Plan) => {
    if (isPlanActive(plan)) {
      setShowCancelConfirm(true);
      return;
    }

    // 🔔 GA EVENT
    trackEvent("subscribe_click", {
      source: "subscription_page",
      plan_id: plan.planId,
      billing_period: billingPeriod,
    });

    if (
      hasActiveSubscription &&
      plan.creditTiers &&
      plan.id === activeBackendPlan?.id
    ) {
      const activeIndex = getActiveTierIndex(plan);
      const selectedIndex = getSelectedTier(plan.id);

      if (activeIndex !== null && selectedIndex < activeIndex) {
        toast({
          variant: "destructive",
          description:
            "Please cancel your current subscription before downgrading.",
        });
        return;
      }
    }

    if (plan.planId) {
      handleSubscribe(plan.planId);
      return;
    }

    if (plan.creditTiers) {
      handleSubscribe(getSelectedTierPlanId(plan)!);
    }
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

  /* ================= EFFECTS ================= */

  useEffect(() => {
    if (!userLoaded) return; // ⛔ block until user API finishes
    fetchAllPlans();
  }, [userLoaded]);

  const fireSubscriptionStartedOnce = (
    sessionId: string | null,
    planName?: string | null
  ) => {
    const key = `ga_subscription_started_${sessionId}`;

    if (sessionStorage.getItem(key)) return;

    trackEvent("subscription_started", {
      source: "stripe_checkout",
      plan_name: planName,
    });

    sessionStorage.setItem(key, "1");
  };

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoadingUser(true);
        const res = await api.userDetails();

        if (res?.active_plan?.id) {
          setActivePlanId(res.active_plan.id);
          setActivePlanStatus(res.active_plan.status);
          setActivePlanEndDate(res.active_plan.end_date);
          setExpiredPlanId(res.active_plan.id);
          if (res.active_plan.has_purchased_any_plan) {
            setHasUsedStarter(true);
          }
          if (res.active_plan.interval) {
            setActiveInterval(res.active_plan.interval);
          }

          setBillingPeriod(
            res.active_plan.interval === "year" ? "annual" : "monthly"
          );
        }

        if (stripeSessionId) {
          await refreshUser();
          // 🔔 GA EVENT — SUBSCRIPTION STARTED (ONCE)
          fireSubscriptionStartedOnce(stripeSessionId, res?.active_plan?.name);
          setSessionDetails({
            planName: res?.active_plan?.name,
            date: res?.active_plan?.start_date,
          });
          setShowSuccess(true);
          window.history.replaceState({}, "", "/subscription");
        }
      } finally {
        setLoadingUser(false);
        setUserLoaded(true);
      }
    };

    loadUser();
  }, [stripeSessionId]);

  useEffect(() => {
    if (!selctedPlans.length || !hasActiveSubscription || !activePlanId) return;

    selctedPlans.forEach((plan) => {
      if (!plan.creditTiers) return;

      const activeTierIndex = plan.creditTiers.findIndex(
        (tier) => tier.planId === activePlanId
      );

      if (activeTierIndex !== -1) {
        setSelectedTier(plan.id, activeTierIndex);
      }
    });
  }, [selctedPlans, activePlanId, hasActiveSubscription]);

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
  }, []);

  /* ================= RENDER ================= */

  if (loadingPlans && loadingUser) {
    return <div className="text-center py-20">Loading...</div>;
  }

  if (loadingPlans) {
    return <div className="text-center py-20">Loading...</div>;
  }

  return (
    <>
      <section className="max-w-7xl mx-auto px-4">
        <div className="mb-12 flex flex-col items-center text-center">
          <div className="mt-4 flex-col lg:flex-row flex items-center justify-items-center gap-4">
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

        <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto mb-4">
          {selctedPlans.map((plan) => {
            return (
              <Card
                key={plan.id}
                className={`relative flex h-full flex-col rounded-3xl border bg-black/70 backdrop-blur-xl border-white/10  ${
                  isPlanActive(plan)
                    ? "border-green-500/60 ring-1 ring-green-500/30"
                    : "border-white/10"
                }`}
              >
                <CardHeader>
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

                  {getAnnualBilling(plan) && (
                    <p className="text-xs mt-1">{getAnnualBilling(plan)}</p>
                  )}

                  {plan.id !== "starter" && (
                    <p className="text-[14px]">1 credit = 1 clip</p>
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
                  {shouldShowExpiry(plan) && (
                    <>
                      <hr className="text-white my-4" />
                      <p
                        className={`text-xs mt-1 text-center ${
                          getExpiryLabel(activePlanEndDate!).startsWith(
                            "Expired"
                          )
                            ? "text-red-400"
                            : "text-amber-400"
                        }`}
                      >
                        {getExpiryLabel(activePlanEndDate!)}
                      </p>
                    </>
                  )}
                </CardContent>

                {plan.id !== "starter" && (
                  <CardFooter>
                    {(() => {
                      const label = getButtonLabel(plan);

                      return (
                        <Button
                          className={`w-full ${getButtonClass(label)}`}
                          disabled={isPlanDisabled(plan)}
                          onClick={() => handlePlanSelect(plan)}
                        >
                          {label}
                        </Button>
                      );
                    })()}
                  </CardFooter>
                )}
              </Card>
            );
          })}
        </div>

        <div className="mt-12 mb-12 max-w-6xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/60 backdrop-blur px-6 py-6">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-emerald-500/10" />

            <div className="relative flex flex-col sm:flex-row gap-4">
              {/* <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm"> */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm self-start sm:self-auto">
                <CircleAlert />
              </div>

              <div className="space-y-3">
                <p className="text-sm font-semibold text-white">
                  Storage management
                </p>

                <div className="space-y-3 sm:space-y-2 text-sm text-gray-400">
                  <div className="flex items-start gap-3">
                    <span className="mt-1 inline-block h-2 w-2 shrink-0 rounded-full bg-purple-400" />
                    <p>
                      When your storage limit is reached, the{" "}
                      <span className="text-white">
                        oldest video is automatically removed
                      </span>{" "}
                      to make room for new clips.
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="mt-1 inline-block h-2 w-2 shrink-0 rounded-full bg-emerald-400" />
                    <p>
                      We recommend regularly reviewing and cleaning up unused or
                      outdated clips to stay in control of your content.
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="mt-1 inline-block h-2 w-2 shrink-0 rounded-full bg-amber-400" />
                    <p>
                      Higher plans provide larger storage capacity, allowing you
                      to retain more videos on the platform.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
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

      {showCancelConfirm && (
        <CancelSubscriptionModal
          open={showCancelConfirm}
          loading={cancelling}
          onClose={() => setShowCancelConfirm(false)}
          onConfirm={async () => {
            await handleCancelSubscription();
            setShowCancelConfirm(false);
          }}
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
