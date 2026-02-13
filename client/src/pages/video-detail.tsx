import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useParams, useSearch } from "wouter";
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

export default function VideoDetail() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const params = useParams();
  const exportId = params.id;
  const streamingId = params.streamingId;

  const search = useSearch();
  const searchParams = new URLSearchParams(search);
  const tab = searchParams.get("tab");
  const streampage = searchParams.get("streampage");
  const videopage = searchParams.get("videopage");

  const videoPageURL = `/dashboard/content/${streamingId}?tab=${tab}&streampage=${streampage}&videopage=${videopage}`;
  const dashboardContentURL = `/dashboard/content?tab=${tab}&streampage=${streampage}`;

  const [isLoading, setIsLoading] = useState(true);
  const [clipsData, setClipsData] = useState<Clip[]>([]);
  const [sourceVideoData, setSourceVideoData] = useState<any>();

  useEffect(() => {
    if (!exportId || !sourceVideoData?.public_id) return;

    // If URL id doesn't match the stored export public_id → redirect
    if (sourceVideoData.public_id !== exportId) {
      localStorage.removeItem("selected_export");
      window.location.href = "/dashboard";
    }
  }, [exportId, sourceVideoData]);

  const fetchReelsData = async (id: string, platform: string) => {
    try {
      const response = await api.getReelsData(platform, id || "");
      setClipsData(response?.reels);
      setIsLoading(false);
    } catch (error: any) {
      console.error("Content Studio API failed:", error);

      toast({
        description: getErrorMessage(
          error,
          "Something went wrong!. Please try again.",
        ),
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (exportId) {
      const selectedExport = JSON.parse(
        localStorage.getItem("selected_export") || "{}",
      );
      fetchReelsData(exportId, selectedExport?.provider);
      setSourceVideoData(selectedExport);
    }
  }, [exportId]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to access the dashboard.",
        variant: "destructive",
      });

      setTimeout(() => {
        window.location.href = "/login";
      }, 500);
    }
  }, [isAuthenticated, authLoading, toast]);

  const duration = Math.round(sourceVideoData?.duration); // Convert float → integer seconds
  const minutes = Math.floor(duration / 60);
  const seconds = String(duration % 60).padStart(2, "0");

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
          <Link
            href={videoPageURL}
            onClick={() => localStorage.removeItem("selected_export")}
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
                    onClick={() => {
                      localStorage.removeItem("selected_export");
                      localStorage.removeItem("selected_streaming_video");
                    }}
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
                    onClick={() => {
                      localStorage.removeItem("selected_export");
                      localStorage.removeItem("selected_streaming_video");
                    }}
                  >
                    Streams
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator />

              <BreadcrumbItem>
                <BreadcrumbLink>
                  <Link
                    href={videoPageURL}
                    onClick={() => localStorage.removeItem("selected_export")}
                  >
                    Videos
                  </Link>
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
          {sourceVideoData?.title && (
            <h1 className="font-display text-3xl sm:text-4xl font-semibold mb-4 break-all">
              {sourceVideoData?.title || ""}
            </h1>
          )}
          {sourceVideoData?.processed_on && (
            <p className="text-muted-foreground mb-8 max-w-2xl">
              Exported on {formatDate(sourceVideoData?.processed_on)}
            </p>
          )}
        </div>
      </div>

      <Card className="border-white/10 bg-black/40 mb-8">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="h-[120px] w-32 rounded-lg bg-gradient-to-br from-primary/20 to-emerald-500/20 flex items-center justify-center">
            {/* <Play className="h-8 w-8 text-white/50" /> */}
            {sourceVideoData?.poster_url ? (
              <img
                src={sourceVideoData?.poster_url}
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
            <p className="text-sm text-muted-foreground mb-1">Source Video</p>
            <p className="font-medium">{sourceVideoData?.title || ""}</p>
            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {minutes}:{seconds}
            </div>
          </div>
        </CardContent>
      </Card>

      <section>
        <h2 className="font-display text-xl font-semibold mb-6">
          Generated Clips ({clipsData.length})
        </h2>

        {clipsData.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {clipsData.map((c) => {
              return (
                <ClipCard
                  key={c.id}
                  clip={c}
                  exportId={exportId || ""}
                  streamingId={streamingId || ""}
                  fetchReelsData={fetchReelsData}
                  platform={sourceVideoData?.provider}
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
      </section>
    </main>
  );
}
