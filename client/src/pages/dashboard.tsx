import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { SiInstagram, SiTiktok, SiYoutube } from "react-icons/si";
import { Clock, Film, Zap, Loader2, Play } from "lucide-react";
import type { StreamExport } from "@shared/schema";
import api, { User } from "@/lib/api/api";
import { getStatusLabel } from "@/lib/common";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { Progress } from "@/components/ui/progress";

// ── Types ─────────────────────────────────────
interface SocialMediaStats {
  instagram_reel_count: number;
  tiktok_reel_count: number;
  youtube_short_count: number;
}

interface DashboardData {
  subscription: {
    plan: string;
    clipCreditsUsed: number;
    clipCreditsTotal: number;
    subscriptionStatus: string;
  };
}

// ── Components (unchanged, just using new props) ─────
function PlatformStatCard({
  platform,
  icon: Icon,
  count,
  comingSoon = false,
  color,
}: any) {
  return (
    <Card
      className={`cursor-default relative overflow-hidden border-2 transition-all ${
        comingSoon
          ? "border-white/10 bg-black/40"
          : `border-[${color}]/30 bg-[${color}]/5`
      }`}
    >
      {comingSoon && (
        <Badge className="cursor-default absolute top-3 right-3 bg-amber-500/20 text-amber-400 border-amber-500/30 text-[10px]">
          Coming Soon
        </Badge>
      )}
      <CardContent className="p-6 flex flex-col items-center text-center">
        <div className="mb-4 p-3 rounded-xl bg-white/5">
          <Icon className="h-6 w-6" style={{ color }} />
        </div>
        <h3
          className="font-display text-lg font-semibold mb-2"
          style={{ color }}
        >
          {platform}
        </h3>
        <p className="text-4xl font-bold">{count}</p>
        <p className="text-sm text-muted-foreground">
          Video{count !== 1 ? "s" : ""} Posted
        </p>
      </CardContent>
    </Card>
  );
}

