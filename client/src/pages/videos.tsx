import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useParams, useSearch, useLocation } from "wouter";
import { Play, Clock, ArrowLeft, Film, Trash } from "lucide-react";
import api from "@/lib/api/api";
import { getStatusLabel } from "@/lib/common";
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
import { cn, formatDate, generateStreamName } from "@/lib/utils";
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

export default function Videos() {
  const params = useParams();
  const streamingId = params.streamingId;

  const [, setLocation] = useLocation();

  const search = useSearch();
  const searchParams = new URLSearchParams(search);
  const tab = searchParams.get("tab");
  const streampage = searchParams.get("streampage");
  const videopage = searchParams.get("videopage");
  const dashboardContentURL = `/dashboard/content?tab=${tab}&streampage=${streampage}`;

  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  const [sourceStreamData, setSourceStreamData] = useState<any | null>(null);
  const [videoData, setVideoData] = useState<any | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [exportsLoading, setExportsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [windowSize, setWindowSize] = useState(5);

  const ITEMS_PER_PAGE = 12;
  const currentPageRef = useRef(currentPage);

  const fetchVideosData = async (page = 1, id: string) => {
    try {
      setExportsLoading(true);
      const response = await api.getVideos(
        id,
        String(page),
        String(ITEMS_PER_PAGE),
      );

      const filteredVideos =
        response?.videos?.filter(
          (video: any) =>
            video.status !== "failed" && video.status !== "skipped",
        ) || [];

      setVideoData(filteredVideos || []);
      setTotalCount(response?.total_count || 0);
      setTotalPages(response?.total_pages || 0);
      setExportsLoading(false);
    } catch (error: any) {
      console.error("Content Studio API failed:", error);
      setExportsLoading(false);
      toast({
        description: getErrorMessage(error, "Something went wrong!"),
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (!totalPages) return;

    const parsedPage = Number(videopage);

    const safePage =
      parsedPage > 0 && parsedPage <= totalPages ? parsedPage : 1;

    if (safePage !== currentPage) {
      setCurrentPage(safePage);
      setLocation(`/dashboard/content?tab=${tab}&videopage=${safePage}`);
    }
  }, [videopage, totalPages]);

  const updateVideoStatusBySocket = (videoId: string, status: string) => {
    setVideoData((prev: any[]) => {
      if (!prev || !Array.isArray(prev)) return prev;

      // ❌ Remove video for skipped / failed
      if (status === "skipped" || status === "failed") {
        const next = prev.filter((video) => video.public_id !== videoId);

        // optional debug
        if (next.length !== prev.length) {
          console.log(`[socket] video removed (${status}):`, videoId);
        }
        return next;
      }

      // ✅ Otherwise update status
      let updated = false;

      const next = prev.map((video) => {
        if (video.public_id === videoId) {
          updated = true;
          if (video.status === status) return video;
          return {
            ...video,
            status,
          };
        }
        return video;
      });

      if (!updated) {
        console.warn("[socket] status update for unknown video:", videoId);
      }

      return next;
    });
  };

  const addNewVideoFromSocket = (newVideo: any) => {
    if (!newVideo?.public_id) return;

    setTimeout(() => {
      // 1️⃣ update total count correctly
      setTotalCount((prevCount) => {
        const updatedCount = prevCount + 1;

        // 2️⃣ update total pages
        setTotalPages(Math.ceil(updatedCount / ITEMS_PER_PAGE));

        return updatedCount;
      });

      // 3️⃣ only update UI if user is on page 1
      if (currentPageRef.current === 1) {
        setVideoData((prev: any[]) => {
          if (!Array.isArray(prev)) return [newVideo];

          // avoid duplicates
          if (prev.some((v) => v.public_id === newVideo.public_id)) {
            return prev;
          }

          const updated = [newVideo, ...prev];

          return updated.slice(0, ITEMS_PER_PAGE);
        });
      }

      toast({
        title: "New video added 🎬",
      });
    }, 300);
  };

  useEffect(() => {
    currentPageRef.current = currentPage;
  }, [currentPage]);

  //socket listeners
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
    const handleVideoStatus = (payload: any) => {
      console.log("[socket] video_status:", payload);
      const { video_id, status } = payload;
      if (!video_id || !status) return;

      updateVideoStatusBySocket(video_id, status);
    };
    const handleNewVideoDetails = (payload: any) => {
      console.log("[socket] video_details:", payload);
      if (!payload?.public_id) return;

      addNewVideoFromSocket(payload);
    };

    // const handleStreamingSessionUpdated = (payload: any) => {
    //   console.log("[socket] streaming_session_updated:", payload);

    //   if (!payload?.streaming_session_id) return;

    //   // ✅ Only update if it matches current streaming page
    //   if (payload.streaming_session_id !== streamingId) return;

    //   // ✅ Update UI state
    //   setSourceStreamData((prev: any) => {
    //     const updated = { ...prev, ...payload };

    //     // ✅ Also persist in localStorage
    //     localStorage.setItem(
    //       "selected_streaming_video",
    //       JSON.stringify(updated),
    //     );

    //     return updated;
    //   });
    // };

    socket?.on("connect", handleConnect);
    socket?.on("disconnect", handleDisconnect);
    socket?.on("connect_error", handleConnectError);
    socket?.on("video_status", handleVideoStatus);
    socket?.on("video_details", handleNewVideoDetails);
    // socket?.on("streaming_session_updated", handleStreamingSessionUpdated);
    return () => {
      socket?.off("connect", handleConnect);
      socket?.off("disconnect", handleDisconnect);
      socket?.off("connect_error", handleConnectError);
      socket?.off("video_status", handleVideoStatus);
      socket?.off("video_details", handleNewVideoDetails);
      // socket?.off("streaming_session_updated", handleStreamingSessionUpdated);
    };
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (streamingId) {
      const selectedExport = JSON.parse(
        localStorage.getItem("selected_streaming_video") || "{}",
      );

      setSourceStreamData(selectedExport);
      fetchVideosData(currentPage, streamingId);
    }
  }, [currentPage, isAuthenticated, streamingId]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [currentPage]);

  const onHandleDelete = async () => {
    if (!deleteTarget) return;

    try {
      // 🔥 call your delete API here
      const response = await api.deleteVideos(deleteTarget.public_id);
      // 🔥 Update total count safely
      const updatedTotalCount = totalCount - 1;
      if (updatedTotalCount <= 0) {
        localStorage.removeItem("selected_streaming_video");
        setLocation(dashboardContentURL);
        toast({
          description: getErrorMessage(
            response?.message || "Video deleted successfully.",
          ),
        });
        return;
      }

      // Otherwise refetch normally
      streamingId && fetchVideosData(currentPage, streamingId);
      toast({
        description: getErrorMessage(
          response?.message || "Video deleted successfully.",
        ),
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: getErrorMessage(error, "Failed to delete video"),
      });
    } finally {
      setIsDeleteOpen(false);
      setDeleteTarget(null);
    }
  };

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

  const title = generateStreamName(sourceStreamData || {});

  if (!isAuthenticated) return null;

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      <div className="flex flex-col">
        <div className="flex items-center gap-1 sm:gap-4 mb-2">
          <Link
            href={dashboardContentURL}
            onClick={() => localStorage.removeItem("selected_streaming_video")}
          >
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>

          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    href="/dashboard"
                    onClick={() =>
                      localStorage.removeItem("selected_streaming_video")
                    }
                    className="text-md"
                  >
                    Dashboard
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator />

              <BreadcrumbItem>
                <BreadcrumbLink>
                  <Link
                    href={dashboardContentURL}
                    onClick={() =>
                      localStorage.removeItem("selected_streaming_video")
                    }
                    className="text-md"
                  >
                    Streams
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator />

              <BreadcrumbItem>
                <BreadcrumbPage className="text-md">Videos</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {title !== "" && (
          <h1 className="font-display text-3xl sm:text-4xl font-semibold mb-4 break-all">
            {title}
          </h1>
        )}
        {sourceStreamData?.created_on && (
          <p className="text-muted-foreground mb-8 max-w-2xl">
            Created on {formatDate(sourceStreamData?.created_on)}
          </p>
        )}
      </div>

      <Card className="border-white/10 bg-black/40 mb-8">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="h-[120px] w-32 rounded-lg bg-gradient-to-br from-primary/20 to-emerald-500/20 flex items-center justify-center">
            {/* <Play className="h-8 w-8 text-white/50" /> */}
            {sourceStreamData?.thumbnail_url ? (
              <img
                src={sourceStreamData?.thumbnail_url}
                alt="Thumbnail"
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div>
                <Play className="h-12 w-12 text-white/50" />
              </div>
            )}
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Source Stream</p>
            <p className="font-medium">{title}</p>
          </div>
        </CardContent>
      </Card>

      <h2 className="font-display text-xl font-semibold mb-6">
        Generated Videos ({totalCount || 0})
      </h2>
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
      ) : videoData && videoData.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {videoData.map((exp: any) => {
              const duration = Math.round(exp.duration);
              const minutes = Math.floor(duration / 60);
              const seconds = String(duration % 60).padStart(2, "0");
              const {
                text,
                icon: Icon,
                class: statusClass,
                message,
              } = getStatusLabel(exp.status);
              const isAccessible = exp.status === "completed";
              return (
                <div
                  key={exp.public_id}
                  className={`transition-all ${
                    isAccessible
                      ? "cursor-pointer"
                      : "opacity-60 cursor-not-allowed"
                  }`}
                >
                  {isAccessible ? (
                    <Link
                      href={`/dashboard/content/${sourceStreamData?.streaming_session_id}/video/${exp.public_id}?tab=${tab}&streampage=${streampage}&videopage=${currentPage}`}
                      onClick={() => {
                        localStorage.setItem(
                          "selected_export",
                          JSON.stringify(exp),
                        );
                      }}
                    >
                      <Card className="group overflow-hidden border-white/10 bg-black/40 hover:border-primary/50 flex flex-col h-full">
                        {/* Thumbnail */}
                        <div className="relative h-[220px] w-full overflow-hidden bg-black">
                          {exp.poster_url ? (
                            <img
                              src={exp.poster_url}
                              alt={exp.title || "Video Thumbnail"}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Play className="h-12 w-12 text-white/50" />
                            </div>
                          )}
                          {/* Duration */}
                          <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded bg-black/70 px-2 py-1 text-xs text-white">
                            <Clock className="h-3 w-3" /> {minutes}:{seconds}
                          </div>
                        </div>
                        {/* Content */}
                        <CardContent className="p-4 space-y-3">
                          <div className="flex justify-between">
                            <span className="inline-block text-[10px] bg-white/10 px-2 py-1 rounded-full border border-white/20">
                              {exp?.provider}
                            </span>
                            <div
                              className="bg-red/10 px-3 py-1 rounded border border-red text-red-500 cursor-pointer hover:text-red-400 transition"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setDeleteTarget(exp);
                                setIsDeleteOpen(true);
                              }}
                            >
                              <Trash className="h-4 w-4" />
                            </div>
                          </div>
                          <p className="font-medium truncate">{exp.title}</p>
                          <div className="flex justify-between items-center">
                            <p className="text-sm">Status</p>
                            <span
                              className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${statusClass}`}
                            >
                              <Icon className="h-3 w-3" /> {text}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="text-sm">Processed On</p>
                            <p className="text-sm text-muted-foreground">
                              {exp.processed_on
                                ? new Date(exp.processed_on).toLocaleString(
                                    "en-US",
                                    {
                                      month: "short",
                                      day: "2-digit",
                                      year: "numeric",
                                    },
                                  )
                                : "Not Available"}
                            </p>
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="text-sm">Posted</p>
                            <div className="px-2 py-1 rounded-md bg-white/10 border border-white/20">
                              <p className="text-sm text-muted-foreground">
                                {`${exp.posted_reels}/${exp.total_reels}`}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ) : (
                    <Card className="overflow-hidden border-white/10 bg-black/40">
                      <div className="relative h-[220px] w-full overflow-hidden bg-black">
                        {exp.poster_url ? (
                          <img
                            src={exp.poster_url}
                            alt={exp.title || "Video Thumbnail"}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Play className="h-12 w-12 text-white/50" />
                          </div>
                        )}
                        <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded bg-black/70 px-2 py-1 text-xs text-white">
                          <Clock className="h-3 w-3" /> {minutes}:{seconds}
                        </div>
                        {/* 🚫 ACCESS OVERLAY */}
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-2 text-white"></div>
                      </div>
                      <CardContent className="p-4 space-y-3">
                        <span className="inline-block text-[10px] bg-white/10 px-2 py-1 rounded-full border border-white/20">
                          {exp?.provider}
                        </span>
                        <p className="font-medium truncate">{exp.title}</p>
                        <div className="flex justify-between items-center">
                          <p className="text-sm">Status</p>
                          <span
                            className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${statusClass}`}
                          >
                            <Icon className="h-3 w-3" /> {text}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-sm">Processed On</p>
                          <p className="text-sm text-muted-foreground">
                            {exp.processed_on
                              ? new Date(exp.processed_on).toLocaleString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "2-digit",
                                    year: "numeric",
                                  },
                                )
                              : "Not Available"}
                          </p>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-sm">Posted</p>
                          <div className="px-2 py-1 rounded-md bg-white/10 border border-white/20">
                            <p className="text-sm text-muted-foreground">
                              {`${exp.posted_reels}/${exp.total_reels}`}
                            </p>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground text-center">
                          {message}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <Pagination className="mt-8">
              <PaginationContent className="gap-4">
                {/* Previous */}
                <PaginationItem>
                  <button
                    disabled={currentPage === 1}
                    onClick={() => {
                      setCurrentPage((p) => {
                        const next = Math.max(p - 1, 1);
                        setLocation(
                          `/dashboard/content/${streamingId}?tab=${tab}&streampage=${streampage}&videopage=${next}`,
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
                {/* {Array.from({ length: totalPages }, (_, index) => {
                  const page = index + 1;
                  const isActive = currentPage === page;

                  return (
                    <PaginationItem key={page}>
                      <button
                        onClick={() => {
                          setCurrentPage(page);
                          setLocation(
                            `/dashboard/content/${streamingId}?tab=${tab}&streampage=${streampage}&videopage=${page}`,
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
                    </PaginationItem>
                  );
                })} */}

                {/* {(() => {
                  const pages = [];
                  const windowSize = 5;

                  // Center current page
                  let start = Math.max(
                    1,
                    currentPage - Math.floor(windowSize / 2),
                  );
                  let end = start + windowSize - 1;

                  if (end > totalPages) {
                    end = totalPages;
                    start = Math.max(1, end - windowSize + 1);
                  }

                  // Show first page if missing
                  if (start > 1) {
                    pages.push(
                      <PaginationItem key={1}>
                        <button
                          onClick={() => {
                            setCurrentPage(1);
                            setLocation(
                              `/dashboard/content/${streamingId}?tab=${tab}&streampage=${streampage}&videopage=1`,
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

                  // Main 5 pages
                  for (let page = start; page <= end; page++) {
                    const isActive = currentPage === page;

                    pages.push(
                      <PaginationItem key={page}>
                        <button
                          onClick={() => {
                            setCurrentPage(page);
                            setLocation(
                              `/dashboard/content/${streamingId}?tab=${tab}&streampage=${streampage}&videopage=${page}`,
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

                  // Show last page if missing
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
                              `/dashboard/content/${streamingId}?tab=${tab}&streampage=${streampage}&videopage=${totalPages}`,
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
                })()} */}

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
                                `/dashboard/content/${streamingId}?tab=${tab}&streampage=${streampage}&videopage=${page}`,
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
                              `/dashboard/content/${streamingId}?tab=${tab}&streampage=${streampage}&videopage=1`,
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
                              `/dashboard/content/${streamingId}?tab=${tab}&streampage=${streampage}&videopage=${page}`,
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
                              `/dashboard/content/${streamingId}?tab=${tab}&streampage=${streampage}&videopage=${totalPages}`,
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
                    onClick={() =>
                      setCurrentPage((p) => {
                        const next = Math.min(p + 1, totalPages);
                        setLocation(
                          `/dashboard/content/${streamingId}?tab=${tab}&streampage=${streampage}&videopage=${next}`,
                        );
                        return next;
                      })
                    }
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
      ) : (
        <Card className="border-white/10 bg-black/40 p-12 text-center">
          <Film className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
          <h3 className="font-display text-2xl font-semibold mb-3">
            No content yet
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Your stream exports will appear here once you connect your streaming
            account and start streaming. We'll automatically detect and export
            your best moments.
          </p>
        </Card>
      )}

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-[420px] rounded-xl p-6">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this video?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The video and its generated clips
              will be permanently removed.
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
