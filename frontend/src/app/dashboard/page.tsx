"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Layers,
  LogOut,
  Plus,
  ListChecks,
  CircleDashed,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Sun,
  Moon,
  Sparkles,
  CalendarDays,
  Target,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";
import { useTasks, useUpdateTask, useDeleteTask } from "@/hooks/use-tasks";
import { TaskItem } from "@/components/task-item";
import { AddTaskModal } from "@/components/add-task-modal";
import { cn } from "@/lib/utils";
import { getQuoteForDay } from "@/lib/quotes";
import type { Task, TaskFilter } from "@/types/task";

const FILTERS: { value: TaskFilter; label: string; icon: typeof ListChecks }[] = [
  { value: "all", label: "All", icon: ListChecks },
  { value: "pending", label: "Pending", icon: CircleDashed },
  { value: "completed", label: "Completed", icon: CheckCircle2 },
];

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [filter, setFilter] = useState<TaskFilter>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!authLoading && !user) router.replace("/login");
  }, [user, authLoading, router]);

  const enabled = !!user && !authLoading;
  const { data: tasks, isLoading, isError, error, refetch } = useTasks(filter, enabled);
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const counts = useMemo(() => {
    const list = tasks ?? [];
    return {
      total: list.length,
      completed: list.filter((t) => t.isCompleted).length,
      pending: list.filter((t) => !t.isCompleted).length,
    };
  }, [tasks]);

  const handleToggle = async (task: Task) => {
    try {
      await updateTask.mutateAsync({
        id: task.id,
        input: { isCompleted: !task.isCompleted },
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this task? This cannot be undone.")) return;
    try {
      await deleteTask.mutateAsync(id);
      toast.success("Task deleted.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete.");
    }
  };

  const handleUpdate = async (id: string, title: string, description: string | null) => {
    try {
      await updateTask.mutateAsync({ id, input: { title, description } });
      toast.success("Task updated.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update.");
      throw err;
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out.");
    router.replace("/");
  };

  const quote = getQuoteForDay();
  const userName = user?.email?.split("@")[0] || "there";

  /* Greeting based on time of day */
  const hour = mounted ? new Date().getHours() : 18;
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
          <p className="text-sm text-muted-foreground font-medium">Loading workspace…</p>
        </div>
      </div>
    );
  }

  const getSubtext = () => {
    if (counts.total === 0) return "A fresh slate. Let's plan your day.";
    if (counts.pending === 0) return "You're all caught up. Great work today!";
    return `You have ${counts.pending} pending task${counts.pending !== 1 ? "s" : ""} to tackle.`;
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* ─── Header ─── */}
      <header className="dash-header">
        <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-brand-600 text-white flex items-center justify-center">
              <Layers className="h-4 w-4" />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground hidden sm:inline">TaskFlow</span>
          </div>

          {/* Center — live clock */}
          <div className="hidden md:flex items-center gap-2 text-muted-foreground text-sm">
            <CalendarDays className="h-4 w-4" />
            <span>
              {mounted ? new Date().toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              }) : ""}
            </span>
            <span className="mx-1">·</span>
            <span className="tabular-nums">
              {mounted ? new Date().toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              }) : ""}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-muted-foreground hover:bg-muted transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button
              onClick={handleSignOut}
              className="p-2 rounded-full text-muted-foreground hover:bg-muted transition-colors"
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ─── Main ─── */}
      <main className="container mx-auto px-4 sm:px-6 py-8 max-w-5xl">
        {/* ─── Welcome section ─── */}
        <div className="mb-8 animate-fade-in">
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            {greeting}, {userName}.
          </h1>
          <p className="text-muted-foreground mt-2 text-base sm:text-lg flex items-center gap-2">
            {getSubtext()}
            <Sparkles className="h-4 w-4 text-brand-500" />
          </p>
        </div>

        {/* ─── Quote Card ─── */}
        <div className="quote-card mb-8 animate-fade-in">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/50 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-brand-600 dark:text-brand-400" />
            </div>
            <div className="flex-1">
              <p className="text-lg sm:text-xl text-foreground italic leading-relaxed">
                &ldquo;{quote.text}&rdquo;
              </p>
              <p className="text-sm font-semibold text-brand-600 dark:text-brand-400 mt-3 uppercase tracking-wider">
                — {quote.author}
              </p>
            </div>
          </div>
        </div>

        {/* ─── Total Tasks Metric ─── */}
        <div className="metric-card max-w-[200px] mb-8 animate-slide-up">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Total Tasks</p>
          <p className="text-4xl font-bold text-foreground">{counts.total}</p>
        </div>

        {/* ─── Filters & New Task ─── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-1 bg-card border border-border rounded-xl p-1.5 shadow-sm">
            {FILTERS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setFilter(value)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200",
                  filter === value
                    ? "text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/30"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-brand-600 rounded-full hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/25"
          >
            <Plus className="h-4 w-4" />
            New Task
          </button>
        </div>

        {/* ─── Task list ─── */}
        <div className="space-y-3">
          {isError ? (
            <div className="card p-8 text-center animate-scale-in">
              <AlertCircle className="h-8 w-8 mx-auto mb-3 text-red-500" />
              <p className="font-semibold text-foreground">Failed to load tasks</p>
              <p className="text-sm text-muted-foreground mt-1">
                {error instanceof Error ? error.message : "Unknown error"}
              </p>
              <button onClick={() => refetch()} className="btn-secondary mt-4 text-sm">
                Try again
              </button>
            </div>
          ) : isLoading ? (
            <>
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton h-20" style={{ animationDelay: `${i * 100}ms` }} />
              ))}
            </>
          ) : (tasks ?? []).length === 0 ? (
            <div className="card p-12 text-center border-dashed animate-fade-in">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Target className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-lg text-foreground">No tasks found</h3>
              <p className="text-muted-foreground text-sm mt-1.5">
                Your workspace is clear. Ready to plan?
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 text-sm font-semibold border border-border rounded-full hover:bg-muted transition-colors"
              >
                Create your first task
              </button>
            </div>
          ) : (
            tasks!.map((t, index) => (
              <div key={t.id} className="animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
                <TaskItem
                  task={t}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                  onUpdate={handleUpdate}
                  busy={updateTask.isPending || deleteTask.isPending}
                />
              </div>
            ))
          )}
        </div>
      </main>

      {/* ─── Add Task Modal ─── */}
      <AddTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
