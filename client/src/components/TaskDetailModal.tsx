import type { TaskDetailMode } from "../hooks/useTaskDetail";
import type { ScheduledTask } from "../types";

type TaskDetailModalProps = {
	task: ScheduledTask;
	mode: TaskDetailMode;
	onClose: () => void;
};

function formatDateTime(iso: string): string {
	return new Date(iso).toLocaleString("ko-KR", {
		month: "long",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
}

export function TaskDetailModal({ task, mode, onClose }: TaskDetailModalProps) {
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
			<div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg">
				{mode === "edit" ? (
					<input
						className="w-full border-b border-gray-300 pb-1 text-lg font-semibold text-gray-900 focus:outline-none focus:border-blue-500"
						defaultValue={task.title}
						autoFocus
					/>
				) : (
					<h2 className="text-lg font-semibold text-gray-900">{task.title}</h2>
				)}

				<dl className="mt-4 space-y-2 text-sm text-gray-600">
					<div className="flex justify-between">
						<dt>시작</dt>
						<dd>{formatDateTime(task.start)}</dd>
					</div>
					<div className="flex justify-between">
						<dt>종료</dt>
						<dd>{formatDateTime(task.end)}</dd>
					</div>
				</dl>

				<button
					type="button"
					onClick={onClose}
					className="mt-6 w-full rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
				>
					닫기
				</button>
			</div>
		</div>
	);
}
