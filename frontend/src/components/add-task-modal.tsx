"use client";

import { useState, useEffect } from "react";
import { X, Sparkles, Flame, Zap, Calendar, Clock } from "lucide-react";
import { toast } from "sonner";
import { useCreateTask } from "@/hooks/use-tasks";
import { cn } from "@/lib/utils";
import type { Priority } from "@/types/task";

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QUICK_DATES = [
  { label: "Today 6pm", hours: 18 },
  { label: "Tomorrow 9am", hours: 33 },
  { label: "This weekend", days: 6 },
  { label: "Next week", days: 7 },
];

export function AddTaskModal({ isOpen, onClose }: AddTaskModalProps) {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const createTask = useCreateTask();

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setTitle("");
      setNotes("");
      setPriority("medium");
      setDueDate("");
      setDueTime("");
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleQuickDate = (config: { label: string; hours?: number; days?: number }) => {
    const now = new Date();
    let targetDate = new Date();
    
    if (config.hours !== undefined) {
      targetDate.setHours(targetDate.getHours() + config.hours);
    } else if (config.days !== undefined) {
      const dayOfWeek = now.getDay();
      const daysUntilWeekend = (6 - dayOfWeek + 7) % 7 || 7;
      targetDate.setDate(now.getDate() + (config.label === "Next week" ? 7 : daysUntilWeekend));
      targetDate.setHours(10, 0, 0, 0);
    }
    
    const dateStr = targetDate.toISOString().split("T")[0];
    const timeStr = targetDate.toTimeString().slice(0, 5);
    
    setDueDate(dateStr);
    setDueTime(timeStr);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) {
      toast.error("Title is required.");
      return;
    }

    try {
      let dueDateTime: string | undefined;
      if (dueDate) {
        const dateTime = dueTime 
          ? new Date(`${dueDate}T${dueTime}`)
          : new Date(`${dueDate}T23:59:59`);
        dueDateTime = dateTime.toISOString();
      }

      await createTask.mutateAsync({
        title: trimmed,
        description: notes.trim() || null,
        dueDate: dueDateTime,
        priority,
      });
      
      toast.success("Task created!");
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create task.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-background border border-border rounded-3xl shadow-2xl w-full max-w-lg pointer-events-auto animate-scale-in max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6 sm:p-8">
            {/* Header */}
            <div className="flex items-start justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-foreground">New task</h2>
                <p className="text-sm text-muted-foreground mt-1">Capture it. Schedule it. Conquer it.</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-full text-muted-foreground hover:bg-muted transition-colors"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Title Field */}
            <div className="space-y-2 mb-6">
              <label className="label">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What needs to be done?"
                className="input text-base"
                autoFocus
                maxLength={200}
              />
            </div>

            {/* Notes Field */}
            <div className="space-y-2 mb-6">
              <label className="label">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add context, links, or sub-steps..."
                rows={3}
                className="input resize-none"
                maxLength={2000}
              />
            </div>

            {/* Priority Field */}
            <div className="space-y-3 mb-6">
              <label className="label">Priority</label>
              <div className="flex gap-2">
                <PriorityButton
                  priority="low"
                  selected={priority === "low"}
                  onClick={() => setPriority("low")}
                  icon={Zap}
                  label="Low"
                />
                <PriorityButton
                  priority="medium"
                  selected={priority === "medium"}
                  onClick={() => setPriority("medium")}
                  icon={Sparkles}
                  label="Medium"
                />
                <PriorityButton
                  priority="high"
                  selected={priority === "high"}
                  onClick={() => setPriority("high")}
                  icon={Flame}
                  label="High"
                />
              </div>
            </div>

            {/* Due Date & Time Field */}
            <div className="space-y-3 mb-6">
              <label className="label flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5" />
                Due Date & Time
              </label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="input flex-1"
                />
                <input
                  type="time"
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                  className="input w-28"
                />
              </div>
              
              {/* Quick Date Buttons */}
              <div className="flex flex-wrap gap-2 mt-3">
                {QUICK_DATES.map((quick) => (
                  <button
                    key={quick.label}
                    type="button"
                    onClick={() => handleQuickDate(quick)}
                    className="px-3 py-1.5 text-xs font-medium text-muted-foreground border border-border rounded-lg hover:bg-muted hover:text-foreground transition-colors"
                  >
                    {quick.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createTask.isPending || !title.trim()}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-brand-600 rounded-xl hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-brand-500/25"
              >
                {createTask.isPending ? (
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : null}
                Create task
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

interface PriorityButtonProps {
  priority: Priority;
  selected: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

function PriorityButton({ priority, selected, onClick, icon: Icon, label }: PriorityButtonProps) {
  const priorityColors = {
    low: "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400",
    medium: "border-brand-200 dark:border-brand-800 text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/30",
    high: "border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-all",
        selected
          ? priorityColors[priority]
          : "border-border text-muted-foreground hover:border-muted-foreground/50"
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}
