import { Radio, Video, Sparkles, Scissors, Share2, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import captureSystemImage from "@assets/generated_images/live_stream_capture_system.png";

export default function FeaturesSection() {
  return (
    <section id="features" className="relative">
      <div className="absolute inset-0 bg-noise opacity-40" />
      <div className="relative max-w-7xl mx-auto">
        <div className="mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <h2 className="font-display font-semibold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-foreground mb-3">
              A studio team,
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-primary to-fuchsia-500">
                bottled into one product.
              </span>
            </h2>
            <p className="max-w-xl text-sm sm:text-base text-muted-foreground/90 leading-relaxed">
              Every part of the pipeline is handled: capture, cut, caption, crop and cross-post. You go live; we ship content that actually grows the channel.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground/80">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/25 bg-emerald-400/5 px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Streams processed in real time
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/8 bg-black/40 px-3 py-1">
              Avg +3–5x more clips per week
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-5 auto-rows-[minmax(180px,_1fr)]">
          <FeatureCard
            className="md:col-span-2 row-span-2 bg-gradient-to-br from-slate-900/80 via-slate-950 to-black border-white/10"
            icon={Radio}
            title="Hands-off capture"
            description="We detect when you go live, spin up a recorder in the cloud, and track your VOD from the first hello to the last raid."
            tag="Live ingest"
            imageSrc={captureSystemImage}
          >
            <div className="mt-4 flex items-center justify-between text-[11px] text-muted-foreground/90">
              <span>Zero overlays or bots required on stream.</span>
              <span className="rounded-full bg-emerald-400/10 px-2 py-1 text-emerald-400 border border-emerald-400/30">
                Always on
              </span>
            </div>
          </FeatureCard>

          <FeatureCard
            className="md:col-span-2 bg-slate-900/70 border-white/8"
            icon={Scissors}
            title="Clips that feel edited, not auto-cut"
            description="Scene-aware clipping finds punchlines, build-up and payoff so your clips feel intentional, not like random mid-sentence jumps."
            tag="Smart clipping"
          />

          <FeatureCard
            className="bg-slate-900/70 border-white/8"
            icon={Video}
            title="Creator-first framing"
            description="Facecam + gameplay compositions that match what performs on TikTok, Reels, and Shorts today, not last year."
            tag="Vertical ready"
          />

          <FeatureCard
            className="bg-gradient-to-br from-emerald-400/10 via-slate-900 to-black border-emerald-400/40"
            icon={Share2}
            title="Ship everywhere in one pass"
            description="Approve once, then publish to TikTok, Reels, Shorts and more with platform-specific rendering profiles."
            tag="Auto-post"
          />

          <FeatureCard
            className="bg-slate-900/70 border-white/8"
            icon={Sparkles}
            title="Captions that match your lane"
            description="Choose from clean streamer-style captions to louder, meme-ready treatments. We keep the vibe on-brand."
            tag="Stylized captions"
          />

          <FeatureCard
            className="md:col-span-2 bg-slate-900/70 border-white/8"
            icon={Zap}
            title="Know what actually moved the needle"
            description="See which clips convert follows and watch-time by game, category and format so you can double down deliberately."
            tag="Clip intelligence"
          />
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  className,
  icon: Icon,
  title,
  description,
  tag,
  children,
  imageSrc,
}: {
  className?: string;
  icon: any;
  title: string;
  description: string;
  tag: string;
  children?: React.ReactNode;
  imageSrc?: string;
}) {
  return (
    <article
      className={cn(
        "relative overflow-hidden rounded-3xl border p-5 sm:p-6 flex flex-col justify-between group transition-all duration-300",
        "bg-black/60 backdrop-blur-xl hover:-translate-y-1 hover:shadow-[0_18px_60px_rgba(15,23,42,0.9)]",
        className,
      )}
    >
      {imageSrc && (
        <div className="absolute inset-0 opacity-30">
          <img 
            src={imageSrc} 
            alt={title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
        </div>
      )}
      <div className="relative z-10 flex-1 flex flex-col gap-3">
        <div className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-slate-100 group-hover:bg-white/10">
          <Icon className="w-4.5 h-4.5" />
        </div>
        <div>
          <h3 className="font-display text-base sm:text-lg font-semibold text-foreground mb-1.5">{title}</h3>
          <p className="text-xs sm:text-sm text-muted-foreground/90 leading-relaxed">{description}</p>
        </div>
      </div>
      <div className="relative z-10 mt-3 flex items-center justify-between text-[11px] text-muted-foreground/80">
        <span className="inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 border border-white/10">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          {tag}
        </span>
        {children}
      </div>
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.25),_transparent_60%)]" />
    </article>
  );
}

