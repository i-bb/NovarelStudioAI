import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { getSocket } from "@/lib/socket";

type Props = {
  initials: string;
};

interface StreamingPlatformProps {
  live: boolean;
  started_at: string | null;
  twitch_stream_url?: string | null;
  kick_stream_url?: string | null;
}

interface PlatformStatus {
  live: boolean;
  started_at: string | null;
  message?: string | null;
  twitch_stream_url?: string | null;
  kick_stream_url?: string | null;
}

interface LiveStatusPayload {
  timestamp: string;
  twitch_status: PlatformStatus;
  kick_status: PlatformStatus;
  connection_status: {
    connected: boolean;
    session_count: number;
  };
  tasks: {
    pending_tasks: number;
    completed_tasks: number;
    failed_tasks: number;
  };
}

export function LiveNotification({ initials }: Props) {
  const [liveStatus, setLiveStatus] = useState<LiveStatusPayload | null>(null);
  const [showCard, setShowCard] = useState(false);

  useEffect(() => {
    const socket = getSocket();

    const handleConnect = () => {
      console.log("[socket] connected:", socket?.id);
    };

    const handleDisconnect = (reason: string) => {
      console.warn("[socket] disconnected:", reason);
      setLiveStatus(null);
    };

    const handleConnectError = (err: Error) => {
      console.error("[socket] connection error:", err.message);
    };

    const handleStreamerStatus = (payload: LiveStatusPayload) => {
      setLiveStatus(payload);
    };

    socket?.on("connect", handleConnect);
    socket?.on("disconnect", handleDisconnect);
    socket?.on("connect_error", handleConnectError);
    socket?.on("streamer_status", handleStreamerStatus);

    return () => {
      socket?.off("connect", handleConnect);
      socket?.off("disconnect", handleDisconnect);
      socket?.off("connect_error", handleConnectError);
      socket?.off("streamer_status", handleStreamerStatus);
    };
  }, []);

  const twitchData: StreamingPlatformProps | null =
    liveStatus?.twitch_status ?? null;

  const kickData: StreamingPlatformProps | null =
    liveStatus?.kick_status ?? null;

  const isLive = Boolean(twitchData?.live || kickData?.live);

  return (
    <div
      className="relative"
      onMouseEnter={() => setShowCard(true)}
      onMouseLeave={() => setShowCard(false)}
    >
      <DropdownMenuTrigger asChild>
        <button className="relative flex items-center rounded-full p-1 cursor-pointer focus-visible:outline-none">
          {isLive && (
            <span
              className="absolute inset-0 rounded-full p-[4px]
              bg-[conic-gradient(from_0deg,rgba(255,0,0,.9),rgba(255,0,128,.9),rgba(128,0,255,.9),rgba(255,0,0,.9))]
              animate-insta-rotate animate-live-glow-breath"
            />
          )}

          <span className="relative rounded-full bg-black p-[3px]">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/20 text-primary text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>
          </span>

          {isLive && (
            <span
              className="absolute -bottom-2 left-1/2 -translate-x-1/2
              rounded-sm bg-red-600 px-1 py-[1px]
              text-[9px] font-bold text-white uppercase"
            >
              Live
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      {isLive && showCard && (
        <div className="absolute right-0 top-full mt-4 z-50 animate-fade-down">
          <LiveStatusCard kickData={kickData} twitchData={twitchData} />
        </div>
      )}
    </div>
  );
}

import { SiTwitch } from "react-icons/si";
import { FaKickstarterK } from "react-icons/fa6";

interface LiveStatusCardProps {
  kickData: StreamingPlatformProps | null;
  twitchData: StreamingPlatformProps | null;
}

function LiveStatusCard({ kickData, twitchData }: LiveStatusCardProps) {
  const isTwitchLive = twitchData?.live;
  const isKickLive = kickData?.live;
  const twitchStartedAt = twitchData?.started_at;
  const kickStartedAt = kickData?.started_at;

  function getLiveSince(isoString: string) {
    const start = new Date(isoString).getTime();
    const now = Date.now();

    const diffMs = now - start;

    if (diffMs <= 0) return "just now";

    const totalMinutes = Math.floor(diffMs / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }

    return `${minutes}m`;
  }

  function formatLiveDate(isoString: string) {
    const date = new Date(isoString);

    return date.toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }

  const gradientClass = (() => {
    if (isTwitchLive && isKickLive) {
      return "bg-[linear-gradient(90deg,#a855f7_0%,#a855f7_50%,#22c55e_50%,#22c55e_100%)]";
    }
    if (isTwitchLive) {
      return "bg-[#a855f7]";
    }
    if (isKickLive) {
      return "bg-[#22c55e]";
    }
    return "";
  })();

  const isBothLive = isKickLive && isTwitchLive;

  return (
    <div className="relative w-[360px] rounded-2xl p-[2px]">
      {isTwitchLive && (
        <span
          className={`absolute -inset-[10px] rounded-2xl blur-[22px] opacity-[0.35] ${
            isKickLive ? "right-1/2" : "inset-0"
          } bg-purple-500`}
        />
      )}

      {isKickLive && (
        <span
          className={`absolute -inset-[10px] rounded-2xl blur-[22px] opacity-[0.35] ${
            isTwitchLive ? "left-1/2" : "inset-0"
          } bg-green-500 `}
        />
      )}

      <div className={`relative z-10 rounded-2xl p-[2px] ${gradientClass}`}>
        <div className="rounded-2xl bg-black/90 backdrop-blur-xl p-5">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {isTwitchLive && (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600">
                  <SiTwitch className="text-white text-sm" />
                </div>
              )}
              {isKickLive && (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500">
                  <FaKickstarterK className="text-black text-sm" />
                </div>
              )}
            </div>

            <div>
              <p className="text-sm font-semibold text-white">
                {isTwitchLive && isKickLive
                  ? "TWITCH • KICK • LIVE"
                  : isTwitchLive
                  ? "TWITCH • LIVE"
                  : "KICK • LIVE"}
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-2 text-sm">
            {isTwitchLive && twitchStartedAt && (
              <div className="flex items-center gap-2 text-purple-400">
                <SiTwitch className="h-6 w-6" />
                <div className="flex flex-col">
                  <div className="flex gap-2">
                    {isTwitchLive && isBothLive && (
                      <div className="flex gap-2 justify-center items-start">
                        <p>
                          <b>Twitch</b>
                        </p>
                      </div>
                    )}{" "}
                    <p className="text-white">
                      Live since: <span>{getLiveSince(twitchStartedAt)}</span>
                    </p>
                  </div>
                  <p className="text-white">
                    Started at: <span>{formatLiveDate(twitchStartedAt)}</span>
                  </p>
                </div>
              </div>
            )}

            {isKickLive && kickStartedAt && (
              <div className="flex items-center gap-2 text-green-400">
                <FaKickstarterK className="h-6 w-6" />
                <div className="flex flex-col">
                  <div className="flex gap-2">
                    {isKickLive && (
                      <div className="flex gap-2 justify-center items-start">
                        <p>
                          <b>Kick</b>
                        </p>
                      </div>
                    )}{" "}
                    <p className="text-white">
                      Live since: <span>{getLiveSince(kickStartedAt)}</span>
                    </p>
                  </div>
                  <p className="text-white">
                    Started at: <span>{formatLiveDate(kickStartedAt)}</span>
                  </p>
                </div>
              </div>
            )}
          </div>
          {/* CTA buttons */}
          <div className="mt-6 flex gap-3">
            {isTwitchLive && (
              <a
                href={twitchData?.twitch_stream_url!}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 rounded-full bg-purple-600/90 px-4 py-2
              text-center text-xs font-semibold text-white
              hover:bg-purple-600 transition"
              >
                WATCH ON TWITCH
              </a>
            )}

            {isKickLive && (
              <a
                href={kickData?.kick_stream_url!}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 rounded-full bg-green-500 px-4 py-2
              text-center text-xs font-semibold text-black
              hover:bg-green-400 transition"
              >
                WATCH ON KICK
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
