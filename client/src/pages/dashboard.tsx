import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import { SiInstagram, SiTiktok, SiYoutube } from "react-icons/si";
import { Play, Clock, Loader2, Sparkles, Film, Zap, Crown, CreditCard } from "lucide-react";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import type { StreamExport } from "@shared/schema";

type SubscriptionData = {
  plan: string;
  planTier: number | null;
  billingPeriod: string | null;
  subscriptionStatus: string | null;
  currentPeriodEnd: string | null;
  clipCreditsRemaining: number | null;
  clipCreditsTotal: number | null;
  stripeSubscriptionId: string | null;
};

function PlatformStatCard({ 
  platform, 
  icon: Icon, 
  count, 
  comingSoon = false,
  color
}: { 
  platform: string; 
  icon: any; 
  count: number;
  comingSoon?: boolean;
  color: string;
}) {
  return (
    <Card 
      className={`relative overflow-hidden border-2 transition-all ${
        comingSoon ? "border-white/10 bg-black/40" : `border-${color}/30 bg-${color}/5`
      }`}
      data-testid={`card-platform-${platform.toLowerCase()}`}
    >
      {comingSoon && (
        <Badge className="absolute top-3 right-3 bg-amber-500/20 text-amber-400 border-amber-500/30 text-[10px]">
          Coming Soon
        </Badge>
      )}
      <CardContent className="p-6 flex flex-col items-center text-center">
        <div className={`mb-4 p-3 rounded-xl ${comingSoon ? "bg-white/5" : `bg-${color}/10`}`}>
          <Icon className={`h-6 w-6 ${comingSoon ? "text-muted-foreground" : `text-${color}`}`} style={{ color: comingSoon ? undefined : color }} />
        </div>
        <h3 className={`font-display text-lg font-semibold mb-2 ${comingSoon ? "text-muted-foreground" : ""}`} style={{ color: comingSoon ? undefined : color }}>
          {platform}
        </h3>
        <p className="text-4xl font-bold text-foreground mb-1">{count}</p>
        <p className="text-sm text-muted-foreground">Video{count !== 1 ? "s" : ""} Posted</p>
      </CardContent>
    </Card>
  );
}

