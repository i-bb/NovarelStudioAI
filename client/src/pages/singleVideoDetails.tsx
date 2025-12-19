import React, { useEffect, useState } from "react";
import {
  Clock,
  TrendingUp,
  Sparkles,
  FileText,
  ArrowLeft,
  Check,
  Loader2,
  Edit,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useParams } from "wouter";
import { toast } from "@/hooks/use-toast";
import api from "@/lib/api/api";
import { useAuth } from "@/hooks/useAuth";
import { platforms } from "@/lib/common";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function SingleVideoDetails() {
  const params = useParams();
  const exportId = params?.id;
  const reelId = params?.reelId;

  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [reelData, setReelData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [publishingPlatform, setPublishingPlatform] = useState<string | null>(
    null
  );
  const [isCaptionModalOpen, setIsCaptionModalOpen] = useState(false);
  const [captionSaving, setCaptionSaving] = useState(false);
  const [rawCaption, setRawCaption] = useState("");
  const [editedCaption, setEditedCaption] = useState("");

  const fetchReelsData = async () => {
    setIsLoading(true);
    try {
      const response = await api.getSingleReelData(reelId || "");
      setReelData(response);
      setIsLoading(false);
    } catch (error) {
      console.error("Content Studio API failed:", error);
      toast({
        title: "Loading offline data",
        description: "Couldn't connect to server",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchReelsData();
  }, [reelId]);

  const handlePublish = async (platform: string) => {
    try {
      if (!reelData?.public_id) {
        toast({
          title: "Video missing",
          description: "No public_id found for this reel.",
          variant: "destructive",
        });
        return;
      }

      setPublishingPlatform(platform); // Start loading

      const response = await api.uploadReels(platform, reelData.public_id);

      toast({
        description: `Reel published on ${platform}!`,
      });

      fetchReelsData();
    } catch (error: any) {
      console.error("Upload failed:", error);

      toast({
        title: "Publish Failed",
        description: error?.response?.data?.description || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setPublishingPlatform(null); // Stop loading
    }
  };

  const handleSaveCaption = async () => {
    try {
      setCaptionSaving(true);

      const captionForApi = formatCaptionForAPI(editedCaption);

      const response = await api.updateReelCaption(
        reelData.public_id,
        captionForApi
      );

      toast({ description: response?.message });

      // Update UI but keep raw format
      setReelData((prev: any) => ({
        ...prev,
        caption: captionForApi,
      }));

      setIsCaptionModalOpen(false);
    } catch (error) {
      console.log("error", error);

      toast({
        title: "Update failed",
        variant: "destructive",
      });
    } finally {
      setCaptionSaving(false);
    }
  };

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

  const formatCaptionForUI = (caption: string) => {
    if (!caption) return "";

    return caption
      .trim()
      .replace(/^"+|"+$/g, "") // remove wrapping quotes
      .replace(/\\n/g, "\n"); // convert escaped newlines
  };

  const formatCaptionForAPI = (caption: string) =>
    `"${caption.replace(/\n/g, "\\n")}"`;

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }
  if (!isAuthenticated) return null;

  return (
    <main>
      <div className="grid lg:grid-cols-[1.5fr_1fr] gap-8 lg:h-[calc(100vh-71px)] lg:overflow-hidden">
        <div className="relative">
          <div
            className="hidden lg:flex absolute gap-4 top-4 left-2 hover:cursor-pointer hover:text-primary"
            onClick={() =>
              (window.location.href = `/dashboard/content/${exportId}`)
            }
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back to Reels</span>
          </div>
          {/* Mobile Back Button */}
          <div
            className="lg:hidden flex gap-2 items-center my-4 px-2 hover:cursor-pointer text-white"
            onClick={() =>
              (window.location.href = `/dashboard/content/${exportId}`)
            }
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back to Reels</span>
          </div>
          <div className="mx-auto rounded-lg overflow-hidden bg-black max-h-[calc(100vh-80px)] aspect-[9/16]">
            <video
              src={reelData.video_url}
              controls
              poster={reelData.poster_url}
              className="w-full h-full object-cover"
            />
          </div>

          {(reelData.viralMoment || reelData.transcription) && (
            <div className="absolute bottom-0 left-0 right-0 pb-6 px-4 pt-12 bg-gradient-to-t from-black/90 to-transparent">
              {reelData.viralMoment && (
                <p className="text-white font-semibold text-base mb-2">
                  {reelData.viralMoment}
                </p>
              )}
              {reelData.transcription && (
                <p className="text-white/80 text-sm line-clamp-3">
                  {reelData.transcription}
                </p>
              )}
            </div>
          )}

          {reelData.durationSeconds && (
            <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded bg-black/70 px-2 py-1 text-xs text-white">
              <Clock className="h-3 w-3" />
              {Math.floor(reelData.durationSeconds / 60)}:
              {String(reelData.durationSeconds % 60).padStart(2, "0")}
            </div>
          )}
        </div>

        <div className="space-y-6 p-6 lg:overflow-y-auto lg:pr-2">
          <h1 className="text-2xl font-bold text-white mt-[26px]">
            {reelData.title}
          </h1>

          <Card className="border-white/10 bg-black/60">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="h-4 w-4 text-primary" />
                Viral Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-3 mb-3">
                <span className={`text-5xl font-bold`}>
                  {reelData.viral_score || 0}
                </span>
                <span className="text-muted-foreground mb-1">/ 10</span>
              </div>
              <Progress
                value={(reelData.viral_score || 0) * 10}
                className="h-2"
              />
            </CardContent>
          </Card>
          {reelData.caption && (
            <Card className="border-white/10 bg-black/60 mt-2">
              <CardContent className="flex items-center justify-between gap-2 p-2">
                <div className="text-[11px] text-white/70 overflow-hidden">
                  <Markdown remarkPlugins={[remarkGfm]}>
                    {formatCaptionForUI(reelData.caption)}
                  </Markdown>
                </div>

                <button
                  type="button"
                  className="text-white/70 hover:text-white transition"
                  onClick={(e) => {
                    e.stopPropagation();

                    const raw = reelData.caption || "";

                    setRawCaption(raw);
                    setEditedCaption(formatCaptionForUI(raw));
                    setIsCaptionModalOpen(true);
                  }}
                >
                  <Edit className="h-3 w-3" />
                </button>
              </CardContent>
            </Card>
          )}

          <Card className="border-white/10 bg-black/60">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Sparkles className="h-4 w-4 text-amber-400" />
                Why This Will Go Viral
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {reelData.viral_reason || "Analysis pending..."}
              </p>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-black/60">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-4 w-4 text-blue-400" />
                Transcript
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-56 overflow-y-auto pr-2">
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {reelData.transcript || "Transcription pending..."}
                </p>
              </div>
            </CardContent>
          </Card>

          {platforms.map(
            ({
              id,
              name,
              postedKey,
              integrated,
              icon: Icon,
              color,
              showToUpload,
            }) => {
              const posted = postedKey && reelData[postedKey];

              return (
                <>
                  {showToUpload && (
                    <div
                      key={name}
                      className={`flex items-center justify-between p-3 rounded-lg bg-white/5 ${
                        posted ? "" : "opacity-60"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`h-7 w-7 ${color}`} />
                        <div>
                          <p className="font-medium text-white text-sm">
                            {name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {!integrated
                              ? "Coming Soon"
                              : posted
                              ? "Published"
                              : "Ready to Publish"}
                          </p>
                        </div>
                      </div>

                      {/* Not integrated → Coming Soon */}
                      {!integrated && (
                        <span className="text-xs px-4 py-2 rounded-md font-medium bg-white/10 text-white/50">
                          Coming Soon
                        </span>
                      )}

                      {/* Integrated but NOT posted → Show Publish button */}
                      {integrated && !posted && (
                        <Button
                          className="text-sm px-6 py-2 rounded-md font-medium bg-primary text-[white]"
                          onClick={() => handlePublish(id)}
                        >
                          {publishingPlatform === id ? (
                            <div className="flex gap-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span>Loading...</span>
                            </div>
                          ) : (
                            "Publish"
                          )}
                        </Button>
                      )}

                      {/* Integrated AND posted → Show Done badge */}
                      {integrated && posted && (
                        <div className="flex items-center justify-center">
                          <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </>
              );
            }
          )}
        </div>
      </div>

      <Dialog open={isCaptionModalOpen} onOpenChange={setIsCaptionModalOpen}>
        <DialogContent className="max-w-lg bg-black border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Caption</DialogTitle>
          </DialogHeader>

          <Textarea
            value={editedCaption}
            onChange={(e) => setEditedCaption(e.target.value)}
            rows={6}
            className="bg-black text-white border-white/20 resize-none"
            placeholder="Write your caption here..."
          />

          <DialogFooter className="flex gap-2">
            <button
              className="px-4 py-2 text-sm rounded-md bg-white/10 text-white hover:bg-white/20"
              onClick={() => setIsCaptionModalOpen(false)}
            >
              Cancel
            </button>

            <button
              className="px-4 py-2 text-sm rounded-md bg-primary text-white hover:bg-primary/80"
              onClick={handleSaveCaption}
              disabled={captionSaving}
            >
              {captionSaving ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </div>
              ) : (
                "Save"
              )}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
