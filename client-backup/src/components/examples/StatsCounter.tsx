import StatsCounter from '../StatsCounter';
import { Video } from 'lucide-react';

export default function StatsCounterExample() {
  return (
    <div className="p-8 max-w-xs">
      <StatsCounter
        label="Clips Generated"
        targetValue={50000}
        suffix="+"
        icon={<Video className="w-4 h-4 text-primary" />}
      />
    </div>
  );
}
