import { useAuth } from "@/hooks/useAuth";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "wouter";
import { Zap, LogOut, LayoutDashboard, Film, Link2 } from "lucide-react";

interface DashboardNavProps {
  activeTab?: "dashboard" | "content" | "accounts";
}

export function DashboardNav({ activeTab = "dashboard" }: DashboardNavProps) {
  const { user } = useAuth();

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/auth/logout");
    },
    onSuccess: () => {
      queryClient.clear();
      window.location.href = "/";
    },
  });

  const displayName = user?.firstName || user?.email?.split("@")[0] || "User";
  const initials = user?.firstName && user?.lastName
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : displayName.slice(0, 2).toUpperCase();

  const getNavLinkClass = (tab: string) => {
    return activeTab === tab ? "text-primary" : "text-muted-foreground";
  };

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
              <Button variant="ghost" size="sm" className={getNavLinkClass("dashboard")} data-testid="nav-dashboard">
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <Link href="/dashboard/content">
              <Button variant="ghost" size="sm" className={getNavLinkClass("content")} data-testid="nav-content-studio">
                <Film className="h-4 w-4 mr-2" />
                Content Studio
              </Button>
            </Link>
            <Link href="/dashboard/accounts">
              <Button variant="ghost" size="sm" className={getNavLinkClass("accounts")} data-testid="nav-connected-accounts">
                <Link2 className="h-4 w-4 mr-2" />
                Connected Accounts
              </Button>
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8" data-testid="avatar-user">
            <AvatarImage src={user?.profileImageUrl || undefined} />
            <AvatarFallback className="bg-primary/20 text-primary text-xs">{initials}</AvatarFallback>
          </Avatar>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            data-testid="button-logout"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
