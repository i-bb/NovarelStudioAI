import ProcessTimeline from '../ProcessTimeline';
import { Radio, Video, Sparkles, Scissors, Share2 } from 'lucide-react';

export default function ProcessTimelineExample() {
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
    <div className="p-8">
      <ProcessTimeline steps={steps} />
    </div>
  );
}
