import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "wouter";
import {
  Zap,
  LayoutDashboard,
  Film,
  Link2,
  LogOut,
  User,
  Settings,
  Menu,
} from "lucide-react";
import { RxCross2 } from "react-icons/rx";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { GrTransaction } from "react-icons/gr";
import { MdSubscriptions } from "react-icons/md";
import api from "@/lib/api/api";
import { useLocation } from "wouter";

export function DashboardNav() {
  const [location] = useLocation();

  const { user } = useAuth();

  const [isKickLive, setIsKickLive] = useState(false);
  const [isTwitchLive, setIsTwitchLick] = useState(false);
  const [liveStartKickTime, setLiveStartKickTime] = useState(null);
  const [liveStartTwitchTime, setLiveStartTwitchTime] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const displayName = user?.name || user?.email?.split("@")[0] || "User";

  const initials = displayName.slice(0, 2).toUpperCase();

  const getNavLinkClass = (path: string) => {
    if (path === "/dashboard") {
      return location === "/dashboard"
        ? "text-primary"
        : "text-muted-foreground";
    }

    return location === path || location.startsWith(path + "/")
      ? "text-primary"
      : "text-muted-foreground";
  };

  const handleLogout = async () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    window.location.href = "/login";
  };

  const fetchTwitchStatus = async () => {
    try {
      const response = await api.getStreamerStreamingAccounts("twitch");
      setIsTwitchLick(response?.live || false);
      setLiveStartTwitchTime(response?.started_at || null);
    } catch (error) {
      console.error("Error polling Twitch account status:", error);
    }
  };

  const fetchKickStatus = async () => {
    try {
      const response = await api.getStreamerStreamingAccounts("kick");
      setIsKickLive(response?.live || false);
      setLiveStartKickTime(response?.started_at || null);
    } catch (error) {
      console.error("Error polling Twitch account status:", error);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchTwitchStatus(); // call on mount AND on page change
    fetchKickStatus();

    const interval = setInterval(() => {
      fetchTwitchStatus();
      fetchKickStatus();
    }, 50 * 1000);

    return () => clearInterval(interval);
  }, [user, location]); // 👈 now runs on route change

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary">
              <Zap className="h-4 w-4" />
            </div>
            <span className="font-display text-lg font-semibold">
              Novarel<span className="text-primary">Studio</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link href="/dashboard">
              <Button
                variant="ghost"
                size="sm"
                className={getNavLinkClass("/dashboard")}
                data-testid="nav-dashboard"
              >
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </Link>

            <Link href="/dashboard/content">
              <Button
                variant="ghost"
                size="sm"
                className={getNavLinkClass("/dashboard/content")}
                data-testid="nav-content-studio"
              >
                <Film className="h-4 w-4 mr-2" />
                Content Studio
              </Button>
            </Link>

            <Link href="/dashboard/accounts">
              <Button
                variant="ghost"
                size="sm"
                className={getNavLinkClass("/dashboard/accounts")}
                data-testid="nav-connected-accounts"
              >
                <Link2 className="h-4 w-4 mr-2" />
                Connected Accounts
              </Button>
            </Link>
          </nav>
        </div>

        {/* ---------------- Right Section: Profile Dropdown ---------------- */}
        <div className="flex items-center gap-3">
          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 rounded-md border border-white/20 text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <span className="h-5 w-5">
                <RxCross2 />
              </span> // X icon
            ) : (
              <Menu className="h-5 w-5" /> // Hamburger icon
            )}
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              {/* liveStartKickTime */}
              <button
                className="relative flex items-center gap-2 rounded-full p-1 cursor-pointer group focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                title={
                  (isKickLive || isTwitchLive) &&
                  ((liveStartKickTime
                    ? `Live since ${new Date(
                        liveStartKickTime
                      ).toLocaleString()}`
                    : liveStartTwitchTime
                    ? `Live since ${new Date(
                        liveStartTwitchTime
                      ).toLocaleString()}`
                    : "") as any)
                }
              >
                {/* 🔥 SAME COLOR RING — rotating + breathing glow */}
                {(isKickLive || isTwitchLive) && (
                  <span className="absolute inset-0 rounded-full p-[4px] bg-[conic-gradient(from_0deg,rgba(255,0,0,.9),rgba(255,0,128,.9),rgba(128,0,255,.9),rgba(255,0,0,.9))] animate-insta-rotate animate-live-glow-breath"></span>
                )}

                {/* Optional ✨ Light Sweep Across Ring */}
                {(isKickLive || isTwitchLive) && (
                  <span className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-light-sweep mix-blend-overlay"></span>
                  </span>
                )}

                {/* Inner black padding circle */}
                <span className="relative rounded-full bg-black p-[3px]">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/20 text-primary text-xs">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </span>

                {/* 📌 LIVE label like Instagram */}
                {(isKickLive || isTwitchLive) && (
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-sm bg-red-600 px-1 py-[1px] text-[9px] font-bold text-white uppercase tracking-wider">
                    Live
                  </span>
                )}
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{displayName}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>

              {user?.active_plan ? (
                <div className="inline-flex items-center rounded-[30px] bg-green-100 px-2 py-1 text-[10px] font-semibold text-green-700 my-3">
                  Active Plan: {user?.active_plan?.name}
                </div>
              ) : (
                <div className="inline-flex items-center rounded-[30px] bg-gray-100 px-2 py-1 text-[10px] font-semibold text-gray-700 my-3">
                  No Active Plan
                </div>
              )}

              <DropdownMenuSeparator />

              <Link href="/dashboard/profile">
                <DropdownMenuItem
                  className="cursor-pointer"
                  data-testid="menu-item-profile"
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Edit Profile</span>
                </DropdownMenuItem>
              </Link>

              <Link href="/transactions">
                <DropdownMenuItem className="cursor-pointer">
                  <GrTransaction className="mr-2 h-4 w-4" />
                  <span>Transaction History</span>
                </DropdownMenuItem>
              </Link>

              <Link href="/subscription">
                <DropdownMenuItem className="cursor-pointer">
                  <MdSubscriptions className="mr-2 h-4 w-4" />
                  <span>Manage Subscription</span>
                </DropdownMenuItem>
              </Link>

              <Link href="/dashboard/accounts">
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Account Settings</span>
                </DropdownMenuItem>
              </Link>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="cursor-pointer text-red-400 focus:text-red-400"
                onClick={handleLogout}
                data-testid="menu-item-logout"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {mobileMenuOpen && (
        <div className="md:hidden absolute left-0 top-[64px] w-full bg-black/100 backdrop-blur-md border-b border-white/10 shadow-lg z-40 rounded-b-xl animate-fade-down">
          <div className="flex flex-col py-3 px-4 text-sm text-white">
            <Link href="/dashboard">
              <Button
                variant="ghost"
                className={getNavLinkClass("/dashboard")}
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Button>
            </Link>

            <Link href="/dashboard/content">
              <Button
                variant="ghost"
                className={getNavLinkClass("/dashboard/content")}
                onClick={() => setMobileMenuOpen(false)}
              >
                Content Studio
              </Button>
            </Link>

            <Link href="/dashboard/accounts">
              <Button
                variant="ghost"
                className={getNavLinkClass("/dashboard/accounts")}
                onClick={() => setMobileMenuOpen(false)}
              >
                Connected Accounts
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}