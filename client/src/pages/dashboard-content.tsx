import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Play, Clock, ArrowLeft, Film } from "lucide-react";
import api from "@/lib/api/api";
import { getStatusLabel } from "@/lib/common";
import kick from "@assets/generated_images/kick.svg";
import twitch from "@assets/generated_images/twitch.png";
import { getErrorMessage } from "@/lib/getErrorMessage";

export default function DashboardContent() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();

  const [exports, setExports] = useState<any | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [exportsLoading, setExportsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<"kick" | "twitch">("twitch");

  const ITEMS_PER_PAGE = 12;
  const totalPages = totalCount;

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        description: "You need to be logged in to access the dashboard.",
        variant: "destructive",
      });

      setTimeout(() => {
        window.location.href = "/login";
      }, 500);
    }
  }, [isAuthenticated, authLoading, toast]);

  const fetchExportData = async (page = 1) => {
    try {
      setExportsLoading(true);
      const response = await api.getContentStudios(
        String(page),
        String(ITEMS_PER_PAGE),
        activeTab
      );

      setExports(response?.videos || []);
      setTotalCount(response?.total_pages || 0);
      setExportsLoading(false);
    } catch (error: any) {
      console.error("Content Studio API failed:", error);
      toast({
        description: getErrorMessage(error, "Something went wrong!"),
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    setCurrentPage(1);
  }, [activeTab, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchExportData(currentPage);
  }, [currentPage, activeTab, isAuthenticated]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [currentPage]);

  useEffect(() => {
    const isReturning = sessionStorage.getItem("content_returning");

    if (!isReturning) {
      // Fresh entry → always default
      setActiveTab("twitch");
      setCurrentPage(1);

      localStorage.removeItem("content_active_tab");
      localStorage.removeItem("content_active_page");
      return;
    }

    // ✅ returning from video
    const savedTab = localStorage.getItem("content_active_tab") as
      | "kick"
      | "twitch"
      | null;

    const savedPage = localStorage.getItem("content_active_page");

    if (savedTab) {
      setActiveTab(savedTab);
    }

    if (savedPage && !isNaN(Number(savedPage))) {
      setCurrentPage(Number(savedPage));
    }

    // 🔥 IMPORTANT: consume the flag
    sessionStorage.removeItem("content_returning");
  }, []);

  const isPlanExpired = (() => {
    const endDate = user?.active_plan?.end_date;
    if (!endDate) return false;

    return new Date(endDate).getTime() < Date.now();
  })();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) return null;
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
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/dashboard"
          onClick={() => {
            localStorage.removeItem("content_active_tab");
            localStorage.removeItem("content_active_page");
            sessionStorage.removeItem("content_returning");
          }}
        >
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold">
          Content Studio
        </h1>
      </div>

      <p className="text-muted-foreground mb-8 max-w-2xl">
        Your stream exports appear here. Click on any video to see the viral
        clips generated from it, along with transcriptions and virality
        insights.
      </p>

      {/* Platform Tabs */}
      <div className="flex items-center flex-wrap gap-4 justify-between mb-6">
        {/* LEFT: Kick / Twitch */}
        <div className="flex gap-2">
          {[
            { key: "twitch", label: "Twitch", logo: twitch },
            { key: "kick", label: "Kick", logo: kick },
          ].map((tab) => (
            <Button
              key={tab.key}
              size="sm"
              // onClick={() => setActiveTab(tab.key as any)}
              onClick={() => {
                setActiveTab(tab.key as any);
                setCurrentPage(1);
                localStorage.setItem("content_active_tab", tab.key);
                localStorage.setItem("content_active_page", "1");
              }}
              className={` flex items-center gap-2 border ${
                activeTab === tab.key
                  ? "bg-primary border-primary"
                  : "bg-black/10 border-white/40 hover:bg-primary hover:border-primary"
              }text-white transition-colors duration-300 transform !translate-y-0 hover:!translate-y-0 active:!translate-y-0`}
            >
              {tab.logo && (
                <img
                  src={tab.logo}
                  alt={tab.label}
                  className="h-4 w-4 object-contain"
                />
              )}
              {tab.label}
            </Button>
          ))}
        </div>
      </div>

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
      ) : exports && exports.length > 0 ? (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {exports.map((exp: any) => {
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
                      href={`/dashboard/content/${exp.public_id}`}
                      onClick={() => {
                        localStorage.setItem(
                          "selected_export",
                          JSON.stringify(exp)
                        );
                        localStorage.setItem("content_active_tab", activeTab);
                        localStorage.setItem(
                          "content_active_page",
                          String(currentPage)
                        );
                        sessionStorage.setItem("content_returning", "true");
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
                                    }
                                  )
                                : "Not Available"}
                            </p>
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="text-sm">Posted</p>
                            <p className="text-sm">{`${exp.posted_reels}/${exp.total_reels}`}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ) : (
                    <Card className="overflow-hidden border-white/10 bg-black/40">
                      <div className="aspect-video relative">
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
                                  }
                                )
                              : "Not Available"}
                          </p>
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <Button
                variant="ghost"
                size="sm"
                disabled={currentPage === 1}
                // onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                onClick={() => {
                  setCurrentPage((p) => {
                    const next = Math.max(p - 1, 1);
                    localStorage.setItem("content_active_page", String(next));
                    return next;
                  });
                }}
              >
                Previous
              </Button>

              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1;
                return (
                  <Button
                    key={page}
                    size="sm"
                    variant={page === currentPage ? "default" : "ghost"}
                    className="min-w-[36px]"
                    // onClick={() => setCurrentPage(page)}
                    onClick={() => {
                      setCurrentPage(page);
                      localStorage.setItem("content_active_page", String(page));
                    }}
                  >
                    {page}
                  </Button>
                );
              })}

              <Button
                variant="ghost"
                size="sm"
                disabled={currentPage === totalPages}
                // onClick={() =>
                //   setCurrentPage((p) => Math.min(p + 1, totalPages))
                // }
                onClick={() =>
                  setCurrentPage((p) => {
                    const next = Math.min(p + 1, totalPages);
                    localStorage.setItem("content_active_page", String(next));
                    return next;
                  })
                }
              >
                Next
              </Button>
            </div>
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
    </main>
  );
}
