import { useRef, useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { connectAccountGuide, features } from "@/lib/common";

export default function FeaturesSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [loopIndex, setLoopIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);

  /* ---------------- AUTO LOOP FLAG ---------------- */

  const isAutoLooping = selectedCard === null;

  /* ---------------- ACTIVE VIDEO (ONLY FROM connectAccountGuide) ---------------- */

  const activeVideo = useMemo(() => {
    if (isAutoLooping) {
      return connectAccountGuide[loopIndex]?.video ?? null;
    }

    return (
      connectAccountGuide.find((c) => c.id === selectedCard)?.video ?? null
    );
  }, [isAutoLooping, loopIndex, selectedCard]);

  /* ---------------- INTERSECTION OBSERVER ---------------- */

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.5 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  /* ---------------- RESET ON VIDEO CHANGE ---------------- */

  // useEffect(() => {
  //   if (!videoRef.current || !activeVideo) return;

  //   videoRef.current.pause();
  //   videoRef.current.currentTime = 0;
  //   setIsVideoReady(false);
  // }, [activeVideo]);
  useEffect(() => {
    if (!videoRef.current || !activeVideo) return;

    videoRef.current.currentTime = 0;
    setIsVideoReady(false);
  }, [activeVideo]);

  /* ---------------- PLAY / PAUSE ---------------- */

  useEffect(() => {
    if (!videoRef.current || !activeVideo || !isVideoReady) return;

    if (isVisible) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
    }
  }, [isVisible, isVideoReady, activeVideo]);

  /* ---------------- AUTO LOOP HANDLER ---------------- */

  const handleVideoEnded = () => {
    if (!isAutoLooping) return;

    setLoopIndex((prev) => (prev + 1) % connectAccountGuide.length);
  };

  /* ---------------- UI ---------------- */

  return (
    <section id="features" className="relative">
      <div className="relative max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* VIDEO */}
          <div className="relative lg:min-h-[480px] rounded-3xl border border-white/10 bg-black overflow-hidden">
            <div ref={containerRef} className="absolute inset-0">
              {activeVideo ? (
                <video
                  key={isAutoLooping ? loopIndex : selectedCard}
                  ref={videoRef}
                  src={activeVideo}
                  muted
                  playsInline
                  onLoadedMetadata={() => {
                    setIsVideoReady(true);

                    if (videoRef.current && isVisible) {
                      videoRef.current.play().catch(() => {});
                    }
                  }}
                  onEnded={handleVideoEnded}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-black" />
              )}
            </div>
          </div>

          {/* FEATURE CARDS */}
          <div className="flex gap-2">
            {/* CONNECT ACCOUNT GUIDE (CLICKABLE) */}
            <div className="grid grid-rows-3 gap-4 w-1/2">
              {connectAccountGuide.map((f) => (
                <FeatureCard
                  key={f.id}
                  icon={f.icon}
                  title={f.title}
                  description={f.description}
                  tag={f.tag}
                  accent={selectedCard === f.id}
                  onClick={() => setSelectedCard(f.id)}
                  clickable
                />
              ))}
            </div>

            {/* FEATURES (NON-CLICKABLE) */}
            <div className="grid grid-rows-3 gap-4 w-1/2">
              {features.map((f) => (
                <FeatureCard
                  key={f.id}
                  icon={f.icon}
                  title={f.title}
                  description={f.description}
                  tag={f.tag}
                />
              ))}
            </div>
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
  onClick,
  clickable = false,
}: {
  icon: any;
  title: string;
  description: string;
  tag: string;
  accent?: boolean;
  onClick?: () => void;
  clickable?: boolean;
}) {
  return (
    <article
      onClick={clickable ? onClick : undefined}
      className={cn(
        "relative overflow-hidden rounded-2xl border p-4 flex flex-col justify-between h-full group transition-all duration-300",
        clickable && "cursor-pointer hover:-translate-y-0.5",
        "backdrop-blur-xl hover:shadow-[0_12px_40px_rgba(15,23,42,0.8)]",
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
          <h3 className="font-subhead text-sm sm:text-base font-normal text-foreground mb-1">
            {title}
          </h3>
          <p className="text-[11px] sm:text-xs text-muted-foreground/80 leading-relaxed line-clamp-2">
            {description}
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center text-[10px] text-muted-foreground/70">
        <span className="inline-flex items-center gap-1 rounded-full bg-black/40 px-2 py-0.5 border border-white/5">
          <span
            className={cn(
              "h-1 w-1 rounded-full",
              accent ? "bg-emerald-400" : "bg-white/40"
            )}
          />
          {tag}
        </span>
      </div>

      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.2),_transparent_60%)]" />
    </article>
  );
}
