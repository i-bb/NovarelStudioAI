import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "wouter";
import {
  Play,
  Clock,
  ArrowLeft,
  TrendingUp,
  Sparkles,
  Instagram,
  Youtube,
  Music2,
  Edit,
} from "lucide-react";
import type { Clip } from "@shared/schema";
import { api } from "@/lib/api/api";

function ClipCard({ clip, exportId }: { clip: any; exportId: string }) {
  const durationSeconds = clip.duration ?? clip.durationSeconds;
  const duration =
    typeof durationSeconds === "number"
      ? `${Math.floor(durationSeconds / 60)}:${String(
          Math.floor(durationSeconds % 60)
        ).padStart(2, "0")}`
      : null;

  const viralScore = clip.viral_score ?? clip.viralityScore;

  const platforms = [];

  if (clip.instagram_posted) {
    platforms.push({
      name: "Instagram",
      icon: Instagram,
      bg: "bg-gradient-to-br from-purple-500 to-pink-500",
    });
  }

  if (clip.youtube_posted) {
    platforms.push({
      name: "YouTube",
      icon: Youtube,
      bg: "bg-red-600",
    });
  }

  if (clip.tiktok_posted) {
    platforms.push({
      name: "TikTok",
      icon: Music2,
      bg: "bg-black",
    });
  }

  return (
    <Link href={`/dashboard/content/${exportId}/reel/${clip.public_id}`}>
      <div className="rounded-xl overflow-hidden border border-white/10 bg-black/40 cursor-pointer group hover:bg-black/60 transition">
        <div className="relative aspect-[9/16]">
          <img
            src={clip.poster_url}
            alt={clip.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />

          {/* Duration */}
          {duration && (
            <div className="absolute top-2 left-2 bg-black/80 text-white text-xs px-2 py-1 rounded flex items-center gap-1 font-medium">
              <Clock className="h-3 w-3" />
              {duration}
            </div>
          )}

          {/* Viral Score */}
          {viralScore !== undefined && (
            <div className="absolute top-2 right-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold text-xs px-2 py-1 rounded flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {viralScore.toFixed(1)}
            </div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300">
            <div className="absolute inset-0 flex top-[40%] justify-center pointer-events-none">
              <Play className="h-16 w-16 text-white drop-shadow-xl" />
            </div>

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/85 to-transparent px-4 pt-10 pb-6 flex flex-col text-left gap-2">
              <p className="font-semibold text-white text-sm leading-tight">
                {clip.title}
              </p>
              {/* Posted on */}
              {(clip.instagram_posted ||
                clip.youtube_posted ||
                clip.tiktok_posted) && (
                <>
                  <p className="text-xs text-white/80 font-medium">
                    Posted on:
                  </p>

                  {/* Platform icons with correct backgrounds */}
                  <div className="flex space-x-2">
                    {platforms.map((p, idx) => {
                      const Icon = p.icon;
                      return (
                        <div
                          key={idx}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${p.bg}`}
                        >
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
              {/* Viral reason */}
              {clip.viral_reason && (
                <p className="text-[11px] text-white/90 leading-relaxed line-clamp-2">
                  {clip.viral_reason}
                </p>
              )}

              {/* Transcript */}
              {clip.transcript && (
                <div className="bg-black/70 border border-white/10 rounded-md px-3 py-2">
                  <p className="text-[11px] text-white/90 italic line-clamp-2">
                    {clip.transcript}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function VideoDetail() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const params = useParams();
  const exportId = params.id;

  const [isLoading, setIsLoading] = useState(true);
  const [clipsData, setClipsData] = useState<Clip[]>([]);
  const [sourceVideoData, setSourceVideoData] = useState<any>();

  const fetchReelsData = async (id: string) => {
    try {
      const response = await api.getReelsData(id || "");
      setClipsData(response?.reels);
      setIsLoading(false);
    } catch (error: any) {
      console.error("Content Studio API failed:", error);
      toast({
        description:
          error?.response?.data?.description || "Something went wrong!",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (exportId) {
      fetchReelsData(exportId);
      const selectedExport = JSON.parse(
        localStorage.getItem("selected_export") || "{}"
      );
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
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/dashboard/content"
          onClick={() => localStorage.removeItem("selected_export")}
        >
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold">
            {sourceVideoData?.title || ""}
          </h1>
          <p className="text-sm text-muted-foreground">
            Exported on {formatDate(sourceVideoData?.processed_on)}
          </p>
        </div>
      </div>

      <Card className="border-white/10 bg-black/40 mb-8">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="h-20 w-32 rounded-lg bg-gradient-to-br from-primary/20 to-emerald-500/20 flex items-center justify-center">
            <Play className="h-8 w-8 text-white/50" />
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
            {clipsData.map((c) => (
              <ClipCard key={c.id} clip={c} exportId={exportId || ""} />
            ))}
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
