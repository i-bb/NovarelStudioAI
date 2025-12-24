// import { useState } from "react";
// import { useLocation } from "wouter";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Check } from "lucide-react";
// import logoImage from "@assets/ChatGPT Image Nov 26, 2025, 05_11_54 PM_1764195119264.png";
// import { plans } from "@/lib/common";

// type CreditTier = {
//   credits: string;
//   clipsPerDay: string;
//   monthlyPrice: number;
//   annualPrice: number;
// };

// type Plan = {
//   id: string;
//   name: string;
//   tagline: string;
//   badge: string | null;
//   bullet: string;
//   features: string[];
//   cta: string;
//   popular: boolean;
//   creditTiers: CreditTier[] | null;
//   fixedMonthlyPrice?: string;
//   fixedAnnualPrice?: string;
// };

// export default function PricingSection() {
//   const [, navigate] = useLocation();
//   const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">(
//     "monthly"
//   );
//   const [creatorTier, setCreatorTier] = useState(0);
//   const [studioTier, setStudioTier] = useState(0);

//   // ⭐ PURE MOCK NAVIGATION, NO API, NO STRIPE
//   const handlePlanSelect = (planId: string) => {
//     const tier = getSelectedTier(planId);
//     const params = new URLSearchParams();

//     params.set("plan", planId);
//     if (planId !== "starter") {
//       params.set("tier", tier.toString());
//       params.set("billing", billingPeriod);
//     }

//     // Navigate locally (mock)
//     navigate(`/signup?${params.toString()}`);
//   };

//   const getSelectedTier = (planId: string) => {
//     if (planId === "creator") return creatorTier;
//     if (planId === "studio") return studioTier;
//     return 0;
//   };

//   const setSelectedTier = (planId: string, value: number) => {
//     if (planId === "creator") setCreatorTier(value);
//     if (planId === "studio") setStudioTier(value);
//   };

//   const getPrice = (plan: Plan) => {
//     if (plan.creditTiers) {
//       const tier = plan.creditTiers[getSelectedTier(plan.id)];
//       return billingPeriod === "monthly"
//         ? `$${tier.monthlyPrice}`
//         : `$${tier.annualPrice}`;
//     }
//     return billingPeriod === "monthly"
//       ? plan.fixedMonthlyPrice
//       : plan.fixedAnnualPrice;
//   };

//   const getAnnualBilling = (plan: Plan) => {
//     if (plan.creditTiers) {
//       const tier = plan.creditTiers[getSelectedTier(plan.id)];
//       return `$${tier.annualPrice * 12} billed annually`;
//     }
//     return null;
//   };

//   const getClipsPerDay = (plan: Plan) => {
//     if (plan.creditTiers)
//       return plan.creditTiers[getSelectedTier(plan.id)].clipsPerDay;
//     return null;
//   };

//   return (
//     <section id="pricing" className="relative pb-10">
//       <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

//       <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
//         <div className="mb-12 flex flex-col items-center text-center">
//           <img
//             src={logoImage}
//             alt="NovarelStudio"
//             className="w-24 h-24 mb-6 grayscale self-start"
//             style={{ clipPath: "circle(38% at center)" }}
//           />

//           <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold">
//             Pay for the clips that actually move your channel
//           </h2>

//           <div className="flex gap-2 mt-4">
//             <BillingToggleButton
//               active={billingPeriod === "monthly"}
//               onClick={() => setBillingPeriod("monthly")}
//               label="Monthly"
//             />
//             <BillingToggleButton
//               active={billingPeriod === "annual"}
//               onClick={() => setBillingPeriod("annual")}
//               label="Annual"
//             />
//           </div>
//         </div>

//         {/* PLANS */}
//         <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto">
//           {plans.map((plan) => (
//             <Card
//               key={plan.id}
//               className={`relative flex h-full flex-col rounded-3xl border bg-black/70 backdrop-blur-xl ${
//                 plan.popular ? "border-white/40" : "border-white/10"
//               }`}
//             >
//               <CardHeader>
//                 {plan.badge && (
//                   <span className="inline-block text-[10px] bg-white/10 px-2 py-1 rounded-full border border-white/20">
//                     {plan.badge}
//                   </span>
//                 )}

//                 <CardTitle className="text-xl">{plan.name}</CardTitle>
//                 <CardDescription>{plan.tagline}</CardDescription>

//                 <div className="mt-4">
//                   <div className="text-3xl font-semibold">{getPrice(plan)}</div>

//                   {billingPeriod === "annual" && plan.creditTiers && (
//                     <p className="text-xs mt-1">{getAnnualBilling(plan)}</p>
//                   )}
//                 </div>

//                 {plan.creditTiers && (
//                   <div className="mt-4">
//                     <p className="text-xs mb-2">1 credit = 1 clip</p>
//                     <Select
//                       value={getSelectedTier(plan.id).toString()}
//                       onValueChange={(v) =>
//                         setSelectedTier(plan.id, parseInt(v))
//                       }
//                     >
//                       <SelectTrigger className="w-full bg-black/50">
//                         <SelectValue />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {plan.creditTiers.map((tier, index) => (
//                           <SelectItem key={index} value={index.toString()}>
//                             {tier.credits}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 )}
//               </CardHeader>

