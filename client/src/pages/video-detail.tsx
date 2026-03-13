import { useEffect, useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useParams, useSearch, useLocation } from "wouter";
import { Play, Clock, ArrowLeft, Sparkles } from "lucide-react";
import type { Clip } from "@shared/schema";
import { api } from "@/lib/api/api";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { useAuth } from "@/hooks/AuthContext";
import ClipCard from "@/components/ClipCard";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { getSocket } from "@/lib/socket";

export default function VideoDetail() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const params = useParams();
  const streamingId = params.streamingId;
  const clipspage = params.clipspage;

  const [, setLocation] = useLocation();

  const search = useSearch();
  const searchParams = new URLSearchParams(search);
  const tab = searchParams.get("tab");
  const streampage = searchParams.get("streampage");

  const dashboardContentURL = `/dashboard/content?tab=${tab}&streampage=${streampage}`;

  const [isLoading, setIsLoading] = useState(true);
  const [clipsData, setClipsData] = useState<Clip[]>([]);
  const [streamingVideoData, setStreamingVideoData] = useState<any>();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [windowSize, setWindowSize] = useState(5);

  const ITEMS_PER_PAGE = 12;
  const currentPageRef = useRef(currentPage);

  useEffect(() => {
    if (!streamingVideoData?.streaming_session_id) return;

    // If URL id doesn't match the streaming_session_id → redirect
    if (streamingVideoData.streaming_session_id !== streamingId) {
      window.location.href = "/dashboard";
    }
  }, [streamingId, streamingVideoData]);

  const fetchReelsData = async (id: string) => {
    try {
      const response = await api.getReelsData(
        String(currentPage),
        String(ITEMS_PER_PAGE),
        id,
      );

      setClipsData(response?.reels);
      setStreamingVideoData(response?.streaming_session);
      setTotalCount(response?.total_count || 0);
      setTotalPages(response?.total_pages || 0);

      setIsLoading(false);
    } catch (error: any) {
      console.error("Content Studio API failed:", error);
      setIsLoading(false);
      toast({
        description: getErrorMessage(
          error,
          "Something went wrong!. Please try again.",
        ),
        variant: "destructive",
      });
    }
  };

  const addNewVideoFromSocket = (newVideo: any) => {
    if (!newVideo?.public_id) return;

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
        setClipsData((prev: any[]) => {
          if (!Array.isArray(prev)) return [newVideo];

          if (prev.some((v) => v.public_id === newVideo.public_id)) {
            return prev;
          }

          const updated = [newVideo, ...prev];

          // keep page size intact
          return updated.slice(0, ITEMS_PER_PAGE);
        });
      }

      toast({
        title: "New clip added 🎬",
      });
    }, 300);
  };

  useEffect(() => {
    if (streamingId) {
      fetchReelsData(streamingId);
    }
  }, [streamingId]);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (!totalPages) return;

    // ✅ Parse page safely
    const parsedPage = Number(streampage);

    const safePage =
      parsedPage > 0 && parsedPage <= totalPages ? parsedPage : 1;

    // 🔹 Update state only if changed
    setCurrentPage((prev) => (prev !== safePage ? safePage : prev));

    // 🔥 If URL page was invalid → fix URL
    if (String(safePage) !== streampage) {
      setLocation(
        `/dashboard/content/${streamingId}?tab=${tab}&streampage=${streampage}&clipspage=${safePage}`,
        { replace: true },
      );
    }
  }, [clipspage, streampage, isAuthenticated, totalPages]);

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
      console.log("[socket] reel_added_to_session:", payload);
      if (payload?.streaming_session_id !== streamingId) return;
      if (!payload?.reel?.public_id) return;

      addNewVideoFromSocket(payload?.reel);
    };

    const handleStreamingSessionUpdated = (payload: any) => {
      console.log("[socket] streaming_session_updated:", payload);

      if (!payload?.streaming_session_id) return;

      // ✅ Match against streamingId
      if (payload.streaming_session_id !== streamingId) return;

      // ✅ Update only what changed (thumbnail etc.)
      setStreamingVideoData((prev: any) => {
        if (!prev) return prev;

        return {
          ...prev,
          thumbnail_url: payload.thumbnail_url ?? prev.thumbnail_url,
          total_clips: payload.total_clips ?? prev.total_clips,
          total_posted_clips:
            payload.total_posted_clips ?? prev.total_posted_clips,
        };
      });
    };

    socket?.on("connect", handleConnect);
    socket?.on("disconnect", handleDisconnect);
    socket?.on("connect_error", handleConnectError);
    socket?.on("reel_added_to_session", handleNewStreamDetails);
    socket?.on("streaming_session_updated", handleStreamingSessionUpdated);
    return () => {
      socket?.off("connect", handleConnect);
      socket?.off("disconnect", handleDisconnect);
      socket?.off("connect_error", handleConnectError);
      socket?.off("reel_added_to_session", handleNewStreamDetails);
      socket?.off("streaming_session_updated", handleStreamingSessionUpdated);
    };
  }, []);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");

    const handleResize = () => {
      setWindowSize(mediaQuery.matches ? 2 : 5);
    };

    handleResize(); // initial check
    mediaQuery.addEventListener("change", handleResize);

    return () => {
      mediaQuery.removeEventListener("change", handleResize);
    };
  }, []);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }
  if (!isAuthenticated) return null;

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      <div className="flex flex-col">
        <div className="flex items-center gap-1 sm:gap-4 mb-2">
          <Link href={dashboardContentURL}>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator />

              <BreadcrumbItem>
                <BreadcrumbLink>
                  <Link href={dashboardContentURL}>Streams</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Clips</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div>
          {streamingVideoData?.title && (
            <h1 className="font-display text-3xl sm:text-4xl font-semibold mb-4 break-all">
              {streamingVideoData?.title || ""}
            </h1>
          )}
          {streamingVideoData?.processed_on && (
            <p className="text-muted-foreground mb-8 max-w-2xl">
              Exported on {formatDate(streamingVideoData?.processed_on)}
            </p>
          )}
        </div>
      </div>

      {/* <Card className="border-white/10 bg-black/40 mb-8">
        <CardContent className="p-6 flex gap-6">
          <div className="h-[120px] w-32 rounded-lg bg-gradient-to-br from-primary/20 to-emerald-500/20 flex items-center justify-center">
            {streamingVideoData?.thumbnail_url ? (
              <img
                src={streamingVideoData?.thumbnail_url}
                alt="Thumbnail"
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div>
                <Play className="h-12 w-12 text-white/50" />
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Title</p>
              <h2 className="text-xl font-semibold text-foreground break-words">
                {streamingVideoData?.title}
              </h2>

              <p className="text-sm text-muted-foreground mt-2">
                Streamer ·
                <span className="text-foreground/90 ml-1">
                  {streamingVideoData?.streamer_username}
                </span>
              </p>
            </div>

            <div className="flex gap-6 mt-6">
              <div
                className="px-4 py-3 rounded-lg 
          bg-primary/10 border border-primary/20"
              >
                <p className="text-xs text-muted-foreground">Total Clips</p>
                <p className="text-lg font-semibold text-primary">
                  {streamingVideoData?.total_clips || 0}
                </p>
              </div>

              <div
                className="px-4 py-3 rounded-lg 
          bg-primary/10 border border-primary/20"
              >
                <p className="text-xs text-muted-foreground">Posted</p>
                <p className="text-lg font-semibold text-primary">
                  {streamingVideoData?.total_posted_clips || 0} /{" "}
                  {streamingVideoData?.total_clips || 0}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card> */}

      <Card className="border-white/10 bg-black/40 mb-8">
        <CardContent className="p-6 flex flex-wrap items-center justify-between gap-6">
          {/* Thumbnail */}
          <div className="flex gap-6">
            <div className="h-[110px] w-28 shrink-0 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20">
              {streamingVideoData?.thumbnail_url ? (
                <img
                  src={streamingVideoData?.thumbnail_url}
                  alt="Thumbnail"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <Play className="h-10 w-10 text-primary/50" />
              )}
            </div>

            {/* Title Section */}
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">Title</p>
              <h2 className="text-lg font-semibold text-foreground truncate whitespace-pre-line">
                {streamingVideoData?.title}
              </h2>

              <p className="text-sm text-muted-foreground mt-2">
                Streamer ·{" "}
                <span className="text-foreground/90">
                  {streamingVideoData?.streamer_username}
                </span>
              </p>
            </div>
          </div>

          {/* Stats (Right Aligned) */}
          <div className="flex items-center gap-8 shrink-0">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Total Clips</p>
              <p className="text-xl font-semibold text-primary">
                {streamingVideoData?.total_clips || 0}
              </p>
            </div>

            <div className="text-center">
              <p className="text-xs text-muted-foreground">Posted</p>
              <p className="text-xl font-semibold text-primary">
                {streamingVideoData?.total_posted_clips || 0}
                <span className="text-muted-foreground text-sm">
                  {" "}
                  / {streamingVideoData?.total_clips || 0}
                </span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <section>
        <>
          {clipsData.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {clipsData.map((c) => {
                return (
                  <ClipCard
                    key={c.id}
                    clip={c}
                    streamingId={streamingId || ""}
                    fetchReelsData={fetchReelsData}
                    platform={streamingVideoData?.provider}
                    currentPage={currentPage}
                  />
                );
              })}
            </div>
          ) : (
            <Card className="border-white/10 bg-black/40 p-12 text-center">
              <Sparkles className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
              <h3 className="font-display text-2xl font-semibold mb-3">
                No clips yet
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                We're analyzing this video for viral moments. Clips will appear
                here once processing is complete.
              </p>
            </Card>
          )}

          {totalPages > 1 && (
            <Pagination className="mt-8">
              <PaginationContent className="gap-4">
                {/* Previous */}
                <PaginationItem>
                  <button
                    disabled={currentPage === 1}
                    onClick={() => {
                      if (currentPage === 1) return;

                      setCurrentPage((p: any) => {
                        const next = Math.max(p - 1, 1);
                        setLocation(
                          `/dashboard/content/${streamingId}?tab=${tab}&streampage=${streampage}&clipspage=${next}`,
                        );
                        return next;
                      });
                    }}
                    className={cn(
                      "text-sm transition-colors",
                      currentPage === 1
                        ? "text-white/40 cursor-not-allowed"
                        : "text-white hover:text-primary",
                    )}
                  >
                    Previous
                  </button>
                </PaginationItem>

                {/* Page Numbers */}

                {(() => {
                  const pages = [];

                  // 🔥 Always show all if totalPages is small (4 or less)
                  if (totalPages <= 4) {
                    for (let page = 1; page <= totalPages; page++) {
                      const isActive = currentPage === page;

                      pages.push(
                        <PaginationItem key={page}>
                          <button
                            onClick={() => {
                              setCurrentPage(page);
                              setLocation(
                                `/dashboard/content/${streamingId}?tab=${tab}&streampage=${streampage}&clipspage=${page}`,
                              );
                            }}
                            className={cn(
                              "h-9 w-9 text-sm rounded-lg transition-all",
                              isActive
                                ? "bg-primary text-white"
                                : "text-white hover:bg-white/10",
                            )}
                          >
                            {page}
                          </button>
                        </PaginationItem>,
                      );
                    }

                    return pages;
                  }

                  // 🔥 Normal sliding window logic
                  const half = Math.floor(windowSize / 2);

                  let start = Math.max(1, currentPage - half);
                  let end = start + windowSize - 1;

                  if (end > totalPages) {
                    end = totalPages;
                    start = Math.max(1, end - windowSize + 1);
                  }

                  // First page
                  if (start > 1) {
                    pages.push(
                      <PaginationItem key={1}>
                        <button
                          onClick={() => {
                            setCurrentPage(1);
                            setLocation(
                              `/dashboard/content/${streamingId}?tab=${tab}&streampage=${streampage}&clipspage=1`,
                            );
                          }}
                          className="h-9 w-9 text-sm rounded-lg text-white hover:bg-white/10"
                        >
                          1
                        </button>
                      </PaginationItem>,
                    );

                    if (start > 2) {
                      pages.push(
                        <PaginationItem key="start-ellipsis">
                          <span className="px-2 text-white/60">...</span>
                        </PaginationItem>,
                      );
                    }
                  }

                  // Main window
                  for (let page = start; page <= end; page++) {
                    const isActive = currentPage === page;

                    pages.push(
                      <PaginationItem key={page}>
                        <button
                          onClick={() => {
                            setCurrentPage(page);
                            setLocation(
                              `/dashboard/content/${streamingId}?tab=${tab}&streampage=${streampage}&clipspage=${page}`,
                            );
                          }}
                          className={cn(
                            "h-9 w-9 text-sm rounded-lg transition-all",
                            isActive
                              ? "bg-primary text-white"
                              : "text-white hover:bg-white/10",
                          )}
                        >
                          {page}
                        </button>
                      </PaginationItem>,
                    );
                  }

                  // Last page
                  if (end < totalPages) {
                    if (end < totalPages - 1) {
                      pages.push(
                        <PaginationItem key="end-ellipsis">
                          <span className="px-2 text-white/60">...</span>
                        </PaginationItem>,
                      );
                    }

                    pages.push(
                      <PaginationItem key={totalPages}>
                        <button
                          onClick={() => {
                            setCurrentPage(totalPages);
                            setLocation(
                              `/dashboard/content/${streamingId}?tab=${tab}&streampage=${streampage}&clipspage=${totalPages}`,
                            );
                          }}
                          className="h-9 w-9 text-sm rounded-lg text-white hover:bg-white/10"
                        >
                          {totalPages}
                        </button>
                      </PaginationItem>,
                    );
                  }

                  return pages;
                })()}

                {/* Next */}
                <PaginationItem>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => {
                      if (currentPage === totalPages) return;

                      setCurrentPage((p: any) => {
                        const next = Math.min(p + 1, totalPages);
                        setLocation(
                          `/dashboard/content/${streamingId}?tab=${tab}&streampage=${streampage}&clipspage=${next}`,
                        );
                        return next;
                      });
                    }}
                    className={cn(
                      "text-sm transition-colors",
                      currentPage === totalPages
                        ? "text-white/40 cursor-not-allowed"
                        : "text-white hover:text-primary",
                    )}
                  >
                    Next
                  </button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      </section>
    </main>
  );
}
