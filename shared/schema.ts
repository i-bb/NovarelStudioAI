import { sql } from 'drizzle-orm';
import {
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table - mandatory for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Plan types for subscription management
export const PLAN_TYPES = {
  STARTER: 'starter',
  CREATOR: 'creator',
  STUDIO: 'studio',
} as const;

export type PlanType = typeof PLAN_TYPES[keyof typeof PLAN_TYPES];

// User storage table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique().notNull(),
  passwordHash: varchar("password_hash"),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  stripeCustomerId: varchar("stripe_customer_id"),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  plan: varchar("plan").default('starter').notNull(),
  planTier: integer("plan_tier").default(0),
  billingPeriod: varchar("billing_period").default('monthly'),
  subscriptionStatus: varchar("subscription_status").default('active'),
  currentPeriodEnd: timestamp("current_period_end"),
  clipCreditsRemaining: integer("clip_credits_remaining").default(10),
  clipCreditsTotal: integer("clip_credits_total").default(10),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Signup/Login schemas for API validation
export const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  channelName: z.string().min(1, "Channel name is required").optional(),
  plan: z.enum(['starter', 'creator', 'studio']).optional().default('starter'),
  planTier: z.number().int().min(0).max(3).optional().default(0),
  billingPeriod: z.enum(['monthly', 'annual']).optional().default('monthly'),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

// Plan limits configuration
export const PLAN_LIMITS = {
  starter: {
    clipsPerMonth: 10,
    exportQuality: '720p',
    connectedPlatforms: 1,
    clipHistoryDays: 3,
    features: ['basic_moment_detection'],
  },
  creator: {
    tiers: [
      { credits: 60, clipsPerDay: 2, monthlyPrice: 35, annualPrice: 23 },
      { credits: 120, clipsPerDay: 4, monthlyPrice: 55, annualPrice: 36 },
      { credits: 200, clipsPerDay: 7, monthlyPrice: 75, annualPrice: 49 },
      { credits: 300, clipsPerDay: 10, monthlyPrice: 95, annualPrice: 62 },
    ],
    exportQuality: '4K',
    connectedPlatforms: 5,
    clipHistoryDays: -1,
    features: ['advanced_detection', 'instagram_autopost', 'branding_presets', 'email_support'],
  },
  studio: {
    tiers: [
      { credits: 150, clipsPerDay: 5, monthlyPrice: 100, annualPrice: 65 },
      { credits: 250, clipsPerDay: 8, monthlyPrice: 150, annualPrice: 98 },
      { credits: 350, clipsPerDay: 12, monthlyPrice: 200, annualPrice: 130 },
      { credits: 450, clipsPerDay: 15, monthlyPrice: 275, annualPrice: 179 },
    ],
    exportQuality: '4K',
    connectedPlatforms: -1,
    clipHistoryDays: -1,
    features: ['all_creator_features', 'multi_channel', 'team_access', 'api_webhooks', 'custom_templates', 'priority_support'],
  },
} as const;

// Stream sessions - represents a live stream that was recorded
export const streamSessions = pgTable("stream_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  platform: varchar("platform").notNull(), // "twitch" or "kick"
  streamTitle: varchar("stream_title"),
  startedAt: timestamp("started_at").notNull(),
  endedAt: timestamp("ended_at"),
  status: varchar("status").notNull().default("recording"), // "recording", "processing", "completed"
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertStreamSessionSchema = createInsertSchema(streamSessions).omit({ id: true, createdAt: true });
export type InsertStreamSession = z.infer<typeof insertStreamSessionSchema>;
export type StreamSession = typeof streamSessions.$inferSelect;

// Stream exports - 10 minute video segments exported from streams
export const streamExports = pgTable("stream_exports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  streamSessionId: varchar("stream_session_id").notNull().references(() => streamSessions.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: varchar("title"),
  durationSeconds: integer("duration_seconds").notNull(),
  videoUrl: varchar("video_url"),
  thumbnailUrl: varchar("thumbnail_url"),
  exportedAt: timestamp("exported_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertStreamExportSchema = createInsertSchema(streamExports).omit({ id: true, createdAt: true });
export type InsertStreamExport = z.infer<typeof insertStreamExportSchema>;
export type StreamExport = typeof streamExports.$inferSelect;

// Clips - viral moments extracted from stream exports
export const clips = pgTable("clips", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  exportId: varchar("export_id").notNull().references(() => streamExports.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  clipUrl: varchar("clip_url"),
  thumbnailUrl: varchar("thumbnail_url"),
  durationSeconds: integer("duration_seconds"),
  transcription: text("transcription"),
  viralityScore: integer("virality_score"), // 0-100
  viralityReason: text("virality_reason"),
  startTime: integer("start_time"), // seconds from start of export
  endTime: integer("end_time"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertClipSchema = createInsertSchema(clips).omit({ id: true, createdAt: true });
export type InsertClip = z.infer<typeof insertClipSchema>;
export type Clip = typeof clips.$inferSelect;

// Social posts - tracks clips posted to social platforms
export const socialPosts = pgTable("social_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clipId: varchar("clip_id").notNull().references(() => clips.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  platform: varchar("platform").notNull(), // "instagram", "tiktok", "youtube"
  status: varchar("status").notNull().default("pending"), // "pending", "posted", "failed"
  postedAt: timestamp("posted_at"),
  metrics: jsonb("metrics"), // { views, likes, comments, shares }
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertSocialPostSchema = createInsertSchema(socialPosts).omit({ id: true, createdAt: true });
export type InsertSocialPost = z.infer<typeof insertSocialPostSchema>;
export type SocialPost = typeof socialPosts.$inferSelect;

// Connected accounts - user's linked streaming and social platforms
export const connectedAccounts = pgTable("connected_accounts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  platform: varchar("platform").notNull(), // "twitch", "kick", "instagram", "youtube", "tiktok"
  platformUserId: varchar("platform_user_id"),
  platformUsername: varchar("platform_username"),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  tokenExpiresAt: timestamp("token_expires_at"),
  isActive: integer("is_active").default(1),
  connectedAt: timestamp("connected_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  uniqueIndex("IDX_connected_accounts_user_platform").on(table.userId, table.platform),
]);

export const insertConnectedAccountSchema = createInsertSchema(connectedAccounts).omit({ id: true, createdAt: true });
export type InsertConnectedAccount = z.infer<typeof insertConnectedAccountSchema>;
export type ConnectedAccount = typeof connectedAccounts.$inferSelect;
