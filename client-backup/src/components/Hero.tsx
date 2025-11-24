import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ArrowRight, Play, Users, Video, TrendingUp } from "lucide-react";
import heroBackground from "@assets/generated_images/hero_background_tech_visualization.png";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background pt-20">
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 w-full">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left side - Featured "Stream" */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-accent/30 rounded-xl blur-2xl opacity-75" />
            <Card className="relative overflow-hidden border-2 border-primary/30 bg-card/50 backdrop-blur">
              <div className="aspect-video relative bg-gradient-to-br from-primary/20 to-accent/20">
                <img 
                  src={heroBackground} 
                  alt="Hero" 
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <Badge className="absolute top-3 left-3 bg-red-600 text-white border-0 font-bold px-3 py-1">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse mr-2" />
                  LIVE
                </Badge>
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="flex items-center gap-2 text-white">
                    <Users className="w-4 h-4" />
                    <span className="font-bold">2.5M viewers</span>
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-primary/90 backdrop-blur flex items-center justify-center hover:scale-110 transition-transform cursor-pointer">
                    <Play className="w-10 h-10 text-white" fill="white" />
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">AI Clipping in Action</h3>
                <p className="text-sm text-muted-foreground">Watch how NovarelStudio turns hours of content into viral moments</p>
              </div>
            </Card>
          </div>

          {/* Right side - Info */}
          <div className="space-y-6">
            <Badge className="bg-primary/20 text-primary border-primary/40 font-bold px-4 py-2 text-sm">
              <TrendingUp className="w-4 h-4 mr-2" />
              #1 AI Clipping Platform
            </Badge>
            
            <h1 className="font-cursive text-5xl md:text-6xl lg:text-7xl text-foreground leading-tight">
              Turn Streams Into
              <br />
              <span className="text-primary">Viral Clips</span>
            </h1>
            
            <p className="text-lg text-muted-foreground">
              The autonomous AI platform that detects, records, analyzes, and publishes 
              viral short-form content from your livestreams—24/7, completely hands-free.
            </p>
            
            <div className="flex flex-wrap gap-3">
              <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 font-bold shadow-lg shadow-primary/30 px-8" data-testid="button-get-started">
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="font-bold border-2" data-testid="button-watch-demo">
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
        
        {/* Stats Grid - Twitch-style blocks */}
        <div className="grid grid-cols-3 gap-4 mt-12">
          <Card className="p-6 border-2 border-primary/30 bg-card/80 backdrop-blur hover-elevate active-elevate-2">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                <Video className="w-5 h-5 text-white" />
              </div>
              <Badge className="bg-green-500/20 text-green-500 border-green-500/40 font-bold">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1" />
                LIVE
              </Badge>
            </div>
            <div className="text-3xl md:text-4xl font-bold text-primary mb-1 font-cursive" data-testid="text-stat-streams">2.5M+</div>
            <div className="text-sm text-muted-foreground font-semibold">Streams Processed</div>
          </Card>
          
          <Card className="p-6 border-2 border-accent/30 bg-card/80 backdrop-blur hover-elevate active-elevate-2">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center">
                <Play className="w-5 h-5 text-white" fill="white" />
              </div>
              <Badge className="bg-green-500/20 text-green-500 border-green-500/40 font-bold">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1" />
                LIVE
              </Badge>
            </div>
            <div className="text-3xl md:text-4xl font-bold text-accent mb-1 font-cursive" data-testid="text-stat-clips">50M+</div>
            <div className="text-sm text-muted-foreground font-semibold">Clips Generated</div>
          </Card>
          
          <Card className="p-6 border-2 border-primary/30 bg-card/80 backdrop-blur hover-elevate active-elevate-2">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <Badge className="bg-green-500/20 text-green-500 border-green-500/40 font-bold">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1" />
                LIVE
              </Badge>
            </div>
            <div className="text-3xl md:text-4xl font-bold text-primary mb-1 font-cursive" data-testid="text-stat-creators">10K+</div>
            <div className="text-sm text-muted-foreground font-semibold">Active Creators</div>
          </Card>
        </div>
      </div>
    </section>
  );
}
