import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { Loader2, Save, User } from "lucide-react";
import { getErrorMessage } from "@/lib/getErrorMessage";
import api from "@/lib/api/api";

export default function ProfilePage() {
  const { toast } = useToast();
  const {
    user,
    isAuthenticated,
    isLoading: authLoading,
    refreshUser,
  } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  // Local loading state instead of mutation
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast({
        variant: "destructive",
        description: "Name cannot be empty",
      });
      return;
    }

    try {
      setIsSaving(true);

      const response = await api.profile(name.trim());

      await refreshUser();
      window.location.reload();
      toast({
        description:
          response.message || "Your profile has been updated successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: getErrorMessage(error),
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const initials = name.trim().slice(0, 2).toUpperCase() || "";

  return (
    <main className="max-w-2xl mx-auto px-4 md:px-8 py-8">
      <h1 className="font-display text-3xl sm:text-4xl font-semibold mb-8">
        Edit Profile
      </h1>

      <Card className="border-white/10 bg-black/40">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={undefined} />
              <AvatarFallback className="bg-primary/20 text-primary text-xl">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div>
              <CardTitle className="flex items-center gap-2">
                {/* <User className="h-5 w-5" />  */}
                Profile Information
              </CardTitle>
              <CardDescription>
                Update your personal details here
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your first name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                disabled
                className="opacity-60"
              />
              <p className="text-xs text-muted-foreground">
                Email cannot be changed. Contact support if you need to update
                it.
              </p>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isSaving}
                className="w-full sm:w-auto"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
