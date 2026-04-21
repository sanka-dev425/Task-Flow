import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Sparkles, CheckCircle2, Layers } from "lucide-react";

export function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  return (
    <div className="min-h-screen w-full flex bg-background text-foreground selection:bg-primary selection:text-primary-foreground font-sans">
      {/* Left Panel - Brand / Editorial */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-12 bg-foreground text-background relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-20 mix-blend-overlay pointer-events-none"></div>
          <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] rounded-full bg-primary/40 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-20%] w-[90%] h-[90%] rounded-full bg-chart-3/30 blur-[120px]" />
          <div className="absolute top-[30%] right-[-10%] w-[60%] h-[60%] rounded-full bg-accent/20 blur-[100px]" />
        </div>

        <div className="relative z-10 flex items-center gap-2">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)]">
            <Layers className="h-6 w-6" />
          </div>
          <span className="font-serif text-2xl font-semibold tracking-tight text-white">TaskFlow</span>
        </div>

        <div className="relative z-10 max-w-md space-y-6">
          <h1 className="font-serif text-5xl leading-[1.15] tracking-tight text-white">
            Clarity in the chaos.<br />Focus on what matters.
          </h1>
          <p className="text-lg text-white/70 leading-relaxed font-light">
            A beautifully crafted workspace for ambitious minds. Plan with intention, execute with precision, and celebrate your progress.
          </p>
          
          <div className="pt-8 space-y-5">
            {[
              "Organize your thoughts seamlessly",
              "Align daily actions with big-picture goals",
              "Enter deep work and find your rhythm"
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-4 text-sm text-white/80 group">
                <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center border border-white/5 backdrop-blur-md group-hover:scale-110 transition-transform">
                  <Sparkles className="h-4 w-4 text-accent" />
                </div>
                <span className="font-medium tracking-wide">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-sm text-white/50 font-medium">
          © {new Date().getFullYear()} TaskFlow Inc. Built for flow.
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 sm:p-12 md:p-24 relative bg-background">
        <div className="absolute inset-0 bg-gradient-to-b from-white/60 to-transparent pointer-events-none" />
        
        <div className="w-full max-w-[420px] mx-auto space-y-10 relative z-10">
          
          <div className="lg:hidden flex items-center gap-2 mb-12">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center shadow-lg shadow-primary/20">
              <Layers className="h-6 w-6" />
            </div>
            <span className="font-serif text-2xl font-semibold tracking-tight text-foreground">TaskFlow</span>
          </div>

          <div className="space-y-3">
            <h2 className="font-serif text-4xl font-semibold tracking-tight text-foreground">
              {isLogin ? "Welcome back" : "Start your journey"}
            </h2>
            <p className="text-muted-foreground text-lg">
              {isLogin 
                ? "Enter your details to access your workspace." 
                : "Create an account to bring order to your day."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="space-y-2.5">
                <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Full Name</Label>
                <Input 
                  id="name" 
                  placeholder="Jane Doe" 
                  required 
                  className="h-14 bg-white border-muted focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10 rounded-xl px-4 shadow-sm transition-all placeholder:text-muted-foreground/50 text-base"
                />
              </div>
            )}
            <div className="space-y-2.5">
              <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="name@example.com" 
                required 
                className="h-14 bg-white border-muted focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10 rounded-xl px-4 shadow-sm transition-all placeholder:text-muted-foreground/50 text-base"
              />
            </div>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Password</Label>
                {isLogin && (
                  <button type="button" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                    Forgot password?
                  </button>
                )}
              </div>
              <Input 
                id="password" 
                type="password" 
                required 
                className="h-14 bg-white border-muted focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10 rounded-xl px-4 shadow-sm transition-all text-base"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-14 bg-primary hover:bg-primary/90 text-white rounded-xl shadow-[0_8px_20px_-4px_rgba(37,99,235,0.3)] hover:shadow-[0_12px_24px_-4px_rgba(37,99,235,0.4)] transition-all flex items-center justify-between px-6 group border border-primary/20 text-lg font-semibold"
              disabled={isLoading}
            >
              <span>{isLoading ? "Processing..." : (isLogin ? "Sign In" : "Create Account")}</span>
              {!isLoading && <ArrowRight className="h-5 w-5 opacity-90 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />}
            </Button>
          </form>

          <div className="text-center pt-2">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-muted-foreground hover:text-foreground font-medium text-sm transition-colors"
            >
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <span className="text-primary hover:underline underline-offset-4">
                {isLogin ? "Sign up" : "Sign in"}
              </span>
            </button>
          </div>
        </div>

        <div className="absolute bottom-8 left-0 right-0 text-center text-xs font-medium text-muted-foreground">
          By continuing, you agree to our <a href="#" className="text-foreground hover:text-primary transition-colors underline underline-offset-4">Terms</a> and <a href="#" className="text-foreground hover:text-primary transition-colors underline underline-offset-4">Privacy</a>.
        </div>
      </div>
    </div>
  );
}
