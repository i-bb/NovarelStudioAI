import FeatureCard from "./FeatureCard";
import { Radio, Video, Sparkles, Scissors, Share2, Zap } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: Radio,
      title: "Auto Stream Detection",
      description: "Automatically detects when you go live on Twitch, YouTube, or other platforms and starts recording.",
      level: 1,
      color: "primary"
    },
    {
      icon: Video,
      title: "Smart Recording",
      description: "Breaks streams into 10-minute segments for efficient processing and analysis.",
      level: 2,
      color: "primary"
    },
    {
      icon: Sparkles,
      title: "AI Moment Detection",
      description: "Advanced AI analyzes emotional intensity, reactions, and context to find viral-worthy moments.",
      level: 3,
      color: "accent"
    },
    {
      icon: Scissors,
      title: "Clip Generation",
      description: "Creates platform-optimized vertical videos with captions and trending hashtags automatically.",
      level: 4,
      color: "accent"
    },
    {
      icon: Share2,
      title: "Auto-Publishing",
      description: "Posts clips to TikTok, YouTube Shorts, and Instagram Reels with smart scheduling.",
      level: 5,
      color: "primary"
    },
    {
      icon: Zap,
      title: "Real-time Analytics",
      description: "Track performance metrics and optimize your content strategy with AI insights.",
      level: 5,
      color: "accent"
    },
  ];

  return (
    <section id="features" className="py-20 px-6 bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-cursive text-4xl md:text-5xl text-foreground mb-4">
            The Complete
            <span className="text-primary"> Automation Pipeline</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From live stream to viral clip in minutes. No manual work required.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              level={feature.level}
              color={feature.color}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
