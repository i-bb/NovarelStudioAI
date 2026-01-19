import { PlatformConfig } from "@/lib/common";
import { PlatformAccount } from "@/pages/connected-accounts";
import React from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Check, Link2, Loader2, Unlink } from "lucide-react";
import { Button } from "./ui/button";
import { User } from "@/lib/api/api";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

const PlatformCard = ({
  platform,
  connectedAccount,
  onConnect,
  onDisconnect,
  isConnecting,
  isDisconnecting,
  isInitialLoading,
  setSelectedPlatform,
  setConfirmModalOpen,
  user,
  isStreamingPlatform = false,
  connectedStreamingCount,
}: {
  platform: PlatformConfig;
  connectedAccount?: PlatformAccount;
  onConnect: () => void;
  onDisconnect: () => void;
  isConnecting: boolean;
  isDisconnecting: boolean;
  isInitialLoading: boolean;
  setSelectedPlatform: any;
  setConfirmModalOpen: any;
  user: User | null;
  isStreamingPlatform?: boolean;
  connectedStreamingCount?: number;
}) => {
  const Icon = platform.icon;
  const isConnected = connectedAccount?.connected;

  const maxStreamingConnections =
    Number(user?.active_plan?.meta_data_json?.connected_platforms) || 0;

  const safeStreamingCount = connectedStreamingCount ?? 0;

  const isStreamingLimitReached =
    isStreamingPlatform &&
    !isConnected &&
    maxStreamingConnections > 0 &&
    safeStreamingCount >= maxStreamingConnections;

  const actionableDescription = platform.description
    ? platform.description
    : `Connect your ${platform.name} account to enable analytics, syncing, and platform-specific features.`;

  return (
    <Card className="bg-black/40 border-white/10 overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl overflow-hidden flex items-center justify-center bg-white/5">
              {isConnected && connectedAccount?.avatar_url ? (
                <img
                  src={connectedAccount.avatar_url}
                  alt="profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div
                  className={`h-full w-full rounded-xl ${platform.bgColor} flex items-center justify-center`}
                >
                  <Icon className={`h-6 w-6 ${platform.color}`} />
                </div>
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-display text-base font-medium text-foreground">
                  {platform.name}
                </h3>

                {!platform.available && (
                  <Badge variant="outline" className="text-xs border-white/20">
                    Coming Soon
                  </Badge>
                )}
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                {actionableDescription}
              </p>

              {isConnected && connectedAccount?.display_name && (
                <p className="text-primary">@{connectedAccount.display_name}</p>
              )}

              {/* {hasReachedStreamingLimit && (
                <p className="text-xs text-red-400 mt-1">
                  Streaming platform limit reached for your plan
                </p>
              )} */}
            </div>
          </div>

          {/* RIGHT BUTTONS */}
          <div className="flex items-center gap-2">
            {isInitialLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            ) : isConnected ? (
              <>
                <Badge className="bg-green-500/20 text-sm text-green-400 border-green-500/30 gap-1 px-4 py-2">
                  <Check className="h-4 w-4" />
                  Connected
                </Badge>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-red-400"
                  onClick={() => {
                    setSelectedPlatform(platform.id);
                    setConfirmModalOpen(true);
                  }}
                  disabled={isDisconnecting}
                >
                  {isDisconnecting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Unlink className="h-4 w-4" />
                  )}
                </Button>
              </>
            ) : (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="inline-block">
                      <Button
                        onClick={onConnect}
                        disabled={
                          !platform.available ||
                          isConnecting ||
                          isStreamingLimitReached
                        }
                        className="gap-2"
                      >
                        {isConnecting ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Link2 className="h-4 w-4" />
                        )}
                        Connect
                      </Button>
                    </div>
                  </TooltipTrigger>

                  {isStreamingLimitReached && (
                    <TooltipContent side="top">
                      <p className="text-xs">
                        You have reached the maximum number of streaming
                        platforms for your plan
                      </p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlatformCard;
