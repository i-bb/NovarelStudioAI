import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Link, useParams } from "wouter";
import { Play, Clock, Zap, LogOut, LayoutDashboard, Film, ArrowLeft, TrendingUp, FileText, Sparkles } from "lucide-react";
import type { StreamExport, Clip } from "@shared/schema";

function DashboardNav() {
  const { user } = useAuth();
  
  const initials = user?.firstName && user?.lastName 
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : user?.email?.[0]?.toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary">
              <Zap className="h-4 w-4" />
            </div>
            <span className="font-display text-lg font-semibold">
              Novarel<span className="text-primary">Studio</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-muted-foreground" data-testid="nav-dashboard">
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <Link href="/dashboard/content">
              <Button variant="ghost" size="sm" className="text-primary" data-testid="nav-content-studio">
                <Film className="h-4 w-4 mr-2" />
                Content Studio
              </Button>
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8" data-testid="avatar-user">
            <AvatarImage src={user?.profileImageUrl || undefined} />
            <AvatarFallback className="bg-primary/20 text-primary text-xs">{initials}</AvatarFallback>
          </Avatar>
          <a href="/api/logout">
            <Button variant="ghost" size="icon" className="h-8 w-8" data-testid="button-logout">
              <LogOut className="h-4 w-4" />
            </Button>
          </a>
        </div>
      </div>
    </header>
  );
}

function ClipCard({ clip }: { clip: Clip }) {
  const viralityColor = clip.viralityScore && clip.viralityScore >= 70 
    ? "text-emerald-400" 
    : clip.viralityScore && clip.viralityScore >= 40 
    ? "text-amber-400" 
    : "text-muted-foreground";

  return (
    <Card className="border-white/10 bg-black/40" data-testid={`card-clip-${clip.id}`}>
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Video Player */}
        <div className="relative">
          <div className="aspect-[9/16] bg-gradient-to-br from-primary/20 to-emerald-500/20 rounded-lg overflow-hidden">
            {clip.clipUrl ? (
              <video 
                src={clip.clipUrl} 
                controls 
                className="w-full h-full object-cover"
                poster={clip.thumbnailUrl || undefined}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Play className="h-16 w-16 text-white/50 mx-auto mb-4" />
                  <p className="text-muted-foreground">Clip preview</p>
                </div>
              </div>
            )}
          </div>
          {clip.durationSeconds && (
            <div className="absolute bottom-4 right-4 flex items-center gap-1 rounded bg-black/70 px-2 py-1 text-xs text-white">
              <Clock className="h-3 w-3" />
              {Math.floor(clip.durationSeconds / 60)}:{String(clip.durationSeconds % 60).padStart(2, '0')}
            </div>
          )}
        </div>

        {/* Clip Details */}
        <div className="space-y-6 p-4 lg:p-0 lg:pr-4">
          {/* Virality Score */}
          <Card className="border-white/10 bg-black/60">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="h-4 w-4 text-primary" />
                Virality Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-3 mb-3">
                <span className={`text-5xl font-bold ${viralityColor}`} data-testid="text-virality-score">
                  {clip.viralityScore || 0}
                </span>
                <span className="text-muted-foreground mb-1">/ 100</span>
              </div>
              <Progress value={clip.viralityScore || 0} className="h-2" />
              {clip.viralityScore && clip.viralityScore >= 70 && (
                <Badge className="mt-3 bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                  High Viral Potential
                </Badge>
              )}
            </CardContent>
          </Card>

          {/* Virality Reason */}
          <Card className="border-white/10 bg-black/60">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Sparkles className="h-4 w-4 text-amber-400" />
                Why This Can Go Viral
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed" data-testid="text-virality-reason">
                {clip.viralityReason || "Analysis pending..."}
              </p>
            </CardContent>
          </Card>

          {/* Transcription */}
          <Card className="border-white/10 bg-black/60">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-4 w-4 text-blue-400" />
                Transcription
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-48 overflow-y-auto">
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap" data-testid="text-transcription">
                  {clip.transcription || "Transcription pending..."}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Card>
  );
}

export default function VideoDetail() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const params = useParams();
  const exportId = params.id;

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to access the dashboard.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [isAuthenticated, authLoading, toast]);

  const { data, isLoading } = useQuery<{ export: StreamExport; clips: Clip[] }>({
    queryKey: ["/api/exports", exportId],
    enabled: isAuthenticated && !!exportId,
  });

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const exportData = data?.export;
  const clips = data?.clips || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-black/95">
      <DashboardNav />
      
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/dashboard/content">
            <Button variant="ghost" size="icon" className="h-8 w-8" data-testid="button-back">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-semibold" data-testid="text-export-title">
              {exportData?.title || "Stream Export"}
            </h1>
            {exportData?.exportedAt && (
              <p className="text-sm text-muted-foreground">
                Exported on {new Date(exportData.exportedAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        {/* Source Video Info */}
        <Card className="border-white/10 bg-black/40 mb-8">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-20 w-32 rounded-lg bg-gradient-to-br from-primary/20 to-emerald-500/20 flex items-center justify-center flex-shrink-0">
              <Play className="h-8 w-8 text-white/50" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Source Video</p>
              <p className="font-medium">{exportData?.title || "Untitled"}</p>
              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {exportData?.durationSeconds 
                  ? `${Math.floor(exportData.durationSeconds / 60)} minutes`
                  : "Duration unknown"
                }
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Clips Section */}
        <section>
          <h2 className="font-display text-xl font-semibold mb-6">
            Generated Clips ({clips.length})
          </h2>

          {clips.length > 0 ? (
            <div className="space-y-8">
              {clips.map((clip) => (
                <ClipCard key={clip.id} clip={clip} />
              ))}
            </div>
          ) : (
            <Card className="border-white/10 bg-black/40 p-12 text-center">
              <Sparkles className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
              <h3 className="font-display text-2xl font-semibold mb-3">No clips yet</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                We're analyzing this video for viral moments. Clips will appear here once processing is complete.
              </p>
            </Card>
          )}
        </section>
      </main>
    </div>
  );
}
