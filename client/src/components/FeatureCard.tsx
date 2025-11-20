import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  level?: number;
  color?: string;
}

export default function FeatureCard({ icon: Icon, title, description, level = 1, color = "primary" }: FeatureCardProps) {
  const colorClasses = {
    primary: "from-primary/20 to-primary/5 border-primary/30",
    accent: "from-accent/20 to-accent/5 border-accent/30",
    blue: "from-blue-500/20 to-blue-500/5 border-blue-500/30",
  };

  return (
    <Card className={`p-6 hover-elevate active-elevate-2 bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses] || colorClasses.primary} transition-all duration-300`} data-testid={`card-feature-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${color === 'primary' ? 'from-primary to-primary/70' : color === 'accent' ? 'from-accent to-accent/70' : 'from-blue-500 to-blue-600'} text-white`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            {level && (
              <Badge variant="secondary" className="text-xs" data-testid={`badge-level-${level}`}>
                Level {level}
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </div>
    </Card>
  );
}
