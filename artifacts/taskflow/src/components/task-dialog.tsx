import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateTask, useUpdateTask, getListTasksQueryKey, useListTasks } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import type { Task, Priority } from "@workspace/api-client-react/src/generated/api.schemas";
import { Loader2 } from "lucide-react";

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task;
}

export function TaskDialog({ open, onOpenChange, task }: TaskDialogProps) {
  const queryClient = useQueryClient();
  const createMutation = useCreateTask();
  const updateMutation = useUpdateTask();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [dueDate, setDueDate] = useState("");

  const isEditing = !!task;
  const isLoading = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (open) {
      if (task) {
        setTitle(task.title);
        setDescription(task.description || "");
        setPriority(task.priority);
        setDueDate(task.dueDate ? task.dueDate.split('T')[0] : "");
      } else {
        setTitle("");
        setDescription("");
        setPriority("medium");
        setDueDate("");
      }
    }
  }, [open, task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const data = {
        title: title.trim(),
        description: description.trim() || null,
        priority,
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      };

      if (isEditing) {
        await updateMutation.mutateAsync({ id: task.id, data });
      } else {
        await createMutation.mutateAsync({ data });
      }

      queryClient.invalidateQueries({ queryKey: getListTasksQueryKey() });
      queryClient.invalidateQueries({ queryKey: ["/api/tasks/summary"] });
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to save task", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white/95 backdrop-blur-xl border-border/50 shadow-2xl p-0 overflow-hidden gap-0 rounded-2xl">
        <div className="p-6 pb-4">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl font-bold">{isEditing ? "Edit task" : "New task"}</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {isEditing ? "Update the details of your task." : "Capture what needs to be done."}
            </DialogDescription>
          </DialogHeader>
        </div>
        
        <form onSubmit={handleSubmit} className="px-6 pb-6 pt-2 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Title</Label>
            <Input 
              id="title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="What needs to be done?" 
              required
              autoFocus
              className="h-11 bg-white border-border/60 focus-visible:ring-primary/20 shadow-sm"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Description (Optional)</Label>
            <Textarea 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Add some details..." 
              className="resize-none min-h-[100px] bg-white border-border/60 focus-visible:ring-primary/20 shadow-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Priority</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
                <SelectTrigger className="h-11 bg-white border-border/60 focus-visible:ring-primary/20 shadow-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dueDate" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Due Date</Label>
              <Input 
                id="dueDate" 
                type="date" 
                value={dueDate} 
                onChange={(e) => setDueDate(e.target.value)} 
                className="h-11 bg-white border-border/60 focus-visible:ring-primary/20 shadow-sm"
              />
            </div>
          </div>

          <DialogFooter className="pt-4 border-t border-border/40 sm:justify-between items-center">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="text-muted-foreground font-semibold">
              Cancel
            </Button>
            <Button type="submit" disabled={!title.trim() || isLoading} className="bg-primary hover:bg-primary/90 text-white h-11 px-8 rounded-xl font-semibold shadow-md transition-all">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Save changes" : "Create task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}