import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'

export function WeekCalendar() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
      <FullCalendar
        plugins={[timeGridPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: '',
        }}
        locale="ko"
        height="auto"
        allDaySlot={false}
        slotMinTime="06:00:00"
        slotMaxTime="24:00:00"
        slotDuration="00:30:00"
        nowIndicator={true}
        weekends={true}
        titleFormat={{ year: 'numeric', month: '2-digit', day: '2-digit' }}
        buttonText={{ today: '오늘', prev: '‹', next: '›' }}
      />
    </div>
  )
}
