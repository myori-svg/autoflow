import { useMemo, useState } from 'react'
import type { EventDropArg } from '@fullcalendar/core'
import { AutoScheduleButton } from './components/AutoScheduleButton'
import { DatePicker } from './components/DatePicker'
import { TaskInput } from './components/TaskInput'
import { WeekCalendar } from './components/WeekCalendar'
import { useSchedule } from './hooks/useSchedule'
import { useTaskForm } from './hooks/useTaskForm'
import type { ScheduledTask } from './types'

const DRAFT_TASK_ID = 'draft'
const DEFAULT_DURATION_HOURS = 1

function App() {
  const { title, deadline, setTitle, setDeadline, clearDraft } = useTaskForm()
  const { scheduling, handleAutoSchedule } = useSchedule()
  const [submitted, setSubmitted] = useState(false)
  const [draggedTask, setDraggedTask] = useState<ScheduledTask | null>(null)

  const titleError = submitted && title.trim().length === 0 ? '할일 제목을 입력해주세요.' : undefined
  const deadlineError = submitted && !deadline ? '마감일을 선택해주세요.' : undefined

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    if (!title.trim() || !deadline) return
    clearDraft()
    setSubmitted(false)
  }

  const canAutoSchedule = title.trim().length > 0 && !!deadline

  const draftTask: ScheduledTask | null = useMemo(() => {
    if (!title.trim() || !deadline) return null
    const start = new Date(deadline.getTime() - DEFAULT_DURATION_HOURS * 60 * 60 * 1000)
    return {
      id: DRAFT_TASK_ID,
      title: title.trim(),
      start: start.toISOString(),
      end: deadline.toISOString(),
    }
  }, [title, deadline])

  const events = draggedTask ? [draggedTask] : draftTask ? [draftTask] : []

  const handleEventDrop = (arg: EventDropArg) => {
    const { event } = arg
    if (!event.start || !event.end) return
    setDraggedTask({
      id: event.id,
      title: event.title,
      start: event.start.toISOString(),
      end: event.end.toISOString(),
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-16">
      <div className="mx-auto max-w-5xl flex flex-col gap-8">
        <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h1 className="text-xl font-semibold text-gray-900 mb-6">새 할일 추가</h1>
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
              onClick={() => { if (title.trim() && deadline) handleAutoSchedule(title.trim(), deadline) }}
            />
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            >
              추가하기
            </button>
          </form>
        </div>

        <WeekCalendar events={events} onEventDrop={handleEventDrop} />
      </div>
    </div>
  )
}

export default App
