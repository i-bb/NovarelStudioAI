import { Link } from "wouter";
import {
  Play,
  Clock,
  Instagram,
  Youtube,
  Music2,
  ScissorsLineDashed,
  Trash,
} from "lucide-react";
import { useState } from "react";
import api from "@/lib/api/api";
import { toast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/getErrorMessage";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function ClipCard({
  clip,
  exportId,
  fetchReelsData,
  platform,
  streamingId,
}: {
  clip: any;
  exportId: string;
  fetchReelsData: any;
  platform: string;
  streamingId: string;
}) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const durationSeconds = clip.duration ?? clip.durationSeconds;

  const duration =
    typeof durationSeconds === "number"
      ? `${Math.floor(durationSeconds / 60)}:${String(
          Math.floor(durationSeconds % 60),
        ).padStart(2, "0")}`
      : null;

  const isClipThatVideo = clip?.is_clip_that || false;

  const onHandleDelete = async () => {
    if (!clip) return;

    try {
      // 🔥 call your delete API here
      const response = await api.deleteSingleReel(clip.public_id);
      fetchReelsData(exportId, platform);
      toast({
        description: response?.message,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: getErrorMessage(error, "Failed to delete video"),
      });
    } finally {
      setIsDeleteOpen(false);
    }
  };

  const platforms: {
    icon: any;
    bg: string;
  }[] = [];

  if (clip.instagram_posted) {
    platforms.push({
      icon: Instagram,
      bg: "bg-gradient-to-br from-purple-500 to-pink-500",
    });
  }

  if (clip.youtube_posted) {
    platforms.push({
      icon: Youtube,
      bg: "bg-red-600",
    });
  }

  if (clip.tiktok_posted) {
    platforms.push({
      icon: Music2,
      bg: "bg-black",
    });
  }

  return (
    <>
      <div className="relative">
        <Link
          href={`/dashboard/content/${streamingId}/video/${exportId}/reel/${clip.public_id}`}
        >
          <div
            className={`relative rounded-xl cursor-pointer group transition mt-9 ${
              isClipThatVideo ? "0px" : ""
            }`}
          >
            {isClipThatVideo && (
              <>
                {/* Border */}
                <div
                  className="absolute -top-8 inset-x-0 bottom-0 rounded-xl pointer-events-none z-30 border-primary/50"
                  style={{
                    outline: "2px solid #6d28d9",
                    outlineOffset: "0px",
                    boxShadow: "0 0 14px rgba(168, 85, 247, 0.9)",
                  }}
                />
              </>
            )}

            {isClipThatVideo && (
              <div className="absolute -top-8 inset-x-0 z-30">
                <div className="w-full rounded-t-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-xs font-semibold py-2 flex items-center justify-center gap-2 shadow-md">
                  <ScissorsLineDashed className="h-4 w-4" />
                  CLIP THAT
                </div>
              </div>
            )}

            <div
              className={`overflow-hidden bg-black/40 cursor-pointer group hover:bg-black/60 transition ${
                isClipThatVideo
                  ? "rounded-b-xl"
                  : "border border-white/10 rounded-xl"
              }`}
            >
              <div className="relative aspect-[9/16]">
                <img
                  src={clip.poster_url}
                  alt={clip.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                />

                {duration && (
                  <div className="absolute top-2 left-2 bg-black/80 text-white text-xs px-2 py-1 rounded flex items-center gap-1 font-medium">
                    <Clock className="h-3 w-3" />
                    {duration}
                  </div>
                )}

                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300">
                  <div className="absolute inset-0 flex top-[40%] justify-center pointer-events-none">
                    <Play className="h-16 w-16 text-white drop-shadow-xl" />
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/85 to-transparent px-4 pt-10 pb-6 flex flex-col text-left gap-2">
                    <p className="font-semibold text-white text-sm leading-tight">
                      {clip.title}
                    </p>
                    {(clip.instagram_posted ||
                      clip.youtube_posted ||
                      clip.tiktok_posted) && (
                      <>
                        <p className="text-xs text-white/80 font-medium">
                          Posted on:
                        </p>

                        <div className="flex space-x-2">
                          {platforms.map((p, idx) => {
                            const Icon = p.icon;
                            return (
                              <div
                                key={idx}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center ${p.bg}`}
                              >
                                <Icon className="w-4 h-4 text-white" />
                              </div>
                            );
                          })}
                        </div>
                      </>
                    )}
                    {clip.viral_reason && (
                      <p className="text-[11px] text-white/90 leading-relaxed line-clamp-2">
                        {clip.viral_reason}
                      </p>
                    )}

                    {clip.transcript && (
                      <div className="bg-black/70 border border-white/10 rounded-md px-3 py-2">
                        <p className="text-[11px] text-white/90 italic line-clamp-2">
                          {clip.transcript}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>

        <button
          className="absolute top-11 right-2 z-40 bg-black/70 backdrop-blur p-2 rounded-lg text-red-500 hover:text-red-400 hover:shadow-[0_0_10px_rgba(239,68,68,0.6)] transition"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDeleteOpen(true);
          }}
        >
          <Trash className="h-4 w-4" />
        </button>
      </div>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-[420px] rounded-xl p-6">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this video?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This clip will be permanently
              removed.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={onHandleDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default ClipCard;

// import { Link } from "wouter";
// import {
//   Play,
//   Clock,
//   Instagram,
//   Youtube,
//   Music2,
//   ScissorsLineDashed,
//   Trash,
// } from "lucide-react";
// import { useState } from "react";
// import api from "@/lib/api/api";
// import { toast } from "@/hooks/use-toast";
// import { getErrorMessage } from "@/lib/getErrorMessage";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";

// function ClipCard({
//   clip,
//   exportId,
//   fetchReelsData,
//   platform,
// }: {
//   clip: any;
//   exportId: string;
//   fetchReelsData: any;
//   platform: string;
// }) {
//   const [isDeleteOpen, setIsDeleteOpen] = useState(false);

//   const durationSeconds = clip.duration ?? clip.durationSeconds;
//   const duration =
//     typeof durationSeconds === "number"
//       ? `${Math.floor(durationSeconds / 60)}:${String(
//           Math.floor(durationSeconds % 60)
//         ).padStart(2, "0")}`
//       : null;

//   const isClipThatVideo = clip?.is_clip_that || false;

//   const onHandleDelete = async () => {
//     try {
//       const response = await api.deleteSingleReel(clip.public_id);
//       fetchReelsData(exportId, platform);
//       toast({ description: response?.message });
//     } catch (error: any) {
//       toast({
//         variant: "destructive",
//         description: getErrorMessage(error, "Failed to delete video"),
//       });
//     } finally {
//       setIsDeleteOpen(false);
//     }
//   };

//   return (
//     <>
//       <div className="relative">
//         <Link href={`/dashboard/content/${exportId}/reel/${clip.public_id}`}>
//           <div className="group cursor-pointer">
//             <div
//               className={`relative overflow-hidden rounded-2xl bg-black/40 transition ${
//                 isClipThatVideo
//                   ? "shadow-[0_0_0_1px_rgba(168,85,247,0.6),0_20px_60px_rgba(168,85,247,0.45)]"
//                   : "border border-white/10"
//               }`}
//             >
//               {/* LEFT VERTICAL BANNER */}
//               {isClipThatVideo && (
//                 <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-b from-violet-600 to-fuchsia-600 flex items-center justify-center z-20">
//                   <div className="rotate-90 flex items-center gap-2 text-white text-[11px] font-semibold tracking-wider whitespace-nowrap">
//                     <ScissorsLineDashed className="h-4 w-4" />
//                     CLIP THAT
//                   </div>
//                 </div>
//               )}

//               {/* VIDEO */}
//               <div className="relative aspect-[9/16]">
//                 <img
//                   src={clip.poster_url}
//                   alt={clip.title}
//                   className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
//                 />

//                 {/* DURATION */}
//                 {duration && (
//                   <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white text-xs px-2 py-1 rounded-md flex items-center gap-1 font-medium z-20">
//                     <Clock className="h-3 w-3" />
//                     {duration}
//                   </div>
//                 )}

//                 {/* HOVER OVERLAY */}
//                 <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition">
//                   <div className="absolute inset-0 flex items-center justify-center">
//                     <Play className="h-16 w-16 text-white drop-shadow-2xl transition-transform group-hover:-translate-y-1" />
//                   </div>

//                   <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent px-4 pt-10 pb-6">
//                     <p className="text-sm font-semibold text-white leading-tight line-clamp-2">
//                       {clip.title}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </Link>

//         {/* DELETE — ALWAYS TOP RIGHT */}
//         <button
//           className="absolute top-2 right-2 z-30 bg-black/60 backdrop-blur-md p-1.5 rounded-md text-red-400 hover:text-red-300 hover:shadow-[0_0_10px_rgba(239,68,68,0.5)] transition"
//           onClick={(e) => {
//             e.preventDefault();
//             e.stopPropagation();
//             setIsDeleteOpen(true);
//           }}
//         >
//           <Trash className="h-4 w-4" />
//         </button>
//       </div>

//       {/* DELETE CONFIRMATION */}
//       <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Delete this video?</AlertDialogTitle>
//             <AlertDialogDescription>
//               This action cannot be undone.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel>Cancel</AlertDialogCancel>
//             <AlertDialogAction
//               className="bg-red-600 hover:bg-red-700"
//               onClick={onHandleDelete}
//             >
//               Delete
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </>
//   );
// }

// export default ClipCard;
