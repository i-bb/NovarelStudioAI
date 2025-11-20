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
    <section id="dashboard" className="py-20 px-6 bg-gradient-to-b from-primary/5 to-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-cursive text-4xl md:text-5xl text-foreground mb-4">
            Your Command Center
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Monitor, manage, and optimize your content production from one powerful dashboard
          </p>
        </div>

        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-accent/30 rounded-2xl blur-2xl" />
          <Card className="relative overflow-hidden bg-card/80 backdrop-blur-xl border-2 border-primary/20 shadow-2xl" data-testid="card-dashboard-preview">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="border-b border-primary/20 bg-gradient-to-r from-card/90 to-card/70 backdrop-blur">
                <div className="px-6 py-4">
                  <TabsList className="grid grid-cols-4 w-full max-w-2xl bg-card/50 border border-primary/20" data-testid="tabs-dashboard">
                    <TabsTrigger value="projects" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-semibold" data-testid="tab-projects">
                      <LayoutDashboard className="w-4 h-4" />
                      Projects
                    </TabsTrigger>
                    <TabsTrigger value="analytics" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-semibold" data-testid="tab-analytics">
                      <BarChart3 className="w-4 h-4" />
                      Analytics
                    </TabsTrigger>
                    <TabsTrigger value="ai-clipping" className="gap-2 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground font-semibold" data-testid="tab-ai-clipping">
                      <Scissors className="w-4 h-4" />
                      AI Clipping
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-semibold" data-testid="tab-settings">
                      <Settings className="w-4 h-4" />
                      Settings
                    </TabsTrigger>
                  </TabsList>
                </div>
              </div>

            <TabsContent value="projects" className="p-6 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Recent Projects</h3>
                <Button size="sm" className="gap-2 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 font-semibold shadow-lg shadow-primary/30" data-testid="button-upload-video">
                  <Upload className="w-4 h-4" />
                  Upload Video
                </Button>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Card className="relative p-4 hover-elevate active-elevate-2 cursor-pointer border-2 border-primary/20" data-testid={`card-project-${i}`}>
                      <div className="relative aspect-video bg-gradient-to-br from-primary/30 to-accent/30 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 animate-pulse" />
                        <Play className="relative w-12 h-12 text-primary z-10 drop-shadow-lg" fill="currentColor" />
                        <Badge className="absolute top-2 left-2 bg-red-600 text-white border-0 font-bold">
                          <span className="w-2 h-2 bg-white rounded-full animate-pulse mr-1" />
                          LIVE
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-sm">Stream Highlights {i}</h4>
                          <Badge className="bg-accent/20 text-accent border-accent/40 font-bold" data-testid={`badge-status-${i}`}>
                            Processing
                          </Badge>
                        </div>
                        <Progress value={33 * i} className="h-2" />
                        <div className="flex items-center justify-between text-xs">
                          <p className="text-muted-foreground font-medium">24 clips generated</p>
                          <p className="text-primary font-bold">+{i * 250} XP</p>
                        </div>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="p-6">
              <div className="grid md:grid-cols-4 gap-4">
                <div className="relative group">
                  <div className="absolute inset-0 bg-primary/20 rounded-xl blur-lg group-hover:blur-xl transition-all" />
                  <Card className="relative p-4 border-2 border-primary/30 bg-gradient-to-br from-primary/10 to-transparent">
                    <div className="text-xs text-muted-foreground mb-1 font-semibold uppercase tracking-wider">Total Views</div>
                    <div className="text-2xl font-bold text-primary font-cursive" data-testid="text-total-views">5.2M</div>
                    <div className="flex items-center gap-1 text-xs text-green-500 mt-1 font-bold">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      +24% this week
                    </div>
                  </Card>
                </div>
                <div className="relative group">
                  <div className="absolute inset-0 bg-accent/20 rounded-xl blur-lg group-hover:blur-xl transition-all" />
                  <Card className="relative p-4 border-2 border-accent/30 bg-gradient-to-br from-accent/10 to-transparent">
                    <div className="text-xs text-muted-foreground mb-1 font-semibold uppercase tracking-wider">Clips Published</div>
                    <div className="text-2xl font-bold text-accent font-cursive" data-testid="text-clips-published">1,248</div>
                    <div className="flex items-center gap-1 text-xs text-green-500 mt-1 font-bold">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      +18% this week
                    </div>
                  </Card>
                </div>
                <div className="relative group">
                  <div className="absolute inset-0 bg-primary/20 rounded-xl blur-lg group-hover:blur-xl transition-all" />
                  <Card className="relative p-4 border-2 border-primary/30 bg-gradient-to-br from-primary/10 to-transparent">
                    <div className="text-xs text-muted-foreground mb-1 font-semibold uppercase tracking-wider">Avg Engagement</div>
                    <div className="text-2xl font-bold text-primary font-cursive" data-testid="text-avg-engagement">8.4%</div>
                    <div className="flex items-center gap-1 text-xs text-green-500 mt-1 font-bold">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      +12% this week
                    </div>
                  </Card>
                </div>
                <div className="relative group">
                  <div className="absolute inset-0 bg-accent/20 rounded-xl blur-lg group-hover:blur-xl transition-all" />
                  <Card className="relative p-4 border-2 border-accent/30 bg-gradient-to-br from-accent/10 to-transparent">
                    <div className="text-xs text-muted-foreground mb-1 font-semibold uppercase tracking-wider">Processing Time</div>
                    <div className="text-2xl font-bold text-accent font-cursive" data-testid="text-processing-time">2.3m</div>
                    <div className="text-xs text-muted-foreground mt-1 font-medium">per clip</div>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="ai-clipping" className="p-6">
              <div className="text-center py-12">
                <Scissors className="w-16 h-16 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">AI Clipping Engine</h3>
                <p className="text-muted-foreground mb-6">Upload a video to start generating viral clips</p>
                <Button size="lg" data-testid="button-start-clipping">Start Clipping</Button>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="p-6">
              <div className="max-w-2xl space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Platform Connections</h3>
                  <div className="space-y-3">
                    <Card className="p-4 flex items-center justify-between">
                      <span className="font-medium">TikTok</span>
                      <Badge variant="secondary" data-testid="badge-tiktok-status">Connected</Badge>
                    </Card>
                    <Card className="p-4 flex items-center justify-between">
                      <span className="font-medium">YouTube Shorts</span>
                      <Badge variant="secondary" data-testid="badge-youtube-status">Connected</Badge>
                    </Card>
                    <Card className="p-4 flex items-center justify-between">
                      <span className="font-medium">Instagram Reels</span>
                      <Button size="sm" variant="outline" data-testid="button-connect-instagram">Connect</Button>
                    </Card>
                  </div>
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
