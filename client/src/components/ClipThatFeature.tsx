// import React from "react";
// import { Card } from "@/components/ui/card";
// import { AudioWaveform, Mic, Zap } from "lucide-react";
// import image from "../../../attached_assets/clipThatFeature.png";

// const howToUseContent = [
//   {
//     icon: <Zap className="h-6 w-6" />,
//     title: "Set it up",
//     description:
//       "Connect your stream once and you are good to go for every session.",
//   },
//   {
//     icon: <Mic className="h-6 w-6" />,
//     title: "Say the command",
//     description: `Trigger clips with “Clip It!” or “Clip That!” while playing.`,
//   },
//   {
//     icon: <AudioWaveform className="h-6 w-6" />,
//     title: "Highlights saved",
//     description:
//       "We catch the moments you do not want to lose and turn them into share-ready clips.",
//   },
// ];

// const ClipThatFeature = () => {
//   return (
//     <section className="relative">
//       <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.2),_transparent_55%)] opacity-70" />
//       <div className="relative max-w-7xl mx-auto">
//         <div className="pt-4 mb-8 md:mb-10">
//           <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-foreground mb-3">
//             Voice Command clip
//           </h2>
//           <p className="max-w-xl text-sm sm:text-base text-muted-foreground/90">
//             Effortlessly capture your gameplay with Voice Command. Just say
//             “Clip it” while streaming to instantly save highlights.
//           </p>
//         </div>

//         <div className="grid gap-6 md:gap-8 lg:gap-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)] items-center">
//           <div className="relative">
//             <img src={image} alt="clip that feature" />
//           </div>

//           <div className="space-y-4">
//             {howToUseContent?.map((content) => {
//               return (
//                 <Card
//                   className="relative border-none bg-transparent p-4 sm:p-5"
//                   data-testid="card-platform-instagram"
//                 >
//                   {content.icon}

//                   <h2 className="font-subhead text-sm sm:text-base font-normal text-foreground mb-1">
//                     {content.title}
//                   </h2>
//                   <p className="text-[12px] text-muted-foreground/80 leading-relaxed">
//                     {content.description}
//                   </p>
//                 </Card>
//               );
//             })}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ClipThatFeature;

import React from "react";
import { Card } from "@/components/ui/card";
import {
  AudioWaveform,
  Mic,
  Zap,
  Timer,
  Sparkles,
  Gamepad2,
} from "lucide-react";
import image from "../../../attached_assets/clipThatFeature.png";

const howToUseContent = [
  {
    icon: <Zap className="h-6 w-6 text-primary" />,
    title: "Set it up once",
    description:
      "Connect your stream a single time. Once enabled, Voice Command runs automatically for every session with zero interruption.",
  },
  {
    icon: <Mic className="h-6 w-6 text-primary" />,
    title: "Say the command",
    description:
      "Just say “Clip that” or “Clip it” during your stream. No hotkeys, no overlays, no interruptions, just effortless, hands-free clipping.",
  },
  {
    icon: <AudioWaveform className="h-6 w-6 text-primary" />,
    title: "Highlights saved instantly",
    description:
      "We capture the moments you don't want to lose and turn them into clean, share-ready clips automatically.",
  },
];

const ClipThatFeature = () => {
  return (
    <section className="relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.2),_transparent_55%)] opacity-70" />

      <div className="relative max-w-7xl mx-auto">
        <div className="grid gap-6 md:gap-8 lg:gap-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)] items-center">
          <div className="relative">
            <div className="pt-4 mb-8 md:mb-10">
              <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-foreground mb-3">
                Clip that — Voice Command
              </h2>
              <p className="max-w-xl text-sm sm:text-base text-muted-foreground/90">
                Turn live moments into instant clips. Just say “clip that” or
                “clip it” during your stream and Novarel captures your best
                reactions and conversations automatically.
              </p>
            </div>
            <img src={image} alt="clip that feature" />
          </div>

          <div className="space-y-4">
            <h3 className="font-display text-lg sm:text-xl font-medium text-foreground">
              How Voice Command Clip Works
            </h3>

            <div className="space-y-4">
              {howToUseContent.map((content, index) => (
                <Card
                  key={index}
                  className="border border-emerald-400/40 bg-black/70 backdrop-blur-xl relative  p-4 sm:p-5"
                >
                  {content.icon}

                  <h4 className="font-subhead text-sm sm:text-base font-normal text-foreground mb-1">
                    {content.title}
                  </h4>
                  <p className="text-[12px] text-muted-foreground/80 leading-relaxed">
                    {content.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClipThatFeature;
