"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Layers, Loader2, Mail, Lock, ShieldCheck, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";

export default function RegisterPage() {
  const router = useRouter();
  const { user, loading, signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) router.replace("/dashboard");
  }, [user, loading, router]);

  /* Password strength indicator */
  const strength =
    password.length === 0
      ? 0
      : password.length < 6
        ? 1
        : password.length < 10
          ? 2
          : 3;
  const strengthLabel = ["", "Weak", "Good", "Strong"][strength];
  const strengthColor = ["", "bg-red-400", "bg-amber-400", "bg-emerald-400"][strength];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("Passwords don't match.");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    setSubmitting(true);
    try {
      await signUp(email, password);
      toast.success("Account created — welcome!");
      router.replace("/dashboard");
    } catch (err) {
      const msg =
        err instanceof Error ? prettifyFirebaseError(err.message) : "Sign-up failed";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Ambient gradient orbs */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-emerald-400/20 blur-3xl animate-float" />
        <div className="absolute top-1/3 -left-40 h-[28rem] w-[28rem] rounded-full bg-brand-400/20 blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute -bottom-24 right-1/4 h-80 w-80 rounded-full bg-violet-400/15 blur-3xl animate-float" style={{ animationDelay: "4s" }} />
      </div>

      <div className="w-full max-w-md animate-scale-in">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 justify-center mb-10 group">
          <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-brand-600 to-brand-500 text-white flex items-center justify-center shadow-lg shadow-brand-500/30 group-hover:shadow-brand-500/50 transition-shadow">
            <Layers className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight">TaskFlow</span>
        </Link>

        {/* Card */}
        <div className="auth-card p-8 sm:p-10 animate-slide-up">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Create your account</h1>
            <p className="text-sm text-slate-500 mt-2">
              Start organizing your day with intention.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="reg-email" className="label mb-2 block">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  id="reg-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input pl-10"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="reg-password" className="label mb-2 block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  id="reg-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pl-10"
                  placeholder="At least 6 characters"
                />
              </div>
              {/* Strength bar */}
              {password.length > 0 && (
                <div className="mt-2.5 flex items-center gap-2 animate-fade-in">
                  <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden flex gap-1">
                    {[1, 2, 3].map((level) => (
                      <div
                        key={level}
                        className={`flex-1 h-full rounded-full transition-all duration-300 ${
                          strength >= level ? strengthColor : "bg-transparent"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-medium text-slate-500">{strengthLabel}</span>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label htmlFor="reg-confirm" className="label mb-2 block">
                Confirm password
              </label>
              <div className="relative">
                <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  id="reg-confirm"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="input pl-10"
                  placeholder="Re-enter password"
                />
              </div>
              {confirm.length > 0 && password !== confirm && (
                <p className="text-xs text-red-500 mt-1.5 animate-fade-in">Passwords don&apos;t match</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full h-12 text-base group"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Create account
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="auth-divider">or</div>

          <p className="text-sm text-slate-500 text-center">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-brand-600 hover:text-brand-700 transition-colors"
            >
              Sign in →
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-400 mt-8">
          Secure authentication powered by Firebase
        </p>
      </div>
    </div>
  );
}

function prettifyFirebaseError(message: string): string {
  if (message.includes("auth/email-already-in-use")) {
    return "That email is already registered.";
  }
  if (message.includes("auth/invalid-email")) return "Please enter a valid email.";
  if (message.includes("auth/weak-password")) {
    return "Password is too weak. Use at least 6 characters.";
  }
  if (message.includes("auth/network-request-failed")) {
    return "Network error. Check your connection.";
  }
  return "Sign-up failed. Please try again.";
}
