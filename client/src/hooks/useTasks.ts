import { useCallback, useEffect, useState } from "react";
import { createTask, fetchTasks, updateTaskSchedule } from "../api/tasks";
import type { ScheduledTask, Task } from "../types";

function toScheduledTask(task: Task): ScheduledTask {
	return { id: task._id, title: task.title, start: task.start, end: task.end };
}

type UseTasksReturn = {
	tasks: ScheduledTask[];
	addTask: (title: string, start: string, end: string) => Promise<void>;
	moveTask: (id: string, start: string, end: string) => Promise<void>;
};

export function useTasks(): UseTasksReturn {
	const [tasks, setTasks] = useState<ScheduledTask[]>([]);

	useEffect(() => {
		fetchTasks()
			.then((data) => setTasks(data.map(toScheduledTask)))
			.catch((err) => console.error(err));
	}, []);

	const addTask = useCallback(
		async (title: string, start: string, end: string) => {
			const task = await createTask(title, start, end);
			setTasks((prev) => [...prev, toScheduledTask(task)]);
		},
		[],
	);

	const moveTask = useCallback(
		async (id: string, start: string, end: string) => {
			const task = await updateTaskSchedule(id, start, end);
			setTasks((prev) =>
				prev.map((t) => (t.id === task._id ? toScheduledTask(task) : t)),
			);
		},
		[],
	);

	return { tasks, addTask, moveTask };
}
