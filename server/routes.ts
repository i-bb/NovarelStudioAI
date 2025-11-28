import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up Replit Auth
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Dashboard stats - get social post counts by platform
  app.get('/api/dashboard/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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
      const userId = req.user.claims.sub;
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

  // Seed demo data for the authenticated user
  app.post('/api/seed-demo', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
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
