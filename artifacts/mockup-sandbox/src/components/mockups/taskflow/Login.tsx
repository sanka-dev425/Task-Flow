import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

export function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  return (
    <div className="min-h-screen w-full flex bg-[#FDFCFB] text-[#1C1C1A] selection:bg-[#2A453B] selection:text-white font-sans">
      {/* Left Panel - Brand / Editorial */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-12 bg-[#1C1C1A] text-[#FDFCFB] relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-gradient-to-br from-[#2A453B] to-transparent blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-20%] w-[80%] h-[80%] rounded-full bg-gradient-to-tl from-[#8C4A32] to-transparent blur-[100px]" />
        </div>

        <div className="relative z-10 flex items-center gap-2">
          <div className="h-8 w-8 rounded bg-[#FDFCFB] text-[#1C1C1A] flex items-center justify-center">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <span className="font-serif text-xl font-medium tracking-tight">TaskFlow</span>
        </div>

        <div className="relative z-10 max-w-md space-y-6">
          <h1 className="font-serif text-5xl leading-[1.1] tracking-tight">
            Design your day.<br />Master your focus.
          </h1>
          <p className="text-lg text-[#A1A09D] leading-relaxed font-light">
            A quiet workspace for ambitious minds. Plan intentionally, execute calmly, and reflect on your progress.
          </p>
          
          <div className="pt-8 space-y-4">
            {[
              "Clear the mental clutter",
              "Align daily actions with long-term goals",
              "Find your rhythm and stay in flow"
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-[#D3D2CF]">
                <Sparkles className="h-4 w-4 text-[#8C4A32]" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-sm text-[#6C6B68]">
          © {new Date().getFullYear()} TaskFlow Inc. The art of done.
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 sm:p-12 md:p-24 relative">
        <div className="w-full max-w-[400px] mx-auto space-y-10">
          
          <div className="lg:hidden flex items-center gap-2 mb-12">
            <div className="h-8 w-8 rounded bg-[#1C1C1A] text-[#FDFCFB] flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <span className="font-serif text-xl font-medium tracking-tight">TaskFlow</span>
          </div>

          <div className="space-y-3">
            <h2 className="font-serif text-3xl font-medium tracking-tight">
              {isLogin ? "Welcome back" : "Begin your journey"}
            </h2>
            <p className="text-[#6C6B68]">
              {isLogin 
                ? "Enter your details to access your workspace." 
                : "Create an account to start organizing your life."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs uppercase tracking-wider text-[#6C6B68]">Full Name</Label>
                <Input 
                  id="name" 
                  placeholder="Jane Doe" 
                  required 
                  className="h-12 bg-white border-[#E8E6E1] focus-visible:ring-[#2A453B] rounded-none border-t-0 border-x-0 border-b-2 px-0 shadow-none focus-visible:border-[#2A453B] focus-visible:ring-0 transition-colors placeholder:text-[#B5B4B0] text-base"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs uppercase tracking-wider text-[#6C6B68]">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="name@example.com" 
                required 
                className="h-12 bg-white border-[#E8E6E1] focus-visible:ring-[#2A453B] rounded-none border-t-0 border-x-0 border-b-2 px-0 shadow-none focus-visible:border-[#2A453B] focus-visible:ring-0 transition-colors placeholder:text-[#B5B4B0] text-base bg-transparent"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs uppercase tracking-wider text-[#6C6B68]">Password</Label>
                {isLogin && (
                  <button type="button" className="text-xs text-[#6C6B68] hover:text-[#1C1C1A] transition-colors">
                    Forgot password?
                  </button>
                )}
              </div>
              <Input 
                id="password" 
                type="password" 
                required 
                className="h-12 bg-white border-[#E8E6E1] focus-visible:ring-[#2A453B] rounded-none border-t-0 border-x-0 border-b-2 px-0 shadow-none focus-visible:border-[#2A453B] focus-visible:ring-0 transition-colors text-base bg-transparent"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 mt-4 bg-[#2A453B] hover:bg-[#1E322A] text-white rounded shadow-sm hover:shadow-md transition-all flex items-center justify-between px-6 group"
              disabled={isLoading}
            >
              <span className="font-medium">{isLoading ? "Processing..." : (isLogin ? "Sign In" : "Create Account")}</span>
              {!isLoading && <ArrowRight className="h-4 w-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />}
            </Button>
          </form>

          <div className="text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-[#6C6B68] hover:text-[#1C1C1A] text-sm transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>

        <div className="absolute bottom-8 left-0 right-0 text-center text-xs text-[#A1A09D]">
          By continuing, you agree to our <a href="#" className="underline underline-offset-4 hover:text-[#1C1C1A]">Terms</a> and <a href="#" className="underline underline-offset-4 hover:text-[#1C1C1A]">Privacy</a>.
        </div>
      </div>
    </div>
  );
}
