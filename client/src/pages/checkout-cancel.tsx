import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function CheckoutCancelPage() {
  return (
    <AppLayout>
      <main className="flex flex-col min-h-screen bg-gradient-to-b from-background via-background/95 to-black/95 pt-24">
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <Card className="w-full max-w-md p-8 bg-black/60 border-white/10 backdrop-blur-xl text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-orange-400/20 blur-xl" />
                <XCircle className="w-16 h-16 text-orange-400 relative z-10" />
              </div>
            </div>
            <h1 className="font-display text-2xl font-semibold text-foreground mb-2">
              Checkout Cancelled
            </h1>
            <p className="text-muted-foreground mb-8">
              No worries! Your payment wasn't processed. You can try again whenever you're ready or start with our free Starter plan.
            </p>
            <div className="space-y-3">
              <Button asChild className="w-full bg-gradient-to-r from-primary to-accent">
                <Link href="/#pricing" data-testid="link-pricing">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Pricing
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link href="/signup" data-testid="link-free-signup">
                  Start Free with Starter Plan
                </Link>
              </Button>
            </div>
            <p className="mt-6 text-xs text-muted-foreground">
              Questions? Contact us at support@novarelstudio.com
            </p>
          </Card>
        </div>
      </main>
    </AppLayout>
  );
}
