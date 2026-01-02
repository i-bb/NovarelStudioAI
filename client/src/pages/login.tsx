import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Zap, Loader2, Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { useLocation, Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api/api";

export default function LoginPage() {
  const [location, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setLocation("/dashboard");
    }
  }, [setLocation]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        // title: "Missing fields",
        description: "Please enter your email and password",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.login(email.trim().toLowerCase(), password);
      localStorage.setItem("auth_token", response.access_token);
      localStorage.setItem("auth_user", JSON.stringify(response.user));

      toast({
        description:
          `Logged in as ${response.user.name}` || "Successfully loged in",
      });

      setLocation("/dashboard");
    } catch (error: any) {
      console.log("error", error);

      const message =
        error.response?.data?.description ||
        error.message ||
        "Invalid email or password";

      toast({
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    toast({
      // title: "Coming soon",
      description: "Google login will be available soon!",
    });
  };

  // Show spinner while checking auth
  // if (!localStorage.getItem("auth_token")) {
  //   return (
  //     <AppLayout>
  //       <main className="flex flex-col min-h-screen bg-gradient-to-b from-background via-background/95 to-black/95 pt-24">
  //         <div className="flex-1 flex items-center justify-center">
  //           <Loader2 className="h-8 w-8 animate-spin text-primary" />
  //         </div>
  //       </main>
  //     </AppLayout>
  //   );
  // }

  return (
    <AppLayout>
      <main className="flex flex-col min-h-screen bg-gradient-to-b from-background via-background/95 to-black/95 pt-24">
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <Card className="w-full max-w-md p-8 bg-black/60 border-white/10 backdrop-blur-xl">
            <div className="flex flex-col items-center mb-8">
              <div className="relative mb-4">
                <div className="absolute inset-0 bg-primary/20 blur-xl" />
                <Zap
                  className="w-12 h-12 text-primary relative z-10"
                  fill="currentColor"
                />
              </div>
              <h1 className="font-display text-3xl font-semibold text-foreground mb-2">
                Welcome back
              </h1>
              <p className="text-sm text-muted-foreground text-center">
                Sign in to your NovarelStudio account
              </p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-foreground"
                >
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-black/40 border-white/20"
                  disabled={isLoading}
                  autoFocus
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-foreground"
                >
                  Password
                </label>

                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-black/40 border-white/20 pr-10"
                    disabled={isLoading}
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    tabIndex={-1}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${
                      showPassword
                        ? "text-black"
                        : "text-muted-foreground hover:text-black"
                    }`}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end text-sm">
                <a
                  href="/forgot-password"
                  className="text-primary hover:text-primary/80"
                >
                  Forgot password?
                </a>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
            {/* <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-black/60 px-3 text-muted-foreground">
                  or
                </span>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleLogin}
              className="w-full h-11 gap-3 border-white/20 bg-white/5 hover:bg-white/10"
              disabled={isLoading}
            >
              <FcGoogle className="h-5 w-5" />
              Continue with Google
            </Button> */}
            <div className="mt-6 text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="text-primary hover:text-primary/80 font-semibold"
              >
                Get started
              </Link>
            </div>
            {/* Real test account for demo/staging
            <div className="mt-8 p-4 bg-yellow-900/20 border border-yellow-700/50 rounded-lg text-xs text-center text-yellow-300">
              <p className="font-semibold mb-1">Test Account:</p>
              <p>iisha.rai@gmail.com</p>
              <p>Password: 000000</p>
            </div> */}
          </Card>
        </div>
      </main>
    </AppLayout>
  );
}
