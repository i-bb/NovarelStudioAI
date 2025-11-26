import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Eye } from "lucide-react";
import dashboardImage from "@assets/generated_images/dashboard_video_grid_interface.png";
import logoImage from "@assets/ChatGPT Image Nov 26, 2025, 05_11_54 PM_1764195119264.png";

export default function VideoShowcase() {
  const clips = [
    { platform: "TikTok", views: "2.4M", label: "Chat loses it at 3AM", delta: "+214%" },
    { platform: "Reels", views: "1.1M", label: "Ace clutch on Ascent", delta: "+181%" },
    { platform: "Shorts", views: "780K", label: "Streamer explains setup", delta: "+96%" },
  ];

  return (
    <section className="relative">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="relative max-w-7xl mx-auto">
        <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <img src={logoImage} alt="NovarelStudio" className="w-24 h-24 mb-6 grayscale" style={{ clipPath: "circle(38% at center)" }} />
            <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-foreground mb-3">
              What your stream turns into overnight
            </h2>
            <p className="max-w-xl text-sm sm:text-base text-muted-foreground/90">
              These are the kinds of cuts NovarelStudio ships while you sleep: tight, vertical and already tuned to how each platform actually behaves.
            </p>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground/80 max-w-xs">
            Mock data, real patterns: punchlines, clutches and chat spikes are what drive follows—not random mid-fight screenshots.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {clips.map((clip, index) => (
            <Card
              key={clip.platform}
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/70 backdrop-blur-xl group cursor-pointer"
              data-testid={`card-video-stat-${clip.platform.toLowerCase()}`}
            >
              <div className="relative aspect-[9/16] w-full overflow-hidden">
                <img
                  src={dashboardImage}
                  alt={`${clip.platform} clip`}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.45),_transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <Badge className="bg-black/80 text-[10px] font-semibold uppercase tracking-[0.18em] border border-white/15">
                    {clip.platform}
                  </Badge>
                  <span className="inline-flex items-center rounded-full bg-black/70 px-2 py-0.5 text-[10px] text-slate-200 border border-white/15">
                    <span className="mr-1 h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Auto-posted
                  </span>
                </div>

                <button className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-black shadow-[0_18px_60px_rgba(15,23,42,0.95)]">
                    <Play className="h-5 w-5" />
                  </span>
                </button>

                <div className="absolute bottom-3 left-3 right-3 space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-slate-200">
                    <span className="inline-flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5" />
                      {clip.views} views
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-300 border border-emerald-400/50">
                      {clip.delta} vs. channel avg
                    </span>
                  </div>
                  <p className="truncate text-sm font-medium text-slate-50">{clip.label}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
