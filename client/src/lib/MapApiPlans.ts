import { CreditTier, Plan } from "@/pages/subscription";

export const TransformApiResponseToPlans = (apiData: any): Plan[] => {
  const result: Plan[] = [];

  apiData.plans.forEach((apiPlan: any) => {
    const planName = apiPlan.name.toLowerCase();

    if (planName === "starter") {
      result.push({
        id: "starter",
        name: apiPlan.name,
        tagline: apiPlan.description,
        badge: null,
        features: apiPlan.features,
        cta: "Get Started",
        popular: false,
        creditTiers: null,
        fixedMonthlyPrice: apiPlan.prices[0]?.price,
        fixedAnnualPrice: apiPlan.prices[0]?.price,
        planId: apiPlan.prices[0]?.plan_id,
      });
    } else {
      const creditTiers: CreditTier[] = apiPlan.prices
        .map((price: any) => {
          const clipLimit = price.metadata_json?.clip_limit || 0;
          const dailyClips = Math.round(clipLimit / 30);

          return {
            credits: `${clipLimit.toLocaleString()} credits/month`,
            clipsPerDay: `About ${dailyClips} clips/day`,
            monthlyPrice: price.price,
            annualPrice: price.price * 12,
            planId: price.plan_id,
            clipLimit,
          };
        })
        .sort((a: CreditTier, b: CreditTier) => a.clipLimit - b.clipLimit);

      result.push({
        id: planName,
        name: apiPlan.name,
        tagline: apiPlan.description,
        badge: null,
        features: apiPlan.features,
        cta: "Subscribe",
        popular: planName === "creator",
        creditTiers,
      });
    }
  });

  return result.sort(
    (a, b) =>
      ["starter", "creator", "studio"].indexOf(a.id) -
      ["starter", "creator", "studio"].indexOf(b.id)
  );
};
