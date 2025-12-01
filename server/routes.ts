import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./auth";
import { getUncachableStripeClient, getStripePublishableKey } from "./stripeClient";
import { db } from "./db";
import { sql } from "drizzle-orm";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up custom authentication
  await setupAuth(app);

  // Dashboard stats - get social post counts by platform
  app.get('/api/dashboard/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const platformCounts = await storage.getSocialPostCountByPlatform(userId);
      
      // Ensure all platforms are represented
      const stats = {
        instagram: 0,
        tiktok: 0,
        youtube: 0,
      };
      
      platformCounts.forEach(({ platform, count }) => {
        if (platform in stats) {
          stats[platform as keyof typeof stats] = count;
        }
      });
      
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Get stream exports (Content Studio)
  app.get('/api/exports', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const limit = parseInt(req.query.limit as string) || 20;
      const exports = await storage.getStreamExports(userId, limit);
      res.json(exports);
    } catch (error) {
      console.error("Error fetching exports:", error);
      res.status(500).json({ message: "Failed to fetch exports" });
    }
  });

  // Get single export with its clips
  app.get('/api/exports/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const exportData = await storage.getStreamExport(id);
      
      if (!exportData) {
        return res.status(404).json({ message: "Export not found" });
      }
      
      const clips = await storage.getClipsByExport(id);
      
      res.json({
        export: exportData,
        clips,
      });
    } catch (error) {
      console.error("Error fetching export:", error);
      res.status(500).json({ message: "Failed to fetch export" });
    }
  });

  // Get single clip
  app.get('/api/clips/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const clip = await storage.getClip(id);
      
      if (!clip) {
        return res.status(404).json({ message: "Clip not found" });
      }
      
      res.json(clip);
    } catch (error) {
      console.error("Error fetching clip:", error);
      res.status(500).json({ message: "Failed to fetch clip" });
    }
  });

  // Connected accounts routes
  app.get('/api/connected-accounts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const accounts = await storage.getConnectedAccounts(userId);
      res.json(accounts);
    } catch (error) {
      console.error("Error fetching connected accounts:", error);
      res.status(500).json({ message: "Failed to fetch connected accounts" });
    }
  });

  app.post('/api/connected-accounts/:platform/connect', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { platform } = req.params;
      const { platformUsername } = req.body || {};
      const user = await storage.getUser(userId);

      const validPlatforms = ['twitch', 'kick', 'instagram', 'youtube', 'tiktok'];
      if (!validPlatforms.includes(platform)) {
        return res.status(400).json({ message: "Invalid platform" });
      }

      // For demo purposes, generate a username based on user's name
      // In production, this would use OAuth tokens from each platform
      const demoUsername = platformUsername || 
        (user?.firstName ? `${user.firstName.toLowerCase()}_${platform}` : `user_${platform}`);

      const account = await storage.upsertConnectedAccount({
        userId,
        platform,
        platformUsername: demoUsername,
        platformUserId: `${platform}_${Date.now()}`,
        isActive: 1,
        connectedAt: new Date(),
      });

      res.json(account);
    } catch (error) {
      console.error("Error connecting account:", error);
      res.status(500).json({ message: "Failed to connect account" });
    }
  });

  app.delete('/api/connected-accounts/:platform', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { platform } = req.params;

      await storage.disconnectAccount(userId, platform);
      res.json({ message: "Account disconnected" });
    } catch (error) {
      console.error("Error disconnecting account:", error);
      res.status(500).json({ message: "Failed to disconnect account" });
    }
  });

  // Stripe subscription routes
  
  // Get Stripe publishable key for frontend
  app.get('/api/stripe/config', async (req, res) => {
    try {
      const publishableKey = await getStripePublishableKey();
      res.json({ publishableKey });
    } catch (error) {
      console.error("Error fetching Stripe config:", error);
      res.status(500).json({ message: "Failed to fetch Stripe config" });
    }
  });

  // Get available pricing plans with Stripe price IDs
  app.get('/api/plans', async (req, res) => {
    try {
      const result = await db.execute(sql`
        SELECT 
          p.id as product_id,
          p.name as product_name,
          p.description as product_description,
          p.metadata as product_metadata,
          pr.id as price_id,
          pr.unit_amount,
          pr.currency,
          pr.recurring,
          pr.metadata as price_metadata
        FROM stripe.products p
        LEFT JOIN stripe.prices pr ON pr.product = p.id AND pr.active = true
        WHERE p.active = true AND p.metadata->>'app' = 'novarelstudio'
        ORDER BY p.name, pr.unit_amount
      `);

      const productsMap = new Map();
      for (const row of result.rows as any[]) {
        if (!productsMap.has(row.product_id)) {
          productsMap.set(row.product_id, {
            id: row.product_id,
            name: row.product_name,
            description: row.product_description,
            metadata: row.product_metadata,
            prices: []
          });
        }
        if (row.price_id) {
          productsMap.get(row.product_id).prices.push({
            id: row.price_id,
            unit_amount: row.unit_amount,
            currency: row.currency,
            recurring: row.recurring,
            metadata: row.price_metadata,
          });
        }
      }

      res.json({ products: Array.from(productsMap.values()) });
    } catch (error) {
      console.error("Error fetching plans:", error);
      res.status(500).json({ message: "Failed to fetch plans" });
    }
  });

  // Create Stripe checkout session for subscription
  app.post('/api/checkout', isAuthenticated, async (req: any, res) => {
    try {
      const stripe = await getUncachableStripeClient();
      const user = req.user;
      const { priceId, plan, tier, billing } = req.body;

      if (!priceId) {
        return res.status(400).json({ message: "Price ID is required" });
      }

      // Create or get Stripe customer
      let customerId = user.stripeCustomerId;
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email,
          metadata: { userId: user.id },
        });
        await storage.updateUserSubscription(user.id, {
          stripeCustomerId: customer.id,
        });
        customerId = customer.id;
      }

      // Calculate credits based on plan and tier
      let clipCredits = 10;
      if (plan === 'creator') {
        const creatorCredits = [60, 120, 200, 300];
        clipCredits = creatorCredits[tier || 0];
      } else if (plan === 'studio') {
        const studioCredits = [150, 250, 350, 450];
        clipCredits = studioCredits[tier || 0];
      }

      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [{ price: priceId, quantity: 1 }],
        mode: 'subscription',
        success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/checkout/cancel`,
        metadata: {
          userId: user.id,
          plan,
          tier: tier?.toString() || '0',
          billing: billing || 'monthly',
          clipCredits: clipCredits.toString(),
        },
      });

      res.json({ url: session.url });
    } catch (error: any) {
      console.error("Error creating checkout session:", error);
      res.status(500).json({ message: error.message || "Failed to create checkout session" });
    }
  });

  // Handle successful checkout - update user subscription
  app.post('/api/checkout/complete', isAuthenticated, async (req: any, res) => {
    try {
      const stripe = await getUncachableStripeClient();
      const { sessionId } = req.body;
      const user = req.user;

      if (!sessionId) {
        return res.status(400).json({ message: "Session ID is required" });
      }

      const session = await stripe.checkout.sessions.retrieve(sessionId);
      
      if (session.payment_status !== 'paid') {
        return res.status(400).json({ message: "Payment not completed" });
      }

      const subscriptionId = session.subscription as string;
      const subscription = await stripe.subscriptions.retrieve(subscriptionId) as any;
      
      const metadata = session.metadata || {};
      const plan = metadata.plan || 'starter';
      const tier = parseInt(metadata.tier || '0');
      const billing = metadata.billing || 'monthly';
      const clipCredits = parseInt(metadata.clipCredits || '10');

      // Update user with subscription info
      const updatedUser = await storage.updateUserSubscription(user.id, {
        stripeSubscriptionId: subscriptionId,
        plan,
        planTier: tier,
        billingPeriod: billing,
        subscriptionStatus: 'active',
        currentPeriodEnd: subscription.current_period_end ? new Date(subscription.current_period_end * 1000) : null,
        clipCreditsRemaining: clipCredits,
        clipCreditsTotal: clipCredits,
      });

      res.json({
        success: true,
        user: {
          id: updatedUser.id,
          plan: updatedUser.plan,
          planTier: updatedUser.planTier,
          subscriptionStatus: updatedUser.subscriptionStatus,
        }
      });
    } catch (error: any) {
      console.error("Error completing checkout:", error);
      res.status(500).json({ message: error.message || "Failed to complete checkout" });
    }
  });

  // Get user's current subscription
  app.get('/api/subscription', isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user;
      
      res.json({
        plan: user.plan,
        planTier: user.planTier,
        billingPeriod: user.billingPeriod,
        subscriptionStatus: user.subscriptionStatus,
        currentPeriodEnd: user.currentPeriodEnd,
        clipCreditsRemaining: user.clipCreditsRemaining,
        clipCreditsTotal: user.clipCreditsTotal,
        stripeSubscriptionId: user.stripeSubscriptionId,
      });
    } catch (error) {
      console.error("Error fetching subscription:", error);
      res.status(500).json({ message: "Failed to fetch subscription" });
    }
  });

  // Create customer portal session for managing subscription
  app.post('/api/billing/portal', isAuthenticated, async (req: any, res) => {
    try {
      const stripe = await getUncachableStripeClient();
      const user = req.user;

      if (!user.stripeCustomerId) {
        return res.status(400).json({ message: "No billing account found" });
      }

      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const session = await stripe.billingPortal.sessions.create({
        customer: user.stripeCustomerId,
        return_url: `${baseUrl}/dashboard`,
      });

      res.json({ url: session.url });
    } catch (error: any) {
      console.error("Error creating portal session:", error);
      res.status(500).json({ message: error.message || "Failed to create billing portal" });
    }
  });

  // Newsletter signup
  app.post('/api/newsletter', async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email || typeof email !== 'string' || !email.includes('@')) {
        return res.status(400).json({ message: "Valid email is required" });
      }

      await storage.createNewsletterSignup(email);
      res.json({ message: "Successfully subscribed to updates!" });
    } catch (error: any) {
      if (error.code === '23505') {
        return res.json({ message: "You're already subscribed!" });
      }
      console.error("Error creating newsletter signup:", error);
      res.status(500).json({ message: "Failed to subscribe" });
    }
  });

  // Seed demo data for the authenticated user
  app.post('/api/seed-demo', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      
      // Create a sample stream session
      const streamSession = await storage.createStreamSession({
        userId,
        platform: "twitch",
        streamTitle: "Late Night Gaming Session",
        startedAt: new Date(Date.now() - 3600000 * 4),
        endedAt: new Date(Date.now() - 3600000 * 1),
        status: "completed",
      });

      // Create sample exports
      const exports = [
        { title: "Epic Clutch Moment - Valorant", duration: 600 },
        { title: "Chat Goes Wild at 3AM", duration: 540 },
        { title: "Explaining My Setup", duration: 720 },
        { title: "Reaction to Donation", duration: 480 },
      ];

      for (const exp of exports) {
        const streamExport = await storage.createStreamExport({
          streamSessionId: streamSession.id,
          userId,
          title: exp.title,
          durationSeconds: exp.duration,
          exportedAt: new Date(),
        });

        // Create a clip for each export
        const clip = await storage.createClip({
          exportId: streamExport.id,
          userId,
          durationSeconds: Math.floor(exp.duration / 10),
          transcription: "This is where the magic happened! The chat went absolutely crazy when this moment unfolded. You can hear the excitement in my voice as I react to what just happened on screen.",
          viralityScore: Math.floor(Math.random() * 40) + 60,
          viralityReason: "High engagement potential: Contains emotional peak moments, clear audio, and excellent pacing. The clip captures authentic reactions that resonate well with audiences on short-form platforms.",
          startTime: Math.floor(Math.random() * 300),
          endTime: Math.floor(Math.random() * 300) + 30,
        });

        // Create a social post for Instagram
        await storage.createSocialPost({
          clipId: clip.id,
          userId,
          platform: "instagram",
          status: "posted",
          postedAt: new Date(),
          metrics: { views: Math.floor(Math.random() * 50000), likes: Math.floor(Math.random() * 5000) },
        });
      }

      res.json({ message: "Demo data seeded successfully!" });
    } catch (error) {
      console.error("Error seeding demo data:", error);
      res.status(500).json({ message: "Failed to seed demo data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
