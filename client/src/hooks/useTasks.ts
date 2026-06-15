import { useCallback, useEffect, useState } from "react";
import { createTask, fetchTasks, updateTask } from "../api/tasks";
import type { ScheduledTask, Task, TaskUpdateInput } from "../types";

export type SyncStatus = "idle" | "syncing" | "synced" | "error";

function toScheduledTask(task: Task): ScheduledTask {
	return {
		id: task._id,
		title: task.title,
		description: task.description,
		priority: task.priority,
		start: task.start,
		end: task.end,
	};
}

type UseTasksReturn = {
	tasks: ScheduledTask[];
	syncStatus: SyncStatus;
	addTask: (title: string, start: string, end: string) => Promise<void>;
	moveTask: (id: string, start: string, end: string) => Promise<void>;
	editTask: (id: string, fields: TaskUpdateInput) => Promise<void>;
};

export function useTasks(): UseTasksReturn {
	const [tasks, setTasks] = useState<ScheduledTask[]>([]);
	const [syncStatus, setSyncStatus] = useState<SyncStatus>("idle");

	useEffect(() => {
		fetchTasks()
			.then((data) => setTasks(data.map(toScheduledTask)))
			.catch((err) => console.error(err));
	}, []);

	const sync = useCallback(async (run: () => Promise<void>) => {
		setSyncStatus("syncing");
		try {
			await run();
			setSyncStatus("synced");
		} catch (err) {
			setSyncStatus("error");
			throw err;
		}
	}, []);

	const addTask = useCallback(
		(title: string, start: string, end: string) =>
			sync(async () => {
				const task = await createTask(title, start, end);
				setTasks((prev) => [...prev, toScheduledTask(task)]);
			}),
		[sync],
	);

	const moveTask = useCallback(
		(id: string, start: string, end: string) =>
			sync(async () => {
				const task = await updateTask(id, { start, end });
				setTasks((prev) =>
					prev.map((t) => (t.id === task._id ? toScheduledTask(task) : t)),
				);
			}),
		[sync],
	);

	const editTask = useCallback(
		(id: string, fields: TaskUpdateInput) =>
			sync(async () => {
				const task = await updateTask(id, fields);
				setTasks((prev) =>
					prev.map((t) => (t.id === task._id ? toScheduledTask(task) : t)),
				);
			}),
		[sync],
	);

	return { tasks, syncStatus, addTask, moveTask, editTask };
}
