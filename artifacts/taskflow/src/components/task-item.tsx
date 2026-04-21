import { CheckCircle2, MoreHorizontal, Clock, Calendar, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Task } from "@workspace/api-client-react/src/generated/api.schemas";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TaskItemProps {
  task: Task;
  index: number;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function TaskItem({ task, index, onToggle, onEdit, onDelete }: TaskItemProps) {
  const isOverdue = task.dueDate && !task.isCompleted && new Date(task.dueDate) < new Date(new Date().setHours(0,0,0,0));

  return (
    <div 
      className={cn(
        "group flex items-start gap-4 p-5 rounded-2xl transition-all duration-300 border bg-white/80 backdrop-blur-md hover:shadow-lg hover:shadow-primary/5",
        task.isCompleted ? "border-transparent opacity-60 hover:opacity-100 bg-white/40" : "border-border/60 shadow-sm",
        "animate-in fade-in slide-in-from-bottom-4 fill-mode-both"
      )}
      style={{ animationDelay: `${50 + index * 50}ms` }}
    >
      <button 
        onClick={onToggle}
        className={cn(
          "mt-0.5 flex-shrink-0 h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
          task.isCompleted 
            ? "bg-primary border-primary text-white scale-95" 
            : "border-muted-foreground/30 hover:border-primary hover:bg-primary/5"
        )}
      >
        {task.isCompleted && <CheckCircle2 className="h-4 w-4 animate-in zoom-in duration-200" />}
      </button>
      
      <div className="flex-1 min-w-0 pt-0.5">
        <div className="flex items-center justify-between gap-4">
          <h3 className={cn(
            "font-semibold text-[17px] truncate transition-all duration-300",
            task.isCompleted ? "line-through text-muted-foreground" : "text-foreground"
          )}>
            {task.title}
          </h3>
          <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors focus:outline-none">
                <MoreHorizontal className="h-5 w-5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 rounded-xl">
                <DropdownMenuItem onClick={onEdit} className="cursor-pointer font-medium">
                  <Pencil className="mr-2 h-4 w-4" /> Edit task
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onDelete} className="cursor-pointer text-destructive focus:text-destructive font-medium">
                  <Trash2 className="mr-2 h-4 w-4" /> Delete task
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {task.description && (
          <p className={cn(
            "text-sm mt-1.5 line-clamp-2 font-medium",
            task.isCompleted ? "text-muted-foreground/70" : "text-muted-foreground"
          )}>
            {task.description}
          </p>
        )}
        
        <div className="flex flex-wrap items-center gap-3 mt-4 text-xs font-bold">
          {task.dueDate && (
            <div className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded-md border",
              task.isCompleted ? "text-muted-foreground/70 bg-secondary/50 border-transparent" : 
              isOverdue ? "bg-destructive/10 text-destructive border-destructive/20" : 
              "bg-secondary/50 text-foreground border-border/50"
            )}>
              <Calendar className="h-3.5 w-3.5" />
              {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </div>
          )}
          
          {task.priority === 'high' && !task.isCompleted && (
            <div className="px-2.5 py-1 rounded-md bg-chart-4/10 text-chart-4 border border-chart-4/20 shadow-sm flex items-center gap-1.5">
              High Priority
            </div>
          )}
          
          {task.priority === 'low' && !task.isCompleted && (
            <div className="px-2.5 py-1 rounded-md bg-chart-3/10 text-chart-3 border border-chart-3/20 shadow-sm">
              Low Priority
            </div>
          )}
        </div>
      </div>
    </div>
  );
}