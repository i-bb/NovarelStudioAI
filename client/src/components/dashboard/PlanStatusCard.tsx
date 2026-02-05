import { User } from "@/lib/api/api";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { AlertTriangle, FolderCog, Zap } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { getExpiryLabel } from "@/lib/utils";
import { CircularProgressBar } from "../CircularProgressBar";

const PlanStatusCard = ({ subscription }: { subscription: User | null }) => {
  const clipCreditsTotal =
    subscription?.active_plan?.meta_data_json?.total_clips || 0;
  const clipCreditsUsed =
    subscription?.active_plan?.meta_data_json?.used_clips || 0;
  const clipCreditUsagePercentage =
    clipCreditsTotal > 0 ? (clipCreditsUsed / clipCreditsTotal) * 100 : 0;

  const dailyPostingLimit =
    subscription?.active_plan?.meta_data_json?.daily_posting_limit || 0;
  const postedReels =
    subscription?.active_plan?.meta_data_json?.daily_posted_count || 0;
  const isTopSubscriptionPlan = subscription?.active_plan?.is_top_plan || false;
  const reelPostedPercentage =
    dailyPostingLimit > 0 ? (postedReels / dailyPostingLimit) * 100 : 0;

  const isTopPlan = subscription?.active_plan?.name === "Studio";
  const totalStorage =
    subscription?.active_plan?.meta_data_json?.total_storage_mb || 0;
  const totalStorageGB = Number((totalStorage / 1024).toFixed(2));

  const usedStorage =
    subscription?.active_plan?.meta_data_json?.used_storage_mb || 0;
  const userStorageGB = Number((usedStorage / 1024).toFixed(2));
  const isStorageWarningLimit =
    subscription?.active_plan?.meta_data_json
      ?.storage_warning_threshold_reached || false;
  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4">
        <Card className="border-white/10 bg-black/40 overflow-hidden mb-8 w-full sm:w-[75%]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-400/10">
                  <Zap className="h-5 w-5 text-emerald-400" />
                </div>
                {subscription?.active_plan ? (
                  <div>
                    <h3 className="font-display text-lg font-semibold capitalize cursor-default">
                      {subscription?.active_plan?.name}
                    </h3>
                    <Badge
                      variant={
                        subscription?.active_plan?.status === "active"
                          ? "secondary"
                          : "destructive"
                      }
                      className="text-[10px] cursor-default hover:text-white"
                    >
                      {subscription?.active_plan?.status}
                    </Badge>
                  </div>
                ) : (
                  <div>
                    <h3 className="font-display text-lg font-semibold capitalize cursor-default">
                      No Active Plan
                    </h3>
                  </div>
                )}
              </div>

              <div className="flex flex-col items-end justify-center gap-2 text-right">
                {subscription?.active_plan?.end_date && (
                  <p
                    className={`text-xs mt-1 ${
                      getExpiryLabel(
                        subscription?.active_plan?.end_date
                      ).startsWith("Expired")
                        ? "text-red-400"
                        : "text-amber-400"
                    }`}
                  >
                    {getExpiryLabel(subscription?.active_plan?.end_date)}
                  </p>
                )}

                {isTopSubscriptionPlan ? (
                  <Button
                    size="sm"
                    disabled
                    className="cursor-not-allowed opacity-60"
                  >
                    <Zap className="h-4 w-4" />
                    Upgrade
                  </Button>
                ) : (
                  <Link href="/subscription">
                    <Button size="sm">
                      <Zap className="h-4 w-4" />
                      {subscription?.active_plan === null
                        ? "Purchase"
                        : "Upgrade"}
                    </Button>
                  </Link>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Clip Credits</span>
                <span className="font-medium">
                  {clipCreditsUsed} / {clipCreditsTotal} Used
                </span>
              </div>
              <Progress value={clipCreditUsagePercentage} className="h-2" />
            </div>
            <div className="space-y-2 mt-8">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Daily Posting Limit
                </span>
                <span className="font-medium">
                  {postedReels} / {dailyPostingLimit} Used
                </span>
              </div>
              <Progress value={reelPostedPercentage} className="h-2" />
            </div>
          </CardContent>
        </Card>
        <Card
          className={`overflow-hidden mb-8 w-full sm:w-[25%] transition-all bg-black/40 ${
            isStorageWarningLimit
              ? "border-amber-400/70 shadow-[0_0_18px_rgba(251,191,36,0.25)]"
              : "border-white/10 "
          }`}
        >
          <CardContent className="p-6 flex flex-col items-center justify-center h-full">
            {isStorageWarningLimit && (
              <div className="flex items-center gap-2 mb-4 text-amber-400 text-sm font-medium">
                <AlertTriangle className="h-4 w-4" />
                Storage Almost Full
              </div>
            )}
            <CircularProgressBar
              value={userStorageGB}
              total={totalStorageGB}
              label="GB"
            />
            <div className="flex gap-2">
              <Link href="/dashboard/content">
                <Button size="sm">
                  <FolderCog className="h-4 w-4" />
                  Manage Videos
                </Button>
              </Link>
              {isStorageWarningLimit &&
                (isTopPlan ? (
                  <Button
                    size="sm"
                    disabled
                    className="cursor-not-allowed opacity-60"
                  >
                    <Zap className="h-4 w-4" />
                    Upgrade
                  </Button>
                ) : (
                  <Link href="/subscription">
                    <Button size="sm">
                      <Zap className="h-4 w-4" />
                      {subscription?.active_plan === null
                        ? "Purchase"
                        : "Upgrade"}
                    </Button>
                  </Link>
                ))}
            </div>
            {isStorageWarningLimit && (
              <p className="mt-3 text-xs text-muted-foreground">
                {isTopPlan
                  ? "Please free up space to add more videos"
                  : " Free up space or upgrade plan"}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default PlanStatusCard;
