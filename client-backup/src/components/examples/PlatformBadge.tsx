import PlatformBadge from '../PlatformBadge';

export default function PlatformBadgeExample() {
  return (
    <div className="p-8 flex gap-4">
      <PlatformBadge platform="tiktok" connected />
      <PlatformBadge platform="youtube" connected />
      <PlatformBadge platform="instagram" />
    </div>
  );
}
