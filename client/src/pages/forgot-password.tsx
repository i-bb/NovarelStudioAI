import { AppLayout } from "@/components/layout/AppLayout";
import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Loader2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import api from "@/lib/api/api";
import { toast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";

const ForgotPassword = () => {
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(30);

  const [, setLocation] = useLocation();

  // TIMER COUNTDOWN
  useEffect(() => {
    if (step !== "otp") return;
    if (timer === 0) return;

    const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer, step]);

  // ────────────────────────────────────────────────
  //  API: SEND OTP
  // ────────────────────────────────────────────────
  const handleSendOtp = async () => {
    try {
      setIsLoading(true);
      const res = await api.resetPassword(email);

      toast({
        description: res?.message || "Check your email inbox.",
      });

      setStep("otp");
      setTimer(30);
    } catch (error: any) {
      console.log("error", error);

      toast({
        variant: "destructive",
        description: error?.message || "Something went wrong.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ────────────────────────────────────────────────
  //  API: VERIFY OTP + RESET PASSWORD
  // ────────────────────────────────────────────────
  const handleVerifyOtp = async () => {
    try {
      setIsLoading(true);

      const res = await api.verifyOtp(email, newPassword, otp);

      toast({
        description:
          res?.message || "You can now log in with your new password.",
      });

      setLocation("/login");
    } catch (error: any) {
      console.log("error", error);

      toast({
        variant: "destructive",
        description: error?.message || "Invalid OTP or something went wrong.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ────────────────────────────────────────────────
  //  API: RESEND OTP
  // ────────────────────────────────────────────────
  const handleResendOtp = async () => {
    if (timer > 0) return;

    try {
      setIsLoading(true);
      const res = await api.resetPassword(email);

      toast({
        // title: "OTP Resent",
        description: res?.message || "Please check your email again.",
      });
      setStep("otp");
      setTimer(30);
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: error?.message || "Try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ────────────────────────────────────────────────
  //  FORM HANDLER
  // ────────────────────────────────────────────────
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === "email") return handleSendOtp();
    return handleVerifyOtp();
  };

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
                {step === "email" ? "Forgot Password" : "Enter OTP"}
              </h1>

              <p className="text-sm text-muted-foreground text-center">
                {step === "email"
                  ? "We will send a One Time Password to your email"
                  : `OTP sent to ${email}`}
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {step === "email" ? (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-black/40 border-white/20"
                    disabled={isLoading}
                    required
                  />
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      OTP
                    </label>
                    <Input
                      type="text"
                      placeholder="Enter your 6-digit OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="bg-black/40 border-white/20"
                      disabled={isLoading}
                      required
                      autoComplete="one-time-code"
                    />
                  </div>

                  <div className="space-y-2 relative">
                    <label className="text-sm font-medium text-foreground">
                      New Password
                    </label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="********"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="bg-black/40 border-white/20"
                        disabled={isLoading}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-2.5 text-gray-500"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* RESEND OTP */}
                  <p className="text-xs text-muted-foreground text-center">
                    {timer > 0 ? (
                      <>
                        Resend OTP in{" "}
                        <span className="text-foreground font-semibold">
                          {timer}s
                        </span>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        className="text-primary hover:underline"
                        disabled={isLoading}
                      >
                        Resend OTP
                      </button>
                    )}
                  </p>
                </>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 font-semibold"
                disabled={
                  isLoading ||
                  (step === "email" && !email) ||
                  (step === "otp" && (!otp || !newPassword))
                }
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                    wait...
                  </>
                ) : step === "email" ? (
                  "Send OTP"
                ) : (
                  "Reset Password"
                )}
              </Button>
            </form>
            <div className="mt-6 text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                href="/login"
                className="text-primary hover:text-primary/80 font-semibold"
              >
                Back to Login
              </Link>
            </div>
          </Card>
        </div>
      </main>
    </AppLayout>
  );
};

export default ForgotPassword;
