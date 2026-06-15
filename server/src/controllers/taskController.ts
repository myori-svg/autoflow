import type { Request, Response } from "express";
import { createTask, listTasks, updateTaskSchedule } from "../services/task";

function parseSchedule(body: unknown): {
	title?: string;
	start?: Date;
	end?: Date;
	error?: string;
} {
	const { title, start, end } = body as {
		title?: string;
		start?: string;
		end?: string;
	};

	if (start === undefined || end === undefined) {
		return { error: "start와 end는 필수입니다." };
	}

	const startDate = new Date(start);
	const endDate = new Date(end);

	if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
		return { error: "start와 end는 유효한 날짜여야 합니다." };
	}

	return { title, start: startDate, end: endDate };
}

export async function createTaskHandler(
	req: Request,
	res: Response,
): Promise<void> {
	const { title, start, end, error } = parseSchedule(req.body);

	if (!title || typeof title !== "string" || title.trim().length === 0) {
		res.status(400).json({ error: "할일 제목은 필수입니다." });
		return;
	}

	if (error || !start || !end) {
		res.status(400).json({ error });
		return;
	}

	try {
		const task = await createTask({ title: title.trim(), start, end });
		res.status(201).json(task);
	} catch (err) {
		const message = err instanceof Error ? err.message : "알 수 없는 오류";
		res.status(500).json({ error: `할일 저장 실패: ${message}` });
	}
}

export async function getTasksHandler(
	_req: Request,
	res: Response,
): Promise<void> {
	try {
		const tasks = await listTasks();
		res.json(tasks);
	} catch (err) {
		const message = err instanceof Error ? err.message : "알 수 없는 오류";
		res.status(500).json({ error: `할일 조회 실패: ${message}` });
	}
}

export async function updateTaskHandler(
	req: Request,
	res: Response,
): Promise<void> {
	const { start, end, error } = parseSchedule(req.body);

	if (error || !start || !end) {
		res.status(400).json({ error });
		return;
	}

	try {
		const id = String(req.params.id);
		const task = await updateTaskSchedule(id, { start, end });
		if (!task) {
			res.status(404).json({ error: "해당 할일을 찾을 수 없습니다." });
			return;
		}
		res.json(task);
	} catch (err) {
		const message = err instanceof Error ? err.message : "알 수 없는 오류";
		res.status(500).json({ error: `일정 수정 실패: ${message}` });
	}
}
