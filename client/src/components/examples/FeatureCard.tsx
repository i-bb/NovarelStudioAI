import FeatureCard from '../FeatureCard';
import { Sparkles } from 'lucide-react';

export default function FeatureCardExample() {
  return (
    <div className="p-8 max-w-md">
      <FeatureCard
        icon={Sparkles}
        title="Clipping"
        description="Automatically detect and extract the most engaging moments from your streams with advanced AI analysis."
        level={3}
        color="primary"
      />
    </div>
  );
}
