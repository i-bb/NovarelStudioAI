import {
  users,
  streamSessions,
  streamExports,
  clips,
  socialPosts,
  connectedAccounts,
  newsletterSignups,
  type User,
  type UpsertUser,
  type StreamSession,
  type InsertStreamSession,
  type StreamExport,
  type InsertStreamExport,
  type Clip,
  type InsertClip,
  type SocialPost,
  type InsertSocialPost,
  type ConnectedAccount,
  type InsertConnectedAccount,
  type NewsletterSignup,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, count } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: UpsertUser): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserSubscription(userId: string, subscriptionData: Partial<User>): Promise<User>;
  updateUserProfile(userId: string, profileData: { firstName: string | null; lastName: string | null }): Promise<User>;
  
  // Stream session operations
  getStreamSessions(userId: string): Promise<StreamSession[]>;
  createStreamSession(session: InsertStreamSession): Promise<StreamSession>;
  
  // Stream export operations
  getStreamExports(userId: string, limit?: number): Promise<StreamExport[]>;
  getStreamExport(id: string): Promise<StreamExport | undefined>;
  createStreamExport(exportData: InsertStreamExport): Promise<StreamExport>;
  
  // Clip operations
  getClipsByExport(exportId: string): Promise<Clip[]>;
  getClip(id: string): Promise<Clip | undefined>;
  createClip(clip: InsertClip): Promise<Clip>;
  
  // Social post operations
  getSocialPostsByUser(userId: string): Promise<SocialPost[]>;
  getSocialPostCountByPlatform(userId: string): Promise<{ platform: string; count: number }[]>;
  createSocialPost(post: InsertSocialPost): Promise<SocialPost>;
  
  // Connected account operations
  getConnectedAccounts(userId: string): Promise<ConnectedAccount[]>;
  getConnectedAccount(userId: string, platform: string): Promise<ConnectedAccount | undefined>;
  upsertConnectedAccount(account: InsertConnectedAccount): Promise<ConnectedAccount>;
  disconnectAccount(userId: string, platform: string): Promise<void>;
  
  // Newsletter operations
  createNewsletterSignup(email: string): Promise<NewsletterSignup>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(userData: UpsertUser): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserSubscription(userId: string, subscriptionData: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        ...subscriptionData,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async updateUserProfile(userId: string, profileData: { firstName: string | null; lastName: string | null }): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  // Stream session operations
  async getStreamSessions(userId: string): Promise<StreamSession[]> {
    return db.select().from(streamSessions).where(eq(streamSessions.userId, userId)).orderBy(desc(streamSessions.createdAt));
  }

  async createStreamSession(session: InsertStreamSession): Promise<StreamSession> {
    const [newSession] = await db.insert(streamSessions).values(session).returning();
    return newSession;
  }

  // Stream export operations
  async getStreamExports(userId: string, limit: number = 50): Promise<StreamExport[]> {
    return db.select().from(streamExports).where(eq(streamExports.userId, userId)).orderBy(desc(streamExports.createdAt)).limit(limit);
  }

  async getStreamExport(id: string): Promise<StreamExport | undefined> {
    const [exportData] = await db.select().from(streamExports).where(eq(streamExports.id, id));
    return exportData;
  }

  async createStreamExport(exportData: InsertStreamExport): Promise<StreamExport> {
    const [newExport] = await db.insert(streamExports).values(exportData).returning();
    return newExport;
  }

  // Clip operations
  async getClipsByExport(exportId: string): Promise<Clip[]> {
    return db.select().from(clips).where(eq(clips.exportId, exportId)).orderBy(desc(clips.createdAt));
  }

  async getClip(id: string): Promise<Clip | undefined> {
    const [clip] = await db.select().from(clips).where(eq(clips.id, id));
    return clip;
  }

  async createClip(clip: InsertClip): Promise<Clip> {
    const [newClip] = await db.insert(clips).values(clip).returning();
    return newClip;
  }

  // Social post operations
  async getSocialPostsByUser(userId: string): Promise<SocialPost[]> {
    return db.select().from(socialPosts).where(eq(socialPosts.userId, userId)).orderBy(desc(socialPosts.createdAt));
  }

  async getSocialPostCountByPlatform(userId: string): Promise<{ platform: string; count: number }[]> {
    const results = await db
      .select({
        platform: socialPosts.platform,
        count: count(),
      })
      .from(socialPosts)
      .where(and(eq(socialPosts.userId, userId), eq(socialPosts.status, "posted")))
      .groupBy(socialPosts.platform);
    
    return results.map((r: { platform: string; count: number }) => ({ platform: r.platform, count: Number(r.count) }));
  }

  async createSocialPost(post: InsertSocialPost): Promise<SocialPost> {
    const [newPost] = await db.insert(socialPosts).values(post).returning();
    return newPost;
  }

  // Connected account operations
  async getConnectedAccounts(userId: string): Promise<ConnectedAccount[]> {
    return db.select().from(connectedAccounts).where(eq(connectedAccounts.userId, userId)).orderBy(connectedAccounts.platform);
  }

  async getConnectedAccount(userId: string, platform: string): Promise<ConnectedAccount | undefined> {
    const [account] = await db.select().from(connectedAccounts).where(
      and(eq(connectedAccounts.userId, userId), eq(connectedAccounts.platform, platform))
    );
    return account;
  }

  async upsertConnectedAccount(account: InsertConnectedAccount): Promise<ConnectedAccount> {
    // Check if account already exists
    const existing = await this.getConnectedAccount(account.userId, account.platform);
    
    if (existing) {
      // Update existing account
      const [result] = await db
        .update(connectedAccounts)
        .set({
          ...account,
          connectedAt: new Date(),
        })
        .where(and(eq(connectedAccounts.userId, account.userId), eq(connectedAccounts.platform, account.platform)))
        .returning();
      return result;
    } else {
      // Insert new account
      const [result] = await db
        .insert(connectedAccounts)
        .values(account)
        .returning();
      return result;
    }
  }

  async disconnectAccount(userId: string, platform: string): Promise<void> {
    await db.delete(connectedAccounts).where(
      and(eq(connectedAccounts.userId, userId), eq(connectedAccounts.platform, platform))
    );
  }

  // Newsletter operations
  async createNewsletterSignup(email: string): Promise<NewsletterSignup> {
    const [signup] = await db.insert(newsletterSignups).values({ email }).returning();
    return signup;
  }
}

export const storage = new DatabaseStorage();
