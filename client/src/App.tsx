import type { EventClickArg, EventDropArg } from "@fullcalendar/core";
import { useMemo, useRef, useState } from "react";
import { AutoScheduleButton } from "./components/AutoScheduleButton";
import { DatePicker } from "./components/DatePicker";
import { SyncStatusIndicator } from "./components/SyncStatusIndicator";
import { TaskDetailModal } from "./components/TaskDetailModal";
import { TaskInput } from "./components/TaskInput";
import { ToastContainer } from "./components/ToastContainer";
import { UnscheduledTaskList } from "./components/UnscheduledTaskList";
import { WeekCalendar } from "./components/WeekCalendar";
import { WorkHoursSettings } from "./components/WorkHoursSettings";
import { useSchedule } from "./hooks/useSchedule";
import { useTaskDetail } from "./hooks/useTaskDetail";
import { useTaskForm } from "./hooks/useTaskForm";
import { useTasks } from "./hooks/useTasks";
import { useToast } from "./hooks/useToast";
import { useWorkHours } from "./hooks/useWorkHours";
import type { ScheduledTask, TaskUpdateInput } from "./types";
import { hasConflict } from "./utils/schedule";

const CONFLICT_WARNING_MESSAGE =
	"기존 일정과 시간이 겹칩니다. 그래도 이동하시겠습니까?";

const DRAFT_TASK_ID = "draft";
const DEFAULT_DURATION_HOURS = 1;

function toFriendlyError(err: unknown): string {
	const msg = err instanceof Error ? err.message : "";
	if (msg.includes("502") || msg.includes("503")) {
		return "서버 응답이 지연되고 있습니다. 잠시 후 다시 시도해주세요.";
	}
	if (msg.includes("500")) {
		return "서버 내부 오류가 발생했습니다.";
	}
	if (msg.includes("400")) {
		return "입력값을 확인해주세요.";
	}
	if (msg.includes("404")) {
		return "해당 항목을 찾을 수 없습니다.";
	}
	return msg || "오류가 발생했습니다.";
}

