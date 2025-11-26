import { Radio, Video, Sparkles, Scissors, Share2, Zap, Play } from "lucide-react";
import { cn } from "@/lib/utils";

export default function FeaturesSection() {
  const features = [
    {
      icon: Radio,
      title: "Hands-off capture",
      description: "Auto-detect when you go live and record in the cloud.",
      tag: "Live ingest",
    },
    {
      icon: Scissors,
      title: "Smart clipping",
      description: "AI finds the best moments with proper build-up.",
      tag: "Scene-aware",
    },
    {
      icon: Video,
      title: "Vertical-ready",
      description: "Auto-crop to 9:16 with facecam focus.",
      tag: "Mobile first",
    },
    {
      icon: Share2,
      title: "Auto-post",
      description: "One click to TikTok, Reels, and Shorts.",
      tag: "Cross-platform",
      accent: true,
    },
    {
      icon: Sparkles,
      title: "Styled captions",
      description: "On-brand text overlays, auto-generated.",
      tag: "Trendy",
    },
    {
      icon: Zap,
      title: "Clip intelligence",
      description: "See which clips drive followers and watch-time.",
      tag: "Analytics",
    },
  ];

  return (
    <section id="features" className="relative">
      <div className="absolute inset-0 bg-noise opacity-40" />
      <div className="relative max-w-7xl mx-auto">
        <div className="mb-10 md:mb-14">
          <h2 className="font-display font-semibold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-foreground mb-3">
            A studio team,
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-primary to-fuchsia-500">
              bottled into one product.
            </span>
          </h2>
          <p className="max-w-lg text-sm sm:text-base text-muted-foreground/90">
            You stream. We handle capture, clipping, and cross-posting.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left: Video Demo */}
          <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[480px] rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/80 via-slate-950 to-black overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(139,92,246,0.15),_transparent_70%)]" />
            
            {/* Video placeholder */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-white/5 border border-white/20 mb-4 group-hover:bg-white/10 group-hover:scale-105 transition-all cursor-pointer">
                  <Play className="w-8 h-8 text-white ml-1" />
                </div>
                <p className="text-sm text-muted-foreground">Connect your accounts</p>
              </div>
            </div>

            {/* Corner accent */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 border border-white/10 text-xs text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                Setup Guide
              </span>
            </div>

            {/* Decorative elements */}
            <div className="absolute bottom-4 left-4 right-4 flex gap-2">
              <div className="flex-1 h-1 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full w-1/3 bg-gradient-to-r from-primary to-emerald-400 rounded-full" />
              </div>
            </div>
          </div>

          {/* Right: Feature Cards Grid */}
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            {features.map((feature) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                tag={feature.tag}
                accent={feature.accent}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  tag,
  accent,
}: {
  icon: any;
  title: string;
  description: string;
  tag: string;
  accent?: boolean;
}) {
  return (
    <article
      className={cn(
        "relative overflow-hidden rounded-2xl border p-4 flex flex-col justify-between group transition-all duration-300",
        "backdrop-blur-xl hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(15,23,42,0.8)]",
        accent
          ? "bg-gradient-to-br from-emerald-400/10 via-slate-900 to-black border-emerald-400/30"
          : "bg-slate-900/70 border-white/8"
      )}
    >
      <div className="flex-1 flex flex-col gap-2.5">
        <div className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-slate-100 group-hover:bg-white/10">
          <Icon className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-subhead text-sm sm:text-base font-normal text-foreground mb-1">{title}</h3>
          <p className="text-[11px] sm:text-xs text-muted-foreground/80 leading-relaxed line-clamp-2">{description}</p>
        </div>
      </div>
      <div className="mt-3 flex items-center text-[10px] text-muted-foreground/70">
        <span className="inline-flex items-center gap-1 rounded-full bg-black/40 px-2 py-0.5 border border-white/5">
          <span className={cn("h-1 w-1 rounded-full", accent ? "bg-emerald-400" : "bg-white/40")} />
          {tag}
        </span>
      </div>
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.2),_transparent_60%)]" />
    </article>
  );
}
