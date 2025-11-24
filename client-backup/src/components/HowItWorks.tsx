import ProcessTimeline from "./ProcessTimeline";
import { Radio, Video, Sparkles, Scissors, Share2 } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: Radio,
      title: "Stream Detection",
      description: "Auto-detect when you go live",
      level: 1
    },
    {
      icon: Video,
      title: "Recording",
      description: "Capture in 10-min segments",
      level: 2
    },
    {
      icon: Sparkles,
      title: "AI Analysis",
      description: "Find viral moments",
      level: 3
    },
    {
      icon: Scissors,
      title: "Clip Generation",
      description: "Create vertical videos",
      level: 4
    },
    {
      icon: Share2,
      title: "Auto-Publish",
      description: "Post to all platforms",
      level: 5
    }
  ];

  return (
    <section id="how-it-works" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-cursive text-4xl md:text-5xl text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Five levels to complete automation. Your content engine that never sleeps.
          </p>
        </div>

        <ProcessTimeline steps={steps} />
      </div>
    </section>
  );
}
