// import { DashboardNav } from "@/components/dashboard/DashboardNav";
// import api from "@/lib/api/api";
// import React, { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { toast } from "@/hooks/use-toast";
// import PaymentSuccessModal from "@/components/PaymentSuccessModal";
// import { useAuth } from "@/hooks/useAuth";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";

// const Subscription = () => {
//   const [subsPlans, setSubsPlans] = useState([]);
//   const [activePlanId, setActivePlanId] = useState(0);
//   const [loadingPlanId, setLoadingPlanId] = useState<number | null>(null);

//   const [loadingPlans, setLoadingPlans] = useState(true);
//   const [loadingUser, setLoadingUser] = useState(true);

//   const [showSuccess, setShowSuccess] = useState(false);
//   const [stripeSessionId, setStripeSessionId] = useState<string | null>(null);
//   const [sessionDetails, setSessionDetails] = useState<any>(null);
//   const { refreshUser } = useAuth();

//   const formatDate = (iso: string) =>
//     new Date(iso).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     });

//   const getSubscriptionPlans = async () => {
//     try {
//       setLoadingPlans(true);
//       const response: any = await api.getSubscriptionPlans();

//       // setSubsPlans(response.plans);
//       setSubsPlans(
//         response.plans.sort((a: any, b: any) => a.price - b.price)
//       );

//     } finally {
//       setLoadingPlans(false);
//     }
//   };

//   const handleSubscribe = async (planId: number) => {
//     try {
//       setLoadingPlanId(planId);
//       const response = await api.purchaseSubscription(planId || 0);
//       const checkoutUrl = response?.checkout_url;

//       if (!checkoutUrl) throw new Error("Stripe checkout URL missing!");
//       window.location.href = checkoutUrl;
//     } catch (error: any) {
//       console.log("error", error);

//       toast?.({
//         description: error?.message || "Something went wrong!",
//         variant: "destructive",
//       });
//     } finally {
//       setLoadingPlanId(null);
//     }
//   };

//   const extractSessionIdFromURL = () => {
//     let sessionId = null;
//     const rawQuery = window.location.search.replace("?", "");
//     const parts = rawQuery.split(/[?&]/);
//     for (const p of parts) {
//       if (p.startsWith("session_id=")) sessionId = p.replace("session_id=", "");
//     }
//     return sessionId;
//   };

//   // Load Stripe session and plans
//   useEffect(() => {
//     const sessionId = extractSessionIdFromURL();
//     if (sessionId) setStripeSessionId(sessionId);

//     getSubscriptionPlans();
//   }, []);

//   // Fetch user and handle subscription success
//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         setLoadingUser(true);

//         const response = await api.userDetails();
//         const activePlan = response?.active_plan;

//         const newPlanId = activePlan?.id || 0;
//         setActivePlanId(newPlanId);

//         // 🔥 If returning from Stripe AND subscription is active
//         if (stripeSessionId && newPlanId !== 0) {
//           // 🔥 Update global auth
//           await refreshUser();

//           setSessionDetails({
//             planName: activePlan?.name,
//             date: activePlan?.start_date,
//           });

//           setShowSuccess(true);

//           // Remove session_id from URL
//           window.history.replaceState({}, "", "/subscription");
//         }
//       } catch (error: any) {
//         toast({
//           description:
//             error?.response?.data?.description || "Error loading user data",
//           variant: "destructive",
//         });
//       } finally {
//         setLoadingUser(false);
//       }
//     };

//     fetchUserData();
//   }, [stripeSessionId]);

//   // 🔥 Page should load only when BOTH are finished
//   const isPageLoading = loadingPlans || loadingUser;

//   return (
//     <div>
//       <main className="max-w-7xl mx-auto px-4 md:px-8 py-10">
//         <h1 className="font-display text-3xl sm:text-4xl font-semibold mb-3">
//           Subscription Plans
//         </h1>

//         <p className="text-muted-foreground mb-12 max-w-2xl">
//           Whether you're just starting out or running a large team, we have a
//           subscription plan for you. Enjoy exclusive features, priority support,
//           and seamless upgrades.
//         </p>

