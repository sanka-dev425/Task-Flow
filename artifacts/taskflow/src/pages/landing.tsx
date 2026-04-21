import { SignInButton, SignUpButton } from "@clerk/react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Layers, ArrowRight, Sparkles } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-[100dvh] bg-background text-foreground font-sans relative overflow-hidden flex flex-col selection:bg-primary selection:text-primary-foreground">
      {/* Background gradients */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-primary/10 blur-[150px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] rounded-full bg-accent/5 blur-[150px]" />
        <div className="absolute top-[40%] left-[20%] w-[400px] h-[400px] rounded-full bg-chart-3/5 blur-[120px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 container mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center shadow-md shadow-primary/20 shrink-0">
            <Layers className="h-5 w-5" />
          </div>
          <span className="font-serif text-lg sm:text-xl font-bold tracking-tight">TaskFlow</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <SignInButton mode="modal">
            <Button variant="ghost" className="font-semibold text-muted-foreground hover:text-foreground px-3 sm:px-4">
              Log in
            </Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button className="bg-primary hover:bg-primary/90 text-white rounded-full px-4 sm:px-6 font-semibold shadow-md hover:shadow-lg transition-all">
              Start Free
            </Button>
          </SignUpButton>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 py-12 sm:py-20 pb-20 sm:pb-32">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 border border-border/50 text-xs sm:text-sm font-semibold text-primary mb-6 sm:mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Sparkles className="h-4 w-4" />
          The workspace for ambitious minds
        </div>
        
        <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight max-w-4xl leading-[1.1] mb-5 sm:mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100 fill-mode-both">
          Clarity in the chaos. <br className="hidden md:block" />
          Focus on what matters.
        </h1>
        
        <p className="text-base sm:text-xl md:text-2xl text-muted-foreground max-w-2xl font-light mb-8 sm:mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 fill-mode-both">
          A beautifully crafted productivity instrument. Plan with intention, execute with precision, and finish your day with confidence.
        </p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full max-w-md sm:max-w-none sm:w-auto animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300 fill-mode-both">
          <SignUpButton mode="modal">
            <Button className="h-12 sm:h-14 px-6 sm:px-8 rounded-full bg-primary hover:bg-primary/90 text-white text-base sm:text-lg font-semibold shadow-[0_8px_20px_-4px_rgba(37,99,235,0.4)] hover:shadow-[0_12px_24px_-4px_rgba(37,99,235,0.5)] transition-all group w-full sm:w-auto">
              Start your journey
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </SignUpButton>
          <SignInButton mode="modal">
            <Button variant="outline" className="h-12 sm:h-14 px-6 sm:px-8 rounded-full text-base sm:text-lg font-semibold bg-white/50 backdrop-blur-sm border-border hover:bg-white hover:text-foreground transition-all w-full sm:w-auto">
              Sign in to workspace
            </Button>
          </SignInButton>
        </div>

        {/* Feature Highlights */}
        <div className="mt-16 sm:mt-24 grid sm:grid-cols-3 gap-8 max-w-4xl text-left animate-in fade-in slide-in-from-bottom-12 duration-700 delay-500 fill-mode-both">
          {[
            {
              title: "Calm your mind",
              desc: "Offload your mental burden into a beautifully designed, distraction-free environment."
            },
            {
              title: "Move with purpose",
              desc: "Prioritize your day with intention so you always know exactly what to tackle next."
            },
            {
              title: "See your progress",
              desc: "Feel the quiet satisfaction of checking off tasks and building unstoppable momentum."
            }
          ].map((feature, i) => (
            <div key={i} className="space-y-3">
              <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-primary mb-4">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <h3 className="font-serif text-xl font-bold">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}