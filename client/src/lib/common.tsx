import { CheckCircle, Clock, Hourglass, Info } from "lucide-react";
import { SiTwitch, SiInstagram, SiTiktok, SiYoutube } from "react-icons/si";

export interface PlatformConfig {
  id: string;
  name: string;
  icon: any;
  color: string;
  bgColor: string;
  description: string;
  category: "streaming" | "social";
  available: boolean;
  postedKey?: string;
  integrated?: boolean;
  showToUpload: boolean;
}
export const platforms: PlatformConfig[] = [
  {
    id: "twitch",
    name: "Twitch",
    icon: SiTwitch,
    color: "text-[#9146FF]",
    bgColor: "bg-[#9146FF]/10",
    description: "Auto-record your live streams",
    category: "streaming",
    available: true,
    showToUpload: false,
  },
  {
    id: "kick",
    name: "Kick",
    icon: () => (
      <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
        <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.5L19 8v8l-7 3.5L5 16V8l7-3.5z" />
      </svg>
    ),
    color: "text-[#53FC18]",
    bgColor: "bg-[#53FC18]/10",
    description: "Auto-record your live streams",
    category: "streaming",
    available: true,
    showToUpload: false,
  },
  {
    id: "instagram",
    name: "Instagram Reels",
    icon: SiInstagram,
    color: "text-[#E4405F]",
    bgColor: "bg-[#E4405F]/10",
    description: "Auto-publish clips to Reels",
    category: "social",
    available: true,
    postedKey: "instagram_posted",
    integrated: true,
    showToUpload: true,
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: SiTiktok,
    color: "text-white",
    bgColor: "bg-white/10",
    description: "Auto-publish clips",
    category: "social",
    available: false,
    postedKey: "tiktok_posted",
    integrated: false,
    showToUpload: true,
  },
  {
    id: "youtube",
    name: "YouTube Shorts",
    icon: SiYoutube,
    color: "text-[#FF0000]",
    bgColor: "bg-[#FF0000]/10",
    description: "Auto-publish clips to Shorts",
    category: "social",
    available: false,
    postedKey: "youtube_posted",
    integrated: false,
    showToUpload: true,
  },
];

export const getStatusLabel = (status: string) => {
  switch (status) {
    case "completed":
      return {
        text: "Completed",
        icon: CheckCircle,
        class: "bg-emerald-600/20 text-emerald-400",
      };

    case "failed":
      return {
        text: "Failed",
        icon: Info,
        class: "bg-red-600/20 text-red-400",
      };

    case "pending":
      return {
        text: "Pending",
        icon: Hourglass, // ⏳
        class: "bg-yellow-600/20 text-yellow-400",
      };

    case "processing":
      return {
        text: "Processing",
        icon: Clock,
        class: "bg-blue-600/20 text-blue-400",
      };

    default:
      return {
        text: "Skipped",
        icon: Info,
        class: "bg-neutral-500/20 text-neutral-400",
      };
  }
};
