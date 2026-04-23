export type Priority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  description: string | null;
  isCompleted: boolean;
  priority: Priority;
  dueDate: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export type TaskFilter = "all" | "pending" | "completed";

export interface CreateTaskInput {
  title: string;
  description?: string | null;
  dueDate?: string;
  priority?: Priority;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string | null;
  isCompleted?: boolean;
  priority?: Priority;
  dueDate?: string | null;
}
