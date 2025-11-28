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

// User storage table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique().notNull(),
  passwordHash: varchar("password_hash"),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
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
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

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
