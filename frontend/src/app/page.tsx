"use client";

import Link from "next/link";
import { Sparkles, ArrowRight, CheckCircle2, MoveRight, BarChart3, Layers, Sun, Moon } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

export default function LandingPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Header */}
      <header className="container mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-brand-600 text-white flex items-center justify-center">
            <Layers className="h-4 w-4" />
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground">TaskFlow</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-muted-foreground hover:bg-muted transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <Link href="/login" className="hidden sm:inline-flex text-sm font-medium text-foreground hover:text-brand-600 transition-colors">
            Log in
          </Link>
          <Link href="/register" className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-brand-600 rounded-full hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/25">
            Start Free
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="container mx-auto px-6 pt-16 sm:pt-24 pb-20">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 dark:bg-brand-950/50 border border-brand-100 dark:border-brand-900 text-brand-600 dark:text-brand-400 text-xs font-medium mb-8">
            <Sparkles className="h-3.5 w-3.5" />
            The workspace for ambitious minds
          </div>

          {/* Headline */}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.15] mb-6">
            Clarity in the chaos.
            <br />
            Focus on what matters.
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed mb-10">
            A beautifully crafted productivity instrument. Plan with intention, execute with precision, and finish your day with confidence.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-semibold text-white bg-brand-600 rounded-full hover:bg-brand-700 transition-all shadow-xl shadow-brand-500/25 group"
            >
              Start your journey
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center px-8 py-3.5 text-sm font-semibold text-foreground border border-border rounded-full hover:bg-muted transition-colors"
            >
              Sign in to workspace
            </Link>
          </div>

          {/* Features */}
          <div className="mt-24 grid sm:grid-cols-3 gap-8 w-full max-w-4xl">
            {[
              {
                icon: CheckCircle2,
                title: "Calm your mind",
                desc: "Offload your mental burden into a beautifully designed, distraction-free environment.",
              },
              {
                icon: MoveRight,
                title: "Move with purpose",
                desc: "Prioritize your day with intention so you always know exactly what to tackle next.",
              },
              {
                icon: BarChart3,
                title: "See your progress",
                desc: "Feel the quiet satisfaction of checking off tasks and building unstoppable momentum.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center sm:text-left">
                <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 mb-4">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 border-t border-border">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>Crafted with care — <span className="font-semibold text-foreground">TaskFlow</span></p>
          <p>2026 TaskFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
