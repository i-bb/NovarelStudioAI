import { Card } from "@/components/ui/card";
import PlatformBadge from "./PlatformBadge";
import platformImage from "@assets/stock_images/young_gamer_streamin_cbac079e.jpg";

export default function PlatformIntegration() {
  return (
    <section className="relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.2),_transparent_55%)] opacity-70" />
      <div className="relative max-w-7xl mx-auto">
        <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-foreground mb-3">
              Ship to every feed without touching a timeline
            </h2>
            <p className="max-w-xl text-sm sm:text-base text-muted-foreground/90">
              Approve once in NovarelStudio and we handle the rest—cropping, captioning and publishing tuned to TikTok, Reels and Shorts.
            </p>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground/80 max-w-xs">
            No extra bots or Zapier chains. One source of truth for what left your channel and where it landed.
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)] items-center">
          <div className="relative">
            <div className="absolute -inset-6 rounded-3xl bg-gradient-to-tr from-slate-900 via-slate-950 to-black shadow-[0_24px_80px_rgba(15,23,42,0.95)]" />
            <img
              src={platformImage}
              alt="Platform integration overview"
              className="relative z-10 w-full h-auto rounded-3xl border border-white/10"
            />
          </div>

          <div className="space-y-4">
            <Card className="relative border border-emerald-400/40 bg-black/70 backdrop-blur-xl p-5" data-testid="card-platform-instagram">
              <div className="flex items-center justify-between mb-4">
                <PlatformBadge platform="instagram" connected />
                <span className="inline-flex items-center gap-2 text-[11px] font-medium text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Connected • Auto-posting
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-xs sm:text-sm">
                <Metric label="Clips this week" value="37" note="auto" />
                <Metric label="Total reach" value="2.5M" note="+21%" />
                <Metric label="Save per clip" value="12m" note="editing" />
              </div>
            </Card>

            <Card className="border border-white/10 bg-black/60 backdrop-blur-xl p-5" data-testid="card-platform-tiktok">
              <div className="flex items-center justify-between mb-2">
                <PlatformBadge platform="tiktok" />
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Coming soon
                </span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground/90">
                Built-in TikTok posting is in active development with early partners. You&apos;ll be able to mirror the same flows you set for Reels.
              </p>
            </Card>

            <Card className="border border-white/10 bg-black/60 backdrop-blur-xl p-5" data-testid="card-platform-youtube">
              <div className="flex items-center justify-between mb-2">
                <PlatformBadge platform="youtube" />
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Coming soon
                </span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground/90">
                Shorts support follows right after TikTok, so your stream moments can hit every vertical feed from a single setup.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

function Metric({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="space-y-1">
      <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold text-foreground">{value}</p>
      {note && <p className="text-[11px] text-muted-foreground/80">{note}</p>}
    </div>
  );
}
