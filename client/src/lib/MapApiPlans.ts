import api from "./api/api";

export type CreditTier = {
  credits: string;
  clipsPerDay: string;
  monthlyPrice: number;
  annualPrice: number;
  planId: number;
  clipLimit: number;
  price: number;
  dailyPostingLimit: number;
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
  clipLimit?: number;
  dailyPostingLimit?: number;
};

export const TransformApiResponseToPlans = (apiData: any): Plan[] => {
  const result: Plan[] = [];

  apiData.plans.forEach((apiPlan: any) => {
    const planName = apiPlan.name.toLowerCase();
    const totalClipLimit = apiPlan.prices[0]?.metadata_json?.clip_limit || 0;
    const monthlyCredits = totalClipLimit / 12;
    const clipLimit =
      apiPlan.prices[0]?.interval === "month" ? totalClipLimit : monthlyCredits;
    const dailyPostingLimit =
      apiPlan.prices[0]?.metadata_json?.daily_posting_limit;

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
        clipLimit: clipLimit,
        dailyPostingLimit,
      });
    } else {
      const creditTiers: CreditTier[] = apiPlan.prices
        .map((price: any) => {
          const clipLimit = price.metadata_json?.clip_limit || 0;
          const dailyClips = Math.round(clipLimit / 30);
          const monthlyCredits = clipLimit / 12;
          const dailyPostingLimit =
            price.metadata_json?.daily_posting_limit || 0;

          return {
            credits: `${
              price.interval === "month"
                ? clipLimit.toLocaleString()
                : monthlyCredits.toLocaleString()
            } credits/month`,
            clipsPerDay: `About ${dailyClips} clips/day`,
            price: price.price,
            monthlyPrice: price.price / 12,
            planId: price.plan_id,
            clipLimit,
            dailyPostingLimit,
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
