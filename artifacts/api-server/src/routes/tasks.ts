import { Router, type IRouter } from "express";
import { and, desc, eq, gte, lt, sql } from "drizzle-orm";
import { db, tasksTable } from "@workspace/db";
import {
  CreateTaskBody,
  ListTasksQueryParams,
  UpdateTaskBody,
  UpdateTaskParams,
  DeleteTaskParams,
} from "@workspace/api-zod";
import { requireAuth, type AuthedRequest } from "../middlewares/requireAuth";

const router: IRouter = Router();

router.use(requireAuth);

function serialize(t: typeof tasksTable.$inferSelect) {
  return {
    id: t.id,
    title: t.title,
    description: t.description,
    isCompleted: t.isCompleted,
    priority: t.priority,
    dueDate: t.dueDate ? t.dueDate.toISOString() : null,
    createdAt: t.createdAt.toISOString(),
    updatedAt: t.updatedAt.toISOString(),
  };
}

router.get("/", async (req, res) => {
  const userId = (req as AuthedRequest).userId;
  const parsed = ListTasksQueryParams.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid query parameters" });
  }
  const status = parsed.data.status ?? "all";
  const conditions = [eq(tasksTable.userId, userId)];
  if (status === "pending") conditions.push(eq(tasksTable.isCompleted, false));
  if (status === "completed") conditions.push(eq(tasksTable.isCompleted, true));

  const rows = await db
    .select()
    .from(tasksTable)
    .where(and(...conditions))
    .orderBy(desc(tasksTable.createdAt));

  return res.json(rows.map(serialize));
});

router.get("/summary", async (req, res) => {
  const userId = (req as AuthedRequest).userId;
  const rows = await db
    .select()
    .from(tasksTable)
    .where(eq(tasksTable.userId, userId));

  const now = new Date();
  const startOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
  const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

  let total = rows.length;
  let completed = 0;
  let pending = 0;
  let completedToday = 0;
  let dueToday = 0;
  let overdue = 0;

  for (const t of rows) {
    if (t.isCompleted) {
      completed++;
      if (t.updatedAt >= startOfDay && t.updatedAt < endOfDay) {
        completedToday++;
      }
    } else {
      pending++;
      if (t.dueDate) {
        if (t.dueDate >= startOfDay && t.dueDate < endOfDay) dueToday++;
        else if (t.dueDate < startOfDay) overdue++;
      }
    }
  }

  const completionRate = total > 0 ? completed / total : 0;

  return res.json({
    total,
    completed,
    pending,
    completedToday,
    dueToday,
    overdue,
    completionRate,
  });
});

router.post("/", async (req, res) => {
  const userId = (req as AuthedRequest).userId;
  const parsed = CreateTaskBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid task data" });
  }
  const { title, description, priority, dueDate } = parsed.data;
  const [row] = await db
    .insert(tasksTable)
    .values({
      userId,
      title,
      description: description ?? null,
      priority: priority ?? "medium",
      dueDate: dueDate ? new Date(dueDate) : null,
    })
    .returning();
  return res.status(201).json(serialize(row));
});

router.put("/:id", async (req, res) => {
  const userId = (req as AuthedRequest).userId;
  const paramsParsed = UpdateTaskParams.safeParse(req.params);
  const bodyParsed = UpdateTaskBody.safeParse(req.body);
  if (!paramsParsed.success || !bodyParsed.success) {
    return res.status(400).json({ error: "Invalid input" });
  }
  const { id } = paramsParsed.data;
  const updates: Record<string, unknown> = { updatedAt: new Date() };
  const b = bodyParsed.data;
  if (b.title !== undefined) updates.title = b.title;
  if (b.description !== undefined) updates.description = b.description;
  if (b.isCompleted !== undefined) updates.isCompleted = b.isCompleted;
  if (b.priority !== undefined) updates.priority = b.priority;
  if (b.dueDate !== undefined)
    updates.dueDate = b.dueDate ? new Date(b.dueDate) : null;

  const [row] = await db
    .update(tasksTable)
    .set(updates)
    .where(and(eq(tasksTable.id, id), eq(tasksTable.userId, userId)))
    .returning();

  if (!row) return res.status(404).json({ error: "Task not found" });
  return res.json(serialize(row));
});

router.delete("/:id", async (req, res) => {
  const userId = (req as AuthedRequest).userId;
  const parsed = DeleteTaskParams.safeParse(req.params);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid id" });
  }
  const { id } = parsed.data;
  const result = await db
    .delete(tasksTable)
    .where(and(eq(tasksTable.id, id), eq(tasksTable.userId, userId)))
    .returning({ id: tasksTable.id });
  if (result.length === 0)
    return res.status(404).json({ error: "Task not found" });
  return res.status(204).send();
});

export default router;
