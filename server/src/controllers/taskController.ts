import type { Request, Response } from "express";
import { TASK_PRIORITIES, type TaskPriority } from "../models/Task";
import {
	createTask,
	deleteTask,
	listTasks,
	unscheduleTask,
	updateTask,
} from "../services/task";

type ParsedTaskFields = {
	title?: string;
	description?: string;
	priority?: TaskPriority;
	deadline?: Date;
	start?: Date;
	end?: Date;
	estimatedHours?: number;
};

function parseTaskFields(body: unknown): ParsedTaskFields | { error: string } {
	const { title, description, priority, deadline, start, end, estimatedHours } =
		body as {
			title?: string;
			description?: string;
			priority?: string;
			deadline?: string;
			start?: string;
			end?: string;
			estimatedHours?: number;
		};

	const fields: ParsedTaskFields = {};

	if (title !== undefined) fields.title = title;
	if (description !== undefined) fields.description = description;

	if (priority !== undefined) {
		if (!TASK_PRIORITIES.includes(priority as TaskPriority)) {
			return { error: "priority는 low, medium, high 중 하나여야 합니다." };
		}
		fields.priority = priority as TaskPriority;
	}

	if (deadline !== undefined) {
		const deadlineDate = new Date(deadline);
		if (Number.isNaN(deadlineDate.getTime())) {
			return { error: "deadline은 유효한 날짜여야 합니다." };
		}
		fields.deadline = deadlineDate;
	}

	if (start !== undefined) {
		const startDate = new Date(start);
		if (Number.isNaN(startDate.getTime())) {
			return { error: "start는 유효한 날짜여야 합니다." };
		}
		fields.start = startDate;
	}

	if (end !== undefined) {
		const endDate = new Date(end);
		if (Number.isNaN(endDate.getTime())) {
			return { error: "end는 유효한 날짜여야 합니다." };
		}
		fields.end = endDate;
	}

	if (estimatedHours !== undefined) {
		if (typeof estimatedHours !== "number" || estimatedHours <= 0) {
			return { error: "estimatedHours는 0보다 큰 숫자여야 합니다." };
		}
		fields.estimatedHours = estimatedHours;
	}

	return fields;
}

export async function createTaskHandler(
	req: Request,
	res: Response,
): Promise<void> {
	const parsed = parseTaskFields(req.body);

	if ("error" in parsed) {
		res.status(400).json({ error: parsed.error });
		return;
	}

	const { title, description, priority, deadline, start, end, estimatedHours } =
		parsed;

	if (!title || title.trim().length === 0) {
		res.status(400).json({ error: "할일 제목은 필수입니다." });
		return;
	}

	try {
		const task = await createTask({
			title: title.trim(),
			description,
			priority,
			deadline,
			start,
			end,
			estimatedHours,
			scheduled: !!(start && end),
		});
		res.status(201).json(task);
	} catch (err) {
		const message = err instanceof Error ? err.message : "알 수 없는 오류";
		res.status(500).json({ error: `할일 저장 실패: ${message}` });
	}
}

export async function deleteTaskHandler(
	req: Request,
	res: Response,
): Promise<void> {
	try {
		const id = String(req.params.id);
		const task = await deleteTask(id);
		if (!task) {
			res.status(404).json({ error: "해당 할일을 찾을 수 없습니다." });
			return;
		}
		res.status(204).send();
	} catch (err) {
		const message = err instanceof Error ? err.message : "알 수 없는 오류";
		res.status(500).json({ error: `할일 삭제 실패: ${message}` });
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
	const id = String(req.params.id);
	const { unschedule } = req.body as { unschedule?: boolean };

	if (unschedule === true) {
		try {
			const task = await unscheduleTask(id);
			if (!task) {
				res.status(404).json({ error: "해당 할일을 찾을 수 없습니다." });
				return;
			}
			res.json(task);
			return;
		} catch (err) {
			const message = err instanceof Error ? err.message : "알 수 없는 오류";
			res.status(500).json({ error: `일정 수정 실패: ${message}` });
			return;
		}
	}

	const parsed = parseTaskFields(req.body);

	if ("error" in parsed) {
		res.status(400).json({ error: parsed.error });
		return;
	}

	if (parsed.title !== undefined && parsed.title.trim().length === 0) {
		res.status(400).json({ error: "할일 제목은 필수입니다." });
		return;
	}

	try {
		const task = await updateTask(id, {
			...parsed,
			title: parsed.title?.trim(),
			...(parsed.start && parsed.end ? { scheduled: true } : {}),
		});
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
