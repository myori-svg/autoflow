import { useState } from "react";
import type { TaskDetailMode } from "../hooks/useTaskDetail";
import type { DetailTask, TaskPriority, TaskUpdateInput } from "../types";

type TaskDetailModalProps = {
	task: DetailTask;
	mode: TaskDetailMode;
	onClose: () => void;
	onSave: (fields: TaskUpdateInput) => void;
};

const PRIORITY_LABELS: Record<TaskPriority, string> = {
	low: "낮음",
	medium: "보통",
	high: "높음",
};

const MS_PER_HOUR = 60 * 60 * 1000;

function formatDateTime(iso: string): string {
	return new Date(iso).toLocaleString("ko-KR", {
		month: "long",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
}

function toDateTimeLocal(iso: string): string {
	const date = new Date(iso);
	const offsetMs = date.getTimezoneOffset() * 60 * 1000;
	return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}

function durationHours(start: string, end: string): number {
	return (
		Math.round(
			((new Date(end).getTime() - new Date(start).getTime()) / MS_PER_HOUR) *
				100,
		) / 100
	);
}

export function TaskDetailModal({
	task,
	mode,
	onClose,
	onSave,
}: TaskDetailModalProps) {
	const isScheduled = !!(task.start && task.end);
	const [editing, setEditing] = useState(mode === "edit");
	const [title, setTitle] = useState(task.title);
	const [description, setDescription] = useState(task.description ?? "");
	const [priority, setPriority] = useState<TaskPriority>(task.priority);
	const [start, setStart] = useState(task.start);
	const [end, setEnd] = useState(task.end);
	const [deadline, setDeadline] = useState(task.deadline);
	const [estimatedHours, setEstimatedHours] = useState(task.estimatedHours);

	const handleStartChange = (value: string) => {
		setStart(new Date(value).toISOString());
	};

	const handleEndChange = (value: string) => {
		setEnd(new Date(value).toISOString());
	};

	const handleDurationChange = (value: string) => {
		if (!start) return;
		const hours = Number(value);
		if (Number.isNaN(hours) || hours <= 0) return;
		setEnd(
			new Date(new Date(start).getTime() + hours * MS_PER_HOUR).toISOString(),
		);
	};

	const handleDeadlineChange = (value: string) => {
		setDeadline(value ? new Date(value).toISOString() : undefined);
	};

	const handleEstimatedHoursChange = (value: string) => {
		const hours = Number(value);
		setEstimatedHours(Number.isNaN(hours) || hours <= 0 ? undefined : hours);
	};

	const handleSave = () => {
		if (title.trim().length === 0) return;
		onSave({
			title: title.trim(),
			description: description.trim(),
			priority,
			...(isScheduled ? { start, end } : { deadline, estimatedHours }),
		});
	};

	const handleCancel = () => {
		setTitle(task.title);
		setDescription(task.description ?? "");
		setPriority(task.priority);
		setStart(task.start);
		setEnd(task.end);
		setDeadline(task.deadline);
		setEstimatedHours(task.estimatedHours);
		setEditing(false);
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
			<div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg">
				{editing ? (
					<div className="flex flex-col gap-3">
						<input
							className="w-full border-b border-gray-300 pb-1 text-lg font-semibold text-gray-900 focus:outline-none focus:border-blue-500"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
						/>
						<textarea
							className="w-full rounded-md border border-gray-300 p-2 text-sm text-gray-700 focus:outline-none focus:border-blue-500"
							placeholder="설명"
							rows={3}
							value={description}
							onChange={(e) => setDescription(e.target.value)}
						/>
						<label className="flex flex-col gap-1 text-sm text-gray-600">
							중요도
							<select
								className="rounded-md border border-gray-300 p-2"
								value={priority}
								onChange={(e) => setPriority(e.target.value as TaskPriority)}
							>
								{Object.entries(PRIORITY_LABELS).map(([value, label]) => (
									<option key={value} value={value}>
										{label}
									</option>
								))}
							</select>
						</label>
						{isScheduled && start && end ? (
							<>
								<label className="flex flex-col gap-1 text-sm text-gray-600">
									시작 시간
									<input
										type="datetime-local"
										className="rounded-md border border-gray-300 p-2"
										value={toDateTimeLocal(start)}
										onChange={(e) => handleStartChange(e.target.value)}
									/>
								</label>
								<label className="flex flex-col gap-1 text-sm text-gray-600">
									마감일
									<input
										type="datetime-local"
										className="rounded-md border border-gray-300 p-2"
										value={toDateTimeLocal(end)}
										onChange={(e) => handleEndChange(e.target.value)}
									/>
								</label>
								<label className="flex flex-col gap-1 text-sm text-gray-600">
									소요 시간 (시간)
									<input
										type="number"
										min="0.5"
										step="0.5"
										className="rounded-md border border-gray-300 p-2"
										value={durationHours(start, end)}
										onChange={(e) => handleDurationChange(e.target.value)}
									/>
								</label>
							</>
						) : (
							<>
								<label className="flex flex-col gap-1 text-sm text-gray-600">
									마감일
									<input
										type="datetime-local"
										className="rounded-md border border-gray-300 p-2"
										value={deadline ? toDateTimeLocal(deadline) : ""}
										onChange={(e) => handleDeadlineChange(e.target.value)}
									/>
								</label>
								<label className="flex flex-col gap-1 text-sm text-gray-600">
									예상 소요 시간 (시간)
									<input
										type="number"
										min="0.5"
										step="0.5"
										className="rounded-md border border-gray-300 p-2"
										value={estimatedHours ?? ""}
										onChange={(e) => handleEstimatedHoursChange(e.target.value)}
									/>
								</label>
							</>
						)}
					</div>
				) : (
					<>
						<h2 className="text-lg font-semibold text-gray-900">
							{task.title}
						</h2>
						{task.description && (
							<p className="mt-2 text-sm text-gray-600">{task.description}</p>
						)}
						<dl className="mt-4 space-y-2 text-sm text-gray-600">
							<div className="flex justify-between">
								<dt>중요도</dt>
								<dd>{PRIORITY_LABELS[task.priority]}</dd>
							</div>
							{isScheduled && task.start && task.end ? (
								<>
									<div className="flex justify-between">
										<dt>시작</dt>
										<dd>{formatDateTime(task.start)}</dd>
									</div>
									<div className="flex justify-between">
										<dt>마감일</dt>
										<dd>{formatDateTime(task.end)}</dd>
									</div>
								</>
							) : (
								<>
									<div className="flex justify-between">
										<dt>마감일</dt>
										<dd>
											{task.deadline ? formatDateTime(task.deadline) : "미설정"}
										</dd>
									</div>
									<div className="flex justify-between">
										<dt>예상 소요 시간</dt>
										<dd>
											{task.estimatedHours !== undefined
												? `${task.estimatedHours}시간`
												: "미설정"}
										</dd>
									</div>
								</>
							)}
						</dl>
					</>
				)}

				<div className="mt-6 flex gap-2">
					{editing ? (
						<>
							<button
								type="button"
								onClick={handleCancel}
								className="flex-1 rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
							>
								취소
							</button>
							<button
								type="button"
								onClick={handleSave}
								className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
							>
								저장
							</button>
						</>
					) : (
						<>
							<button
								type="button"
								onClick={onClose}
								className="flex-1 rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
							>
								닫기
							</button>
							<button
								type="button"
								onClick={() => setEditing(true)}
								className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
							>
								편집
							</button>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
