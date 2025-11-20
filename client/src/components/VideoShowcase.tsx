import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Heart, Eye } from "lucide-react";
import dashboardImage from "@assets/generated_images/dashboard_video_grid_interface.png";

interface VideoShowcaseProps {
  title?: string;
  description?: string;
}

export default function VideoShowcase({ title = "AI-Generated Clips", description = "See what NovarelStudio can create from your content" }: VideoShowcaseProps) {
  // Mock data for demo
  const videos = [
    { platform: 'tiktok', views: '2.5M', likes: '450K' },
    { platform: 'youtube', views: '1.2M', likes: '85K' },
    { platform: 'instagram', views: '890K', likes: '120K' },
  ];

  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-cursive text-4xl md:text-5xl text-foreground mb-4">{title}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{description}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <Card className="overflow-hidden hover-elevate active-elevate-2" data-testid="card-video-showcase">
              <div className="relative group cursor-pointer">
                <img 
                  src={dashboardImage} 
                  alt="Dashboard Preview" 
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                  <Button size="icon" className="rounded-full w-16 h-16 bg-primary hover:bg-primary/90" data-testid="button-play-showcase">
                    <Play className="w-8 h-8 fill-white" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            {videos.map((video, index) => (
              <Card key={index} className="p-6 hover-elevate active-elevate-2" data-testid={`card-video-stat-${video.platform}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <Badge className="mb-2 capitalize" data-testid={`badge-platform-${video.platform}`}>
                      {video.platform}
                    </Badge>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span data-testid={`text-views-${video.platform}`}>{video.views}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        <span data-testid={`text-likes-${video.platform}`}>{video.likes}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold font-cursive text-primary">+{index * 100 + 250}%</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
