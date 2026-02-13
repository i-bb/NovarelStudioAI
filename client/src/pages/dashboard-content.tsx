import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useSearch, useLocation } from "wouter";
import { ArrowLeft, Zap, AlertTriangle } from "lucide-react";
import api from "@/lib/api/api";
import kick from "@assets/generated_images/kick.svg";
import twitch from "@assets/generated_images/twitch.png";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { getSocket } from "@/lib/socket";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Progress } from "@/components/ui/progress";
import StreamingVideos from "@/components/streaming-videos";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function DashboardContent() {
  const { toast } = useToast();
  const {
    isAuthenticated,
    isLoading: authLoading,
    user,
    isTopPlan,
    totalStorageGB,
    usedStorageGB,
    isStorageWarningLimit,
    totalStorageUsagePercentage,
  } = useAuth();

  const search = useSearch();
  const searchParams = new URLSearchParams(search);
  const tab = searchParams.get("tab");
  const streampage = searchParams.get("streampage");

  const [, setLocation] = useLocation();

  const [streamingVideos, setStreamingVideos] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<"kick" | "twitch">("twitch");
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const ITEMS_PER_PAGE = 12;
  const currentPageRef = useRef(currentPage);
  const activeTabRef = useRef(activeTab);

  const fetchStreamingVideosData = async (page = 1) => {
    try {
      setIsLoading(true);
      const response = await api.getStreamingVideos(
        String(page),
        String(ITEMS_PER_PAGE),
        activeTab,
      );

      setStreamingVideos(response?.sessions || []);
      setTotalCount(response?.total_count || 0);
      setTotalPages(response?.total_pages || 0);
      setIsLoading(false);
    } catch (error: any) {
      console.error("Content Studio API failed:", error);
      setIsLoading(false);
      toast({
        description: getErrorMessage(error, "Something went wrong!"),
        variant: "destructive",
      });
    }
  };

  const addNewVideoFromSocket = (newVideo: any) => {
    if (!newVideo?.streaming_session_id) return;

    // provider filter
    if (newVideo.provider !== activeTabRef.current) return;

    setTimeout(() => {
      // 1️⃣ Update total count correctly
      setTotalCount((prevCount) => {
        const updatedCount = prevCount + 1;

        // 2️⃣ Update total pages based on new count
        setTotalPages(Math.ceil(updatedCount / ITEMS_PER_PAGE));

        return updatedCount;
      });

      // 3️⃣ Only update UI list if user is on page 1
      if (currentPageRef.current === 1) {
        setStreamingVideos((prev: any[]) => {
          if (!Array.isArray(prev)) return [newVideo];

          // avoid duplicates
          if (
            prev.some(
              (v) => v.streaming_session_id === newVideo.streaming_session_id,
            )
          ) {
            return prev;
          }

          const updated = [newVideo, ...prev];

          // keep page size intact
          return updated.slice(0, ITEMS_PER_PAGE);
        });
      }

      toast({
        title: "New streaming video added 🎬",
      });
    }, 300);
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    if (!totalPages) return; // wait until API loads

    // ✅ Validate tab
    const urlTab = tab === "kick" || tab === "twitch" ? tab : "twitch";

    // ✅ Parse page safely
    const parsedPage = Number(streampage);

    const safePage =
      parsedPage > 0 && parsedPage <= totalPages ? parsedPage : 1;

    // 🔹 Update state only if changed
    setActiveTab((prev) => (prev !== urlTab ? (urlTab as any) : prev));

    setCurrentPage((prev) => (prev !== safePage ? safePage : prev));

    // 🔥 If URL page was invalid → fix URL
    if (String(safePage) !== streampage) {
      setLocation(
        `/dashboard/content?tab=${urlTab}&streampage=${safePage}`,
        { replace: true }, // prevents history stacking
      );
    }
  }, [tab, streampage, isAuthenticated, totalPages]);

  useEffect(() => {
    currentPageRef.current = currentPage;
  }, [currentPage]);

  useEffect(() => {
    activeTabRef.current = activeTab;
  }, [activeTab]);

  useEffect(() => {
    const socket = getSocket();
    const handleConnect = () => {
      console.log("[socket] connected:", socket?.id);
    };
    const handleDisconnect = (reason: string) => {
      console.warn("[socket] disconnected:", reason);
    };
    const handleConnectError = (err: Error) => {
      console.error("[socket] connection error:", err.message);
    };

    const handleNewStreamDetails = (payload: any) => {
      console.log("[socket] streaming_session_started:", payload);
      if (!payload?.streaming_session_id) return;

      addNewVideoFromSocket(payload);
    };

    const handleStreamingSessionUpdated = (payload: any) => {
      console.log("[socket] streaming_session_updated:", payload);

      if (!payload?.streaming_session_id) return;

      // Only update if provider matches active tab
      if (payload.provider !== activeTabRef.current) return;

      setStreamingVideos((prev: any[]) => {
        if (!prev || !Array.isArray(prev)) return prev;

        return prev.map((video) =>
          video.streaming_session_id === payload.streaming_session_id
            ? { ...video, ...payload } // merge updated fields
            : video,
        );
      });
    };

    socket?.on("connect", handleConnect);
    socket?.on("disconnect", handleDisconnect);
    socket?.on("connect_error", handleConnectError);
    socket?.on("streaming_session_started", handleNewStreamDetails);
    socket?.on("streaming_session_updated", handleStreamingSessionUpdated);
    return () => {
      socket?.off("connect", handleConnect);
      socket?.off("disconnect", handleDisconnect);
      socket?.off("connect_error", handleConnectError);
      socket?.off("streaming_session_started", handleNewStreamDetails);
      socket?.off("streaming_session_updated", handleStreamingSessionUpdated);
    };
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchStreamingVideosData(currentPage);
  }, [currentPage, activeTab, isAuthenticated]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [currentPage]);

  const isPlanExpired = (() => {
    // const endDate = "2026-02-15T07:32:47.961082+00:00";
    const endDate = user?.active_plan?.end_date;
    if (!endDate) return false;
    return new Date(endDate).getTime() < Date.now();
  })();

  const onHandleDelete = async () => {
    if (!deleteTarget) return;

    try {
      // 🔥 call your delete API here
      const response = await api.deleteStreamingVideos(
        deleteTarget.streaming_session_id,
      );
      fetchStreamingVideosData(currentPage);
      toast({
        description: response?.message,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: getErrorMessage(error, "Failed to delete streaming video"),
      });
    } finally {
      setIsDeleteOpen(false);
      setDeleteTarget(null);
    }
  };

  if (!isAuthenticated) return null;

  if (user?.active_plan === null) {
    return (
      <main className="min-h-[70vh] flex items-center justify-center px-4 ">
        <Card className="p-10 text-center border-none">
          <h2 className="text-2xl font-bold mb-3">No Content Available</h2>
          <p className="text-muted-foreground">
            You do not have an active subscription plan.
          </p>
          <p className="text-muted-foreground mb-6">
            To unlock content features, please purchase a plan.
          </p>
          <Link href="/subscription">
            <Button className="bg-primary hover:bg-primary-700 text-white">
              Purchase Plan
            </Button>
          </Link>
        </Card>
      </main>
    );
  }
  const isClipLimitReached =
    user?.active_plan?.meta_data_json?.clips_limit_reached;

  if (isPlanExpired) {
    return (
      <main className="min-h-[70vh] flex items-center justify-center px-4 ">
        <Card className="p-10 text-center border-none">
          <h2 className="text-2xl font-bold mb-3">No Content Available</h2>
          {isClipLimitReached ? (
            <>
              <p className="text-muted-foreground">
                You do not have an active subscription plan.
              </p>
              <p className="text-muted-foreground mb-6">
                To unlock content features, please purchase a plan.
              </p>
            </>
          ) : (
            <>
              <p className="text-muted-foreground">
                You still have unused credits on your account.
              </p>
              <p className="text-muted-foreground mb-6">
                Renew or upgrade your plan to use your remaining credits and
                access content features.
              </p>
            </>
          )}
          <Link href="/subscription">
            <Button className="bg-primary hover:bg-primary-700 text-white">
              Purchase Plan
            </Button>
          </Link>
        </Card>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      <div className="flex flex-col">
        <div className="flex gap-1 sm:gap-4 mb-2 items-center">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/dashboard" className="text-md">
                    Dashboard
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator />

              <BreadcrumbItem>
                <BreadcrumbPage className="text-md">Streams</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold mb-4">
          Content Studio
        </h1>
        <p className="text-muted-foreground mb-8 max-w-2xl">
          Your stream exports appear here. Click on any streamin video to see
          the videos and the viral clips generated from it, along with
          transcriptions and virality insights.
        </p>
      </div>

      {isStorageWarningLimit && (
        <Card className="border border-white/10 bg-black/40 mb-8">
          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col w-full">
                <div className="flex justify-between">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <AlertTriangle className="h-5 w-5 text-amber-400" />
                    <p className="text-xl">Storage is low</p>
                  </div>
                  {isTopPlan ? (
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
                        Upgrade
                      </Button>
                    </Link>
                  )}
                </div>

                <p className="text-xs text-muted-foreground">
                  {isTopPlan
                    ? "Please free up space to add more videos"
                    : " Free up space or upgrade plan"}
                </p>

                {/* Progress */}
                <div className="mt-3">
                  <Progress
                    value={totalStorageUsagePercentage}
                    className="h-2"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    {`${usedStorageGB}GB of ${totalStorageGB} GB used`}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center flex-wrap gap-4 justify-between mb-6">
        <div className="flex gap-2">
          {[
            { key: "twitch", label: "Twitch", logo: twitch },
            { key: "kick", label: "Kick", logo: kick },
          ].map((tab) => (
            <div
              key={tab.key}
              onClick={() => {
                const newTab = tab.key;
                setActiveTab(newTab as any);
                setCurrentPage(1);
                setLocation(`/dashboard/content?tab=${newTab}&streampage=1`, {
                  replace: true,
                });
              }}
              className={`${
                activeTab === tab.key
                  ? "bg-primary border-primary"
                  : "bg-black/10 border-white/40 hover:bg-primary hover:border-primary"
              } px-3 py-0 rounded-md h-[32px] text-xs cursor-default flex items-center gap-2 border text-white transition-colors duration-300 transform !translate-y-0 hover:!translate-y-0 active:!translate-y-0`}
            >
              {tab.logo && (
                <img
                  src={tab.logo}
                  alt={tab.label}
                  className="h-4 w-4 object-contain"
                />
              )}
              {tab.label}
            </div>
          ))}
        </div>
      </div>

      <StreamingVideos
        isLoading={isLoading || authLoading}
        videoData={streamingVideos}
        totalPages={totalPages}
        activeTab={activeTab}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        setIsDeleteOpen={setIsDeleteOpen}
        setDeleteTarget={setDeleteTarget}
      />

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-[420px] rounded-xl p-6">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this streaming video?</AlertDialogTitle>
            <AlertDialogDescription>
              The streaming video with all the generated videos and clips will
              be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setDeleteTarget(null);
              }}
            >
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={onHandleDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
