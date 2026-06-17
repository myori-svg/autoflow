import type { ScheduledTask, Task, WorkHours } from "../types";
import { calculatePriorityScore } from "./priority";
import { hasConflict } from "./schedule";

const SLOT_STEP_MINUTES = 30;
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

function timeToMinutes(time: string): number {
	const [h, m] = time.split(":").map(Number);
	return h * 60 + m;
}

function setMinutesOfDay(date: Date, minutes: number): Date {
	const result = new Date(date);
	result.setHours(0, minutes, 0, 0);
	return result;
}

function getDayBounds(
	date: Date,
	workHours: WorkHours,
): { start: Date; end: Date } | null {
	const override = workHours.overrides.find((o) => o.day === date.getDay());
	if (override?.enabled === false) return null;
	const startTime = override?.start ?? workHours.defaultStart;
	const endTime = override?.end ?? workHours.defaultEnd;
	return {
		start: setMinutesOfDay(date, timeToMinutes(startTime)),
		end: setMinutesOfDay(date, timeToMinutes(endTime)),
	};
}

function goToNextDay(cursor: Date): Date {
	const result = new Date(cursor);
	result.setDate(result.getDate() + 1);
	result.setHours(0, 0, 0, 0);
	return result;
}

export function findAvailableSlot(
	durationHours: number,
	existing: ScheduledTask[],
	searchFrom: Date,
	workHours: WorkHours,
): { start: string; end: string } {
	let cursor = roundUpToSlot(searchFrom);
	const durationMs = durationHours * 60 * 60 * 1000;

	for (let i = 0; i < (MAX_SEARCH_DAYS * 24 * 60) / SLOT_STEP_MINUTES; i++) {
		const dayBounds = getDayBounds(cursor, workHours);

		if (!dayBounds) {
			cursor = goToNextDay(cursor);
			continue;
		}

		if (cursor < dayBounds.start) {
			cursor = new Date(dayBounds.start);
		}

		const candidateEnd = new Date(cursor.getTime() + durationMs);

		if (candidateEnd > dayBounds.end) {
			cursor = goToNextDay(cursor);
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
	workHours: WorkHours,
	now: Date = new Date(),
): Array<{ id: string; start: string; end: string }> {
	const sorted = [...tasks].sort(
		(a, b) => calculatePriorityScore(b, now) - calculatePriorityScore(a, now),
	);

	const occupied = [...existing];
	const results: Array<{ id: string; start: string; end: string }> = [];

	for (const task of sorted) {
		const durationHours = task.estimatedHours ?? 1;
		const slot = findAvailableSlot(durationHours, occupied, now, workHours);

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
