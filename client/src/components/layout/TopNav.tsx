import { useState, useEffect } from "react";
import { Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "wouter";

export function TopNav() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        isScrolled
          ? "border-b border-white/10 bg-[color-mix(in_srgb,#020617_80%,transparent_20%)] backdrop-blur-xl"
          : "border-b border-transparent bg-gradient-to-b from-black/70 via-black/20 to-transparent backdrop-blur-sm",
      )}
    >
      <div className="mx-auto flex h-16 sm:h-18 max-w-7xl items-center justify-between px-4 md:px-8 lg:px-12">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="relative">
            <div className="absolute inset-0 rounded-xl bg-primary/60 blur-md" />
            <div className="relative flex h-8 w-8 items-center justify-center rounded-xl border border-white/20 bg-slate-950 text-white">
              <Zap className="h-4 w-4" />
            </div>
          </div>
          <div className="leading-tight">
            <p className="font-display text-sm font-semibold tracking-tight text-foreground">
              Novarel<span className="text-primary">Studio</span>
            </p>
            <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Stream-to-clip autopilot</p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-muted-foreground/90">
          {["Features", "How it works", "Pricing", "Showcase"].map((item) => {
            const href = 
              item === "Features" ? "/#features" :
              item === "How it works" ? "/how-it-works" :
              item === "Pricing" ? "/pricing" :
              item === "Showcase" ? "/showcase" : "#";
            
            return (
              <a
                key={item}
                href={href}
                className="relative inline-flex items-center gap-1 py-1 transition-colors hover:text-foreground"
              >
                <span>{item}</span>
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="ghost"
            className="hidden sm:inline-flex h-8 rounded-full border border-transparent px-3 text-xs font-medium text-muted-foreground hover:border-white/15 hover:bg-white/5 hover:text-foreground"
          >
            Log in
          </Button>
          <Button className="h-9 sm:h-10 rounded-full bg-white px-3.5 sm:px-4 text-xs sm:text-sm font-semibold text-black shadow-[0_12px_40px_rgba(15,23,42,0.9)] hover:bg-slate-100">
            Get started
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
