import { useState } from "react";
import { estimateTask } from "../api/ai";
import type { ScheduledTask, Task, TaskUpdateInput } from "../types";
import { assignSchedules, type TaskWithEstimate } from "../utils/autoSchedule";

const DEFAULT_ESTIMATED_HOURS = 1;

type UseScheduleReturn = {
	scheduling: boolean;
	handleAutoSchedule: (
		unscheduled: Task[],
		scheduled: ScheduledTask[],
		onAssign: (id: string, fields: TaskUpdateInput) => Promise<void>,
	) => Promise<void>;
};

export function useSchedule(): UseScheduleReturn {
	const [scheduling, setScheduling] = useState(false);

	const handleAutoSchedule = async (
		unscheduled: Task[],
		scheduled: ScheduledTask[],
		onAssign: (id: string, fields: TaskUpdateInput) => Promise<void>,
	) => {
		if (unscheduled.length === 0) {
			alert("배치할 미배치 할일이 없습니다.");
			return;
		}

		setScheduling(true);
		try {
			const withEstimates: TaskWithEstimate[] = await Promise.all(
				unscheduled.map(async (task) => {
					if (!task.deadline) {
						return { ...task, estimatedHours: DEFAULT_ESTIMATED_HOURS };
					}
					const { estimatedHours } = await estimateTask(
						task.title,
						new Date(task.deadline),
					);
					return { ...task, estimatedHours };
				}),
			);

			const assignments = assignSchedules(withEstimates, scheduled);

			for (const { id, start, end } of assignments) {
				await onAssign(id, { start, end });
			}

			alert(`${assignments.length}개의 할일을 캘린더에 배치했습니다.`);
		} catch (err) {
			alert(err instanceof Error ? err.message : "자동 배분에 실패했습니다.");
		} finally {
			setScheduling(false);
		}
	};

	return { scheduling, handleAutoSchedule };
}
