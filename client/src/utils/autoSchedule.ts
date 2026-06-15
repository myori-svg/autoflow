import type { ScheduledTask, Task } from "../types";
import { calculatePriorityScore } from "./priority";
import { hasConflict } from "./schedule";

const SLOT_STEP_MINUTES = 30;
const DAY_START_HOUR = 6;
const DAY_END_HOUR = 24;
const MAX_SEARCH_DAYS = 14;

function roundUpToSlot(date: Date): Date {
	const result = new Date(date);
	const remainder = result.getMinutes() % SLOT_STEP_MINUTES;
	if (
		remainder !== 0 ||
		result.getSeconds() > 0 ||
		result.getMilliseconds() > 0
	) {
		result.setMinutes(result.getMinutes() + (SLOT_STEP_MINUTES - remainder));
	}
	result.setSeconds(0, 0);
	return result;
}

export function findAvailableSlot(
	durationHours: number,
	existing: ScheduledTask[],
	searchFrom: Date,
): { start: string; end: string } {
	let cursor = roundUpToSlot(searchFrom);
	const durationMs = durationHours * 60 * 60 * 1000;

	for (let i = 0; i < (MAX_SEARCH_DAYS * 24 * 60) / SLOT_STEP_MINUTES; i++) {
		const dayEnd = new Date(cursor);
		dayEnd.setHours(DAY_END_HOUR, 0, 0, 0);

		if (cursor.getHours() < DAY_START_HOUR) {
			cursor.setHours(DAY_START_HOUR, 0, 0, 0);
		}

		const candidateEnd = new Date(cursor.getTime() + durationMs);

		if (candidateEnd > dayEnd) {
			cursor = new Date(cursor);
			cursor.setDate(cursor.getDate() + 1);
			cursor.setHours(DAY_START_HOUR, 0, 0, 0);
			continue;
		}

		const candidate = {
			id: "candidate",
			start: cursor.toISOString(),
			end: candidateEnd.toISOString(),
		};

		if (!hasConflict(candidate, existing)) {
			return { start: candidate.start, end: candidate.end };
		}

		cursor = new Date(cursor.getTime() + SLOT_STEP_MINUTES * 60 * 1000);
	}

	const fallbackStart = roundUpToSlot(searchFrom);
	return {
		start: fallbackStart.toISOString(),
		end: new Date(fallbackStart.getTime() + durationMs).toISOString(),
	};
}

export type TaskWithEstimate = Task & { estimatedHours?: number };

export function assignSchedules(
	tasks: TaskWithEstimate[],
	existing: ScheduledTask[],
	now: Date = new Date(),
): Array<{ id: string; start: string; end: string }> {
	const sorted = [...tasks].sort(
		(a, b) => calculatePriorityScore(b, now) - calculatePriorityScore(a, now),
	);

	const occupied = [...existing];
	const results: Array<{ id: string; start: string; end: string }> = [];

	for (const task of sorted) {
		const durationHours = task.estimatedHours ?? 1;
		const slot = findAvailableSlot(durationHours, occupied, now);

		results.push({ id: task._id, ...slot });
		occupied.push({
			id: task._id,
			title: task.title,
			priority: task.priority,
			start: slot.start,
			end: slot.end,
		});
	}

	return results;
}
