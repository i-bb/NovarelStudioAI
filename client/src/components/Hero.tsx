import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Play, Zap, Users, Clock3, TrendingUp, Scissors, MessageCircle, Upload, RefreshCw } from "lucide-react";
import streamerImage from "@assets/generated_images/young_black_teen_streamer_full_body.png";

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-24 pb-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(124,58,237,0.45),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(22,163,74,0.25),_transparent_55%)]" />
      <div className="absolute inset-0 bg-noise opacity-40" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 grid md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] gap-6 md:gap-8 lg:gap-12 items-stretch">
        {/* Left: Narrative & CTA */}
        <div>
          <Badge className="mb-6 border-white/15 bg-white/5 text-xs font-medium tracking-[0.18em] uppercase rounded-full px-4 py-1.5 text-muted-foreground flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            Built for Twitch & Kick streamers
          </Badge>

          <h1 className="font-display font-semibold text-4xl sm:text-5xl lg:text-6xl xl:text-7xl tracking-tight leading-[1.05] text-foreground mb-6" style={{ fontFamily: "'Porcine Bosk', var(--font-display)" }}>
            Turn live chaos into
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-fuchsia-500 to-emerald-400 mt-2">
              content that prints followers.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground/90 max-w-xl leading-relaxed mb-8">
            NovarelStudio watches your stream end-to-end, finds the moments your chat loses its mind, and ships vertical clips to every platform automatically.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
            <Button className="h-12 sm:h-14 px-5 sm:px-8 text-xs sm:text-sm md:text-base font-semibold rounded-full bg-white text-black hover:bg-slate-100 shadow-[0_18px_60px_rgba(15,23,42,0.8)]">
              <span className="hidden sm:inline">Start free for your next stream</span>
              <span className="sm:hidden">Start free</span>
              <ArrowRight className="ml-2 h-4 w-4 flex-shrink-0" />
            </Button>
            <Button
              variant="outline"
              className="h-12 sm:h-14 px-5 sm:px-8 text-xs sm:text-sm md:text-base rounded-full border-white/15 bg-black/40 hover:bg-white/5 text-foreground flex items-center"
            >
              <Play className="mr-2 h-4 w-4 fill-current flex-shrink-0" />
              <span className="hidden sm:inline">Watch 60s tour</span>
              <span className="sm:hidden">Watch tour</span>
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[10px] sm:text-xs md:text-sm text-muted-foreground/80">
            <div className="flex -space-x-3">
              {["#10b981", "#6366f1", "#f97316"].map((color, i) => (
                <div
                  key={i}
                  className="inline-flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full border border-background/80 bg-slate-900 text-[10px] font-semibold"
                  style={{ boxShadow: "0 0 0 1.5px rgba(15,23,42,0.9)" }}
                >
                  <span className="h-5 w-5 sm:h-6 sm:w-6 rounded-full" style={{ background: color }} />
                </div>
              ))}
            </div>
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-emerald-400 flex-shrink-0" />
              <span className="hidden sm:inline">Trusted by early teams from top Twitch categories</span>
              <span className="sm:hidden">Trusted by top streamers</span>
            </span>
            <span className="flex items-center gap-1">
              <Clock3 className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-sky-400 flex-shrink-0" />
              <span className="hidden sm:inline">Goes live in under 5 minutes</span>
              <span className="sm:hidden">Live in 5 mins</span>
            </span>
          </div>
        </div>

        {/* Right: Product Surface */}
        <div className="relative self-stretch flex flex-col">
          <div className="absolute -inset-10 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.22),_transparent_60%)] opacity-70" />
          <div className="relative flex-1 rounded-3xl border border-white/8 bg-gradient-to-b from-slate-900/80 via-slate-950/95 to-black/95 shadow-[0_24px_80px_rgba(15,23,42,0.95)] overflow-hidden flex flex-col py-4">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-slate-900/60 mx-4 rounded-xl">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <span className="ml-3 font-mono text-[11px] bg-black/40 px-2 py-0.5 rounded-full border border-white/5">
                  twitch.tv/your-channel • LIVE
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Zap className="h-3.5 w-3.5 text-primary" />
                  Auto-clipping
                </span>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-0 mt-4 mx-4 rounded-xl overflow-hidden">
              {/* Live stream preview */}
              <div className="relative border-r border-white/5 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.25),_transparent_65%)]">
                <img 
                  src={streamerImage} 
                  alt="Live streaming" 
                  className="absolute inset-0 h-full w-full object-cover object-top"
                />
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3">
                  <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1 rounded-full bg-rose-600/90 px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase text-white shadow-lg shadow-rose-500/40">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                      </span>
                      Live
                    </div>
                    <div className="hidden sm:flex items-center gap-1 rounded-full bg-black/70 px-2.5 py-1 text-[11px] text-slate-100 border border-white/10">
                      EN • Just Chatting
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <span className="rounded-full bg-black/75 p-1.5 border border-emerald-400/30 flex items-center justify-center" title="Clip queued">
                      <Scissors className="h-3 w-3 text-emerald-400" />
                    </span>
                    <span className="rounded-full bg-black/75 p-1.5 border border-emerald-400/30 flex items-center justify-center" title="Chat spike">
                      <MessageCircle className="h-3 w-3 text-emerald-400" />
                    </span>
                  </div>
                </div>
              </div>

              {/* Clip stack */}
              <div className="p-4 sm:p-5 flex flex-col gap-4 bg-black/80">
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-[0.18em] mb-1">
                      Tonight's stream
                    </p>
                    <p className="text-sm font-semibold text-slate-50">6 clips generated • 3 auto-published</p>
                  </div>
                  <button className="rounded-full bg-emerald-400/90 px-3 py-1.5 text-[11px] font-semibold text-emerald-950 shadow-md hover:bg-emerald-300">
                    Approve all
                  </button>
                </div>

                <div className="space-y-2.5">
                  {[
                    { title: "Ace clutch", tag: "Gameplay" },
                    { title: "Chat moment", tag: "Viral" },
                    { title: "Setup story", tag: "Creator" },
                  ].map((clip, idx) => (
                    <div
                      key={clip.title}
                      className="group flex items-center gap-3 rounded-2xl border border-white/8 bg-slate-900/60 px-2.5 py-2.5 hover:border-emerald-400/40 hover:bg-slate-900/90 transition-colors"
                    >
                      <div className="relative h-12 w-9 overflow-hidden rounded-xl bg-slate-800/80">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(52,211,153,0.65),_transparent_65%)] opacity-70" />
                        <Play className="absolute inset-0 m-auto h-3.5 w-3.5 text-slate-950" />
                        <span className="absolute bottom-1 left-1 rounded-full bg-black/65 px-1.5 py-0.5 text-[9px] font-semibold text-slate-100">
                          0{idx + 1}:23
                        </span>
                      </div>
                      <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
                        <div>
                          <p className="truncate text-[13px] font-medium text-slate-50">{clip.title}</p>
                          <span className="mt-0.5 inline-flex rounded-full bg-slate-900/80 px-1.5 py-0.5 border border-white/10 text-[11px] text-muted-foreground">{clip.tag}</span>
                        </div>
                        <div className="flex items-center gap-1 text-emerald-400">
                          <TrendingUp className="h-3.5 w-3.5" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Upload className="h-3 w-3 text-muted-foreground/70" />
                    <span className="hidden sm:inline">Auto-posts</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <RefreshCw className="h-3 w-3 animate-spin" style={{ animationDuration: '3s' }} />
                    <span className="hidden sm:inline">Active</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
