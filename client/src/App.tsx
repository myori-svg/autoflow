import { useState } from 'react'
import { AutoScheduleButton } from './components/AutoScheduleButton'
import { DatePicker } from './components/DatePicker'
import { TaskInput } from './components/TaskInput'
import { WeekCalendar } from './components/WeekCalendar'
import { useSchedule } from './hooks/useSchedule'
import { useTaskForm } from './hooks/useTaskForm'

function App() {
  const { title, deadline, setTitle, setDeadline, clearDraft } = useTaskForm()
  const { scheduling, handleAutoSchedule } = useSchedule()
  const [submitted, setSubmitted] = useState(false)

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

        <WeekCalendar />
      </div>
    </div>
  )
}

export default App
