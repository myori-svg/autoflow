import type { Task, TaskUpdateInput } from "../types";

export async function fetchTasks(): Promise<Task[]> {
	const res = await fetch("/api/tasks");
	if (!res.ok) throw new Error(`서버 오류: ${res.status}`);
	return res.json() as Promise<Task[]>;
}

export async function createTask(
	title: string,
	start: string,
	end: string,
): Promise<Task> {
	const res = await fetch("/api/tasks", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ title, start, end }),
	});
	if (!res.ok) throw new Error(`서버 오류: ${res.status}`);
	return res.json() as Promise<Task>;
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