function App() {
	const { title, deadline, setTitle, setDeadline, clearDraft } = useTaskForm();
	const { scheduling, handleAutoSchedule } = useSchedule();
	const {
		tasks,
		unscheduledTasks,
		syncStatus,
		addTask,
		moveTask,
		editTask,
		removeTask,
		unscheduleTask,
	} = useTasks();
	const { selectedTask, mode, handleTaskClick, closeDetail } = useTaskDetail();
	const { toasts, show, dismiss } = useToast();
	const { workHours, saveDefault, saveOverride } = useWorkHours();
	const [submitted, setSubmitted] = useState(false);
	const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
	const unscheduleDropZoneRef = useRef<HTMLDivElement>(null);

	const titleError =
		submitted && title.trim().length === 0
			? "할일 제목을 입력해주세요."
			: undefined;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitted(true);
		if (!title.trim()) return;
		try {
			await addTask({
				title: title.trim(),
				...(deadline ? { deadline: deadline.toISOString() } : {}),
			});
			clearDraft();
			setSubmitted(false);
		} catch (err) {
			show(toFriendlyError(err), "error");
		}
	};

	const draftTask: ScheduledTask | null = useMemo(() => {
		if (!title.trim() || !deadline) return null;
		const start = new Date(
			deadline.getTime() - DEFAULT_DURATION_HOURS * 60 * 60 * 1000,
		);
		return {
			id: DRAFT_TASK_ID,
			title: title.trim(),
			priority: "medium",
			start: start.toISOString(),
			end: deadline.toISOString(),
		};
	}, [title, deadline]);

	const events = draftTask ? [...tasks, draftTask] : tasks;

	const handleEventDrop = (arg: EventDropArg) => {
		const { event } = arg;
		if (!event.start || !event.end) return;
		if (event.id === DRAFT_TASK_ID) return;

		const start = event.start.toISOString();
		const end = event.end.toISOString();

		if (hasConflict({ id: event.id, start, end }, tasks)) {
			if (!confirm(CONFLICT_WARNING_MESSAGE)) {
				arg.revert();
				return;
			}
		}

		moveTask(event.id, start, end).catch((err) => {
			show(toFriendlyError(err), "error");
			arg.revert();
		});
	};

	const handleEventClick = (arg: EventClickArg) => {
		const { event } = arg;
		if (event.id === DRAFT_TASK_ID) return;

		const task = tasks.find((t) => t.id === event.id);
		if (!task) return;

		handleTaskClick(task);
	};

	const handleTaskSave = async (id: string, fields: TaskUpdateInput) => {
		try {
			await editTask(id, fields);
			closeDetail();
		} catch (err) {
			show(toFriendlyError(err), "error");
		}
	};

	const handleTaskDelete = async (id: string) => {
		try {
			await removeTask(id);
			closeDetail();
		} catch (err) {
			show(toFriendlyError(err), "error");
		}
	};

	const handleExternalDrop = async (id: string, start: Date, end: Date) => {
		const startIso = start.toISOString();
		const endIso = end.toISOString();

		if (hasConflict({ id, start: startIso, end: endIso }, tasks)) {
			if (!confirm(CONFLICT_WARNING_MESSAGE)) return;
		}

		try {
			await editTask(id, { start: startIso, end: endIso });
		} catch (err) {
			show(toFriendlyError(err), "error");
		}
	};

	const handleUnschedule = async (id: string, index: number) => {
		if (id === DRAFT_TASK_ID) return;
		try {
			await unscheduleTask(id, index);
		} catch (err) {
			show(toFriendlyError(err), "error");
		}
	};

	const handleSaveDefaultWorkHours = async (start: string, end: string) => {
		try {
			await saveDefault(start, end);
		} catch (err) {
			show(toFriendlyError(err), "error");
		}
	};

	const handleSaveWorkHoursOverride = async (
		day: number,
		override: { start: string; end: string; enabled: boolean } | null,
	) => {
		try {
			await saveOverride(day, override);
		} catch (err) {
			show(toFriendlyError(err), "error");
		}
	};

	const handleAutoScheduleClick = async () => {
		try {
			const count = await handleAutoSchedule(
				unscheduledTasks,
				tasks,
				editTask,
				workHours,
			);
			if (count > 0) {
				show(`${count}개의 할일을 캘린더에 배치했습니다.`, "success");
			}
		} catch (err) {
			show(toFriendlyError(err), "error");
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 flex flex-col">
			{/* 헤더 */}
			<header className="bg-white border-b border-gray-200 px-6 py-4 flex-none">
				<div className="max-w-screen-xl mx-auto flex items-center justify-between">
					<div>
						<h1 className="text-xl font-bold text-blue-600 tracking-tight">
							AutoFlow
						</h1>
						<p className="text-xs text-gray-400 mt-0.5">
							AI 기반 일정 자동 배분
						</p>
					</div>
					<div className="flex items-center gap-3 text-xs text-gray-500">
						<span className="inline-flex items-center gap-1.5">
							<span className="h-2 w-2 rounded-full bg-red-400" />
							높음
						</span>
						<span className="inline-flex items-center gap-1.5">
							<span className="h-2 w-2 rounded-full bg-blue-400" />
							보통
						</span>
						<span className="inline-flex items-center gap-1.5">
							<span className="h-2 w-2 rounded-full bg-emerald-400" />
							낮음
						</span>
					</div>
				</div>
			</header>

			{/* 본문 */}
			<div className="flex-1 max-w-screen-xl mx-auto w-full flex gap-5 p-5">
				{/* 사이드바 */}
				<aside className="w-72 flex-none flex flex-col gap-4">
					<div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
						<h2 className="text-sm font-semibold text-gray-700 mb-4">
							새 할일 추가
						</h2>
						<form onSubmit={handleSubmit} className="flex flex-col gap-3">
							<TaskInput value={title} onChange={setTitle} error={titleError} />
							<DatePicker selected={deadline} onSelect={setDeadline} />
							<button
								type="submit"
								className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
							>
								추가하기
							</button>
						</form>
					</div>

					<UnscheduledTaskList
						ref={unscheduleDropZoneRef}
						tasks={unscheduledTasks}
						onTaskClick={handleTaskClick}
						dropIndex={dragOverIndex}
					/>
					<AutoScheduleButton
						disabled={unscheduledTasks.length === 0}
						loading={scheduling}
						onClick={handleAutoScheduleClick}
					/>
					<WorkHoursSettings
						workHours={workHours}
						onSaveDefault={handleSaveDefaultWorkHours}
						onSaveOverride={handleSaveWorkHoursOverride}
					/>
				</aside>

				{/* 캘린더 */}
				<main className="flex-1 min-w-0">
					<WeekCalendar
						events={events}
						onEventDrop={handleEventDrop}
						onEventClick={handleEventClick}
						onExternalDrop={handleExternalDrop}
						onUnschedule={handleUnschedule}
						onDragHoverChange={setDragOverIndex}
						unscheduleDropZoneRef={unscheduleDropZoneRef}
					/>
				</main>
			</div>

			{selectedTask && (
				<TaskDetailModal
					task={selectedTask}
					mode={mode}
					onClose={closeDetail}
					onSave={(fields) => handleTaskSave(selectedTask.id, fields)}
					onDelete={() => handleTaskDelete(selectedTask.id)}
				/>
			)}

			<ToastContainer toasts={toasts} onDismiss={dismiss} />
			<SyncStatusIndicator status={syncStatus} />
		</div>
	);
}

export default App;
