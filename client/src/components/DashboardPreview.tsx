import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { LayoutDashboard, BarChart3, Settings, Scissors, Upload, Play } from "lucide-react";

export default function DashboardPreview() {
  const [activeTab, setActiveTab] = useState("projects");

  return (
    <section id="dashboard" className="relative">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="relative max-w-7xl mx-auto">
        <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-foreground mb-3">
              Your channel&apos;s control room
            </h2>
            <p className="max-w-xl text-sm sm:text-base text-muted-foreground/90">
              One place to see what streams ran, what clips were generated and what actually moved your follower and view curves.
            </p>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground/80 max-w-xs">
            The goal isn&apos;t more data—it&apos;s a simple read on whether last night&apos;s stream made progress for the channel.
          </p>
        </div>

        <div className="relative group">
          <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_top,_rgba(79,70,229,0.4),_transparent_60%)] blur-3xl" />
          <Card className="relative overflow-hidden rounded-3xl border border-white/12 bg-black/75 backdrop-blur-2xl shadow-[0_24px_80px_rgba(15,23,42,0.95)]" data-testid="card-dashboard-preview">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="border-b border-white/10 bg-black/60">
                <div className="px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
                  <p className="hidden sm:inline-flex text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                    Tonight&apos;s stream — overview
                  </p>
                  <TabsList className="grid grid-cols-4 w-full max-w-xl bg-black/60 border border-white/10" data-testid="tabs-dashboard">
                    <TabsTrigger
                      value="projects"
                      className="gap-1.5 data-[state=active]:bg-white data-[state=active]:text-black text-[11px] font-medium"
                      data-testid="tab-projects"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5" />
                      Streams
                    </TabsTrigger>
                    <TabsTrigger
                      value="analytics"
                      className="gap-1.5 data-[state=active]:bg-white data-[state=active]:text-black text-[11px] font-medium"
                      data-testid="tab-analytics"
                    >
                      <BarChart3 className="w-3.5 h-3.5" />
                      Impact
                    </TabsTrigger>
                    <TabsTrigger
                      value="ai-clipping"
                      className="gap-1.5 data-[state=active]:bg-white data-[state=active]:text-black text-[11px] font-medium"
                      data-testid="tab-ai-clipping"
                    >
                      <Scissors className="w-3.5 h-3.5" />
                      Clipping
                    </TabsTrigger>
                    <TabsTrigger
                      value="settings"
                      className="gap-1.5 data-[state=active]:bg-white data-[state=active]:text-black text-[11px] font-medium"
                      data-testid="tab-settings"
                    >
                      <Settings className="w-3.5 h-3.5" />
                      Rules
                    </TabsTrigger>
                  </TabsList>
                </div>
              </div>

              <TabsContent value="projects" className="px-4 sm:px-6 py-5 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-2">
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-foreground">Recent streams</h3>
                    <p className="text-[11px] text-muted-foreground">Each card is one stream run through NovarelStudio.</p>
                  </div>
                  <Button
                    size="sm"
                    className="gap-2 rounded-full bg-white text-black hover:bg-slate-100 text-xs font-semibold shadow-[0_12px_40px_rgba(15,23,42,0.9)]"
                    data-testid="button-upload-video"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Upload VOD
                  </Button>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="relative group/card">
                      <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.35),_transparent_65%)] opacity-0 group-hover/card:opacity-100 transition-opacity" />
                      <Card
                        className="relative border border-white/12 bg-slate-950/90 p-4 rounded-2xl cursor-pointer"
                        data-testid={`card-project-${i}`}
                      >
                        <div className="relative mb-3 overflow-hidden rounded-xl bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.25),_transparent_60%)]">
                          <div className="aspect-video w-full bg-[radial-gradient(circle_at_center,_rgba(15,23,42,0.85),_transparent_70%)]" />
                          <Play className="absolute inset-0 m-auto h-6 w-6 text-slate-100" />
                          <Badge className="absolute top-2 left-2 bg-black/80 text-[10px] font-semibold uppercase tracking-[0.18em] border border-white/20">
                            Stream {i}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-medium text-foreground">Highlights run</p>
                            <Badge
                              className="bg-emerald-400/10 text-emerald-300 border border-emerald-400/40 text-[10px] font-semibold"
                              data-testid={`badge-status-${i}`}
                            >
                              {i === 3 ? "Published" : "Processing"}
                            </Badge>
                          </div>
                          <Progress value={i === 3 ? 100 : 40 + i * 15} className="h-1.5" />
                          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                            <span>24 clips generated</span>
                            <span className="text-emerald-300 font-medium">+{i * 240} followers est.</span>
                          </div>
                        </div>
                      </Card>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="px-4 sm:px-6 py-5">
                <div className="grid gap-4 md:grid-cols-4">
                  <MetricCard
                    label="Views from clips (28d)"
                    value="5.2M"
                    delta="+24% vs baseline"
                    testId="text-total-views"
                  />
                  <MetricCard
                    label="Clips published"
                    value="1,248"
                    delta="+18% this week"
                    testId="text-clips-published"
                  />
                  <MetricCard
                    label="Avg watch-through"
                    value="8.4%"
                    delta="+12% this week"
                    testId="text-avg-engagement"
                  />
                  <MetricCard
                    label="Avg processing time"
                    value="2.3m"
                    note="per clip"
                    testId="text-processing-time"
                  />
                </div>
              </TabsContent>

              <TabsContent value="ai-clipping" className="px-4 sm:px-6 py-10">
                <div className="mx-auto max-w-md text-center">
                  <Scissors className="mx-auto mb-4 h-10 w-10 text-primary" />
                  <h3 className="mb-2 text-base sm:text-lg font-semibold text-foreground">AI clipping engine</h3>
                  <p className="mb-5 text-xs sm:text-sm text-muted-foreground/90">
                    Drag in a VOD or let us ingest your next live session automatically. Everything else—from detection to captioning—runs hands-off.
                  </p>
                  <Button size="sm" className="rounded-full px-5 text-xs font-semibold" data-testid="button-start-clipping">
                    Start a manual run
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="px-4 sm:px-6 py-5">
                <div className="max-w-xl space-y-4">
                  <h3 className="text-sm sm:text-base font-semibold text-foreground mb-1">Posting rules</h3>
                  <p className="text-[11px] text-muted-foreground">
                    Set once, then let NovarelStudio obey those rules on every stream.
                  </p>
                  <div className="space-y-3">
                    <RuleRow label="Instagram Reels" value="On • 3 clips per stream" testId="badge-instagram-status" />
                    <RuleRow label="TikTok" value="Off • in beta" testId="badge-tiktok-status" />
                    <RuleRow label="YouTube Shorts" value="Off • queued" testId="badge-youtube-status" />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </section>
  );
}

function MetricCard({
  label,
  value,
  delta,
  note,
  testId,
}: {
  label: string;
  value: string;
  delta?: string;
  note?: string;
  testId: string;
}) {
  return (
    <div className="relative group">
      <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_top,_rgba(79,70,229,0.35),_transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity" />
      <Card className="relative rounded-2xl border border-white/12 bg-slate-950/90 p-4">
        <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
        <p className="text-xl sm:text-2xl font-semibold text-foreground" data-testid={testId}>
          {value}
        </p>
        {delta && <p className="mt-1 text-[11px] text-emerald-300">{delta}</p>}
        {note && !delta && <p className="mt-1 text-[11px] text-muted-foreground/80">{note}</p>}
      </Card>
    </div>
  );
}

function RuleRow({ label, value, testId }: { label: string; value: string; testId: string }) {
  return (
    <Card className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/60 px-4 py-3">
      <span className="text-xs sm:text-sm text-foreground">{label}</span>
      <Badge
        variant="secondary"
        className="rounded-full bg-white/5 px-3 py-1 text-[11px] font-medium text-muted-foreground border-white/20"
        data-testid={testId}
      >
        {value}
      </Badge>
    </Card>
  );
}
