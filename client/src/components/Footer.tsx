import { useState } from "react";
import {
  Zap,
  Github,
  Twitter,
  Linkedin,
  CheckCircle,
  Loader2,
  Mail,
} from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [isPending, setIsPending] = useState(false);

  // --- Mock Newsletter Submit (Simulates API Call) ---
  const mockNewsletterSubmit = async (email: string) => {
    setIsPending(true);
    return new Promise<{ message: string }>((resolve, reject) => {
      setTimeout(() => {
        // Mock: Random success / failure
        const isSuccess = Math.random() > 0.2; // 80% success
        if (isSuccess) resolve({ message: "Successfully subscribed!" });
        else reject(new Error("Mock failure"));
      }, 1200);
    })
      .then((data) => {
        setSuccess(true);
        setMessage(data.message);
        setEmail("");
        setTimeout(() => {
          setSuccess(false);
          setMessage("");
        }, 4000);
      })
      .catch(() => {
        setMessage("Failed to subscribe. Please try again.");
        setTimeout(() => setMessage(""), 3000);
      })
      .finally(() => {
        setIsPending(false);
      });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      mockNewsletterSubmit(email);
    }
  };

  return (
    <footer className="relative border-t border-white/5 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.18),_transparent_55%),_linear-gradient(to_bottom,_#020617,_#020617)] pt-16 pb-10 mt-8">
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      <div className="absolute inset-x-0 -bottom-40 h-80 bg-[radial-gradient(circle_at_center,_rgba(15,23,42,0.9),_transparent_70%)] opacity-80" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5 flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 rounded-xl bg-primary/70 blur-md" />
                <div className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-slate-900 text-white">
                  <Zap className="h-4 w-4" />
                </div>
              </div>
              <div className="leading-tight">
                <p className="font-display text-lg font-semibold tracking-tight text-foreground">
                  Novarel<span className="text-primary">Studio</span>
                </p>
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  Stream-to-clip autopilot
                </p>
              </div>
            </div>

            <p className="max-w-sm text-sm text-muted-foreground/90">
              Stream-to-clip automation for Twitch and Kick creators.
            </p>
             <a
              href="mailto:hello@novarelstudio.com"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
              <Mail className="h-4 w-4" />
              hello@novarelstudio.com
              </a>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-[11px] font-medium text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Early access open
            </span>

            <div className="flex gap-3 mt-1">
              <SocialLink icon={Twitter} href="#" label="Twitter" />
              <SocialLink icon={Github} href="#" label="GitHub" />
              <SocialLink icon={Linkedin} href="#" label="LinkedIn" />
            </div>
          </div>

          <div className="md:col-span-3 flex flex-col gap-4 text-sm">
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Product
            </h4>
            <nav className="flex flex-col gap-2.5 text-muted-foreground/90">
              <FooterLink href="/#features">Features</FooterLink>
              <FooterLink href="/how-it-works">How it works</FooterLink>
              <FooterLink href="/pricing">Pricing</FooterLink>
              <FooterLink href="/showcase">Showcase</FooterLink>
              <FooterLink href="/privacy">Privacy Policy</FooterLink>
              <FooterLink href="/terms">Terms of Service</FooterLink>
            </nav>
          </div>

          <div className="md:col-span-4 flex flex-col gap-4 text-sm">
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Get updates
            </h4>

            {success ? (
              <div className="flex items-center gap-2 text-emerald-300 text-sm py-2">
                <CheckCircle className="h-4 w-4" />
                <span>{message}</span>
              </div>
            ) : (
              <form
                className="flex flex-col sm:flex-row gap-3"
                onSubmit={handleSubmit}
              >
                <input
                  type="email"
                  placeholder="you@yourchannel.gg"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 min-w-0 rounded-full border border-white/15 bg-black/40 px-4 py-2.5 text-sm text-foreground placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
                <button
                  type="submit"
                  disabled={isPending}
                  className="rounded-full bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-black shadow-[0_10px_40px_rgba(15,23,42,0.9)] hover:bg-slate-100 flex-shrink-0 whitespace-nowrap disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Get updates"
                  )}
                </button>
              </form>
            )}

            {message && !success && (
              <p className="text-xs text-red-400">{message}</p>
            )}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-5 text-[11px] sm:text-xs text-muted-foreground/80 md:flex-row md:items-center md:justify-center">
          <p>
            © {new Date().getFullYear()} NovarelStudio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({
  children,
  href,
  target,
}: {
  children: React.ReactNode;
  href: string;
  target?: string;
}) {
  return (
    <a
      href={href}
      target={target}
      rel={target === "_blank" ? "noreferrer" : undefined}
      className="relative inline-flex items-center text-muted-foreground/90 hover:text-foreground transition-colors"
    >
      <span>{children}</span>
    </a>
  );
}

function SocialLink({
  icon: Icon,
  href,
  label,
}: {
  icon: any;
  href: string;
  label: string;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/40 text-muted-foreground hover:text-foreground hover:border-white/40 hover:bg-white/5 transition-colors"
    >
      <Icon className="h-4 w-4" />
    </a>
  );
}
