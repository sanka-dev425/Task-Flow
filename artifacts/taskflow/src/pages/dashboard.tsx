import { useState, useMemo } from "react";
import { useUser, useClerk } from "@clerk/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Layers, 
  LogOut, 
  ChevronDown, 
  Sparkles, 
  Plus, 
  CircleDashed,
  Loader2,
  Calendar,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

import { 
  useListTasks, 
  getListTasksQueryKey, 
  useGetTaskSummary,
  useUpdateTask,
  useDeleteTask
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import type { Task, ListTasksStatus } from "@workspace/api-client-react/src/generated/api.schemas";
import { TaskDialog } from "@/components/task-dialog";
import { TaskItem } from "@/components/task-item";

export default function DashboardPage() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<ListTasksStatus>("all");
  
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

  const { data: tasks, isLoading: tasksLoading, error: tasksError } = useListTasks(
    { status: filter },
    { query: { queryKey: getListTasksQueryKey({ status: filter }) } }
  );

  const { data: summary, isLoading: summaryLoading } = useGetTaskSummary();

  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();

  const handleToggleTask = async (task: Task) => {
    try {
      await updateTaskMutation.mutateAsync({
        id: task.id,
        data: { isCompleted: !task.isCompleted }
      });
      queryClient.invalidateQueries({ queryKey: getListTasksQueryKey() });
      queryClient.invalidateQueries({ queryKey: ["/api/tasks/summary"] });
    } catch (error) {
      console.error("Failed to toggle task", error);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTaskMutation.mutateAsync({ id });
      queryClient.invalidateQueries({ queryKey: getListTasksQueryKey() });
      queryClient.invalidateQueries({ queryKey: ["/api/tasks/summary"] });
    } catch (error) {
      console.error("Failed to delete task", error);
    }
  };

  const openEdit = (task: Task) => {
    setEditingTask(task);
    setTaskDialogOpen(true);
  };

  const openNew = () => {
    setEditingTask(undefined);
    setTaskDialogOpen(true);
  };

  const hour = new Date().getHours();
  const greetingTime = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  // Compute a motivational subline
  const motivationalSubline = useMemo(() => {
    if (!summary) return "Let's make it happen.";
    if (summary.pending === 0 && summary.completed > 0) return "You're all caught up. Great work today!";
    if (summary.pending === 0) return "A fresh slate. Let's plan your day.";
    if (summary.overdue > 0) return `You have ${summary.overdue} overdue task${summary.overdue > 1 ? 's' : ''} to wrap up.`;
    return `You have ${summary.pending} task${summary.pending > 1 ? 's' : ''} requiring your attention today.`;
  }, [summary]);

  return (
    <div className="min-h-[100dvh] bg-background text-foreground font-sans flex flex-col relative">
      {/* Background ambiance */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-accent/5 blur-[150px]" />
      </div>

      {/* Top Nav */}
      <header className="h-16 border-b border-border/50 bg-white/70 backdrop-blur-xl sticky top-0 z-20 px-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center shadow-sm">
            <Layers className="h-5 w-5" />
          </div>
          <span className="font-serif text-xl font-bold tracking-tight">TaskFlow</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm font-semibold text-muted-foreground hidden sm:flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-full border border-border/50">
            <Calendar className="h-4 w-4" />
            {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 hover:opacity-80 transition-opacity pl-2 outline-none">
                <Avatar className="h-9 w-9 border-2 border-white shadow-sm ring-1 ring-border">
                  <AvatarImage src={user?.imageUrl} />
                  <AvatarFallback className="bg-primary text-primary-foreground font-bold text-xs">
                    {user?.firstName?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white/90 backdrop-blur-xl border-border/50 shadow-xl rounded-xl p-1">
              <DropdownMenuLabel className="font-normal px-2 py-2">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-semibold leading-none text-foreground">{user?.firstName} {user?.lastName}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.primaryEmailAddress?.emailAddress}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border/50 my-1" />
              <DropdownMenuItem 
                onClick={() => signOut()}
                className="focus:bg-destructive/10 rounded-lg cursor-pointer py-2 text-destructive focus:text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span className="font-medium">Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="flex-1 px-4 sm:px-6 py-10 md:px-12 max-w-5xl mx-auto w-full relative z-10">
        <div className="space-y-10">
          
          {/* Header Area */}
          <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
            <h1 className="font-serif text-4xl sm:text-5xl font-semibold tracking-tight text-foreground">
              {greetingTime}, {user?.firstName || "there"}.
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground font-medium flex items-center gap-2">
              {summaryLoading ? (
                <span className="flex items-center gap-2 opacity-50"><Loader2 className="h-4 w-4 animate-spin"/> Loading summary...</span>
              ) : (
                <>
                  {motivationalSubline} <Sparkles className="h-5 w-5 text-accent" />
                </>
              )}
            </p>
          </div>

          {/* Stats Row */}
          {!summaryLoading && summary && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100 ease-out fill-mode-both">
              <div className="bg-white/80 backdrop-blur-md border border-border/50 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                <div className="text-muted-foreground text-xs sm:text-sm font-bold uppercase tracking-wider mb-2">Total Tasks</div>
                <div className="font-serif text-3xl sm:text-4xl font-medium text-foreground">{summary.total}</div>
              </div>
              <div className="bg-white/80 backdrop-blur-md border border-border/50 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                <div className="text-muted-foreground text-xs sm:text-sm font-bold uppercase tracking-wider mb-2">Pending</div>
                <div className="font-serif text-3xl sm:text-4xl font-medium text-foreground">{summary.pending}</div>
              </div>
              <div className="bg-white/80 backdrop-blur-md border border-border/50 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                <div className="text-muted-foreground text-xs sm:text-sm font-bold uppercase tracking-wider mb-2">Completed Today</div>
                <div className="font-serif text-3xl sm:text-4xl font-medium text-primary">{summary.completedToday}</div>
              </div>
              <div className="bg-gradient-to-br from-accent/10 to-transparent border border-accent/20 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                <div className="text-accent text-xs sm:text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  Completion Rate
                </div>
                <div className="font-serif text-3xl sm:text-4xl font-medium text-foreground">
                  {Math.round(summary.completionRate * 100)}<span className="text-lg text-muted-foreground font-sans font-medium tracking-normal">%</span>
                </div>
              </div>
            </div>
          )}

          {/* Tasks Section */}
          <div className="pt-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 ease-out fill-mode-both">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-border/60 pb-5">
              <div className="flex gap-6 sm:gap-8 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
                {(["all", "pending", "completed"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={cn(
                      "text-sm font-bold uppercase tracking-wider pb-5 -mb-[21px] transition-all relative whitespace-nowrap",
                      filter === f ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {f}
                    {filter === f && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
                    )}
                  </button>
                ))}
              </div>
              
              <Button 
                onClick={openNew}
                className="bg-primary hover:bg-primary/90 text-white rounded-full h-10 px-5 text-sm shadow-[0_4px_14px_rgba(37,99,235,0.25)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.4)] transition-all font-semibold group flex-shrink-0"
              >
                <Plus className="h-4 w-4 mr-1.5 group-hover:rotate-90 transition-transform duration-300" /> New Task
              </Button>
            </div>

            <div className="space-y-3.5">
              {tasksError ? (
                <div className="text-center py-16 px-4 bg-destructive/5 rounded-2xl border border-destructive/20 text-destructive">
                  <AlertCircle className="h-8 w-8 mx-auto mb-3 opacity-80" />
                  <p className="font-semibold">Failed to load tasks</p>
                  <Button variant="outline" className="mt-4 bg-white" onClick={() => queryClient.invalidateQueries()}>Retry</Button>
                </div>
              ) : tasksLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-24 bg-white/50 rounded-2xl border border-border/50 animate-pulse" />
                  ))}
                </div>
              ) : tasks?.length === 0 ? (
                <div className="text-center py-20 px-4 bg-white/50 backdrop-blur-sm rounded-2xl border-2 border-dashed border-border/60">
                  <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                    <CircleDashed className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold text-lg text-foreground mb-1">No tasks found</h3>
                  <p className="text-muted-foreground font-medium mb-6">
                    {filter === 'all' ? "Your workspace is clear. Ready to plan?" : `No ${filter} tasks right now.`}
                  </p>
                  {filter === 'all' && (
                    <Button onClick={openNew} variant="outline" className="rounded-full font-semibold border-border/60 shadow-sm">
                      Create your first task
                    </Button>
                  )}
                </div>
              ) : (
                tasks?.map((task, i) => (
                  <TaskItem 
                    key={task.id} 
                    task={task} 
                    index={i} 
                    onToggle={() => handleToggleTask(task)}
                    onEdit={() => openEdit(task)}
                    onDelete={() => handleDeleteTask(task.id)}
                  />
                ))
              )}
            </div>
          </div>
          
        </div>
      </main>

      <TaskDialog 
        open={taskDialogOpen} 
        onOpenChange={setTaskDialogOpen} 
        task={editingTask} 
      />
    </div>
  );
}