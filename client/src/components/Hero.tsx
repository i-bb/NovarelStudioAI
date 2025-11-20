import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import heroBackground from "@assets/generated_images/hero_background_tech_visualization.png";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url(${heroBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background/90" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">AI-Powered Content Engine</span>
        </div>
        
        <h1 className="font-cursive text-5xl md:text-7xl lg:text-8xl text-foreground mb-6 leading-tight">
          Turn Streams Into
          <br />
          <span className="text-primary">Viral Clips</span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          The autonomous AI platform that detects, records, analyzes, and publishes 
          viral short-form content from your livestreams—24/7, completely hands-free.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button size="lg" className="rounded-full px-8 text-base group" data-testid="button-get-started">
            Get Started Free
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button size="lg" variant="outline" className="rounded-full px-8 text-base" data-testid="button-watch-demo">
            Watch Demo
          </Button>
        </div>
        
        <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-1 font-cursive" data-testid="text-stat-streams">2.5M+</div>
            <div className="text-sm text-muted-foreground">Streams Processed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-1 font-cursive" data-testid="text-stat-clips">50M+</div>
            <div className="text-sm text-muted-foreground">Clips Generated</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-1 font-cursive" data-testid="text-stat-creators">10K+</div>
            <div className="text-sm text-muted-foreground">Creators</div>
          </div>
        </div>
      </div>
    </section>
  );
}
