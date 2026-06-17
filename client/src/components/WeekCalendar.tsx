import type { EventClickArg, EventDropArg } from "@fullcalendar/core";
import interactionPlugin, {
	type EventDragStopArg,
	type EventReceiveArg,
} from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import type { RefObject } from "react";
import { useRef } from "react";
import type { ScheduledTask } from "../types";

type WeekCalendarProps = {
	events: ScheduledTask[];
	onEventDrop: (arg: EventDropArg) => void;
	onEventClick: (arg: EventClickArg) => void;
	onExternalDrop: (taskId: string, start: Date, end: Date) => void;
	onUnschedule: (taskId: string, index: number) => void;
	onDragHoverChange: (index: number | null) => void;
	unscheduleDropZoneRef: RefObject<HTMLDivElement | null>;
};

const PRIORITY_COLORS: Record<string, { backgroundColor: string }> = {
	high: { backgroundColor: "#ef4444" },
	medium: { backgroundColor: "#3b82f6" },
	low: { backgroundColor: "#10b981" },
};

function computeDropIndex(
	clientX: number,
	clientY: number,
	zone: HTMLElement,
): number | null {
	const rect = zone.getBoundingClientRect();
	const within =
		clientX >= rect.left &&
		clientX <= rect.right &&
		clientY >= rect.top &&
		clientY <= rect.bottom;
	if (!within) return null;

	const items = Array.from(
		zone.querySelectorAll<HTMLElement>(".unscheduled-task-item"),
	);
	for (let i = 0; i < items.length; i++) {
		const itemRect = items[i].getBoundingClientRect();
		const mid = itemRect.top + itemRect.height / 2;
		if (clientY < mid) return i;
	}
	return items.length;
}

export function WeekCalendar({
	events,
	onEventDrop,
	onEventClick,
	onExternalDrop,
	onUnschedule,
	onDragHoverChange,
	unscheduleDropZoneRef,
}: WeekCalendarProps) {
	const dropIndexRef = useRef<number | null>(null);
	const moveHandlerRef = useRef<((e: PointerEvent) => void) | null>(null);

	const coloredEvents = events.map(({ id, title, start, end, priority }) => ({
		id,
		title,
		start,
		end,
		textColor: "#ffffff",
		...(PRIORITY_COLORS[priority] ?? PRIORITY_COLORS.medium),
	}));

	const handleEventReceive = (info: EventReceiveArg) => {
		const { event } = info;
		if (event.start && event.end) {
			onExternalDrop(event.id, event.start, event.end);
		}
		event.remove();
	};

	const handleEventDragStart = () => {
		const handler = (e: PointerEvent) => {
			const zone = unscheduleDropZoneRef.current;
			const index = zone ? computeDropIndex(e.clientX, e.clientY, zone) : null;
			if (index !== dropIndexRef.current) {
				dropIndexRef.current = index;
				onDragHoverChange(index);
			}
		};
		moveHandlerRef.current = handler;
		document.addEventListener("pointermove", handler);
	};

	const handleEventDragStop = (info: EventDragStopArg) => {
		if (moveHandlerRef.current) {
			document.removeEventListener("pointermove", moveHandlerRef.current);
			moveHandlerRef.current = null;
		}
		if (dropIndexRef.current !== null) {
			onUnschedule(info.event.id, dropIndexRef.current);
		}
		dropIndexRef.current = null;
		onDragHoverChange(null);
	};

	return (
		<div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
			<FullCalendar
				plugins={[timeGridPlugin, interactionPlugin]}
				initialView="timeGridWeek"
				headerToolbar={{
					left: "prev,next today",
					center: "title",
					right: "",
				}}
				locale="ko"
				height={680}
				allDaySlot={false}
				slotMinTime="06:00:00"
				slotMaxTime="24:00:00"
				slotDuration="00:30:00"
				nowIndicator={true}
				weekends={true}
				dayHeaderFormat={{
					weekday: "short",
					month: "numeric",
					day: "numeric",
					omitCommas: true,
				}}
				buttonText={{ today: "오늘" }}
				events={coloredEvents}
				editable={true}
				droppable={true}
				eventStartEditable={true}
				eventDurationEditable={false}
				longPressDelay={200}
				dragRevertDuration={0}
				eventDrop={onEventDrop}
				eventClick={onEventClick}
				eventReceive={handleEventReceive}
				eventDragStart={handleEventDragStart}
				eventDragStop={handleEventDragStop}
			/>
		</div>
	);
}
