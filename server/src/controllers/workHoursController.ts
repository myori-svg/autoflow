import type { Request, Response } from "express";
import type { DayOverride } from "../models/WorkHours";
import { getWorkHours, updateWorkHours } from "../services/workHours";

const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

function isValidTime(value: unknown): value is string {
	return typeof value === "string" && TIME_REGEX.test(value);
}

function isValidOverride(value: unknown): value is DayOverride {
	if (typeof value !== "object" || value === null) return false;
	const o = value as Record<string, unknown>;
	return (
		typeof o.day === "number" &&
		o.day >= 0 &&
		o.day <= 6 &&
		typeof o.enabled === "boolean" &&
		isValidTime(o.start) &&
		isValidTime(o.end)
	);
}

export async function getWorkHoursHandler(
	_req: Request,
	res: Response,
): Promise<void> {
	try {
		const workHours = await getWorkHours();
		res.json(workHours);
	} catch (err) {
		const message = err instanceof Error ? err.message : "알 수 없는 오류";
		res.status(500).json({ error: `근무시간 조회 실패: ${message}` });
	}
}

export async function updateWorkHoursHandler(
	req: Request,
	res: Response,
): Promise<void> {
	const { defaultStart, defaultEnd, overrides } = req.body as {
		defaultStart?: string;
		defaultEnd?: string;
		overrides?: unknown;
	};

	if (defaultStart !== undefined && !isValidTime(defaultStart)) {
		res.status(400).json({ error: "defaultStart는 HH:mm 형식이어야 합니다." });
		return;
	}
	if (defaultEnd !== undefined && !isValidTime(defaultEnd)) {
		res.status(400).json({ error: "defaultEnd는 HH:mm 형식이어야 합니다." });
		return;
	}
	if (overrides !== undefined) {
		if (!Array.isArray(overrides) || !overrides.every(isValidOverride)) {
			res.status(400).json({ error: "overrides 형식이 올바르지 않습니다." });
			return;
		}
	}

	try {
		const workHours = await updateWorkHours({
			defaultStart,
			defaultEnd,
			overrides: overrides as DayOverride[] | undefined,
		});
		res.json(workHours);
	} catch (err) {
		const message = err instanceof Error ? err.message : "알 수 없는 오류";
		res.status(500).json({ error: `근무시간 수정 실패: ${message}` });
	}
}
