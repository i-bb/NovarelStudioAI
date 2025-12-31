import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Loader2, ArrowLeft } from "lucide-react";
import { api } from "@/lib/api/api";
import { platforms } from "@/lib/common";
import { getErrorMessage } from "@/lib/getErrorMessage";
import PlatformCard from "@/components/PlatformCard";

export interface PlatformAccount {
  avatar_url: string | null;
  connected: boolean;
  display_name: string | null;
}

export type ConnectedAccounts = {
  [platform: string]: PlatformAccount;
};

// ------------------ MAIN PAGE ------------------
export default function ConnectedAccountsPage() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);

  const [connectedAccounts, setConnectedAccounts] =
    useState<ConnectedAccounts | null>(null);

  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true); // ⬅ NEW

  const [connectingPlatform, setConnectingPlatform] = useState<string | null>(
    null
  );
  const [disconnectingPlatform, setDisconnectingPlatform] = useState<
    string | null
  >(null);

  // Fetch user connected accounts
  const fetchUserDetails = async () => {
    try {
      setIsLoadingAccounts(true);
      const response = await api.userDetails();

      const accounts = response?.connected_accounts;
      setConnectedAccounts(accounts ? { ...accounts } : null);
    } catch (error: any) {
      toast({
        description: error?.response?.data?.description,
        variant: "destructive",
      });
    } finally {
      setIsLoadingAccounts(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchUserDetails();
  }, [isAuthenticated]);

  // Universal Connect
  const handleConnect = async (platformId: string) => {
    try {
      setConnectingPlatform(platformId);
      sessionStorage.setItem("oauth_platform", platformId);

      const platform = platforms.find((p) => p.id === platformId);

      if (platform?.category === "streaming") {
        const res = await api.authorizeStreamingAccount(platformId);
        const redirectUrl = new URL(res?.authorization_url);
        sessionStorage.setItem(
          "oauth_state",
          redirectUrl.searchParams.get("state")!
        );
        redirectUrl.searchParams.set(
          "state",
          platformId + ":" + crypto.randomUUID()
        );
        window.location.href = redirectUrl.toString();
        return;
      }

      const res = await api.authorizePlatform(platformId);
      window.location.href = res?.authorization_url || res?.url;
    } catch (error: any) {
      toast({
        // title: "Connection Failed",
        description: getErrorMessage(error, "Something went wrong!"),
        variant: "destructive",
      });
    } finally {
      setConnectingPlatform(null);
    }
  };

  // Disconnect
  const handleDisconnect = async (platformId: string) => {
    try {
      setDisconnectingPlatform(platformId);

      const platform = platforms.find((p) => p.id === platformId);

      if (platform?.category === "streaming") {
        const response = await api.disconnectStreamingAccount(platformId);
        toast({ description: response?.message });
      } else {
        const response = await api.disconnectPlatform(platformId);
        toast({
          description:
            response?.description ||
            response?.message ||
            `${platformId} disconnected`,
        });
      }

      await fetchUserDetails();
    } catch (error: any) {
      toast({
        description: getErrorMessage(error, "Something went wrong!"),
        variant: "destructive",
      });
    } finally {
      setDisconnectingPlatform(null);
    }
  };

  // OAuth callback handler
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const state = params.get("state");
    const error = params.get("error");

    if (error) {
      toast({
        description: error || "You denied access or closed the popup.",
        variant: "destructive",
      });
      window.history.replaceState({}, "", "/dashboard/accounts");
      return;
    }

    if (!code) return;

    (async () => {
      try {
        let platformId: string | null = null;

        // 1️⃣ Extract from state ("twitch:xyz")
        if (state && state.includes(":")) {
          platformId = state.split(":")[0];
        }

        // 2️⃣ Fallback from sessionStorage
        if (!platformId) {
          platformId = sessionStorage.getItem("oauth_platform");
        }

        // 3️⃣ Instagram fallback (it does NOT return state)
        if (!platformId && (code.startsWith("AQ") || code.length > 80)) {
          platformId = "instagram";
          if (!state) {
            sessionStorage.setItem(
              "oauth_state",
              "instagram:" + crypto.randomUUID()
            );
          }
        }

        // 4️⃣ Safety fallback
        if (!platformId) {
          toast({
            description: "Unable to detect platform",
            variant: "destructive",
          });
          return;
        }

        const platformConfig = platforms.find((p) => p.id === platformId);

        const rawState =
          state ||
          sessionStorage.getItem("oauth_state") ||
          `${platformId}:${crypto.randomUUID()}`;

        // --------------------------
        // 🔥 CALL CORRECT BACKEND API
        // --------------------------
        let response;
        if (platformConfig?.category === "streaming") {
          // Twitch, Kick
          response = await api.callbackStreamingPlatform(
            platformId,
            code,
            rawState
          );
        } else {
          // Instagram, YouTube, TikTok, Facebook
          response = await api.callbackPlatform(platformId, code, rawState);
        }

        // --------------------------
        // 🔥 SUCCESS
        // --------------------------
        sessionStorage.removeItem("oauth_state");

        toast({
          // title: `${platformId.toUpperCase()} Connected!`,
          description: response?.message || "Your account is now linked.",
          // description: "Streamer connected successfully",
        });

        await fetchUserDetails();
      } catch (err: any) {
        toast({
          // title: "Connection failed",
          description: getErrorMessage(err, "Authentication failed."),
          variant: "destructive",
        });
      } finally {
        window.history.replaceState({}, "", "/dashboard/accounts");
      }
    })();
  }, []);

  const connectedStreamingCount = platforms
    .filter((p) => p.category === "streaming")
    .reduce((count, platform) => {
      if (connectedAccounts?.[platform.id]?.connected) {
        return count + 1;
      }
      return count;
    }, 0);

  // ------------------ LOADING STATES ------------------
  if (authLoading || isLoadingAccounts) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <>
      <main className="max-w-4xl mx-auto px-4 md:px-8 py-8">
        <Link href="/dashboard">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 mb-4 text-muted-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>

        <h1 className="font-display text-3xl font-semibold mb-2">
          Connected Accounts
        </h1>
        <p className="text-muted-foreground mb-6">
          Link your streaming and social media accounts.
        </p>

        {/* Streaming */}
        <section className="mb-10">
          <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary" />
            Streaming Platforms
          </h2>

          <div className="space-y-3">
            {platforms
              .filter((p) => p.category === "streaming")
              .map((platform) => (
                <PlatformCard
                  key={platform.id}
                  platform={platform}
                  connectedAccount={connectedAccounts?.[platform.id]}
                  onConnect={() => handleConnect(platform.id)}
                  onDisconnect={() => handleDisconnect(platform.id)}
                  isConnecting={connectingPlatform === platform.id}
                  isDisconnecting={disconnectingPlatform === platform.id}
                  isInitialLoading={isLoadingAccounts}
                  setSelectedPlatform={setSelectedPlatform}
                  setConfirmModalOpen={setConfirmModalOpen}
                  user={user}
                  isStreamingPlatform
                  connectedStreamingCount={connectedStreamingCount}
                />
              ))}
          </div>
        </section>

        {/* Social */}
        <section>
          <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary" />
            Social Media Platforms
          </h2>

          <div className="space-y-3">
            {platforms
              .filter((p) => p.category === "social")
              .map((platform) => (
                <PlatformCard
                  key={platform.id}
                  platform={platform}
                  connectedAccount={connectedAccounts?.[platform.id]}
                  onConnect={() => handleConnect(platform.id)}
                  onDisconnect={() => handleDisconnect(platform.id)}
                  isConnecting={connectingPlatform === platform.id}
                  isDisconnecting={disconnectingPlatform === platform.id}
                  isInitialLoading={isLoadingAccounts}
                  setSelectedPlatform={setSelectedPlatform}
                  setConfirmModalOpen={setConfirmModalOpen}
                  user={user}
                />
              ))}
          </div>
        </section>
      </main>
      {/* Disconnect Confirmation Modal */}
      {confirmModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
          <div className="bg-[#111] border border-white/10 rounded-xl p-6 w-full max-w-sm shadow-xl">
            <h2 className="text-xl font-semibold mb-2">
              Disconnect {selectedPlatform}?
            </h2>

            <p className="text-muted-foreground mb-6 text-sm">
              Are you sure you want to unlink this account? You can reconnect
              anytime.
            </p>

            <div className="flex justify-end gap-3">
              <Button
                variant="ghost"
                onClick={() => setConfirmModalOpen(false)}
              >
                Cancel
              </Button>

              <Button
                variant="destructive"
                onClick={() => {
                  if (selectedPlatform) handleDisconnect(selectedPlatform);
                  setConfirmModalOpen(false);
                }}
                disabled={disconnectingPlatform === selectedPlatform}
                className="gap-2"
              >
                {disconnectingPlatform === selectedPlatform ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Disconnect"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
