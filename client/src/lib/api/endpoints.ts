export const ENDPOINTS = {
  // Auth --------------------------------//
  login: "/auth/login",
  logout: "/auth/logout",
  signup: "/auth/signup",
  resetPassword: "/auth/forgot/password",
  otpVerification: "auth/reset/password/otp",

  // Others --------------------------//
  dashboard: "/dashboard",
  contentStudios: "/videos",
  userDetails: "/auth/me",
  reels: "/reels",
  singleReel: "/reel",
  subscriptionPlan: "/subscription/plans",
  subscriptionPurchase: "/subscription/purchase",
  transaction: "/subscription/transaction",

  // Dynamic platform endpoints
  disconnectPlatform: (platform: string) => `/${platform}/disconnect` as const,
  authorizePlatform: (platform: string) => `/${platform}/authorize` as const,
  callbackPlatform: (platform: string) => `/${platform}/callback` as const,
  disconnectStreamingAccount: (platform: string) =>
    `streams/${platform}/disconnect` as const,
  authorizeStreamingAccount: (platform: string) =>
    `streams/${platform}/authorize` as const,
  callbackStreamingAccount: (platform: string) =>
    `streams/${platform}/callback` as const,
  streamerStreamingAccounts: (platform: string) =>
    `streams/${platform}/streamer` as const,

  uploadReels: (platform: string) => `${platform}/upload` as const,
} as const;
