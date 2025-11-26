import logoImage from "@assets/ChatGPT Image Nov 26, 2025, 05_11_54 PM_1764195119264.png";

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <div className="relative max-w-7xl mx-auto">
        <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <img src={logoImage} alt="NovarelStudio" className="w-24 h-24 mb-6 grayscale" style={{ clipPath: "circle(38% at center)" }} />
            <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-foreground mb-3">
              From "Go Live" to multi-platform drops
            </h2>
            <p className="max-w-xl text-sm sm:text-base text-muted-foreground/90">
              The flow is brutally simple on purpose. No new scenes, bots or OBS sorcery. You keep streaming; the system quietly does the rest.
            </p>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground/80 max-w-xs">
            Designed with high-volume streamers: the fewer knobs you need to touch, the more likely you&apos;ll actually use it every night.
          </p>
        </div>

        <ol className="grid gap-4 md:grid-cols-3">
          <StepCard
            step="01"
            title="Connect once, then forget it"
            description="Link Twitch or Kick, set your posting rules, and choose where clips should land. That&apos;s the last time you touch settings."
          />
          <StepCard
            step="02"
            title="Novarel sits in on every stream"
            description="As you go live, we watch audio, chat spikes and in-game events to flag the 1–2% of moments actually worth posting."
          />
          <StepCard
            step="03"
            title="Wake up to finished clips"
            description="Review a tight stack of ready-to-post clips or let them ship automatically while you sleep. No timelines, no exports."
          />
        </ol>
      </div>
    </section>
  );
}

function StepCard({ step, title, description }: { step: string, title: string, description: string }) {
  return (
    <li className="relative group rounded-3xl border border-white/8 bg-black/70 px-5 py-6 sm:px-6 sm:py-7 flex flex-col gap-4 overflow-hidden">
      <div className="flex items-center justify-between gap-4">
        <span className="font-display text-4xl sm:text-5xl font-semibold text-white/8 group-hover:text-primary/20 transition-colors select-none">
          {step}
        </span>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Always the same, every stream
        </span>
      </div>
      <div>
        <h3 className="font-display text-base sm:text-lg font-semibold text-foreground mb-1.5">{title}</h3>
        <p className="text-xs sm:text-sm text-muted-foreground/90 leading-relaxed">{description}</p>
      </div>
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.25),_transparent_60%)]" />
    </li>
  );
}