function PlanStatusCard({ subscription }: { subscription: SubscriptionData | undefined }) {
  const { toast } = useToast();
  
  const portalMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/billing/portal");
      return response.json();
    },
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to open billing portal",
        variant: "destructive",
      });
    },
  });

  const planName = subscription?.plan || "starter";
  const isPaid = planName !== "starter" && subscription?.subscriptionStatus === "active";
  const creditsRemaining = subscription?.clipCreditsRemaining ?? 10;
  const creditsTotal = subscription?.clipCreditsTotal ?? 10;
  const usagePercentage = creditsTotal > 0 ? ((creditsTotal - creditsRemaining) / creditsTotal) * 100 : 0;

  return (
    <Card className="border-white/10 bg-black/40 overflow-hidden" data-testid="card-plan-status">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {planName === "studio" ? (
              <div className="p-2 rounded-lg bg-yellow-500/10">
                <Crown className="h-5 w-5 text-yellow-400" />
              </div>
            ) : planName === "creator" ? (
              <div className="p-2 rounded-lg bg-primary/10">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
            ) : (
              <div className="p-2 rounded-lg bg-emerald-400/10">
                <Zap className="h-5 w-5 text-emerald-400" />
              </div>
            )}
            <div>
              <h3 className="font-display text-lg font-semibold capitalize">{planName} Plan</h3>
              {subscription?.subscriptionStatus && (
                <Badge 
                  variant={subscription.subscriptionStatus === "active" ? "default" : "secondary"} 
                  className="text-[10px]"
                >
                  {subscription.subscriptionStatus}
                </Badge>
              )}
            </div>
          </div>
          {isPaid ? (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => portalMutation.mutate()}
              disabled={portalMutation.isPending}
              data-testid="button-manage-billing"
            >
              {portalMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Manage Billing
                </>
              )}
            </Button>
          ) : (
            <Link href="/#pricing">
              <Button size="sm" data-testid="button-upgrade">
                <Zap className="h-4 w-4 mr-2" />
                Upgrade
              </Button>
            </Link>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Clip Credits</span>
            <span className="font-medium">{creditsRemaining} / {creditsTotal} remaining</span>
          </div>
          <Progress value={usagePercentage} className="h-2" />
          {creditsRemaining <= 5 && (
            <p className="text-xs text-amber-400">
              Running low on credits! Consider upgrading for more clips.
            </p>
          )}
        </div>

        {subscription?.currentPeriodEnd && (
          <p className="text-xs text-muted-foreground mt-4">
            {subscription.subscriptionStatus === "active" ? "Renews" : "Expires"} on{" "}
            {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function ContentStudioPreview({ exports }: { exports: StreamExport[] }) {
  if (exports.length === 0) {
    return (
      <Card className="border-white/10 bg-black/40 p-8 text-center">
        <Film className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="font-display text-lg font-semibold mb-2">No content yet</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Your stream exports will appear here once you start streaming.
        </p>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {exports.slice(0, 6).map((exp) => (
        <Link key={exp.id} href={`/dashboard/content/${exp.id}`}>
          <Card 
            className="group cursor-pointer overflow-hidden border-white/10 bg-black/40 hover:border-primary/50 transition-all"
            data-testid={`card-export-${exp.id}`}
          >
            <div className="aspect-video relative bg-gradient-to-br from-primary/20 to-emerald-500/20">
              {exp.thumbnailUrl ? (
                <img src={exp.thumbnailUrl} alt={exp.title || "Stream export"} className="w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Play className="h-10 w-10 text-white/50 group-hover:text-white transition-colors" />
                </div>
              )}
              <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded bg-black/70 px-2 py-1 text-xs text-white">
                <Clock className="h-3 w-3" />
                {Math.floor(exp.durationSeconds / 60)}:{String(exp.durationSeconds % 60).padStart(2, '0')}
              </div>
            </div>
            <CardContent className="p-3">
              <p className="font-medium text-sm truncate">{exp.title || "Untitled Export"}</p>
              <p className="text-xs text-muted-foreground">
                {exp.exportedAt ? new Date(exp.exportedAt).toLocaleDateString() : "Recently"}
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to access the dashboard.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 500);
    }
  }, [isAuthenticated, authLoading, toast]);

  const { data: stats } = useQuery<{ instagram: number; tiktok: number; youtube: number }>({
    queryKey: ["/api/dashboard/stats"],
    enabled: isAuthenticated,
  });

  const { data: exports } = useQuery<StreamExport[]>({
    queryKey: ["/api/exports"],
    enabled: isAuthenticated,
  });

  const { data: subscription } = useQuery<SubscriptionData>({
    queryKey: ["/api/subscription"],
    enabled: isAuthenticated,
  });

  const seedMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/seed-demo");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/exports"] });
      toast({
        title: "Demo data created!",
        description: "Sample streams and clips have been added to your dashboard.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create demo data.",
        variant: "destructive",
      });
    },
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const displayName = user?.firstName 
    ? `${user.firstName}${user.lastName ? ` ${user.lastName[0]}` : ""}`
    : user?.email?.split("@")[0] || "Creator";

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-black/95">
      <DashboardNav activeTab="dashboard" />
      
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl sm:text-4xl font-semibold" data-testid="text-greeting">
            Hello, {displayName}
          </h1>
          {(!exports || exports.length === 0) && (
            <Button 
              onClick={() => seedMutation.mutate()} 
              disabled={seedMutation.isPending}
              className="gap-2"
              data-testid="button-seed-demo"
            >
              {seedMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              Load Demo Data
            </Button>
          )}
        </div>

        {/* Plan Status */}
        <section className="mb-8">
          <PlanStatusCard subscription={subscription} />
        </section>

        {/* Platform Stats */}
        <section className="mb-12">
          <div className="grid gap-4 sm:grid-cols-3">
            <PlatformStatCard 
              platform="Instagram" 
              icon={SiInstagram} 
              count={stats?.instagram || 0}
              color="#E1306C"
            />
            <PlatformStatCard 
              platform="TikTok" 
              icon={SiTiktok} 
              count={stats?.tiktok || 0}
              comingSoon
              color="#00f2ea"
            />
            <PlatformStatCard 
              platform="YouTube" 
              icon={SiYoutube} 
              count={stats?.youtube || 0}
              comingSoon
              color="#FF0000"
            />
          </div>
        </section>

        {/* Content Studio Preview */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-semibold">Content Studio</h2>
            <Link href="/dashboard/content">
              <Button variant="outline" size="sm" data-testid="button-view-all-content">
                View All
              </Button>
            </Link>
          </div>
          <ContentStudioPreview exports={exports || []} />
        </section>
      </main>
    </div>
  );
}
