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
    <section className="py-20 px-6 bg-gradient-to-b from-primary/5 to-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-cursive text-4xl md:text-5xl text-foreground mb-4">
            Your Command Center
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Monitor, manage, and optimize your content production from one powerful dashboard
          </p>
        </div>

        <Card className="overflow-hidden bg-card/50 backdrop-blur" data-testid="card-dashboard-preview">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="border-b border-border bg-card/80">
              <div className="px-6 py-4">
                <TabsList className="grid grid-cols-4 w-full max-w-2xl" data-testid="tabs-dashboard">
                  <TabsTrigger value="projects" className="gap-2" data-testid="tab-projects">
                    <LayoutDashboard className="w-4 h-4" />
                    Projects
                  </TabsTrigger>
                  <TabsTrigger value="analytics" className="gap-2" data-testid="tab-analytics">
                    <BarChart3 className="w-4 h-4" />
                    Analytics
                  </TabsTrigger>
                  <TabsTrigger value="ai-clipping" className="gap-2" data-testid="tab-ai-clipping">
                    <Scissors className="w-4 h-4" />
                    AI Clipping
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="gap-2" data-testid="tab-settings">
                    <Settings className="w-4 h-4" />
                    Settings
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>

            <TabsContent value="projects" className="p-6 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Recent Projects</h3>
                <Button size="sm" className="gap-2" data-testid="button-upload-video">
                  <Upload className="w-4 h-4" />
                  Upload Video
                </Button>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="p-4 hover-elevate active-elevate-2 cursor-pointer" data-testid={`card-project-${i}`}>
                    <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg mb-3 flex items-center justify-center">
                      <Play className="w-12 h-12 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">Stream Highlights {i}</h4>
                        <Badge variant="secondary" data-testid={`badge-status-${i}`}>Processing</Badge>
                      </div>
                      <Progress value={33 * i} className="h-1" />
                      <p className="text-xs text-muted-foreground">24 clips generated</p>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="p-6">
              <div className="grid md:grid-cols-4 gap-4">
                <Card className="p-4">
                  <div className="text-sm text-muted-foreground mb-1">Total Views</div>
                  <div className="text-2xl font-bold text-foreground" data-testid="text-total-views">5.2M</div>
                  <div className="text-xs text-green-600 mt-1">+24% this week</div>
                </Card>
                <Card className="p-4">
                  <div className="text-sm text-muted-foreground mb-1">Clips Published</div>
                  <div className="text-2xl font-bold text-foreground" data-testid="text-clips-published">1,248</div>
                  <div className="text-xs text-green-600 mt-1">+18% this week</div>
                </Card>
                <Card className="p-4">
                  <div className="text-sm text-muted-foreground mb-1">Avg Engagement</div>
                  <div className="text-2xl font-bold text-foreground" data-testid="text-avg-engagement">8.4%</div>
                  <div className="text-xs text-green-600 mt-1">+12% this week</div>
                </Card>
                <Card className="p-4">
                  <div className="text-sm text-muted-foreground mb-1">Processing Time</div>
                  <div className="text-2xl font-bold text-foreground" data-testid="text-processing-time">2.3m</div>
                  <div className="text-xs text-muted-foreground mt-1">per clip</div>
                </Card>
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
    </section>
  );
}
