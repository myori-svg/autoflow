import type { EventClickArg, EventDropArg } from "@fullcalendar/core";
import { useMemo, useState } from "react";
import { AutoScheduleButton } from "./components/AutoScheduleButton";
import { DatePicker } from "./components/DatePicker";
import { TaskDetailModal } from "./components/TaskDetailModal";
import { TaskInput } from "./components/TaskInput";
import { WeekCalendar } from "./components/WeekCalendar";
import { useSchedule } from "./hooks/useSchedule";
import { useTaskDetail } from "./hooks/useTaskDetail";
import { useTaskForm } from "./hooks/useTaskForm";
import { useTasks } from "./hooks/useTasks";
import type { ScheduledTask } from "./types";
import { hasConflict } from "./utils/schedule";

const CONFLICT_WARNING_MESSAGE =
	"기존 일정과 시간이 겹칩니다. 그래도 이동하시겠습니까?";

const DRAFT_TASK_ID = "draft";
const DEFAULT_DURATION_HOURS = 1;

function App() {
	const { title, deadline, setTitle, setDeadline, clearDraft } = useTaskForm();
	const { scheduling, handleAutoSchedule } = useSchedule();
	const { tasks, addTask, moveTask } = useTasks();
	const { selectedTask, mode, handleTaskClick, closeDetail } = useTaskDetail();
	const [submitted, setSubmitted] = useState(false);

	const titleError =
		submitted && title.trim().length === 0
			? "할일 제목을 입력해주세요."
			: undefined;
	const deadlineError =
		submitted && !deadline ? "마감일을 선택해주세요." : undefined;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitted(true);
		if (!title.trim() || !deadline) return;
		const start = new Date(
			deadline.getTime() - DEFAULT_DURATION_HOURS * 60 * 60 * 1000,
		);
		await addTask(title.trim(), start.toISOString(), deadline.toISOString());
		clearDraft();
		setSubmitted(false);
	};

	const canAutoSchedule = title.trim().length > 0 && !!deadline;

	const draftTask: ScheduledTask | null = useMemo(() => {
		if (!title.trim() || !deadline) return null;
		const start = new Date(
			deadline.getTime() - DEFAULT_DURATION_HOURS * 60 * 60 * 1000,
		);
		return {
			id: DRAFT_TASK_ID,
			title: title.trim(),
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
			alert(err instanceof Error ? err.message : "일정 변경에 실패했습니다.");
			arg.revert();
		});
	};

	const handleEventClick = (arg: EventClickArg) => {
		const { event } = arg;
		if (event.id === DRAFT_TASK_ID || !event.start || !event.end) return;

		handleTaskClick({
			id: event.id,
			title: event.title,
			start: event.start.toISOString(),
			end: event.end.toISOString(),
		});
	};

	return (
		<div className="min-h-screen bg-gray-50 px-4 py-16">
			<div className="mx-auto max-w-5xl flex flex-col gap-8">
				<div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<h1 className="text-xl font-semibold text-gray-900 mb-6">
						새 할일 추가
					</h1>
					<form onSubmit={handleSubmit} className="flex flex-col gap-4">
						<TaskInput value={title} onChange={setTitle} error={titleError} />
						<DatePicker
							selected={deadline}
							onSelect={setDeadline}
							error={deadlineError}
							touched={submitted}
						/>
						<AutoScheduleButton
							disabled={!canAutoSchedule}
							loading={scheduling}
							onClick={() => {
								if (title.trim() && deadline)
									handleAutoSchedule(title.trim(), deadline);
							}}
						/>
						<button
							type="submit"
							className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
						>
							추가하기
						</button>
					</form>
				</div>

				<WeekCalendar
					events={events}
					onEventDrop={handleEventDrop}
					onEventClick={handleEventClick}
				/>
			</div>

			{selectedTask && (
				<TaskDetailModal
					task={selectedTask}
					mode={mode}
					onClose={closeDetail}
				/>
			)}
		</div>
	);
}

export default App;
