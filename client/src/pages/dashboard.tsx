import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { SiInstagram, SiTiktok, SiYoutube } from "react-icons/si";
import { Loader2 } from "lucide-react";
import api, { User } from "@/lib/api/api";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { useAuth } from "@/hooks/AuthContext";
import PlatformStatCard from "@/components/dashboard/PlatformStatCard";
import PlanStatusCard from "@/components/dashboard/PlanStatusCard";

// ── Types ─────────────────────────────────────
interface SocialMediaStats {
  instagram_reel_count: number;
  tiktok_reel_count: number;
  youtube_short_count: number;
}

// ── Main Dashboard Component ─────────────────────
export default function Dashboard() {
  const { refreshUser, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  const [socialMediaStats, setSocialMediaStats] =
    useState<SocialMediaStats | null>({
      instagram_reel_count: 0,
      tiktok_reel_count: 0,
      youtube_short_count: 0,
    });
  const [loading, setLoading] = useState(true);
  const [userDataLoading, setUserDataLoading] = useState(true);
  const [userData, setUserData] = useState<User | null>(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await api.getDashboard();
      setSocialMediaStats({
        instagram_reel_count: response?.instagram_reel_count,
        tiktok_reel_count: response?.tiktok_reel_count,
        youtube_short_count: response?.youtube_short_count,
      });
    } catch (error: any) {
      console.error("Dashboard API failed:", error);
      toast({
        description: getErrorMessage(error, "Failed to fetch data."),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDetails = async () => {
    try {
      const response = await api.userDetails();
      setUserDataLoading(false);
      setUserData(response);
      refreshUser();
    } catch (error: any) {
      toast({
        description: getErrorMessage(error, "Failed to fetch user data."),
        variant: "destructive",
      });
    } finally {
      setUserDataLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchDashboard();
    fetchUserDetails();
  }, [isAuthenticated]);

  // Auth guard
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({ description: "Redirecting..." });
      setTimeout(() => (window.location.href = "/login"), 800);
    }
  }, [isAuthenticated, authLoading, toast]);

  if (authLoading || loading || userDataLoading || !socialMediaStats) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-black/95 flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  const displayName = userData?.name || "Creator";

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      <h1 className="font-display text-3xl mb-8">Hello, {displayName}!</h1>

      <PlanStatusCard subscription={userData || null} />

      <section className="my-12">
        <div className="grid gap-6 sm:grid-cols-3">
          <PlatformStatCard
            platform="Instagram"
            icon={SiInstagram}
            count={socialMediaStats?.instagram_reel_count}
            color="#E1306C"
          />
          <PlatformStatCard
            platform="TikTok"
            icon={SiTiktok}
            count={socialMediaStats?.tiktok_reel_count}
            comingSoon
            color="#00f2ea"
          />
          <PlatformStatCard
            platform="YouTube"
            icon={SiYoutube}
            count={socialMediaStats?.youtube_short_count}
            comingSoon
            color="#FF0000"
          />
        </div>
      </section>
    </main>
  );
}
