import type { DayOverride, WorkHours } from "../types";

export async function fetchWorkHours(): Promise<WorkHours> {
	const res = await fetch("/api/work-hours");
	if (!res.ok) throw new Error(`서버 오류: ${res.status}`);
	return res.json() as Promise<WorkHours>;
}

export async function updateWorkHours(input: {
	defaultStart?: string;
	defaultEnd?: string;
	overrides?: DayOverride[];
}): Promise<WorkHours> {
	const res = await fetch("/api/work-hours", {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(input),
	});
	if (!res.ok) throw new Error(`서버 오류: ${res.status}`);
	return res.json() as Promise<WorkHours>;
}
