import { useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, Loader2 } from "lucide-react";
import { SiReplit } from "react-icons/si";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";

export default function SignupPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      setLocation("/dashboard");
    }
  }, [isAuthenticated, isLoading, setLocation]);

  const handleSignup = () => {
    window.location.href = "/api/login";
  };

  if (isLoading) {
    return (
      <AppLayout>
        <main className="flex flex-col min-h-screen bg-gradient-to-b from-background via-background/95 to-black/95 pt-24">
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </main>
      </AppLayout>
    );
  }

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

            <div className="space-y-4">
              <Button
                onClick={handleSignup}
                className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 font-semibold text-base gap-3"
                data-testid="button-signup"
              >
                <SiReplit className="h-5 w-5" />
                Get Started with Replit
              </Button>

              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  Free to start • No credit card required
                </p>
              </div>
            </div>

            <p className="mt-6 text-xs text-muted-foreground text-center">
              By signing up, you agree to our Terms of Service and Privacy Policy
            </p>
          </Card>
        </div>
      </main>
    </AppLayout>
  );
}
