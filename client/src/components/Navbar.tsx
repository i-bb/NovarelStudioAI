import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Link } from "wouter";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-background/80 border-b border-border">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/">
            <a className="text-2xl font-cursive text-primary hover-elevate active-elevate-2 px-2" data-testid="link-logo">
              NovarelStudio
            </a>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features">
              <a className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors" data-testid="link-features">
                Features
              </a>
            </Link>
            <Link href="#how-it-works">
              <a className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors" data-testid="link-how-it-works">
                How It Works
              </a>
            </Link>
            <Link href="#pricing">
              <a className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors" data-testid="link-pricing">
                Pricing
              </a>
            </Link>
            <Link href="#dashboard">
              <a className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors" data-testid="link-dashboard">
                Dashboard
              </a>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="hidden md:inline-flex" data-testid="button-sign-in">
              Sign In
            </Button>
            <Button className="rounded-full" data-testid="button-start-free">
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
