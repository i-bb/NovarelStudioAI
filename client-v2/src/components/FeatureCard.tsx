import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LucideIcon, Zap } from "lucide-react";

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
    <div className="relative group" data-testid={`card-feature-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <Card className={`relative p-6 hover-elevate active-elevate-2 bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses] || colorClasses.primary} transition-all duration-300 border-2`}>
        <div className="flex items-start gap-4 mb-4">
          <div className="relative">
            <div className={`absolute inset-0 ${color === 'primary' ? 'bg-primary' : 'bg-accent'}/30 rounded-xl blur-md`} />
            <div className={`relative p-3 rounded-xl bg-gradient-to-br ${color === 'primary' ? 'from-primary to-primary/70' : color === 'accent' ? 'from-accent to-accent/70' : 'from-blue-500 to-blue-600'} text-white shadow-lg`}>
              <Icon className="w-6 h-6" />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-bold text-foreground">{title}</h3>
              {level && (
                <Badge className={`text-xs font-bold ${color === 'primary' ? 'bg-primary/20 text-primary border-primary/40' : 'bg-accent/20 text-accent border-accent/40'}`} data-testid={`badge-level-${level}`}>
                  <Zap className="w-3 h-3 mr-1" fill="currentColor" />
                  LVL {level}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
          </div>
        </div>
        <Progress value={level * 20} className="h-1.5" />
      </Card>
    </div>
  );
}
