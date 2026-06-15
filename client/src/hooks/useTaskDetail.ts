import { useCallback, useRef, useState } from "react";
import type { DetailTask } from "../types";

const DOUBLE_CLICK_THRESHOLD_MS = 300;

export type TaskDetailMode = "view" | "edit";

type UseTaskDetailReturn = {
	selectedTask: DetailTask | null;
	mode: TaskDetailMode;
	handleTaskClick: (task: DetailTask) => void;
	closeDetail: () => void;
};

export function useTaskDetail(): UseTaskDetailReturn {
	const [selectedTask, setSelectedTask] = useState<DetailTask | null>(null);
	const [mode, setMode] = useState<TaskDetailMode>("view");
	const clickTimer = useRef<number | null>(null);

	const handleTaskClick = useCallback((task: DetailTask) => {
		if (clickTimer.current !== null) {
			window.clearTimeout(clickTimer.current);
			clickTimer.current = null;
			setSelectedTask(task);
			setMode("edit");
			return;
		}

		clickTimer.current = window.setTimeout(() => {
			setSelectedTask(task);
			setMode("view");
			clickTimer.current = null;
		}, DOUBLE_CLICK_THRESHOLD_MS);
	}, []);

	const closeDetail = useCallback(() => {
		setSelectedTask(null);
		setMode("view");
	}, []);

	return { selectedTask, mode, handleTaskClick, closeDetail };
}
