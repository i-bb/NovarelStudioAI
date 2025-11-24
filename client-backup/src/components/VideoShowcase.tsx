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
    <section className="py-20 px-6 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h2 className="font-cursive text-4xl md:text-5xl text-foreground mb-4">
            <span className="text-accent">Clips</span> — Viral Moments
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl">{description}</p>
        </div>

        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-4">
          {videos.map((video, index) => (
            <Card key={index} className="overflow-hidden border-2 border-primary/20 bg-card/80 backdrop-blur hover-elevate active-elevate-2 group cursor-pointer" data-testid={`card-video-stat-${video.platform}`}>
              <div className="relative aspect-[9/16] bg-gradient-to-br from-primary/20 to-accent/20">
                <img 
                  src={dashboardImage} 
                  alt={`${video.platform} clip`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
                <Badge className="absolute top-3 left-3 bg-red-600 text-white border-0 font-bold">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse mr-1" />
                  LIVE
                </Badge>
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="flex items-center gap-2 text-white mb-2">
                    <Eye className="w-4 h-4" />
                    <span className="font-bold text-sm" data-testid={`text-views-${video.platform}`}>{video.views}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="capitalize bg-black/60 text-white border-0 backdrop-blur" data-testid={`badge-platform-${video.platform}`}>
                      {video.platform}
                    </Badge>
                    <Badge className="bg-primary/80 text-white border-0 backdrop-blur font-bold">
                      +{index * 100 + 250}%
                    </Badge>
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-16 h-16 rounded-full bg-primary/90 backdrop-blur flex items-center justify-center">
                    <Play className="w-8 h-8 text-white" fill="white" />
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm">Epic Gameplay Moment #{index + 1}</h3>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Heart className="w-3 h-3" />
                    <span data-testid={`text-likes-${video.platform}`}>{video.likes}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
