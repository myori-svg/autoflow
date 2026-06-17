import type { Task } from "../types";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const IMPORTANCE_SCORES: Record<Task["priority"], number> = {
	high: 1,
	medium: 0.5,
	low: 0,
};

export function calculatePriorityScore(
	task: Task,
	now: Date = new Date(),
): number {
	const daysRemaining = task.deadline
		? (new Date(task.deadline).getTime() - now.getTime()) / MS_PER_DAY
		: 0;

	const urgencyScore = 1 / (Math.max(daysRemaining, 0) + 1);
	const importanceScore = IMPORTANCE_SCORES[task.priority];

	return urgencyScore + importanceScore;
}
