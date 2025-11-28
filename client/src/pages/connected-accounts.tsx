import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "wouter";
import { SiTwitch, SiInstagram, SiTiktok, SiYoutube } from "react-icons/si";
import { LogOut, LayoutDashboard, Film, Link2, Check, Loader2, ArrowLeft, Unlink } from "lucide-react";
import type { ConnectedAccount } from "@shared/schema";

function DashboardNav() {
  const { user } = useAuth();
  
  const displayName = user?.firstName || user?.email?.split("@")[0] || "User";
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <header className="border-b border-white/10 bg-black/40 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4 md:px-8">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2" data-testid="link-logo">
            <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <span className="text-primary font-bold text-sm">N</span>
            </div>
            <span className="font-display text-lg font-semibold">Novarel<span className="text-primary">Studio</span></span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-1">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground" data-testid="link-dashboard">
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link href="/dashboard/content">
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground" data-testid="link-content-studio">
                <Film className="h-4 w-4" />
                Content Studio
              </Button>
            </Link>
            <Link href="/dashboard/accounts">
              <Button variant="ghost" size="sm" className="gap-2 text-foreground bg-white/5" data-testid="link-connected-accounts">
                <Link2 className="h-4 w-4" />
                Connected Accounts
              </Button>
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
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

interface PlatformConfig {
  id: string;
  name: string;
  icon: typeof SiTwitch;
  color: string;
  bgColor: string;
  description: string;
  category: "streaming" | "social";
  available: boolean;
}

const platforms: PlatformConfig[] = [
  {
    id: "twitch",
    name: "Twitch",
    icon: SiTwitch,
    color: "text-[#9146FF]",
    bgColor: "bg-[#9146FF]/10",
    description: "Auto-record your live streams",
    category: "streaming",
    available: true,
  },
  {
    id: "kick",
    name: "Kick",
    icon: () => (
      <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
        <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.5L19 8v8l-7 3.5L5 16V8l7-3.5z"/>
      </svg>
    ),
    color: "text-[#53FC18]",
    bgColor: "bg-[#53FC18]/10",
    description: "Auto-record your live streams",
    category: "streaming",
    available: true,
  },
  {
    id: "instagram",
    name: "Instagram Reels",
    icon: SiInstagram,
    color: "text-[#E4405F]",
    bgColor: "bg-[#E4405F]/10",
    description: "Auto-publish clips to Reels",
    category: "social",
    available: true,
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: SiTiktok,
    color: "text-white",
    bgColor: "bg-white/10",
    description: "Auto-publish clips",
    category: "social",
    available: false,
  },
  {
    id: "youtube",
    name: "YouTube Shorts",
    icon: SiYoutube,
    color: "text-[#FF0000]",
    bgColor: "bg-[#FF0000]/10",
    description: "Auto-publish clips to Shorts",
    category: "social",
    available: false,
  },
];

function PlatformCard({ 
  platform, 
  connectedAccount,
  onConnect,
  onDisconnect,
  isConnecting,
  isDisconnecting,
}: { 
  platform: PlatformConfig;
  connectedAccount?: ConnectedAccount;
  onConnect: () => void;
  onDisconnect: () => void;
  isConnecting: boolean;
  isDisconnecting: boolean;
}) {
  const Icon = platform.icon;
  const isConnected = !!connectedAccount;
  const isPending = isConnecting || isDisconnecting;

  return (
    <Card className="bg-black/40 border-white/10 overflow-hidden" data-testid={`card-platform-${platform.id}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`h-12 w-12 rounded-xl ${platform.bgColor} flex items-center justify-center`}>
              <Icon className={`h-6 w-6 ${platform.color}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-lg font-semibold text-foreground">{platform.name}</h3>
                {!platform.available && (
                  <Badge variant="outline" className="text-xs border-white/20">Coming Soon</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{platform.description}</p>
              {isConnected && connectedAccount.platformUsername && (
                <p className="text-xs text-primary mt-1">@{connectedAccount.platformUsername}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {isConnected ? (
              <>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 gap-1">
                  <Check className="h-3 w-3" />
                  Connected
                </Badge>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-red-400"
                  onClick={onDisconnect}
                  disabled={isPending}
                  data-testid={`button-disconnect-${platform.id}`}
                >
                  {isDisconnecting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Unlink className="h-4 w-4" />
                  )}
                </Button>
              </>
            ) : (
              <Button 
                onClick={onConnect}
                disabled={!platform.available || isPending}
                className="gap-2"
                data-testid={`button-connect-${platform.id}`}
              >
                {isConnecting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Link2 className="h-4 w-4" />
                )}
                Connect
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ConnectedAccountsPage() {
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to manage connected accounts.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [isAuthenticated, authLoading, toast]);

  const { data: connectedAccounts = [] } = useQuery<ConnectedAccount[]>({
    queryKey: ["/api/connected-accounts"],
    enabled: isAuthenticated,
  });

  const connectMutation = useMutation({
    mutationFn: async (platform: string) => {
      await apiRequest("POST", `/api/connected-accounts/${platform}/connect`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/connected-accounts"] });
      toast({
        title: "Account connected!",
        description: "Your account has been successfully linked.",
      });
    },
    onError: () => {
      toast({
        title: "Connection failed",
        description: "Failed to connect account. Please try again.",
        variant: "destructive",
      });
    },
  });

  const disconnectMutation = useMutation({
    mutationFn: async (platform: string) => {
      await apiRequest("DELETE", `/api/connected-accounts/${platform}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/connected-accounts"] });
      toast({
        title: "Account disconnected",
        description: "Your account has been unlinked.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to disconnect account. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const getConnectedAccount = (platformId: string) => 
    connectedAccounts.find(a => a.platform === platformId);

  const streamingPlatforms = platforms.filter(p => p.category === "streaming");
  const socialPlatforms = platforms.filter(p => p.category === "social");

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-black/95">
      <DashboardNav />
      
      <main className="max-w-4xl mx-auto px-4 md:px-8 py-8">
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="gap-2 mb-4 text-muted-foreground" data-testid="button-back">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold mb-2" data-testid="text-page-title">
            Connected Accounts
          </h1>
          <p className="text-muted-foreground">
            Link your streaming and social media accounts to enable automatic recording and publishing.
          </p>
        </div>

        <section className="mb-10">
          <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary" />
            Streaming Platforms
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Connect your streaming accounts so Novarel can automatically record and process your streams.
          </p>
          <div className="space-y-3">
            {streamingPlatforms.map(platform => (
              <PlatformCard
                key={platform.id}
                platform={platform}
                connectedAccount={getConnectedAccount(platform.id)}
                onConnect={() => connectMutation.mutate(platform.id)}
                onDisconnect={() => disconnectMutation.mutate(platform.id)}
                isConnecting={connectMutation.isPending && connectMutation.variables === platform.id}
                isDisconnecting={disconnectMutation.isPending && disconnectMutation.variables === platform.id}
              />
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-accent" />
            Social Media Platforms
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Connect your social accounts to auto-publish your best clips directly to your audience.
          </p>
          <div className="space-y-3">
            {socialPlatforms.map(platform => (
              <PlatformCard
                key={platform.id}
                platform={platform}
                connectedAccount={getConnectedAccount(platform.id)}
                onConnect={() => connectMutation.mutate(platform.id)}
                onDisconnect={() => disconnectMutation.mutate(platform.id)}
                isConnecting={connectMutation.isPending && connectMutation.variables === platform.id}
                isDisconnecting={disconnectMutation.isPending && disconnectMutation.variables === platform.id}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
