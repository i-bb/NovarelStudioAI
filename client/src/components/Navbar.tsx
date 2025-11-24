import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, Zap } from "lucide-react";
import { Link } from "wouter";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-background/95 border-b border-primary/20 shadow-lg shadow-primary/5">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover-elevate active-elevate-2 px-2 group" data-testid="link-logo">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl group-hover:blur-2xl transition-all" />
              <Zap className="w-8 h-8 text-primary relative z-10" fill="currentColor" />
            </div>
            <span className="text-2xl font-display text-primary">NovarelStudio</span>
            <Badge variant="secondary" className="bg-accent/20 text-accent-foreground border-accent/30 text-xs">LIVE</Badge>
          </Link>
          
          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm font-semibold text-foreground/70 hover:text-primary hover-elevate active-elevate-2 px-3 py-2 rounded-lg transition-all" data-testid="link-features">
              Features
            </a>
            <a href="#how-it-works" className="text-sm font-semibold text-foreground/70 hover:text-primary hover-elevate active-elevate-2 px-3 py-2 rounded-lg transition-all" data-testid="link-how-it-works">
              How It Works
            </a>
            <Link href="/pricing" className="text-sm font-semibold text-foreground/70 hover:text-primary hover-elevate active-elevate-2 px-3 py-2 rounded-lg transition-all" data-testid="link-pricing">
              Pricing
            </Link>
            <a href="#dashboard" className="text-sm font-semibold text-foreground/70 hover:text-primary hover-elevate active-elevate-2 px-3 py-2 rounded-lg transition-all" data-testid="link-dashboard">
              Dashboard
            </a>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="hidden md:inline-flex font-semibold" data-testid="button-sign-in">
              Sign In
            </Button>
            <Button className="rounded-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 font-semibold shadow-lg shadow-primary/30" data-testid="button-start-free">
              Start Free
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden" data-testid="button-menu">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
