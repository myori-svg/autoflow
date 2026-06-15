import { useCallback, useEffect, useState } from "react";
import { estimateTask } from "../api/ai";
import { createTask, deleteTask, fetchTasks, updateTask } from "../api/tasks";
import type {
	CreateTaskInput,
	ScheduledTask,
	Task,
	TaskUpdateInput,
} from "../types";

export type SyncStatus = "idle" | "syncing" | "synced" | "error";

function toScheduledTask(task: Task): ScheduledTask {
	return {
		id: task._id,
		title: task.title,
		description: task.description,
		priority: task.priority,
		start: task.start as string,
		end: task.end as string,
	};
}

type UseTasksReturn = {
	tasks: ScheduledTask[];
	unscheduledTasks: Task[];
	syncStatus: SyncStatus;
	addTask: (input: CreateTaskInput) => Promise<void>;
	moveTask: (id: string, start: string, end: string) => Promise<void>;
	editTask: (id: string, fields: TaskUpdateInput) => Promise<void>;
	removeTask: (id: string) => Promise<void>;
};

export function useTasks(): UseTasksReturn {
	const [allTasks, setAllTasks] = useState<Task[]>([]);
	const [syncStatus, setSyncStatus] = useState<SyncStatus>("idle");

	useEffect(() => {
		fetchTasks()
			.then((data) => setAllTasks(data))
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
		(input: CreateTaskInput) =>
			sync(async () => {
				let estimatedHours = input.estimatedHours;
				if (estimatedHours === undefined && input.deadline) {
					try {
						const estimate = await estimateTask(
							input.title,
							new Date(input.deadline),
						);
						estimatedHours = estimate.estimatedHours;
					} catch (err) {
						console.error("소요 시간 추정 실패", err);
					}
				}

				const task = await createTask({ ...input, estimatedHours });
				setAllTasks((prev) => [...prev, task]);
			}),
		[sync],
	);

	const moveTask = useCallback(
		(id: string, start: string, end: string) =>
			sync(async () => {
				const task = await updateTask(id, { start, end });
				setAllTasks((prev) => prev.map((t) => (t._id === task._id ? task : t)));
			}),
		[sync],
	);

	const editTask = useCallback(
		(id: string, fields: TaskUpdateInput) =>
			sync(async () => {
				const task = await updateTask(id, fields);
				setAllTasks((prev) => prev.map((t) => (t._id === task._id ? task : t)));
			}),
		[sync],
	);

	const removeTask = useCallback(
		(id: string) =>
			sync(async () => {
				await deleteTask(id);
				setAllTasks((prev) => prev.filter((t) => t._id !== id));
			}),
		[sync],
	);

	const isScheduled = (t: Task) => !!(t.start && t.end);
	const tasks = allTasks.filter(isScheduled).map(toScheduledTask);
	const unscheduledTasks = allTasks.filter((t) => !isScheduled(t));

	return {
		tasks,
		unscheduledTasks,
		syncStatus,
		addTask,
		moveTask,
		editTask,
		removeTask,
	};
}
