import { useEffect } from "react";
import { SiTiktok, SiInstagram, SiYoutube } from "react-icons/si";
import { Sparkles, Share2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process: () => void;
      };
    };
  }
}

export default function ClipPreviewMockup() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//www.instagram.com/embed.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.instgrm) {
        window.instgrm.Embeds.process();
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <Card className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/95 via-slate-950 to-black p-4 sm:p-6 shadow-2xl">
      <div className="absolute top-3 left-4 flex gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
      </div>

      <div className="mt-6 flex flex-col lg:flex-row gap-6">
        <div className="relative flex-shrink-0">
          <div className="relative w-[200px] sm:w-[240px] mx-auto lg:mx-0">
            <div className="rounded-2xl overflow-hidden shadow-xl border border-white/10">
              <blockquote 
                className="instagram-media" 
                data-instgrm-captioned 
                data-instgrm-permalink="https://www.instagram.com/reel/DPefClCAYRf/?utm_source=ig_embed&utm_campaign=loading" 
                data-instgrm-version="14"
                style={{
                  background: "#000",
                  border: 0,
                  borderRadius: "16px",
                  margin: 0,
                  maxWidth: "540px",
                  minWidth: "200px",
                  padding: 0,
                  width: "100%"
                }}
              >
                <div style={{ padding: "16px" }}>
                  <a 
                    href="https://www.instagram.com/reel/DPefClCAYRf/?utm_source=ig_embed&utm_campaign=loading" 
                    style={{ 
                      background: "#000", 
                      lineHeight: 0, 
                      padding: 0, 
                      textAlign: "center", 
                      textDecoration: "none", 
                      width: "100%" 
                    }} 
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                      <div style={{ backgroundColor: "#333", borderRadius: "50%", flexGrow: 0, height: "40px", marginRight: "14px", width: "40px" }}></div>
                      <div style={{ display: "flex", flexDirection: "column", flexGrow: 1, justifyContent: "center" }}>
                        <div style={{ backgroundColor: "#333", borderRadius: "4px", flexGrow: 0, height: "14px", marginBottom: "6px", width: "100px" }}></div>
                        <div style={{ backgroundColor: "#333", borderRadius: "4px", flexGrow: 0, height: "14px", width: "60px" }}></div>
                      </div>
                    </div>
                    <div style={{ padding: "19% 0" }}></div>
                    <div style={{ display: "block", height: "50px", margin: "0 auto 12px", width: "50px" }}>
                      <SiInstagram className="h-12 w-12 text-white/50" />
                    </div>
                    <div style={{ paddingTop: "8px" }}>
                      <div style={{ color: "#999", fontSize: "13px", lineHeight: "17px", textAlign: "center" }}>
                        Loading Instagram Reel...
                      </div>
                    </div>
                  </a>
                </div>
              </blockquote>
            </div>

            <div className="absolute -top-2 -right-2 h-9 w-9 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-lg border-2 border-black animate-bounce" style={{ animationDuration: '2s' }}>
              <SiTiktok className="h-4 w-4 text-white" />
            </div>
            <div className="absolute top-8 -right-4 h-9 w-9 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center shadow-lg border-2 border-black">
              <SiInstagram className="h-4 w-4 text-white" />
            </div>
            <div className="absolute -left-3 top-1/4 h-9 w-9 rounded-full bg-red-600 flex items-center justify-center shadow-lg border-2 border-black">
              <SiYoutube className="h-4 w-4 text-white" />
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-4 min-w-0">
          <div>
            <label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5 block">Title</label>
            <div className="relative">
              <div className="rounded-lg bg-slate-800/80 border border-white/10 px-3 py-2.5 text-sm text-foreground">
                AI-generated viral clip title
              </div>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-md bg-primary/20 px-1.5 py-0.5 text-[10px] text-primary">
                  <Sparkles className="h-2.5 w-2.5" />
                  AI
                </span>
                <span className="text-[10px] text-muted-foreground">0/100</span>
                <Copy className="h-3 w-3 text-muted-foreground/60 cursor-pointer hover:text-muted-foreground" />
              </div>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5 block">Description</label>
            <div className="relative">
              <div className="rounded-lg bg-slate-800/80 border border-white/10 px-3 py-2.5 text-sm text-foreground/80 min-h-[72px]">
                <span className="text-muted-foreground/90 text-xs leading-relaxed">
                  Check out this insane play! #gaming #streamer #viral #clips #twitch
                </span>
              </div>
              <div className="absolute right-2 bottom-2 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-md bg-primary/20 px-1.5 py-0.5 text-[10px] text-primary">
                  <Sparkles className="h-2.5 w-2.5" />
                  AI
                </span>
                <span className="text-[10px] text-muted-foreground">0/500</span>
              </div>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5 block">Hashtags</label>
            <div className="flex flex-wrap gap-1.5">
              <span className="rounded-full bg-primary/15 border border-primary/30 px-2.5 py-1 text-[11px] text-primary">#gaming</span>
              <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 text-[11px] text-emerald-400">#streamer</span>
              <span className="rounded-full bg-white/5 border border-white/10 px-2.5 py-1 text-[11px] text-muted-foreground">#viral</span>
              <span className="rounded-full bg-white/5 border border-white/10 px-2.5 py-1 text-[11px] text-muted-foreground">+ Add</span>
            </div>
          </div>

          <Button className="w-full rounded-full bg-primary hover:bg-primary/90 text-white font-semibold mt-2" data-testid="button-share-mockup">
            <Share2 className="h-4 w-4 mr-2" />
            Publish to all platforms
          </Button>
        </div>
      </div>
    </Card>
  );
}
