import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2, PartyPopper, Zap } from "lucide-react";
import { useLocation, useSearch, Link } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function CheckoutSuccessPage() {
  const [, setLocation] = useLocation();
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const sessionId = params.get("session_id");
  const { toast } = useToast();
  const [completed, setCompleted] = useState(false);

  const completeMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      const response = await apiRequest("POST", "/api/checkout/complete", { sessionId });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/subscription"] });
      setCompleted(true);
      toast({
        title: "Subscription activated!",
        description: "Your plan is now active. Let's create some viral clips!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Activation issue",
        description: error.message || "There was an issue activating your subscription. Please contact support.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (sessionId && !completed && !completeMutation.isPending) {
      completeMutation.mutate(sessionId);
    }
  }, [sessionId]);

  if (!sessionId) {
    return (
      <AppLayout>
        <main className="flex flex-col min-h-screen bg-gradient-to-b from-background via-background/95 to-black/95 pt-24">
          <div className="flex-1 flex items-center justify-center px-4 py-12">
            <Card className="w-full max-w-md p-8 bg-black/60 border-white/10 backdrop-blur-xl text-center">
              <h1 className="font-display text-2xl font-semibold text-foreground mb-4">
                Invalid Session
              </h1>
              <p className="text-muted-foreground mb-6">
                No checkout session found. Please try again from the pricing page.
              </p>
              <Button asChild>
                <Link href="/#pricing">View Plans</Link>
              </Button>
            </Card>
          </div>
        </main>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <main className="flex flex-col min-h-screen bg-gradient-to-b from-background via-background/95 to-black/95 pt-24">
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <Card className="w-full max-w-md p-8 bg-black/60 border-white/10 backdrop-blur-xl text-center">
            {completeMutation.isPending ? (
              <>
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 blur-xl" />
                    <Loader2 className="w-16 h-16 text-primary animate-spin relative z-10" />
                  </div>
                </div>
                <h1 className="font-display text-2xl font-semibold text-foreground mb-4">
                  Activating your subscription...
                </h1>
                <p className="text-muted-foreground">
                  Please wait while we set up your account.
                </p>
              </>
            ) : completed ? (
              <>
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-emerald-400/20 blur-xl" />
                    <div className="relative z-10 flex items-center justify-center">
                      <CheckCircle2 className="w-16 h-16 text-emerald-400" />
                      <PartyPopper className="w-8 h-8 text-yellow-400 absolute -top-2 -right-2 animate-bounce" />
                    </div>
                  </div>
                </div>
                <h1 className="font-display text-2xl font-semibold text-foreground mb-2">
                  You're all set!
                </h1>
                <p className="text-lg text-primary font-medium mb-4">
                  Welcome to the NovarelStudio family
                </p>
                <p className="text-muted-foreground mb-8">
                  Your subscription is active and you're ready to start turning your streams into viral content. Let's go!
                </p>
                <div className="space-y-3">
                  <Button asChild className="w-full bg-gradient-to-r from-primary to-accent">
                    <Link href="/dashboard" data-testid="link-dashboard">
                      <Zap className="mr-2 h-4 w-4" />
                      Go to Dashboard
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/dashboard?tab=accounts" data-testid="link-connect-accounts">
                      Connect Your Streaming Accounts
                    </Link>
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-red-400/20 blur-xl" />
                    <Zap className="w-16 h-16 text-red-400 relative z-10" />
                  </div>
                </div>
                <h1 className="font-display text-2xl font-semibold text-foreground mb-4">
                  Something went wrong
                </h1>
                <p className="text-muted-foreground mb-6">
                  We couldn't activate your subscription. Your payment was successful, but there was an issue on our end.
                </p>
                <div className="space-y-3">
                  <Button onClick={() => completeMutation.mutate(sessionId)} className="w-full">
                    Try Again
                  </Button>
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/dashboard">Go to Dashboard</Link>
                  </Button>
                </div>
              </>
            )}
          </Card>
        </div>
      </main>
    </AppLayout>
  );
}
