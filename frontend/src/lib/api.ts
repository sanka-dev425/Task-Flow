import { auth } from "./firebase";
import type { Task, CreateTaskInput, UpdateTaskInput, TaskFilter } from "@/types/task";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000";

class ApiError extends Error {
  constructor(public status: number, message: string, public details?: unknown) {
    super(message);
    this.name = "ApiError";
  }
}

async function getAuthHeader(): Promise<HeadersInit> {
  const user = auth.currentUser;
  if (!user) throw new ApiError(401, "Not authenticated");
  const token = await user.getIdToken();
  return { Authorization: `Bearer ${token}` };
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const authHeader = await getAuthHeader();
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...authHeader,
      ...(options.headers ?? {}),
    },
  });

  if (res.status === 204) return undefined as T;

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    throw new ApiError(
      res.status,
      data?.error ?? `Request failed (${res.status})`,
      data?.details
    );
  }

  return data as T;
}

export const tasksApi = {
  list: (filter: TaskFilter = "all") => {
    const qs = filter === "all" ? "" : `?status=${filter}`;
    return request<Task[]>(`/api/tasks${qs}`);
  },
  create: (input: CreateTaskInput) =>
    request<Task>("/api/tasks", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  update: (id: string, input: UpdateTaskInput) =>
    request<Task>(`/api/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(input),
    }),
  remove: (id: string) =>
    request<void>(`/api/tasks/${id}`, { method: "DELETE" }),
};

export { ApiError };
