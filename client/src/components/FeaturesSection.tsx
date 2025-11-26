import { Radio, Video, Sparkles, Scissors, Share2, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import captureSystemImage from "@assets/generated_images/live_stream_cloud_recording_interface.png";

export default function FeaturesSection() {
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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-5 auto-rows-[minmax(180px,_1fr)]">
          <FeatureCard
            className="md:col-span-2 row-span-2 bg-gradient-to-br from-slate-900/80 via-slate-950 to-black border-white/10"
            icon={Radio}
            title="Hands-off capture"
            description="Auto-detect when you go live and record in the cloud."
            tag="Live ingest"
            imageSrc={captureSystemImage}
          />

          <FeatureCard
            className="md:col-span-2 bg-slate-900/70 border-white/8"
            icon={Scissors}
            title="Smart clipping"
            description="AI finds the best moments with proper build-up and payoff."
            tag="Scene-aware"
          />

          <FeatureCard
            className="bg-slate-900/70 border-white/8"
            icon={Video}
            title="Vertical-ready"
            description="Auto-crop to 9:16 with facecam focus."
            tag="Mobile first"
          />

          <FeatureCard
            className="bg-gradient-to-br from-emerald-400/10 via-slate-900 to-black border-emerald-400/40"
            icon={Share2}
            title="Auto-post"
            description="One click to TikTok, Reels, and Shorts."
            tag="Cross-platform"
          />

          <FeatureCard
            className="bg-slate-900/70 border-white/8"
            icon={Sparkles}
            title="Styled captions"
            description="On-brand text overlays, auto-generated."
            tag="Trendy"
          />

          <FeatureCard
            className="md:col-span-2 bg-slate-900/70 border-white/8"
            icon={Zap}
            title="Clip intelligence"
            description="See which clips drive followers and watch-time."
            tag="Analytics"
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
          <h3 className="font-subhead text-lg sm:text-xl font-normal text-foreground mb-1.5">{title}</h3>
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

