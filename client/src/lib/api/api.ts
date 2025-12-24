import apiClient from "./client";
import { ENDPOINTS } from "./endpoints";

// ─────────────────────────────────────────────
// Unified safe request wrapper with auto error formatting
// ─────────────────────────────────────────────
async function safeRequest<T>(promise: Promise<any>): Promise<T> {
  try {
    const res = await promise;
    return res.data as T;
  } catch (error: any) {
    let message = "Something went wrong. Please try again.";

    if (error.type === "SERVER_ERROR") {
      message =
        error?.data?.description ??
        error?.data?.message ??
        "Server rejected the request.";
    } else if (error.type === "NO_RESPONSE") {
      message =
        "Unable to reach the server. Please check your connection and try again.";
    } else if (error.type === "REQUEST_NOT_SENT") {
      message = "Something went wrong before sending the request.";
    }

    throw {
      type: error.type,
      message,
      raw: error,
    };
  }
}

// ─────────────────────────────────────────────
// Generic wrapper for all apiClient methods
// ─────────────────────────────────────────────
function request<T>(
  method: "get" | "post" | "delete" | "patch",
  url: string,
  data?: any
): Promise<T> {
  if (method === "get" || method === "delete") {
    return safeRequest<T>(apiClient[method](url));
  }
  return safeRequest<T>(apiClient[method](url, data));
}

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export const SUPPORTED_PLATFORMS = {
  twitch: "twitch",
  kick: "kick",
  youtube: "youtube",
  tiktok: "tiktok",
  instagram: "instagram",
} as const;

export type Platform = keyof typeof SUPPORTED_PLATFORMS;

export interface ResetPasswordResponse {
  message: string;
}

export interface VerifyOtpResponse {
  message: string;
  access_token?: string;
  user?: User;
}

export interface ActivePlan {
  description: string | null;
  end_date: string | null;
  id: number;
  interval: string | null;
  name: string | null;
  price: number | null;
  start_date: string | null;
  status: "active" | "inActive";
}

export interface ConnectedAccounts {
  instagram: SocialAccount;
  tiktok: SocialAccount;
  twitch: SocialAccount;
  youtube: SocialAccount;
}

export interface SocialAccount {
  connected: boolean;
  display_name: string | null;
  avatar_url: string | null;
}

export interface User {
  email: string;
  name: string;
  active_plan: ActivePlan;
  connected_accounts: ConnectedAccounts;
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
}

export interface SignupResponse {
  user: User;
  access_token: string;
  message?: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface DashboardResponse {
  instagram_reel_count: number;
  tiktok_reel_count: number;
  youtube_short_count: number;
}

export interface AccountResponse {
  platform: string;
}

// ─────────────────────────────────────────────
// API METHODS (ALL CLEAN, ALL USING request())
// ─────────────────────────────────────────────

export const api = {
  // AUTH
  login: (email: string, password: string) =>
    request<LoginResponse>("post", ENDPOINTS.login, { email, password }),

  signup: (payload: SignupPayload) =>
    request<SignupResponse>("post", ENDPOINTS.signup, payload),

  userDetails: () => request<User>("get", ENDPOINTS.userDetails),

  resetPassword: (email: string) =>
    request<ResetPasswordResponse>("post", ENDPOINTS.resetPassword, { email }),

  verifyOtp: (email: string, new_password: string, otp: string) =>
    request<VerifyOtpResponse>("post", ENDPOINTS.otpVerification, {
      email,
      new_password,
      otp,
    }),

  // DASHBOARD
  getDashboard: () => request<DashboardResponse>("get", ENDPOINTS.dashboard),

  // CONTENT STUDIO
  getContentStudios: (page: string, limit: string, platform?: string) =>
    request<any>(
      "get",
      `${ENDPOINTS.contentStudios}/${platform}?page=${page}&limit=${limit}`
    ),

  // getReelsData: (public_id: string) =>
  //   request<any>("get", `${ENDPOINTS.reels}?public_id=${public_id}`),
  getReelsData: (platform: string, public_id: string) =>
    request<any>("get", ENDPOINTS.reels(platform, public_id)),

  getSingleReelData: (reelId: string) =>
    request<any>("get", `${ENDPOINTS.singleReel}/${reelId}`),

  updateReelCaption: (reelId: string, caption: string) =>
    request<any>("patch", ENDPOINTS.reelCaption(reelId), { caption: caption }),

  // SOCIAL ACCOUNTS
  disconnectPlatform: (platform: string) =>
    request<any>("delete", ENDPOINTS.disconnectPlatform(platform)),

  authorizePlatform: (platform: string) =>
    request<any>("get", ENDPOINTS.authorizePlatform(platform)),

  callbackPlatform: (platform: string, code: string, state = "") =>
    request<any>("post", ENDPOINTS.callbackPlatform(platform), { code, state }),

  // STREAMING ACCOUNTS
  disconnectStreamingAccount: (platform: string) =>
    request<any>("delete", ENDPOINTS.disconnectStreamingAccount(platform)),

  authorizeStreamingAccount: (platform: string) =>
    request<any>("get", ENDPOINTS.authorizeStreamingAccount(platform)),

  callbackStreamingPlatform: (platform: string, code: string, state = "") =>
    request<any>("post", ENDPOINTS.callbackStreamingAccount(platform), {
      code,
      state,
    }),

  getStreamerStreamingAccounts: (platform: string) =>
    request<any>("get", ENDPOINTS.streamerStreamingAccounts(platform)),

  // SUBSCRIPTIONS
  getSubscriptionPlans: () => request("get", ENDPOINTS.subscriptionPlan),

  purchaseSubscription: (planId: number) =>
    request<any>("post", ENDPOINTS.subscriptionPurchase, { plan_id: planId }),

  // TRANSACTIONS
  getTransactionHistory: (page: string, limit: string) =>
    request<any>("get", `${ENDPOINTS.transaction}?page=${page}&limit=${limit}`),

  // REELS
  uploadReels: (platform: string, public_id: string) =>
    request(
      "post",
      `${ENDPOINTS.uploadReels(platform)}?public_id=${public_id}`
    ),


    downloadReel: (reelId: string) =>
    request<any>("get", ENDPOINTS.downloadReel(reelId)),
    // SUBSCRIPTIONS
getSubscriptionPlansByInterval: (
  interval: "month" | "year",
) =>
  request<any>(
    "get",
    ENDPOINTS.subscriptionPlanWithInterval(interval),
  ),

};

export default api;
