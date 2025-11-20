import { Card } from "@/components/ui/card";
import PlatformBadge from "./PlatformBadge";
import platformImage from "@assets/generated_images/platform_integration_visualization.png";

export default function PlatformIntegration() {
  return (
    <section className="py-20 px-6 bg-gradient-to-b from-background to-primary/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-cursive text-4xl md:text-5xl text-foreground mb-4">
            Publish Everywhere,
            <span className="text-primary"> Automatically</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            One-click integration with all major platforms. Your content, everywhere your audience is.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 blur-3xl" />
            <img 
              src={platformImage} 
              alt="Platform Integration" 
              className="relative z-10 w-full h-auto rounded-2xl"
            />
          </div>

          <div className="space-y-6">
            <Card className="p-6 hover-elevate active-elevate-2" data-testid="card-platform-tiktok">
              <div className="flex items-center justify-between mb-4">
                <PlatformBadge platform="tiktok" connected />
                <span className="inline-flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs text-muted-foreground">Connected</span>
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Posted Today</div>
                  <div className="text-xl font-bold text-foreground" data-testid="text-tiktok-posted">24</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Total Reach</div>
                  <div className="text-xl font-bold text-foreground" data-testid="text-tiktok-reach">2.5M</div>
                </div>
              </div>
            </Card>

            <Card className="p-6 hover-elevate active-elevate-2" data-testid="card-platform-youtube">
              <div className="flex items-center justify-between mb-4">
                <PlatformBadge platform="youtube" connected />
                <span className="inline-flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs text-muted-foreground">Connected</span>
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Posted Today</div>
                  <div className="text-xl font-bold text-foreground" data-testid="text-youtube-posted">18</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Total Reach</div>
                  <div className="text-xl font-bold text-foreground" data-testid="text-youtube-reach">1.8M</div>
                </div>
              </div>
            </Card>

            <Card className="p-6 hover-elevate active-elevate-2" data-testid="card-platform-instagram">
              <div className="flex items-center justify-between mb-4">
                <PlatformBadge platform="instagram" />
                <span className="inline-flex items-center gap-2">
                  <span className="w-2 h-2 bg-muted-foreground rounded-full" />
                  <span className="text-xs text-muted-foreground">Not Connected</span>
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                Connect to start publishing automatically
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
