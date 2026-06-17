import { useState } from "react";
import { estimateTask } from "../api/ai";
import type { ScheduledTask, Task, TaskUpdateInput, WorkHours } from "../types";
import { assignSchedules, type TaskWithEstimate } from "../utils/autoSchedule";

const DEFAULT_ESTIMATED_HOURS = 1;

type UseScheduleReturn = {
	scheduling: boolean;
	handleAutoSchedule: (
		unscheduled: Task[],
		scheduled: ScheduledTask[],
		onAssign: (id: string, fields: TaskUpdateInput) => Promise<void>,
		workHours: WorkHours,
	) => Promise<number>;
};

export function useSchedule(): UseScheduleReturn {
	const [scheduling, setScheduling] = useState(false);

	const handleAutoSchedule = async (
		unscheduled: Task[],
		scheduled: ScheduledTask[],
		onAssign: (id: string, fields: TaskUpdateInput) => Promise<void>,
		workHours: WorkHours,
	): Promise<number> => {
		if (unscheduled.length === 0) return 0;

		setScheduling(true);
		try {
			const withEstimates: TaskWithEstimate[] = await Promise.all(
				unscheduled.map(async (task) => {
					if (task.estimatedHours !== undefined) {
						return task;
					}
					if (!task.deadline) {
						return { ...task, estimatedHours: DEFAULT_ESTIMATED_HOURS };
					}
					try {
						const { estimatedHours } = await estimateTask(
							task.title,
							new Date(task.deadline),
						);
						return { ...task, estimatedHours };
					} catch {
						return { ...task, estimatedHours: DEFAULT_ESTIMATED_HOURS };
					}
				}),
			);

			const assignments = assignSchedules(withEstimates, scheduled, workHours);
			const estimatesById = new Map(
				withEstimates.map((task) => [task._id, task.estimatedHours]),
			);

			for (const { id, start, end } of assignments) {
				const original = unscheduled.find((task) => task._id === id);
				const fields: TaskUpdateInput = { start, end };
				if (
					original?.estimatedHours === undefined &&
					estimatesById.get(id) !== undefined
				) {
					fields.estimatedHours = estimatesById.get(id);
				}
				await onAssign(id, fields);
			}

			return assignments.length;
		} finally {
			setScheduling(false);
		}
	};

	return { scheduling, handleAutoSchedule };
}
