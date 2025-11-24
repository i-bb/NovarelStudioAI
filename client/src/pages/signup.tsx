import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { Zap } from "lucide-react";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement registration logic
    console.log("Signup attempt:", { name, email, password });
  };

  return (
    <AppLayout>
      <main className="flex flex-col min-h-screen bg-gradient-to-b from-background via-background/95 to-black/95 pt-24">
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <Card className="w-full max-w-md p-8 bg-black/60 border-white/10 backdrop-blur-xl">
            <div className="flex flex-col items-center mb-8">
              <div className="relative mb-4">
                <div className="absolute inset-0 bg-primary/20 blur-xl" />
                <Zap className="w-12 h-12 text-primary relative z-10" fill="currentColor" />
              </div>
              <h1 className="font-display text-3xl font-semibold text-foreground mb-2">
                Start your journey
              </h1>
              <p className="text-sm text-muted-foreground text-center">
                Turn your streams into viral clips automatically
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-foreground">
                  Channel name
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="YourChannelName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="bg-black/40 border-white/20"
                  data-testid="input-name"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@yourchannel.gg"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-black/40 border-white/20"
                  data-testid="input-email"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-black/40 border-white/20"
                  data-testid="input-password"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 font-semibold"
                data-testid="button-signup"
              >
                Create Account
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                By signing up, you agree to our Terms of Service and Privacy Policy
              </p>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:text-primary/80 font-semibold" data-testid="link-login">
                Sign in
              </Link>
            </div>
          </Card>
        </div>
      </main>
    </AppLayout>
  );
}
