import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface StatsCounterProps {
  label: string;
  targetValue: number;
  suffix?: string;
  icon?: React.ReactNode;
}

export default function StatsCounter({ label, targetValue, suffix = "", icon }: StatsCounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = targetValue / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= targetValue) {
        setCount(targetValue);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [targetValue]);

  return (
    <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/5 border-primary/20" data-testid={`stat-counter-${label.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-muted-foreground">{label}</div>
        {icon || <TrendingUp className="w-4 h-4 text-primary" />}
      </div>
      <div className="text-3xl font-bold font-display text-primary" data-testid={`text-stat-value-${label.toLowerCase().replace(/\s+/g, '-')}`}>
        {count.toLocaleString()}{suffix}
      </div>
    </Card>
  );
}