//               <CardContent>
//                 {plan.creditTiers && (
//                   <div className="flex items-center gap-2">
//                     <Check className="h-3 w-3 text-emerald-300" />
//                     <span>{getClipsPerDay(plan)}</span>
//                   </div>
//                 )}

//                 {plan.features.map((feature, idx) => (
//                   <div key={idx} className="flex items-center gap-2">
//                     <Check className="h-3 w-3 text-emerald-300" />
//                     <span>{feature}</span>
//                   </div>
//                 ))}
//               </CardContent>

//               <CardFooter>
//                 <Button
//                   className="w-full rounded-full"
//                   onClick={() => handlePlanSelect(plan.id)}
//                 >
//                   {plan.cta}
//                 </Button>
//               </CardFooter>
//             </Card>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

// function BillingToggleButton({
//   active,
//   onClick,
//   label,
// }: {
//   active: boolean;
//   onClick: () => void;
//   label: string;
// }) {
//   return (
//     <button
//       className={`px-3 py-1 rounded-full text-xs ${
//         active ? "bg-white text-black" : "bg-white/10 text-white/70"
//       }`}
//       onClick={onClick}
//     >
//       {label}
//     </button>
//   );
// }

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
import api from "@/lib/api/api";
import { toast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/getErrorMessage";

type CreditTier = {
  credits: string;
  clipsPerDay: string;
  monthlyPrice: number;
  annualPrice: number;
  clipLimit: number;
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
  const [, navigate] = useLocation();

  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">(
    "monthly"
  );
  const [creatorTier, setCreatorTier] = useState(0);
  const [studioTier, setStudioTier] = useState(0);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  /* ---------------- API → UI TRANSFORM (same logic as Subscription page) ---------------- */
  const transformApiResponseToPlans = (apiData: any): Plan[] => {
    const transformed: Plan[] = [];

    apiData.plans.forEach((apiPlan: any) => {
      const planName = apiPlan.name.toLowerCase();

      if (planName === "starter") {
        transformed.push({
          id: "starter",
          name: apiPlan.name,
          tagline: apiPlan.description,
          badge: null,
          bullet: "",
          features: apiPlan.features,
          cta: "Get Started",
          popular: false,
          creditTiers: null,
          fixedMonthlyPrice: apiPlan.prices[0]?.price,
          fixedAnnualPrice: apiPlan.prices[0]?.price,
        });
      } else {
        const creditTiers: CreditTier[] = apiPlan.prices.map((price: any) => {
          const clipLimit =
            price.interval === "month"
              ? price.metadata_json?.clip_limit
              : price.metadata_json?.clip_limit / 12 || 0;
          const days = price.interval === "month" ? 30 : 365;
          const clipsPerDay = Math.round(clipLimit / days);

          return {
            credits: `${clipLimit.toLocaleString()} credits/month`,
            clipsPerDay: `About ${clipsPerDay} clips/day`,
            monthlyPrice:
              price.interval === "month" ? price.price : price.price / 12,
            annualPrice: price.price,
            clipLimit,
          };
        });

        creditTiers.sort((a, b) => a.clipLimit - b.clipLimit);

        transformed.push({
          id: planName,
          name: apiPlan.name,
          tagline: apiPlan.description,
          badge: planName === "creator" ? "MOST POPULAR" : null,
          bullet: "",
          features: apiPlan.features,
          cta: "Subscribe",
          popular: planName === "creator",
          creditTiers,
        });
      }
    });

    return transformed.sort(
      (a, b) =>
        ["starter", "creator", "studio"].indexOf(a.id) -
        ["starter", "creator", "studio"].indexOf(b.id)
    );
  };

  /* ---------------- LOAD PLANS ---------------- */
  useEffect(() => {
    const loadPlans = async () => {
      try {
        setLoading(true);
        const interval = billingPeriod === "monthly" ? "month" : "year";
        const response = await api.getSubscriptionPlansByInterval(interval);
        setPlans(transformApiResponseToPlans(response));
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
  }, [billingPeriod]);

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

  const getClipsPerDay = (plan: Plan) =>
    plan.creditTiers
      ? plan.creditTiers[getSelectedTier(plan.id)].clipsPerDay
      : null;

  /* ---------------- UI (UNCHANGED) ---------------- */
  return (
    <section id="pricing" className="relative pb-10">
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

        {loading ? (
          <div className="text-center text-muted-foreground">Loading...</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={`relative flex h-full flex-col rounded-3xl border bg-black/70 backdrop-blur-xl ${
                  plan.popular ? "border-white/40" : "border-white/10"
                }`}
              >
                <CardHeader>
                  {plan.badge && (
                    <span className="inline-block text-[10px] bg-white/10 px-2 py-1 rounded-full border border-white/20">
                      {plan.badge}
                    </span>
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

                <CardContent>
                  {plan.creditTiers && (
                    <div className="flex items-center gap-2">
                      <Check className="h-3 w-3 text-emerald-300" />
                      <span>{getClipsPerDay(plan)}</span>
                    </div>
                  )}

                  {plan.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Check className="h-3 w-3 text-emerald-300" />
                      <span>{f}</span>
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
        )}
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
