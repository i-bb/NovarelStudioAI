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
    console.log('Waitlist signup:', email);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section id="pricing" className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <Card className="p-12 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 border-primary/20 text-center">
          <h2 className="font-cursive text-4xl md:text-5xl text-foreground mb-4">
            Ready to Go Viral?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of creators who are scaling their content without scaling their team.
            Start your free trial today.
          </p>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-full px-6"
                data-testid="input-email-waitlist"
              />
              <Button type="submit" size="lg" className="rounded-full px-8 whitespace-nowrap group" data-testid="button-join-waitlist">
                Join Waitlist
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>
          ) : (
            <div className="flex items-center justify-center gap-2 text-green-600" data-testid="text-success-message">
              <CheckCircle className="w-5 h-5" />
              <span>Thanks! We'll be in touch soon.</span>
            </div>
          )}

          <p className="text-xs text-muted-foreground mt-4">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </Card>
      </div>
    </section>
  );
}