function PlanStatusCard({ subscription }: { subscription: User | null }) {
  const clipCreditsTotal =
    subscription?.active_plan?.meta_data_json?.total_clips || 0;
  const clipCreditsUsed =
    subscription?.active_plan?.meta_data_json?.used_clips || 0;
  const dailyPostingLimitReached =
    subscription?.active_plan?.meta_data_json?.posting_limit_complete || false;
  const postingLimit =
    subscription?.active_plan?.meta_data_json?.daily_posting_limit || 0;

  const usagePercentage =
    clipCreditsTotal > 0 ? (clipCreditsUsed / clipCreditsTotal) * 100 : 0;

  return (
    <Card className="border-white/10 bg-black/40 overflow-hidden mb-8">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-400/10">
              <Zap className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold capitalize cursor-default">
                {subscription?.active_plan?.name}
              </h3>
              <Badge
                variant="secondary"
                className="text-[10px] cursor-default hover:text-white"
              >
                {subscription?.active_plan?.status}
              </Badge>
            </div>
          </div>
          <Link href="/subscription">
            <Button size="sm">
              <Zap className="h-4 w-4 mr-2" />
              Upgrade
            </Button>
          </Link>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Clip Credits</span>
            <span className="font-medium">
              {clipCreditsUsed} / {clipCreditsTotal} Used
            </span>
          </div>
          <Progress value={usagePercentage} className="h-2" />
        </div>
        {dailyPostingLimitReached && (
          <div className="space-y-2">
            <div className="px-2 py-4 bg-red-500/10 text-red-400 rounded-md mt-4">
              <p>{`You have utilized your daily positing limit of ${postingLimit} post`}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// function ContentStudioPreview({ exports }: { exports: any }) {
//   if (!exports || exports.length === 0) {
//     return (
//       <Card className="border-white/10 bg-black/40 p-8 text-center">
//         <Film className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
//         <h3 className="font-display text-lg font-semibold mb-2">
//           No content yet
//         </h3>
//         <p className="text-sm text-muted-foreground">
//           Your stream exports will appear here once you start streaming.
//         </p>
//       </Card>
//     );
//   }

//   return (
//     <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//       {exports.slice(0, 6).map((exp: any) => {
//         const duration = Math.round(exp.duration);
//         const minutes = Math.floor(duration / 60);
//         const seconds = String(duration % 60).padStart(2, "0");
//         const {
//           text,
//           icon: Icon,
//           class: statusClass,
//         } = getStatusLabel(exp.status);
//         const isAccessible = exp.status === "completed";

//         return (
//           <div
//             key={exp.public_id}
//             className={`transition-all ${
//               isAccessible ? "cursor-pointer" : "opacity-60 cursor-not-allowed"
//             }`}
//           >
//             {isAccessible ? (
//               <Link
//                 href={`/dashboard/content/${exp.public_id}`}
//                 onClick={() => {
//                   localStorage.setItem("selected_export", JSON.stringify(exp));
//                 }}
//               >
//                 <Card className="group overflow-hidden border-white/10 bg-black/40 hover:border-primary/50 flex flex-col h-full">
//                   <div className="aspect-video relative">
//                     {exp.poster_url ? (
//                       <img
//                         src={exp.poster_url}
//                         alt={exp.title || "Video Thumbnail"}
//                         className="w-full h-full object-cover"
//                       />
//                     ) : (
//                       <div className="absolute inset-0 flex items-center justify-center">
//                         <Play className="h-12 w-12 text-white/50" />
//                       </div>
//                     )}

//                     <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded bg-black/70 px-2 py-1 text-xs text-white">
//                       <Clock className="h-3 w-3" /> {minutes}:{seconds}
//                     </div>
//                   </div>

//                   <CardContent className="p-4 space-y-3">
//                     <p className="font-medium truncate">{exp.title}</p>

//                     <div className="flex justify-between items-center">
//                       <p className="text-sm">Status</p>
//                       <span
//                         className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${statusClass}`}
//                       >
//                         <Icon className="h-3 w-3" /> {text}
//                       </span>
//                     </div>

//                     <div className="flex justify-between items-center">
//                       <p className="text-sm">Processed On</p>
//                       <p className="text-sm text-muted-foreground">
//                         {exp.processed_on
//                           ? new Date(exp.processed_on).toLocaleString("en-US", {
//                               month: "short",
//                               day: "2-digit",
//                               year: "numeric",
//                             })
//                           : "Not Available"}
//                       </p>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </Link>
//             ) : (
//               <Card className="overflow-hidden border-white/10 bg-black/40">
//                 <div className="aspect-video relative">
//                   {exp.poster_url ? (
//                     <img
//                       src={exp.poster_url}
//                       alt={exp.title || "Video Thumbnail"}
//                       className="w-full h-full object-cover"
//                     />
//                   ) : (
//                     <div className="absolute inset-0 flex items-center justify-center">
//                       <Play className="h-12 w-12 text-white/50" />
//                     </div>
//                   )}
//                   <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded bg-black/70 px-2 py-1 text-xs text-white">
//                     <Clock className="h-3 w-3" /> {minutes}:{seconds}
//                   </div>
//                   <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-2 text-white"></div>
//                 </div>

//                 <CardContent className="p-4 space-y-3">
//                   <p className="font-medium truncate">{exp.title}</p>

//                   <div className="flex justify-between items-center">
//                     <p className="text-sm">Status</p>
//                     <span
//                       className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${statusClass}`}
//                     >
//                       <Icon className="h-3 w-3" /> {text}
//                     </span>
//                   </div>

//                   <div className="flex justify-between items-center">
//                     <p className="text-sm">Processed On</p>
//                     <p className="text-sm text-muted-foreground">
//                       {exp.processed_on
//                         ? new Date(exp.processed_on).toLocaleString("en-US", {
//                             month: "short",
//                             day: "2-digit",
//                             year: "numeric",
//                           })
//                         : "Not Available"}
//                     </p>
//                   </div>

//                   <p className="text-xs text-muted-foreground text-center">
//                     {exp.status === "failed"
//                       ? "Stream recording was corrupt."
//                       : "No engaging moment found."}
//                   </p>
//                 </CardContent>
//               </Card>
//             )}
//           </div>
//         );
//       })}
//     </div>
//   );
// }

// ── Main Dashboard Component ─────────────────────
export default function Dashboard() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  const [socialMediaStats, setSocialMediaStats] =
    useState<SocialMediaStats | null>({
      instagram_reel_count: 0,
      tiktok_reel_count: 0,
      youtube_short_count: 0,
    });
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await api.getDashboard();
      setSocialMediaStats({
        instagram_reel_count: response?.instagram_reel_count,
        tiktok_reel_count: response?.tiktok_reel_count,
        youtube_short_count: response?.youtube_short_count,
      });
    } catch (error: any) {
      console.error("Dashboard API failed:", error);
      toast({
        description: getErrorMessage(
          error,
          "Failed to create account. Please try again."
        ),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchDashboard();
  }, [isAuthenticated]);

  // Auth guard
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({ description: "Redirecting..." });
      setTimeout(() => (window.location.href = "/login"), 800);
    }
  }, [isAuthenticated, authLoading, toast]);

  if (authLoading || loading || !socialMediaStats) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-black/95 flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  const displayName = user?.name || "Creator";

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      <h1 className="font-display text-3xl mb-8">Hello, {displayName}!</h1>

      <PlanStatusCard subscription={user || null} />

      <section className="my-12">
        <div className="grid gap-6 sm:grid-cols-3">
          <PlatformStatCard
            platform="Instagram"
            icon={SiInstagram}
            count={socialMediaStats?.instagram_reel_count}
            color="#E1306C"
          />
          <PlatformStatCard
            platform="TikTok"
            icon={SiTiktok}
            count={socialMediaStats?.tiktok_reel_count}
            comingSoon
            color="#00f2ea"
          />
          <PlatformStatCard
            platform="YouTube"
            icon={SiYoutube}
            count={socialMediaStats?.youtube_short_count}
            comingSoon
            color="#FF0000"
          />
        </div>
      </section>

      {/* <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-semibold">Content Studio</h2>
          {exportData && exportData?.length > 0 && (
            <Link href="/dashboard/content">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          )}
        </div>
        <ContentStudioPreview exports={exportData || []} />
      </section> */}
    </main>
  );
}
