"use client";

import { useState } from "react";
import { Check, Trash2, Pencil, Loader2, X, Calendar, Clock, Zap, Sparkles, Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Task, Priority } from "@/types/task";

interface Props {
  task: Task;
  onToggle: (task: Task) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, title: string, description: string | null) => Promise<void> | void;
  busy?: boolean;
}

export function TaskItem({ task, onToggle, onDelete, onUpdate, busy }: Props) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? "");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!title.trim()) return;
    setSaving(true);
    try {
      await onUpdate(task.id, title.trim(), description.trim() || null);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const cancel = () => {
    setTitle(task.title);
    setDescription(task.description ?? "");
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") cancel();
    if (e.key === "Enter" && !e.shiftKey && (e.target as HTMLElement).tagName !== "TEXTAREA") {
      e.preventDefault();
      save();
    }
  };

  const getPriorityIcon = () => {
    switch (task.priority) {
      case "high": return Flame;
      case "medium": return Sparkles;
      case "low": return Zap;
      default: return Sparkles;
    }
  };

  const PriorityIcon = getPriorityIcon();

  const formatDueDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const isTomorrow = new Date(now.getTime() + 86400000).toDateString() === date.toDateString();
    
    if (isToday) return "Today";
    if (isTomorrow) return "Tomorrow";
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.isCompleted;

  return (
    <div
      className={cn(
        "card p-4 sm:p-5 flex items-start gap-4 transition-all duration-200 group",
        "hover:shadow-lg hover:-translate-y-0.5",
        task.isCompleted && "bg-muted/50 opacity-75 hover:opacity-90"
      )}
    >
      {/* Toggle checkbox */}
      <button
        type="button"
        aria-label={task.isCompleted ? "Mark pending" : "Mark complete"}
        onClick={() => onToggle(task)}
        disabled={busy}
        className={cn(
          "mt-0.5 flex-shrink-0 h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all duration-200",
          task.isCompleted
            ? "bg-emerald-500 border-emerald-500 text-white"
            : "border-muted-foreground/30 hover:border-brand-500 hover:bg-brand-50 dark:hover:bg-brand-950/30"
        )}
      >
        {task.isCompleted && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {editing ? (
          <div className="space-y-2.5 animate-fade-in" onKeyDown={handleKeyDown}>
            <input
              className="input font-medium"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              autoFocus
              maxLength={200}
            />
            <textarea
              className="input resize-none text-sm"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description (optional)"
              maxLength={2000}
            />
            <div className="flex items-center gap-2 pt-0.5">
              <button
                type="button"
                onClick={save}
                disabled={!title.trim() || saving}
                className="btn-primary h-8 text-xs px-3"
              >
                {saving && <Loader2 className="h-3 w-3 animate-spin" />}
                Save changes
              </button>
              <button
                type="button"
                onClick={cancel}
                className="btn-ghost h-8 text-xs px-3"
              >
                <X className="h-3 w-3" />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-start gap-3">
              <h3
                className={cn(
                  "font-semibold text-base leading-snug break-words transition-colors flex-1",
                  task.isCompleted && "line-through text-muted-foreground"
                )}
              >
                {task.title}
              </h3>
            </div>
            
            {task.description && (
              <p
                className={cn(
                  "text-sm text-muted-foreground mt-1.5 whitespace-pre-wrap break-words leading-relaxed",
                  task.isCompleted && "opacity-60"
                )}
              >
                {task.description}
              </p>
            )}
            
            {/* Meta info row */}
            <div className="flex items-center gap-4 mt-3 flex-wrap">
              {/* Date */}
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>{new Date(task.createdAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}</span>
              </div>
              
              {/* Due Date */}
              {task.dueDate && (
                <div className={cn(
                  "flex items-center gap-1.5 text-xs",
                  isOverdue ? "text-red-500" : "text-muted-foreground"
                )}>
                  <Clock className="h-3 w-3" />
                  <span>{formatDueDate(task.dueDate)}</span>
                </div>
              )}
              
              {/* Priority */}
              {task.priority && (
                <div className={cn(
                  "flex items-center gap-1 text-xs px-2 py-0.5 rounded-full",
                  task.priority === "high" && "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
                  task.priority === "medium" && "bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400",
                  task.priority === "low" && "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400",
                )}>
                  <PriorityIcon className="h-3 w-3" />
                  <span className="capitalize">{task.priority}</span>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Actions */}
      {!editing && (
        <div className="flex items-center gap-0.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="p-2 rounded-lg text-muted-foreground hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-950/30 transition-all"
            aria-label="Edit task"
            disabled={busy}
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(task.id)}
            className="p-2 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
            aria-label="Delete task"
            disabled={busy}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
