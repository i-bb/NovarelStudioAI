import React from "react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "@/components/ui/badge";

const PlatformStatCard = ({
  platform,
  icon: Icon,
  count,
  comingSoon = false,
  color,
}: any) => {
  return (
    <>
      <Card
        className={`cursor-default relative overflow-hidden border-2 transition-all ${
          comingSoon
            ? "border-white/10 bg-black/40"
            : `border-[${color}]/30 bg-[${color}]/5`
        }`}
      >
        {comingSoon && (
          <Badge className="cursor-default absolute top-1 right-1 lg:top-3 lg:right-3 bg-amber-500/20 text-amber-400 border-amber-500/30 text-[9px] lg:text-[10px]">
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
    </>
  );
};

export default PlatformStatCard;
