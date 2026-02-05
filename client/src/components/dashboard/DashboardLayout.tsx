import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { useAuth } from "@/hooks/AuthContext";
import { AuthProvider } from "@/hooks/AuthProvider";
import { toast } from "@/hooks/use-toast";
import { useEffect } from "react";

export default function DashboardLayout({ children }: any) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        // title: "Please log in",
        description: "You need to be logged in to access the dashboard.",
        variant: "destructive",
      });

      setTimeout(() => {
        window.location.href = "/login";
      }, 500);
    }
  }, [isAuthenticated, authLoading, toast]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) return null;
  return (
    // <AuthProvider>
    <div
      className="min-h-screen bg-gradient-to-b from-background via-background/95 to-black/95"
      style={{ display: "flex", flexDirection: "column" }}
    >
      <DashboardNav />
      <div style={{ flex: 1 }}>{children}</div>
    </div>
    // </AuthProvider>
  );
}
