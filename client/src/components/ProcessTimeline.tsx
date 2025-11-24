import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, LucideIcon } from "lucide-react";

interface TimelineStep {
  icon: LucideIcon;
  title: string;
  description: string;
  level: number;
}

interface ProcessTimelineProps {
  steps: TimelineStep[];
}

export default function ProcessTimeline({ steps }: ProcessTimelineProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
      {steps.map((step, index) => {
        const Icon = step.icon;
        return (
          <div key={index} className="flex items-center gap-4">
            <Card className="p-6 flex-1 hover-elevate active-elevate-2 bg-gradient-to-br from-card to-card/50" data-testid={`timeline-step-${index + 1}`}>
              <div className="flex flex-col items-center text-center gap-3">
                <div className="p-4 rounded-full bg-gradient-to-br from-primary to-primary/70 text-white">
                  <Icon className="w-6 h-6" />
                </div>
                <Badge variant="secondary" className="text-xs" data-testid={`badge-step-level-${step.level}`}>
                  Level {step.level}
                </Badge>
                <h3 className="font-display font-semibold text-foreground">{step.title}</h3>
                <p className="text-xs text-muted-foreground">{step.description}</p>
              </div>
            </Card>
            {index < steps.length - 1 && (
              <ArrowRight className="hidden md:block w-6 h-6 text-primary/50 flex-shrink-0" />
            )}
          </div>
        );
      })}
    </div>
  );
}
