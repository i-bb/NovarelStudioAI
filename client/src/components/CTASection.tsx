import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ArrowRight, CheckCircle } from "lucide-react";

export default function CTASection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // wire up to backend later
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section className="relative py-16">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <div className="relative max-w-4xl mx-auto px-3 sm:px-4 md:px-0">
        <Card className="relative overflow-hidden rounded-3xl border border-white/15 bg-[radial-gradient(circle_at_top,_rgba(79,70,229,0.45),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(16,185,129,0.25),_transparent_55%),_#020617] px-6 py-8 sm:px-10 sm:py-10 text-center">
          <div className="mx-auto max-w-2xl">
            <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-foreground mb-3">
              Put your next stream on autopilot
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground/90 mb-6">
              Drop in your email and we&apos;ll send you a link to spin up NovarelStudio before you go live tonight. No credit card, no contracts—just see if the clips are worth it.
            </p>

            {!submitted ? (
              <form
                onSubmit={handleSubmit}
                className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row"
              >
                <Input
                  type="email"
                  placeholder="you@yourchannel.gg"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="rounded-full border-white/20 bg-black/60 px-4 text-sm min-w-0"
                  data-testid="input-email-waitlist"
                />
                <Button
                  type="submit"
                  size="sm"
                  className="rounded-full px-4 sm:px-6 text-xs sm:text-sm font-semibold bg-white text-black hover:bg-slate-100 shadow-[0_16px_60px_rgba(15,23,42,0.95)] group flex-shrink-0"
                  data-testid="button-join-waitlist"
                >
                  <span className="hidden sm:inline">Get access for my stream</span>
                  <span className="sm:hidden">Get access</span>
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 flex-shrink-0" />
                </Button>
              </form>
            ) : (
              <div
                className="flex items-center justify-center gap-2 text-emerald-300 text-xs sm:text-sm"
                data-testid="text-success-message"
              >
                <CheckCircle className="h-4 w-4" />
                <span>We&apos;ll email you setup instructions for your next stream.</span>
              </div>
            )}

            <p className="mt-4 text-[11px] text-muted-foreground/85">
              No credit card required • First clips on us • You decide if it stays in your stack.
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
}
