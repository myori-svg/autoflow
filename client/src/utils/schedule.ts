import type { ScheduledTask } from "../types";

export function hasConflict(
	target: { id: string; start: string; end: string },
	others: ScheduledTask[],
): boolean {
	const targetStart = new Date(target.start).getTime();
	const targetEnd = new Date(target.end).getTime();

	return others.some((task) => {
		if (task.id === target.id) return false;
		const taskStart = new Date(task.start).getTime();
		const taskEnd = new Date(task.end).getTime();
		return targetStart < taskEnd && taskStart < targetEnd;
	});
}
