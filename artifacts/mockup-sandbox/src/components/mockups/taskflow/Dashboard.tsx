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
  ChevronDown
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
    <div className="min-h-screen bg-[#FDFCFB] text-[#1C1C1A] font-sans flex flex-col selection:bg-[#2A453B] selection:text-white">
      {/* Top Nav */}
      <header className="h-16 border-b border-[#E8E6E1] bg-white/50 backdrop-blur-sm sticky top-0 z-20 px-6 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded bg-[#1C1C1A] text-[#FDFCFB] flex items-center justify-center">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <span className="font-serif text-lg font-medium tracking-tight">TaskFlow</span>
          </div>
          
          <div className="hidden md:flex items-center relative group">
            <Search className="absolute left-3 h-4 w-4 text-[#A1A09D] group-focus-within:text-[#2A453B] transition-colors" />
            <input 
              type="text" 
              placeholder="Search tasks, notes, or tags..." 
              className="pl-9 pr-4 py-1.5 w-64 bg-[#F5F4F1] border border-transparent focus:border-[#E8E6E1] focus:bg-white rounded-full text-sm outline-none transition-all placeholder:text-[#A1A09D]"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm font-medium text-[#6C6B68] hidden sm:block">
            {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </div>
          <button className="text-[#6C6B68] hover:text-[#1C1C1A] transition-colors relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-[#8C4A32] border-2 border-white"></span>
          </button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <Avatar className="h-8 w-8 border border-[#E8E6E1]">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback className="bg-[#2A453B] text-white text-xs">EL</AvatarFallback>
                </Avatar>
                <ChevronDown className="h-4 w-4 text-[#A1A09D]" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-white border-[#E8E6E1] shadow-lg rounded-xl">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Eleanor</p>
                  <p className="text-xs leading-none text-muted-foreground">eleanor@example.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[#E8E6E1]" />
              <DropdownMenuItem className="focus:bg-[#F5F4F1] cursor-pointer">
                <Settings className="mr-2 h-4 w-4 text-[#6C6B68]" />
                <span>Preferences</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="focus:bg-[#F5F4F1] cursor-pointer text-[#8C4A32] focus:text-[#8C4A32]">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="flex-1 flex max-w-[1400px] w-full mx-auto">
        {/* Main Content */}
        <main className="flex-1 px-6 py-10 md:px-12 max-w-4xl">
          <div className="space-y-8">
            
            {/* Header Area */}
            <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
              <h1 className="font-serif text-4xl font-medium tracking-tight">Good morning, Eleanor.</h1>
              <p className="text-lg text-[#6C6B68]">You have {pendingCount} tasks requiring your attention today. Maintain the momentum.</p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100 ease-out fill-mode-both">
              <div className="bg-white border border-[#E8E6E1] rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-16 h-16 bg-[#2A453B]/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                <div className="text-[#6C6B68] text-sm font-medium mb-1">Today</div>
                <div className="font-serif text-3xl">{taskList.length}</div>
              </div>
              <div className="bg-white border border-[#E8E6E1] rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-[#6C6B68] text-sm font-medium mb-1">Pending</div>
                <div className="font-serif text-3xl">{pendingCount}</div>
              </div>
              <div className="bg-white border border-[#E8E6E1] rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-[#6C6B68] text-sm font-medium mb-1">Completed</div>
                <div className="font-serif text-3xl text-[#2A453B]">{completedCount}</div>
              </div>
              <div className="bg-white border border-[#E8E6E1] rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-16 h-16 bg-[#8C4A32]/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                <div className="text-[#6C6B68] text-sm font-medium mb-1 flex items-center gap-1">
                  <Flame className="h-3.5 w-3.5 text-[#8C4A32]" /> Streak
                </div>
                <div className="font-serif text-3xl">12 <span className="text-base text-[#A1A09D] font-sans tracking-normal">days</span></div>
              </div>
            </div>

            {/* Tasks Section */}
            <div className="pt-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 ease-out fill-mode-both">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-[#E8E6E1] pb-4">
                <div className="flex gap-6">
                  {["all", "pending", "completed"].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={cn(
                        "text-sm font-medium capitalize tracking-wider pb-4 -mb-[17px] transition-colors relative",
                        filter === f ? "text-[#1C1C1A]" : "text-[#A1A09D] hover:text-[#6C6B68]"
                      )}
                    >
                      {f}
                      {filter === f && (
                        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#1C1C1A]" />
                      )}
                    </button>
                  ))}
                </div>
                
                <Button className="bg-[#1C1C1A] text-white hover:bg-[#2A453B] rounded-full h-9 px-4 text-sm shadow-sm">
                  <Plus className="h-4 w-4 mr-1" /> Add Task
                </Button>
              </div>

              <div className="space-y-3">
                {filteredTasks.length === 0 ? (
                  <div className="text-center py-16 px-4 bg-[#F5F4F1] rounded-xl border border-dashed border-[#E8E6E1]">
                    <CircleDashed className="h-8 w-8 text-[#A1A09D] mx-auto mb-3" />
                    <h3 className="font-medium text-[#1C1C1A] mb-1">No tasks found</h3>
                    <p className="text-sm text-[#6C6B68]">You're all caught up for now.</p>
                  </div>
                ) : (
                  filteredTasks.map((task, i) => (
                    <div 
                      key={task.id}
                      className={cn(
                        "group flex items-start gap-4 p-4 rounded-xl transition-all duration-300 border bg-white hover:shadow-md",
                        task.completed ? "border-transparent opacity-60 hover:opacity-100" : "border-[#E8E6E1] shadow-sm",
                        "animate-in fade-in slide-in-from-bottom-2 fill-mode-both"
                      )}
                      style={{ animationDelay: `${200 + i * 50}ms` }}
                    >
                      <button 
                        onClick={() => toggleTask(task.id)}
                        className={cn(
                          "mt-1 flex-shrink-0 h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors duration-200",
                          task.completed ? "bg-[#2A453B] border-[#2A453B] text-white" : "border-[#C2C0BA] hover:border-[#2A453B]"
                        )}
                      >
                        {task.completed && <CheckCircle2 className="h-3.5 w-3.5" />}
                      </button>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-4">
                          <h3 className={cn(
                            "font-medium text-base truncate transition-all duration-200",
                            task.completed ? "line-through text-[#A1A09D]" : "text-[#1C1C1A]"
                          )}>
                            {task.title}
                          </h3>
                          <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                            <button className="text-[#A1A09D] hover:text-[#1C1C1A]"><MoreHorizontal className="h-4 w-4" /></button>
                          </div>
                        </div>
                        
                        {task.desc && (
                          <p className={cn(
                            "text-sm mt-1 truncate",
                            task.completed ? "text-[#C2C0BA]" : "text-[#6C6B68]"
                          )}>
                            {task.desc}
                          </p>
                        )}
                        
                        <div className="flex flex-wrap items-center gap-3 mt-3 text-xs">
                          <div className={cn(
                            "flex items-center gap-1 font-medium",
                            task.completed ? "text-[#C2C0BA]" : "text-[#8C4A32]"
                          )}>
                            <Clock className="h-3 w-3" />
                            {task.time}
                          </div>
                          <div className="px-2 py-0.5 rounded-full bg-[#F5F4F1] text-[#6C6B68] font-medium border border-[#E8E6E1]">
                            {task.tag}
                          </div>
                          {task.priority === 'high' && !task.completed && (
                            <div className="px-2 py-0.5 rounded-full bg-[#FFF0ED] text-[#8C4A32] font-medium">
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
        <aside className="hidden lg:block w-80 border-l border-[#E8E6E1] bg-white/30 px-6 py-10 relative">
          <div className="sticky top-24 space-y-10 animate-in fade-in slide-in-from-right-8 duration-700 delay-300 ease-out fill-mode-both">
            
            {/* Focus Timer Mini */}
            <div className="bg-[#1C1C1A] text-white rounded-2xl p-6 relative overflow-hidden shadow-lg">
              <div className="absolute top-[-20%] right-[-10%] w-[150px] h-[150px] rounded-full bg-[#2A453B] blur-[50px] opacity-60"></div>
              
              <div className="relative z-10 flex flex-col items-center">
                <div className="text-[#A1A09D] text-xs uppercase tracking-widest font-medium mb-2">Current Focus</div>
                <div className="font-serif text-5xl font-light mb-4">24:15</div>
                <div className="w-full h-1 bg-white/20 rounded-full mb-4 overflow-hidden">
                  <div className="h-full bg-white rounded-full w-[45%]"></div>
                </div>
                <button className="w-full py-2 bg-white text-[#1C1C1A] rounded-lg text-sm font-medium hover:bg-[#FDFCFB] transition-colors">
                  Pause Session
                </button>
              </div>
            </div>

            {/* Mini Calendar / Agenda */}
            <div>
              <h3 className="font-serif text-lg font-medium mb-4 flex items-center justify-between">
                Coming Up
                <button className="text-[#6C6B68] hover:text-[#1C1C1A] text-sm font-sans flex items-center">
                  View <ArrowRight className="h-3 w-3 ml-1" />
                </button>
              </h3>
              
              <div className="space-y-4 relative before:absolute before:inset-y-0 before:left-[11px] before:w-[1px] before:bg-[#E8E6E1]">
                <div className="relative pl-8">
                  <div className="absolute left-0 top-1.5 w-[23px] h-[23px] bg-[#FDFCFB] border-2 border-[#E8E6E1] rounded-full flex items-center justify-center z-10">
                    <div className="w-2 h-2 bg-[#2A453B] rounded-full"></div>
                  </div>
                  <div className="text-sm font-medium text-[#1C1C1A]">Product Review</div>
                  <div className="text-xs text-[#6C6B68] mt-0.5">4:00 PM • Conf Room A</div>
                </div>
                
                <div className="relative pl-8">
                  <div className="absolute left-0 top-1.5 w-[23px] h-[23px] bg-[#FDFCFB] border-2 border-[#E8E6E1] rounded-full flex items-center justify-center z-10"></div>
                  <div className="text-sm font-medium text-[#1C1C1A]">Send Weekly Update</div>
                  <div className="text-xs text-[#6C6B68] mt-0.5">5:30 PM • Asynchronous</div>
                </div>
                
                <div className="relative pl-8">
                  <div className="absolute left-0 top-1.5 w-[23px] h-[23px] bg-[#FDFCFB] border-2 border-[#E8E6E1] rounded-full flex items-center justify-center z-10"></div>
                  <div className="text-sm font-medium text-[#1C1C1A]">End of Day Reflection</div>
                  <div className="text-xs text-[#6C6B68] mt-0.5">6:00 PM</div>
                </div>
              </div>
            </div>

            {/* Quick Note */}
            <div className="bg-[#F5F4F1] border border-[#E8E6E1] rounded-xl p-4">
              <h4 className="text-xs uppercase tracking-widest text-[#6C6B68] font-medium mb-2">Scratchpad</h4>
              <textarea 
                className="w-full bg-transparent resize-none outline-none text-sm text-[#1C1C1A] placeholder:text-[#A1A09D] min-h-[100px]"
                placeholder="Jot down a quick thought..."
              />
            </div>
            
          </div>
        </aside>
      </div>
    </div>
  );
}
