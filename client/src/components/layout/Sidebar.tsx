import { Home, Compass, Radio, Users, Heart, Trophy, Video, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "wouter";

export function Sidebar() {
  return (
    <div className="w-64 h-[calc(100vh-3.5rem)] bg-sidebar border-r border-sidebar-border flex flex-col sticky top-14 hidden lg:flex">
      <ScrollArea className="flex-1 py-4">
        <div className="px-3 mb-6">
          <h3 className="font-display font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-2 px-2">
            For You
          </h3>
          <div className="space-y-1">
            <SidebarItem icon={Home} label="Home" isActive />
            <SidebarItem icon={Compass} label="Discover" />
            <SidebarItem icon={Radio} label="Live Clips" />
          </div>
        </div>

        <div className="px-3 mb-6">
          <h3 className="font-display font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-2 px-2">
            Your Tools
          </h3>
          <div className="space-y-1">
            <SidebarChannel 
              name="AutoClipper" 
              category="AI Tool" 
              status="online" 
              viewers="2.4k" 
              image="https://api.dicebear.com/7.x/bottts/svg?seed=autoclip"
            />
            <SidebarChannel 
              name="ViralShorts" 
              category="Processing" 
              status="away" 
              viewers="856"
              image="https://api.dicebear.com/7.x/bottts/svg?seed=viral"
            />
            <SidebarChannel 
              name="AnalyticsBot" 
              category="Data" 
              status="offline" 
              viewers=""
              image="https://api.dicebear.com/7.x/bottts/svg?seed=data"
            />
          </div>
        </div>

        <div className="px-3">
          <h3 className="font-display font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-2 px-2">
            Recommended
          </h3>
          <div className="space-y-1">
             <SidebarChannel 
              name="NinjaEditor" 
              category="Editing" 
              status="online" 
              viewers="12k"
              image="https://api.dicebear.com/7.x/avataaars/svg?seed=ninja"
            />
             <SidebarChannel 
              name="StreamQueen" 
              category="Just Chatting" 
              status="online" 
              viewers="8.1k"
              image="https://api.dicebear.com/7.x/avataaars/svg?seed=queen"
            />
          </div>
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t border-sidebar-border bg-sidebar">
         <div className="rounded-lg bg-sidebar-accent/50 p-3">
            <p className="text-xs font-medium text-primary mb-1">NovarelStudio Pro</p>
            <p className="text-[10px] text-muted-foreground mb-2">Unlock 4k clipping & more.</p>
            <Link href="/pricing">
              <Button size="sm" className="w-full h-7 text-xs font-bold bg-primary text-white hover:bg-primary/90">
                Upgrade
              </Button>
            </Link>
         </div>
      </div>
    </div>
  );
}

function SidebarItem({ icon: Icon, label, isActive }: { icon: any, label: string, isActive?: boolean }) {
  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start h-9 px-2 font-medium text-sm",
        isActive ? "bg-sidebar-accent text-sidebar-primary" : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
      )}
    >
      <Icon className="mr-2 h-4 w-4" />
      {label}
    </Button>
  );
}

function SidebarChannel({ name, category, status, viewers, image }: { name: string, category: string, status: 'online' | 'offline' | 'away', viewers?: string, image: string }) {
  return (
    <div className="flex items-center justify-between p-2 rounded-md hover:bg-sidebar-accent cursor-pointer group">
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="relative">
          <Avatar className="h-8 w-8 border-2 border-background group-hover:border-sidebar-accent">
            <AvatarImage src={image} />
            <AvatarFallback>{name[0]}</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col truncate">
          <span className="text-sm font-semibold text-sidebar-foreground truncate leading-none mb-1">{name}</span>
          <span className="text-[11px] text-muted-foreground truncate leading-none">{category}</span>
        </div>
      </div>
      {status === 'online' && (
        <div className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-red-500"></span>
            <span className="text-xs font-medium text-sidebar-foreground">{viewers}</span>
        </div>
      )}
      {status === 'away' && (
         <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
      )}
    </div>
  )
}
