import type { EventClickArg, EventDropArg } from "@fullcalendar/core";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import type { ScheduledTask } from "../types";

type WeekCalendarProps = {
	events: ScheduledTask[];
	onEventDrop: (arg: EventDropArg) => void;
	onEventClick: (arg: EventClickArg) => void;
};

export function WeekCalendar({
	events,
	onEventDrop,
	onEventClick,
}: WeekCalendarProps) {
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
				height="auto"
				allDaySlot={false}
				slotMinTime="06:00:00"
				slotMaxTime="24:00:00"
				slotDuration="00:30:00"
				nowIndicator={true}
				weekends={true}
				titleFormat={{ year: "numeric", month: "2-digit", day: "2-digit" }}
				buttonText={{ today: "오늘", prev: "‹", next: "›" }}
				events={events}
				editable={true}
				eventStartEditable={true}
				eventDurationEditable={false}
				longPressDelay={200}
				eventDrop={onEventDrop}
				eventClick={onEventClick}
			/>
		</div>
	);
}
