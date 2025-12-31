import { stat } from "fs";
import {
  CheckCircle,
  Clock,
  Hourglass,
  Info,
  Instagram,
  Twitch,
} from "lucide-react";
import {
  SiTwitch,
  SiInstagram,
  SiTiktok,
  SiYoutube,
  SiKick,
} from "react-icons/si";
import {
  Radio,
  Video,
  Sparkles,
  Scissors,
  Share2,
  Zap,
  Play,
} from "lucide-react";
import demoVideo from "../../../attached_assets/twitch 1-1 video.mov";
import KickVideo from "../../../attached_assets/KickVideo.mov";
import TwitchVideo from "../../../attached_assets/TwitchVideo.mov";
import InstagramVideo from "../../../attached_assets/InstagramVideo.mov";

type CreditTier = {
  credits: string;
  clipsPerDay: string;
  monthlyPrice: number;
  annualPrice: number;
};

type Plan = {
  id: string;
  planId: number;
  name: string;
  tagline: string;
  badge: string | null;
  bullet: string;
  features: string[];
  cta: string;
  popular: boolean;
  creditTiers: CreditTier[] | null;
  fixedMonthlyPrice?: string;
  fixedAnnualPrice?: string;
};
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
        message: "",
      };

    case "failed":
      return {
        text: "Failed",
        icon: Info,
        class: "bg-red-600/20 text-red-400",
        message: "Stream recording was corrupt.",
      };

    case "pending":
      return {
        text: "Pending",
        icon: Hourglass, // ⏳
        class: "bg-yellow-600/20 text-yellow-400",
        message: "",
      };

    case "processing":
      return {
        text: "Processing",
        icon: Clock,
        class: "bg-blue-600/20 text-blue-400",
        message: "",
      };

    default:
      return {
        text: "Skipped",
        icon: Info,
        class: "bg-neutral-500/20 text-neutral-400",
        message: "No engaging moment found.",
      };
  }
};

export const plans: Plan[] = [
  {
    id: "starter",
    planId: 2,
    name: "Starter",
    tagline: "Try NovarelStudio on nights and weekends.",
    badge: null,
    bullet: "Best if you're testing the waters.",
    features: [
      "Up to 10 clips / month",
      "720p exports",
      "Basic moment detection",
      "1 connected platform",
      "3-day clip history",
    ],
    cta: "Start free",
    popular: false,
    creditTiers: null,
    fixedMonthlyPrice: "$0",
    fixedAnnualPrice: "$0",
  },
  {
    id: "creator",
    planId: 1,
    name: "Creator",
    tagline: "For channels that treat streaming like a job.",
    badge: "Most picked by full-time creators",
    bullet: "Best if you stream 3–6 nights a week.",
    features: [
      "4K exports",
      "Advanced chat + audio detection",
      "Instagram Reels auto-posting",
      "Unlimited clip archive",
      "Basic branding presets",
      "Email support",
    ],
    cta: "Use on my next stream",
    popular: true,
    creditTiers: [
      {
        credits: "60 clips/month",
        clipsPerDay: "About 2 clips/day",
        monthlyPrice: 35,
        annualPrice: 23,
      },
      {
        credits: "120 clips/month",
        clipsPerDay: "About 4 clips/day",
        monthlyPrice: 55,
        annualPrice: 36,
      },
      {
        credits: "200 clips/month",
        clipsPerDay: "About 7 clips/day",
        monthlyPrice: 75,
        annualPrice: 49,
      },
      {
        credits: "300 clips/month",
        clipsPerDay: "About 10 clips/day",
        monthlyPrice: 95,
        annualPrice: 62,
      },
    ],
  },
  {
    id: "studio",
    planId: 3,
    name: "Studio",
    tagline: "For partnered channels and small teams.",
    badge: "For serious growth pushes",
    bullet: "Best if you run multiple channels or games.",
    features: [
      "Everything in Creator",
      "Multi-channel & multi-game workspaces",
      "Team access (up to 5 seats)",
      "API + webhooks",
      "Custom caption + template setup",
      "Priority support and check-ins",
    ],
    cta: "Talk to the team",
    popular: false,
    creditTiers: [
      {
        credits: "150 clips/month",
        clipsPerDay: "About 5 clips/day",
        monthlyPrice: 100,
        annualPrice: 65,
      },
      {
        credits: "250 clips/month",
        clipsPerDay: "About 8 clips/day",
        monthlyPrice: 150,
        annualPrice: 98,
      },
      {
        credits: "350 clips/month",
        clipsPerDay: "About 12 clips/day",
        monthlyPrice: 200,
        annualPrice: 130,
      },
      {
        credits: "450 clips/month",
        clipsPerDay: "About 15 clips/day",
        monthlyPrice: 275,
        annualPrice: 179,
      },
    ],
  },
];

export const connectAccountGuide = [
  {
    id: "twitch",
    icon: Twitch,
    title: "Twitch",
    description: "How to connect your Twitch account.",
    tag: "twitch",
    video: TwitchVideo,
  },
  {
    id: "kick",
    icon: SiKick,
    title: "Kick",
    description: "How to connect your Kick account.",
    tag: "kiick",
    video: KickVideo,
  },
  {
    id: "instagram",
    icon: Instagram,
    title: "Instagram",
    description: "How to connect your Instagram account.",
    tag: "instagram",
    video: InstagramVideo,
  },
];

export const features = [
  {
    id: "hands-off",
    icon: Radio,
    title: "Hands-off capture",
    description: "Auto-detect when you go live and record in the cloud.",
    tag: "Live ingest",
  },
  {
    id: "smart-clipping",
    icon: Scissors,
    title: "Smart clipping",
    description: "AI finds the best moments with proper build-up.",
    tag: "Scene-aware",
  },
  {
    id: "vertical-ready",
    icon: Video,
    title: "Vertical-ready",
    description: "Auto-crop to 9:16 with facecam focus.",
    tag: "Mobile first",
  },
];
