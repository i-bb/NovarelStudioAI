import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Play, Film, Trash } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

const StreamingVideos = ({
  isLoading,
  videoData,
  totalPages,
  activeTab,
  currentPage,
  setCurrentPage,
  setIsDeleteOpen,
  setDeleteTarget,
}: any) => {
  return (
    <>
      {isLoading ? (
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
          <div
            className={`grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${totalPages > 1 ? "" : "mb-8"}`}
          >
            {videoData.map((data: any) => {
              const isLive = !data.end_time;
              return (
                <div
                  key={data.streaming_session_id}
                  className="transition-all cursor-pointer"
                >
                  <Link
                    href={`/dashboard/content/${data.streaming_session_id}`}
                    onClick={() => {
                      localStorage.setItem(
                        "selected_streaming_video",
                        JSON.stringify(data),
                      );
                      localStorage.setItem("content_active_tab", activeTab);
                      localStorage.setItem(
                        "content_active_page",
                        String(currentPage),
                      );
                      sessionStorage.setItem("content_returning", "true");
                    }}
                  >
                    <Card className="group overflow-hidden border-white/10 bg-black/40 hover:border-primary/50 flex flex-col h-full">
                      {/* Thumbnail */}
                      <div className="relative h-[220px] w-full overflow-hidden bg-black">
                        {data.thumbnail_url ? (
                          <img
                            src={data.thumbnail_url}
                            alt={data.title || "Video Thumbnail"}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Play className="h-12 w-12 text-white/50" />
                          </div>
                        )}
                        {/* 🔴 LIVE Badge */}
                        {isLive && (
                          <div className="absolute top-3 left-3 bg-red-600 text-white text-xs px-2 py-1 rounded-md font-semibold animate-pulse">
                            LIVE
                          </div>
                        )}
                      </div>
                      {/* Content */}
                      <CardContent className="p-4 space-y-3">
                        <div className="flex justify-between">
                          <span className="inline-block text-[10px] bg-white/10 px-2 py-1 rounded-full border border-white/20">
                            {data?.provider}
                          </span>
                          <div
                            className={cn(
                              "px-3 py-1 rounded border transition",
                              isLive
                                ? "bg-gray-500/10 border-gray-500 text-gray-500 cursor-not-allowed"
                                : "bg-red/10 border-red text-red-500 hover:text-red-400 cursor-pointer",
                            )}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();

                              if (isLive) return; // 🚫 Prevent delete if live

                              setDeleteTarget(data);
                              setIsDeleteOpen(true);
                            }}
                          >
                            <Trash className="h-4 w-4" />
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-sm font-medium">Streamer</p>
                          <p className="font-medium truncate">
                            {data.streamer_username}
                          </p>
                        </div>

                        <div className="flex justify-between items-center">
                          <p className="text-sm">Started On</p>
                          <p className="text-sm text-muted-foreground">
                            {data.start_time
                              ? new Date(data.start_time).toLocaleString(
                                  "en-US",
                                  {
                                    month: "numeric",
                                    day: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                  },
                                )
                              : "Not Available"}
                          </p>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-sm">Ended On</p>
                          <p className="text-sm text-muted-foreground">
                            {data.end_time
                              ? new Date(data.end_time).toLocaleString(
                                  "en-US",
                                  {
                                    month: "numeric",
                                    day: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                  },
                                )
                              : "Not Available"}
                          </p>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-sm">Total Videos</p>
                          <div className="px-2 py-1 rounded-md bg-white/10 border border-white/20">
                            <p className="text-sm text-muted-foreground">
                              {data.total_videos}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
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
                      if (currentPage === 1) return;

                      setCurrentPage((p: any) => {
                        const next = Math.max(p - 1, 1);
                        localStorage.setItem(
                          "content_active_page",
                          String(next),
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
                {Array.from({ length: totalPages }, (_, index) => {
                  const page = index + 1;
                  const isActive = currentPage === page;

                  return (
                    <PaginationItem key={page}>
                      <button
                        onClick={() => {
                          setCurrentPage(page);
                          localStorage.setItem(
                            "content_active_page",
                            String(page),
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
                })}

                {/* Next */}
                <PaginationItem>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => {
                      if (currentPage === totalPages) return;

                      setCurrentPage((p: any) => {
                        const next = Math.min(p + 1, totalPages);
                        localStorage.setItem(
                          "content_active_page",
                          String(next),
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
    </>
  );
};

export default StreamingVideos;
