import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Search, 
  Bell, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  MoreHorizontal, 
  Plus,
  Flame,
  ArrowRight,
  CircleDashed,
  Settings,
  LogOut,
  ChevronDown,
  Layers,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const tasks = [
  { id: 1, title: "Review Q3 Marketing Strategy", desc: "Focus on conversion metrics in APAC region", time: "10:00 AM", tag: "Work", priority: "high", completed: false },
  { id: 2, title: "Draft product update announcement", desc: "Include new navigation paradigm", time: "1:30 PM", tag: "Writing", priority: "medium", completed: false },
  { id: 3, title: "Sync with design team on component library", desc: "", time: "3:00 PM", tag: "Meeting", priority: "medium", completed: false },
  { id: 4, title: "Read 'The Architecture of Happiness' ch. 3", desc: "", time: "Evening", tag: "Growth", priority: "low", completed: false },
  { id: 5, title: "Morning mobility routine", desc: "15 mins minimum", time: "7:00 AM", tag: "Health", priority: "high", completed: true },
  { id: 6, title: "Clear inbox zero", desc: "", time: "9:00 AM", tag: "Admin", priority: "medium", completed: true },
];

export function Dashboard() {
  const [filter, setFilter] = useState("all");
  const [taskList, setTaskList] = useState(tasks);

  const toggleTask = (id: number) => {
    setTaskList(taskList.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const filteredTasks = taskList.filter(t => {
    if (filter === "pending") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  const pendingCount = taskList.filter(t => !t.completed).length;
  const completedCount = taskList.filter(t => t.completed).length;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col selection:bg-primary selection:text-primary-foreground relative">
      {/* Background ambiance */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-accent/5 blur-[150px]" />
      </div>

      {/* Top Nav */}
      <header className="h-16 border-b border-border bg-white/70 backdrop-blur-xl sticky top-0 z-20 px-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center shadow-md shadow-primary/20">
              <Layers className="h-5 w-5" />
            </div>
            <span className="font-serif text-xl font-bold tracking-tight">TaskFlow</span>
          </div>
          
          <div className="hidden md:flex items-center relative group">
            <Search className="absolute left-3.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search tasks, notes, or tags..." 
              className="pl-10 pr-4 py-2 w-72 bg-white/50 border border-border focus:border-primary/50 focus:ring-4 focus:ring-primary/10 focus:bg-white rounded-full text-sm outline-none transition-all placeholder:text-muted-foreground shadow-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div className="text-sm font-semibold text-muted-foreground hidden sm:block bg-secondary/50 px-3 py-1.5 rounded-full border border-border/50">
            {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </div>
          <button className="h-9 w-9 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-all relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-destructive border-2 border-white shadow-[0_0_0_2px_rgba(255,255,255,1)]"></span>
          </button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 hover:opacity-80 transition-opacity pl-2">
                <Avatar className="h-9 w-9 border-2 border-white shadow-sm ring-1 ring-border">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback className="bg-primary text-primary-foreground font-bold text-xs">EL</AvatarFallback>
                </Avatar>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white/90 backdrop-blur-xl border-border shadow-xl rounded-xl p-1">
              <DropdownMenuLabel className="font-normal px-2 py-2">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-semibold leading-none text-foreground">Eleanor</p>
                  <p className="text-xs leading-none text-muted-foreground">eleanor@example.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border/50 my-1" />
              <DropdownMenuItem className="focus:bg-secondary rounded-lg cursor-pointer py-2">
                <Settings className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Preferences</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="focus:bg-destructive/10 rounded-lg cursor-pointer py-2 text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span className="font-medium">Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="flex-1 flex max-w-[1440px] w-full mx-auto relative z-10">
        {/* Main Content */}
        <main className="flex-1 px-6 py-10 md:px-12 max-w-4xl">
          <div className="space-y-10">
            
            {/* Header Area */}
            <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
              <h1 className="font-serif text-5xl font-semibold tracking-tight text-foreground">Good morning, Eleanor.</h1>
              <p className="text-xl text-muted-foreground font-medium flex items-center gap-2">
                You have <span className="text-primary font-bold">{pendingCount} tasks</span> requiring your attention today. Let's make it happen. <Sparkles className="h-5 w-5 text-accent" />
              </p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100 ease-out fill-mode-both">
              <div className="bg-white/80 backdrop-blur-md border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-110 duration-500"></div>
                <div className="text-muted-foreground text-sm font-bold uppercase tracking-wider mb-2">Total Tasks</div>
                <div className="font-serif text-4xl font-medium text-foreground">{taskList.length}</div>
              </div>
              <div className="bg-white/80 backdrop-blur-md border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-chart-4/5 rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-110 duration-500"></div>
                <div className="text-muted-foreground text-sm font-bold uppercase tracking-wider mb-2">Pending</div>
                <div className="font-serif text-4xl font-medium text-foreground">{pendingCount}</div>
              </div>
              <div className="bg-white/80 backdrop-blur-md border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-110 duration-500"></div>
                <div className="text-muted-foreground text-sm font-bold uppercase tracking-wider mb-2">Completed</div>
                <div className="font-serif text-4xl font-medium text-primary">{completedCount}</div>
              </div>
              <div className="bg-gradient-to-br from-chart-5/10 to-transparent border border-chart-5/20 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-chart-5/20 rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-110 duration-500"></div>
                <div className="text-chart-5 text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Flame className="h-4 w-4" /> Streak
                </div>
                <div className="font-serif text-4xl font-medium text-foreground">12 <span className="text-lg text-muted-foreground font-sans font-medium tracking-normal">days</span></div>
              </div>
            </div>

            {/* Tasks Section */}
            <div className="pt-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 ease-out fill-mode-both">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-border/60 pb-5">
                <div className="flex gap-8">
                  {["all", "pending", "completed"].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={cn(
                        "text-sm font-bold uppercase tracking-wider pb-5 -mb-[21px] transition-all relative",
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
                
                <Button className="bg-primary hover:bg-primary/90 text-white rounded-full h-10 px-5 text-sm shadow-[0_4px_14px_rgba(37,99,235,0.25)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.4)] transition-all font-semibold group">
                  <Plus className="h-4 w-4 mr-1.5 group-hover:rotate-90 transition-transform duration-300" /> New Task
                </Button>
              </div>

              <div className="space-y-3.5">
                {filteredTasks.length === 0 ? (
                  <div className="text-center py-20 px-4 bg-white/50 backdrop-blur-sm rounded-2xl border-2 border-dashed border-border">
                    <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                      <CircleDashed className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold text-lg text-foreground mb-1">No tasks found</h3>
                    <p className="text-muted-foreground font-medium">You're all caught up for now.</p>
                  </div>
                ) : (
                  filteredTasks.map((task, i) => (
                    <div 
                      key={task.id}
                      className={cn(
                        "group flex items-start gap-4 p-5 rounded-2xl transition-all duration-300 border bg-white/80 backdrop-blur-md hover:shadow-lg hover:shadow-primary/5",
                        task.completed ? "border-transparent opacity-60 hover:opacity-100 bg-white/40" : "border-border/60 shadow-sm",
                        "animate-in fade-in slide-in-from-bottom-4 fill-mode-both"
                      )}
                      style={{ animationDelay: `${200 + i * 50}ms` }}
                    >
                      <button 
                        onClick={() => toggleTask(task.id)}
                        className={cn(
                          "mt-0.5 flex-shrink-0 h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                          task.completed 
                            ? "bg-primary border-primary text-white scale-95" 
                            : "border-muted-foreground/30 hover:border-primary hover:bg-primary/5"
                        )}
                      >
                        {task.completed && <CheckCircle2 className="h-4 w-4 animate-in zoom-in duration-200" />}
                      </button>
                      
                      <div className="flex-1 min-w-0 pt-0.5">
                        <div className="flex items-center justify-between gap-4">
                          <h3 className={cn(
                            "font-semibold text-[17px] truncate transition-all duration-300",
                            task.completed ? "line-through text-muted-foreground" : "text-foreground"
                          )}>
                            {task.title}
                          </h3>
                          <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                            <button className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                              <MoreHorizontal className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                        
                        {task.desc && (
                          <p className={cn(
                            "text-sm mt-1.5 truncate font-medium",
                            task.completed ? "text-muted-foreground/70" : "text-muted-foreground"
                          )}>
                            {task.desc}
                          </p>
                        )}
                        
                        <div className="flex flex-wrap items-center gap-3 mt-4 text-xs font-bold">
                          <div className={cn(
                            "flex items-center gap-1.5 px-2.5 py-1 rounded-md",
                            task.completed ? "text-muted-foreground/70 bg-secondary/50" : "text-chart-3 bg-chart-3/10"
                          )}>
                            <Clock className="h-3.5 w-3.5" />
                            {task.time}
                          </div>
                          <div className="px-2.5 py-1 rounded-md bg-secondary text-foreground border border-border/50 shadow-sm">
                            {task.tag}
                          </div>
                          {task.priority === 'high' && !task.completed && (
                            <div className="px-2.5 py-1 rounded-md bg-destructive/10 text-destructive border border-destructive/20 shadow-sm">
                              High Priority
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            
          </div>
        </main>

        {/* Sidebar / Context Panel */}
        <aside className="hidden lg:block w-[340px] border-l border-border/60 bg-white/40 backdrop-blur-xl px-8 py-10 relative">
          <div className="sticky top-28 space-y-10 animate-in fade-in slide-in-from-right-8 duration-700 delay-300 ease-out fill-mode-both">
            
            {/* Focus Timer Mini */}
            <div className="bg-foreground text-background rounded-[24px] p-7 relative overflow-hidden shadow-2xl shadow-foreground/20">
              <div className="absolute top-[-20%] right-[-10%] w-[200px] h-[200px] rounded-full bg-primary blur-[60px] opacity-40"></div>
              <div className="absolute bottom-[-10%] left-[-10%] w-[100px] h-[100px] rounded-full bg-accent blur-[40px] opacity-30"></div>
              
              <div className="relative z-10 flex flex-col items-center">
                <div className="text-white/60 text-xs font-bold uppercase tracking-widest mb-3">Current Focus</div>
                <div className="font-serif text-6xl font-medium tracking-tight text-white mb-6">24<span className="opacity-50">:</span>15</div>
                <div className="w-full h-2 bg-white/10 rounded-full mb-6 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full w-[45%] shadow-[0_0_10px_rgba(37,99,235,0.5)]"></div>
                </div>
                <button className="w-full py-3 bg-white text-foreground rounded-xl text-sm font-bold hover:bg-white/90 transition-colors shadow-sm">
                  Pause Session
                </button>
              </div>
            </div>

            {/* Mini Calendar / Agenda */}
            <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-border shadow-sm">
              <h3 className="font-serif text-xl font-bold mb-5 flex items-center justify-between text-foreground">
                Coming Up
                <button className="text-primary hover:text-primary/80 text-sm font-sans font-semibold flex items-center group">
                  View <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </button>
              </h3>
              
              <div className="space-y-5 relative before:absolute before:inset-y-2 before:left-[11px] before:w-[2px] before:bg-border">
                <div className="relative pl-8">
                  <div className="absolute left-0 top-1.5 w-6 h-6 bg-background border-[3px] border-primary rounded-full flex items-center justify-center z-10 shadow-sm">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                  </div>
                  <div className="text-sm font-bold text-foreground">Product Review</div>
                  <div className="text-xs font-medium text-muted-foreground mt-1">4:00 PM • Conf Room A</div>
                </div>
                
                <div className="relative pl-8">
                  <div className="absolute left-0 top-1.5 w-6 h-6 bg-background border-[3px] border-border rounded-full flex items-center justify-center z-10"></div>
                  <div className="text-sm font-bold text-foreground">Send Weekly Update</div>
                  <div className="text-xs font-medium text-muted-foreground mt-1">5:30 PM • Asynchronous</div>
                </div>
                
                <div className="relative pl-8">
                  <div className="absolute left-0 top-1.5 w-6 h-6 bg-background border-[3px] border-border rounded-full flex items-center justify-center z-10"></div>
                  <div className="text-sm font-bold text-foreground">End of Day Reflection</div>
                  <div className="text-xs font-medium text-muted-foreground mt-1">6:00 PM</div>
                </div>
              </div>
            </div>

            {/* Quick Note */}
            <div className="bg-white/60 backdrop-blur-md border border-border rounded-2xl p-5 shadow-sm focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10 transition-all">
              <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-chart-5"></div>
                Scratchpad
              </h4>
              <textarea 
                className="w-full bg-transparent resize-none outline-none text-sm text-foreground placeholder:text-muted-foreground/60 min-h-[120px] font-medium"
                placeholder="Jot down a quick thought..."
              />
            </div>
            
          </div>
        </aside>
      </div>
    </div>
  );
}
