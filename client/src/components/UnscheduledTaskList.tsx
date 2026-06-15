import type { DetailTask, Task } from "../types";

type Props = {
	tasks: Task[];
	onTaskClick?: (task: DetailTask) => void;
};

const PRIORITY_LABELS: Record<Task["priority"], string> = {
	low: "낮음",
	medium: "보통",
	high: "높음",
};

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

export function UnscheduledTaskList({ tasks, onTaskClick }: Props) {
	if (tasks.length === 0) return null;

	return (
		<div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-200 p-6">
			<h2 className="text-lg font-semibold text-gray-900 mb-4">미배치 할일</h2>
			<ul className="flex flex-col gap-2">
				{tasks.map((task) => (
					<li key={task._id}>
						<button
							type="button"
							onClick={() => onTaskClick?.(toDetailTask(task))}
							className="flex w-full items-center justify-between rounded-md border border-gray-200 px-3 py-2 text-sm text-left hover:bg-gray-50"
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
				))}
			</ul>
		</div>
	);
}
