import { SiInstagram } from "react-icons/si";
import { Sparkles, Share2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function ClipPreviewMockup() {
  return (
    <Card className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/95 via-slate-950 to-black p-4 sm:p-6 shadow-2xl">
      <div className="absolute top-3 left-4 flex gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
      </div>

      <div className="mt-6 flex flex-col lg:flex-row gap-6">
        <div className="relative flex-shrink-0">
          <div className="relative w-[180px] sm:w-[200px] mx-auto lg:mx-0">
            <div className="aspect-[9/16] rounded-2xl overflow-hidden shadow-xl border border-white/10 bg-black">
              <iframe
                src="https://www.youtube.com/embed/Y6bAK5AITyw?autoplay=1&mute=1&loop=1&playlist=Y6bAK5AITyw&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1"
                title="Clip Preview"
                className="w-full h-full"
                style={{ border: 0 }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="absolute -top-2 -right-2 h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center shadow-lg border-2 border-black">
              <SiInstagram className="h-5 w-5 text-white" />
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-4 min-w-0">
          <div>
            <label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5 block">Title</label>
            <div className="relative">
              <div className="rounded-lg bg-slate-800/80 border border-white/10 px-3 py-2.5 text-sm text-foreground">
                Your viral clip title goes here
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