//         {/* ----------------------------------------------------
//             🔥 Skeleton appears until BOTH user + plans are loaded
//         ------------------------------------------------------ */}
//         {isPageLoading ? (
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {[1, 2, 3].map((n) => (
//               <div
//                 key={n}
//                 className="rounded-xl p-7 shadow-md border animate-pulse"
//               >
//                 <div className="h-6 bg-muted rounded mb-4"></div>
//                 <div className="h-10 bg-muted rounded mb-4"></div>
//                 <div className="h-4 bg-muted rounded mb-8"></div>
//                 <div className="h-10 bg-muted rounded"></div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {subsPlans.map((plan: any) => {
//               const isActive = plan.id === activePlanId;
//               const isLoading = loadingPlanId === plan.id;

//               // return (
//               //   <div
//               //     key={plan.id}
//               //     className={`rounded-xl p-7 shadow-md backdrop-blur-sm border transition-all duration-300 flex flex-col ${isActive
//               //         ? "border-green-500 ring-2 ring-green-500/40"
//               //         : "border-border hover:shadow-lg"
//               //       }`}
//               //   >
//               //     <h2 className="text-2xl font-bold text-center mb-3">
//               //       {plan.name}
//               //     </h2>

//               //     {isActive && (
//               //       <div className="flex justify-center mb-4">
//               //         <Badge className="bg-green-500 hover:bg-green-600 text-white px-3">
//               //           Active Plan
//               //         </Badge>
//               //       </div>
//               //     )}

//               //     <p className="text-center text-4xl font-semibold">
//               //       ${plan.price}
//               //     </p>
//               //     <p className="text-center text-muted-foreground mb-8">
//               //       per month
//               //     </p>

//               //     <div className="mt-auto flex justify-center">
//               //       {isActive ? (
//               //         <Button
//               //           disabled
//               //           variant="secondary"
//               //           className="w-full bg-muted text-foreground cursor-default"
//               //         >
//               //           Current Plan
//               //         </Button>
//               //       ) : (
//               //         <Button
//               //           disabled={isLoading}
//               //           className="w-full bg-primary hover:bg-primary-dark"
//               //           onClick={() => handleSubscribe(plan.id)}
//               //         >
//               //           {isLoading ? "Processing..." : `Choose ${plan.name}`}
//               //         </Button>
//               //       )}
//               //     </div>
//               //   </div>
//               // );
//               return (
//                 <Card
//                   key={plan.id}
//                   className={`relative flex h-full flex-col rounded-3xl border bg-black/70 backdrop-blur-xl ${isActive ? "border-green-500 ring-2 ring-green-500/40" : "border-white/10"
//                     }`}
//                 >
//                   <CardHeader>
//                     {isActive && (
//                       <Badge className="w-fit bg-green-500 text-white px-2 py-0.5 text-[10px]">
//                         Active Plan
//                       </Badge>
//                     )}

//                     <CardTitle className="text-xl">{plan.name}</CardTitle>

//                     <CardDescription>
//                       {plan.description || "Subscription plan"}
//                     </CardDescription>

//                     <div className="mt-4">
//                       <div className="text-3xl font-semibold">${plan.price}</div>
//                       <p className="text-xs mt-1 text-muted-foreground">per month</p>
//                     </div>
//                   </CardHeader>

//                   <CardContent>
//                     {/* keep empty or existing content if any */}
//                   </CardContent>

//                   <CardFooter className="mt-auto">
//                     {isActive ? (
//                       <Button
//                         disabled
//                         variant="secondary"
//                         className="w-full rounded-full cursor-default"
//                       >
//                         Current Plan
//                       </Button>
//                     ) : (
//                       <Button
//                         disabled={isLoading}
//                         className="w-full rounded-full"
//                         onClick={() => handleSubscribe(plan.id)}
//                       >
//                         {isLoading ? "Processing..." : `Choose ${plan.name}`}
//                       </Button>
//                     )}
//                   </CardFooter>
//                 </Card>


//               )
//             })}
//           </div>
//         )}
//       </main>

//       {/* Stripe Success Modal */}
//       {showSuccess && sessionDetails && (
//         <PaymentSuccessModal
//           open={showSuccess}
//           sessionId={stripeSessionId}
//           date={formatDate(sessionDetails.date)}
//           planName={sessionDetails.planName}
//           onClose={() => {
//             setShowSuccess(false);
//             window.location.href = "/dashboard";
//           }}
//         />
//       )}
//     </div>
//   );
// };

// export default Subscription;



import { useState } from "react";
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

  // Active plan state
  const [activePlanId, setActivePlanId] = useState("starter");

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

  // ⭐ MOCK DATA (replaces all API & Stripe usage)
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
        {
          credits: "60 clips/month",
          clipsPerDay: "About 2 clips/day",
          monthlyPrice: 35,
          annualPrice: 23,
        },
        {
          credits: "120 clips/month",
          clipsPerDay: "About 4 clips/day",
          monthlyPrice: 55,
          annualPrice: 36,
        },
        {
          credits: "200 clips/month",
          clipsPerDay: "About 7 clips/day",
          monthlyPrice: 75,
          annualPrice: 49,
        },
        {
          credits: "300 clips/month",
          clipsPerDay: "About 10 clips/day",
          monthlyPrice: 95,
          annualPrice: 62,
        },
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
        {
          credits: "150 clips/month",
          clipsPerDay: "About 5 clips/day",
          monthlyPrice: 100,
          annualPrice: 65,
        },
        {
          credits: "250 clips/month",
          clipsPerDay: "About 8 clips/day",
          monthlyPrice: 150,
          annualPrice: 98,
        },
        {
          credits: "350 clips/month",
          clipsPerDay: "About 12 clips/day",
          monthlyPrice: 200,
          annualPrice: 130,
        },
        {
          credits: "450 clips/month",
          clipsPerDay: "About 15 clips/day",
          monthlyPrice: 275,
          annualPrice: 179,
        },
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

  return (
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
                  <div className="text-3xl font-semibold">{getPrice(plan)}</div>

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
                  onClick={() => handlePlanSelect(plan.id)}
                >
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
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


