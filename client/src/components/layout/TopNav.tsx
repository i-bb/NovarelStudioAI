import { useState, useEffect, useRef } from "react";
import { Zap, ArrowRight, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "wouter";

export function TopNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = ["Features", "How it works", "Pricing", "Showcase"];

  const getHref = (item: string) => {
    switch (item) {
      case "Features":
        return "/#features";
      case "How it works":
        return "/how-it-works";
      case "Pricing":
        return "/pricing";
      case "Showcase":
        return "/showcase";
      default:
        return "#";
    }
  };

  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileMenuOpen]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        isScrolled || isMobileMenuOpen
          ? "border-b border-white/10 bg-[rgba(2,6,23,0.96)]"
          : "border-b border-transparent bg-gradient-to-b from-black/70 via-black/20 to-transparent"
      )}
    >
      <div className="mx-auto flex h-16 sm:h-18 max-w-7xl items-center justify-between px-4 md:px-8 lg:px-12">
        {/* Logo */}
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
            <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Stream-to-clip autopilot
            </p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-muted-foreground/90">
          {navItems.map((item) => (
            <a
              key={item}
              href={getHref(item)}
              className="relative inline-flex items-center gap-1 py-1 transition-colors hover:text-foreground"
            >
              {item}
            </a>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="ghost"
            className="hidden sm:block h-8 rounded-full border border-transparent px-3 text-xs font-medium text-muted-foreground hover:border-white/15 hover:bg-white/5 hover:text-foreground"
            asChild
          >
            <Link href="/login">Log in</Link>
          </Button>

          <Button
            className="h-9 sm:h-10 rounded-full bg-white px-3.5 sm:px-4 text-xs sm:text-sm font-semibold text-black shadow-[0_12px_40px_rgba(15,23,42,0.9)] hover:bg-slate-100"
            asChild
          >
            <Link href="/signup">
              Get Started
              {/* <ArrowRight className="ml-1.5 h-3.5 w-3.5" /> */}
            </Link>
          </Button>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden ml-1 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-muted-foreground hover:bg-white/5 hover:text-foreground"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        ref={mobileMenuRef}
        className={cn(
          "fixed inset-x-0 top-16 z-40 transition-all duration-300 ease-out md:hidden",
          isMobileMenuOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-2 pointer-events-none"
        )}
      >
        <nav className="flex flex-col gap-1 border-t border-white/10 bg-[color-mix(in_srgb,#020617_90%,transparent_10%)] px-4 py-4 backdrop-blur-xl">
          {navItems.map((item) => (
            <a
              key={item}
              href={getHref(item)}
              onClick={() => setIsMobileMenuOpen(false)}
              className="rounded-md px-2 py-2 text-sm font-medium text-muted-foreground transition hover:bg-white/5 hover:text-foreground"
            >
              {item}
            </a>
          ))}
          <a
            href="/login"
            className="rounded-md px-2 py-2 text-sm font-medium text-muted-foreground transition hover:bg-white/5 hover:text-foreground"
          >
            Log in
          </a>
        </nav>
      </div>
    </header>
  );
}
