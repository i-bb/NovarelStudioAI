import { Badge } from "@/components/ui/badge";

interface PlatformBadgeProps {
  platform: 'tiktok' | 'youtube' | 'instagram';
  connected?: boolean;
}

export default function PlatformBadge({ platform, connected = false }: PlatformBadgeProps) {
  const platformConfig = {
    tiktok: { name: 'TikTok', color: 'bg-black text-white' },
    youtube: { name: 'YouTube', color: 'bg-red-600 text-white' },
    instagram: { name: 'Instagram', color: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' },
  };

  const config = platformConfig[platform];

  return (
    <div className="inline-flex items-center gap-2" data-testid={`platform-badge-${platform}`}>
      <Badge className={`${config.color} relative`}>
        {config.name}
        {connected && (
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        )}
      </Badge>
    </div>
  );
}
