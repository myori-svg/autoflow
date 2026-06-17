import { Draggable } from "@fullcalendar/interaction";
import { forwardRef, useEffect, useRef } from "react";
import type { DetailTask, Task } from "../types";

type Props = {
	tasks: Task[];
	onTaskClick?: (task: DetailTask) => void;
	dropIndex?: number | null;
};

const PRIORITY_LABELS: Record<Task["priority"], string> = {
	low: "낮음",
	medium: "보통",
	high: "높음",
};

const DEFAULT_DURATION_HOURS = 1;

function toDetailTask(task: Task): DetailTask {
	return {
		id: task._id,
		title: task.title,
		description: task.description,
		priority: task.priority,
		start: task.start,
		end: task.end,
		deadline: task.deadline,
		estimatedHours: task.estimatedHours,
	};
}

function toDurationString(hours: number | undefined): string {
	const totalMinutes = Math.round((hours ?? DEFAULT_DURATION_HOURS) * 60);
	const hh = Math.floor(totalMinutes / 60);
	const mm = totalMinutes % 60;
	return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

export const UnscheduledTaskList = forwardRef<HTMLDivElement, Props>(
	function UnscheduledTaskList({ tasks, onTaskClick, dropIndex = null }, ref) {
		const listRef = useRef<HTMLUListElement>(null);

		useEffect(() => {
			if (!listRef.current) return;
			const draggable = new Draggable(listRef.current, {
				itemSelector: ".unscheduled-task-item",
				eventData: (el) => ({
					id: el.dataset.taskId,
					title: el.dataset.taskTitle,
					duration: el.dataset.taskDuration,
				}),
			});
			return () => draggable.destroy();
		}, []);

		const indicator = (
			<li
				key="__drop_indicator"
				aria-hidden="true"
				className="h-1.5 rounded-full bg-blue-400"
			/>
		);

		const itemNodes = tasks.map((task) => (
			<li
				key={task._id}
				className="unscheduled-task-item"
				data-task-id={task._id}
				data-task-title={task.title}
				data-task-duration={toDurationString(task.estimatedHours)}
			>
				<button
					type="button"
					onClick={() => onTaskClick?.(toDetailTask(task))}
					className="flex w-full items-center justify-between rounded-md border border-gray-200 px-3 py-2 text-sm text-left hover:bg-gray-50 cursor-grab active:cursor-grabbing"
				>
					<span className="text-gray-700">{task.title}</span>
					<div className="flex items-center gap-2 text-xs text-gray-400">
						<span>{PRIORITY_LABELS[task.priority]}</span>
						{task.estimatedHours !== undefined && (
							<span>{task.estimatedHours}시간</span>
						)}
						{task.deadline && (
							<span>
								{new Date(task.deadline).toLocaleString("ko-KR", {
									month: "long",
									day: "numeric",
									hour: "2-digit",
									minute: "2-digit",
								})}
							</span>
						)}
					</div>
				</button>
			</li>
		));

		let content: React.ReactNode;
		if (tasks.length === 0) {
			content =
				dropIndex !== null ? (
					indicator
				) : (
					<li className="list-none text-sm text-gray-400">
						미배치 할일이 없습니다. 캘린더의 일정을 여기로 드래그하면 미배치
						처리됩니다.
					</li>
				);
		} else if (dropIndex === null) {
			content = itemNodes;
		} else {
			content = [
				...itemNodes.slice(0, dropIndex),
				indicator,
				...itemNodes.slice(dropIndex),
			];
		}

		return (
			<div
				ref={ref}
				className={[
					"w-full bg-white rounded-xl shadow-sm border-2 p-4 transition-colors",
					dropIndex !== null
						? "border-dashed border-blue-400 bg-blue-50/40"
						: "border-gray-200",
				].join(" ")}
			>
				<h2 className="text-lg font-semibold text-gray-900 mb-4">
					미배치 할일
				</h2>
				<ul ref={listRef} className="flex flex-col gap-2">
					{content}
				</ul>
			</div>
		);
	},
);
