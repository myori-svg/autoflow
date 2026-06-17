import type { CreateTaskInput, Task, TaskUpdateInput } from "../types";

export async function fetchTasks(): Promise<Task[]> {
	const res = await fetch("/api/tasks");
	if (!res.ok) throw new Error(`서버 오류: ${res.status}`);
	return res.json() as Promise<Task[]>;
}

export async function createTask(input: CreateTaskInput): Promise<Task> {
	const res = await fetch("/api/tasks", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(input),
	});
	if (!res.ok) throw new Error(`서버 오류: ${res.status}`);
	return res.json() as Promise<Task>;
}

export async function deleteTask(id: string): Promise<void> {
	const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
	if (!res.ok) throw new Error(`서버 오류: ${res.status}`);
}

export async function updateTask(
	id: string,
	fields: TaskUpdateInput,
): Promise<Task> {
	const res = await fetch(`/api/tasks/${id}`, {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(fields),
	});
	if (!res.ok) throw new Error(`서버 오류: ${res.status}`);
	return res.json() as Promise<Task>;
}
