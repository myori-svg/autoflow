import { type DayOverride, WorkHours } from "../models/WorkHours";

export type WorkHoursUpdate = {
	defaultStart?: string;
	defaultEnd?: string;
	overrides?: DayOverride[];
};

export async function getWorkHours() {
	const existing = await WorkHours.findOne();
	if (existing) return existing;
	return WorkHours.create({});
}

export async function updateWorkHours(update: WorkHoursUpdate) {
	const fields = Object.fromEntries(
		Object.entries(update).filter(([, value]) => value !== undefined),
	);

	const existing = await WorkHours.findOne();
	if (!existing) {
		return WorkHours.create(fields);
	}
	Object.assign(existing, fields);
	await existing.save();
	return existing;
}
