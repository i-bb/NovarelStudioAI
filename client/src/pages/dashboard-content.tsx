import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "wouter";
import { Play, Clock, Zap, LogOut, LayoutDashboard, Film, ArrowLeft } from "lucide-react";
import type { StreamExport } from "@shared/schema";

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

export default function DashboardContent() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

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

  const { data: exports, isLoading: exportsLoading } = useQuery<StreamExport[]>({
    queryKey: ["/api/exports"],
    enabled: isAuthenticated,
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-black/95">
      <DashboardNav />
      
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="h-8 w-8" data-testid="button-back">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold">Content Studio</h1>
        </div>

        <p className="text-muted-foreground mb-8 max-w-2xl">
          Your stream exports appear here. Click on any video to see the viral clips generated from it, 
          along with transcriptions and virality insights.
        </p>

        {exportsLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="border-white/10 bg-black/40 animate-pulse">
                <div className="aspect-video bg-white/5" />
                <CardContent className="p-3">
                  <div className="h-4 bg-white/5 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-white/5 rounded w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : exports && exports.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {exports.map((exp) => (
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
                        <Play className="h-12 w-12 text-white/50 group-hover:text-white transition-colors" />
                      </div>
                    )}
                    <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded bg-black/70 px-2 py-1 text-xs text-white">
                      <Clock className="h-3 w-3" />
                      {Math.floor(exp.durationSeconds / 60)}:{String(exp.durationSeconds % 60).padStart(2, '0')}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <p className="font-medium truncate mb-1">{exp.title || "Untitled Export"}</p>
                    <p className="text-sm text-muted-foreground">
                      {exp.exportedAt ? new Date(exp.exportedAt).toLocaleDateString() : "Recently"}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="border-white/10 bg-black/40 p-12 text-center">
            <Film className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
            <h3 className="font-display text-2xl font-semibold mb-3">No content yet</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Your stream exports will appear here once you connect your streaming account and start streaming. 
              We'll automatically detect and export your best moments.
            </p>
          </Card>
        )}
      </main>
    </div>
  );
}
