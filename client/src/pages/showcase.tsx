import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import { SiInstagram, SiTiktok, SiYoutube } from "react-icons/si";
import { Play, Clock, Zap, Film, TrendingUp, Users, Eye, Lock } from "lucide-react";

function PreviewPlatformStatCard({ 
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
        comingSoon ? "border-white/10 bg-black/40" : "border-white/10 bg-black/40"
      }`}
    >
      {comingSoon && (
        <Badge className="absolute top-3 right-3 bg-amber-500/20 text-amber-400 border-amber-500/30 text-[10px]">
          Coming Soon
        </Badge>
      )}
      <CardContent className="p-6 flex flex-col items-center text-center">
        <div className={`mb-4 p-3 rounded-xl ${comingSoon ? "bg-white/5" : "bg-white/5"}`}>
          <Icon className="h-6 w-6" style={{ color: comingSoon ? "var(--muted-foreground)" : color }} />
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

function PreviewPlanStatusCard() {
  return (
    <Card className="border-white/10 bg-black/40 overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-400/10">
              <Zap className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold">Starter Plan</h3>
              <Badge variant="default" className="text-[10px]">
                active
              </Badge>
            </div>
          </div>
          <Button size="sm" variant="outline" disabled>
            <Zap className="h-4 w-4 mr-2" />
            Upgrade
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Clip Credits</span>
            <span className="font-medium">7 / 10 remaining</span>
          </div>
          <Progress value={30} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}

function PreviewContentCard({ 
  title, 
  duration, 
  date,
  gradient
}: { 
  title: string; 
  duration: string;
  date: string;
  gradient: string;
}) {
  return (
    <Card className="group overflow-hidden border-white/10 bg-black/40">
      <div className={`aspect-video relative ${gradient}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <Play className="h-10 w-10 text-white/50" />
        </div>
        <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded bg-black/70 px-2 py-1 text-xs text-white">
          <Clock className="h-3 w-3" />
          {duration}
        </div>
      </div>
      <CardContent className="p-3">
        <p className="font-medium text-sm truncate">{title}</p>
        <p className="text-xs text-muted-foreground">{date}</p>
      </CardContent>
    </Card>
  );
}

function PreviewAnalyticsCard({
  title,
  value,
  change,
  icon: Icon
}: {
  title: string;
  value: string;
  change: string;
  icon: any;
}) {
  return (
    <Card className="border-white/10 bg-black/40">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">{title}</span>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-xs text-emerald-400">{change}</p>
      </CardContent>
    </Card>
  );
}

export default function ShowcasePage() {
  return (
    <AppLayout>
      <main className="min-h-screen bg-gradient-to-b from-background via-background/95 to-black/95 pt-20">
        <div className="container mx-auto px-4 md:px-8 lg:px-12 py-12">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
              Dashboard Preview
            </Badge>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Your Creator Command Center
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get a sneak peek at the powerful tools waiting for you. 
              Track your content, manage clips, and grow across platforms.
            </p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
            
            <div className="border border-white/10 rounded-xl bg-black/20 backdrop-blur-sm overflow-hidden">
              <div className="border-b border-white/10 bg-black/40 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/70" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                    <div className="w-3 h-3 rounded-full bg-green-500/70" />
                  </div>
                  <span className="text-sm text-muted-foreground font-mono">novarelstudio.com/dashboard</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  <Lock className="h-3 w-3 mr-1" />
                  Preview Mode
                </Badge>
              </div>

              <div className="p-6 md:p-8 space-y-8 relative">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-2xl md:text-3xl font-semibold">
                    Hello, StreamerPro
                  </h2>
                  <Badge className="bg-primary/20 text-primary border-primary/30">
                    Sample Data
                  </Badge>
                </div>

                <PreviewPlanStatusCard />

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <PreviewAnalyticsCard 
                    title="Total Views" 
                    value="24.5K" 
                    change="+12% from last week"
                    icon={Eye}
                  />
                  <PreviewAnalyticsCard 
                    title="Followers Gained" 
                    value="847" 
                    change="+23% from last week"
                    icon={Users}
                  />
                  <PreviewAnalyticsCard 
                    title="Engagement Rate" 
                    value="8.2%" 
                    change="+5% from last week"
                    icon={TrendingUp}
                  />
                  <PreviewAnalyticsCard 
                    title="Clips Created" 
                    value="32" 
                    change="+8 this week"
                    icon={Film}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <PreviewPlatformStatCard 
                    platform="Instagram" 
                    icon={SiInstagram} 
                    count={18}
                    color="#E1306C"
                  />
                  <PreviewPlatformStatCard 
                    platform="TikTok" 
                    icon={SiTiktok} 
                    count={0}
                    comingSoon
                    color="#00f2ea"
                  />
                  <PreviewPlatformStatCard 
                    platform="YouTube" 
                    icon={SiYoutube} 
                    count={0}
                    comingSoon
                    color="#FF0000"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display text-xl font-semibold">Content Studio</h3>
                    <Button variant="outline" size="sm" disabled>View All</Button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <PreviewContentCard 
                      title="Epic Victory Royale Compilation"
                      duration="2:34"
                      date="Dec 1, 2024"
                      gradient="bg-gradient-to-br from-primary/30 to-emerald-500/30"
                    />
                    <PreviewContentCard 
                      title="Best Chat Moments of the Week"
                      duration="1:48"
                      date="Nov 29, 2024"
                      gradient="bg-gradient-to-br from-purple-500/30 to-pink-500/30"
                    />
                    <PreviewContentCard 
                      title="Insane Clutch Play Highlight"
                      duration="0:45"
                      date="Nov 28, 2024"
                      gradient="bg-gradient-to-br from-blue-500/30 to-cyan-500/30"
                    />
                  </div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/95 pointer-events-none" />
              </div>
            </div>

            <div className="relative z-20 -mt-24 pt-32 pb-8 text-center bg-gradient-to-t from-background via-background/95 to-transparent">
              <Card className="max-w-lg mx-auto border-primary/30 bg-black/60 backdrop-blur-md">
                <CardContent className="p-8">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                    <Zap className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-display text-2xl font-bold mb-3">
                    Ready to Level Up Your Content?
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Create your free account to access your personalized dashboard, 
                    AI-powered clip generation, and multi-platform publishing.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link href="/signup">
                      <Button size="lg" className="w-full sm:w-auto" data-testid="button-showcase-signup">
                        Create Free Account
                      </Button>
                    </Link>
                    <Link href="/pricing">
                      <Button 
                        size="lg" 
                        variant="outline" 
                        className="w-full sm:w-auto" 
                        data-testid="button-showcase-pricing"
                      >
                        View Pricing
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </AppLayout>
  );
}
