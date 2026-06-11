import { useState } from 'react'
import { AutoScheduleButton } from './components/AutoScheduleButton'
import { DatePicker } from './components/DatePicker'
import { TaskInput } from './components/TaskInput'
import { WeekCalendar } from './components/WeekCalendar'
import { useTaskForm } from './hooks/useTaskForm'

function App() {
  const { title, deadline, setTitle, setDeadline, clearDraft } = useTaskForm()
  const [submitted, setSubmitted] = useState(false)
  const [scheduling, setScheduling] = useState(false)

  const titleError = submitted && title.trim().length === 0 ? '할일 제목을 입력해주세요.' : undefined
  const deadlineError = submitted && !deadline ? '마감일을 선택해주세요.' : undefined

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    if (!title.trim() || !deadline) return
    clearDraft()
    setSubmitted(false)
  }

  const handleAutoSchedule = async () => {
    if (!title.trim() || !deadline) return
    setScheduling(true)
    try {
      const res = await fetch('/api/ai/estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), deadline: deadline.toISOString() }),
      })
      if (!res.ok) throw new Error(`서버 오류: ${res.status}`)
      const data = (await res.json()) as { estimatedHours: number; reasoning: string }
      alert(`예상 소요 시간: ${data.estimatedHours}시간\n근거: ${data.reasoning}`)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'AI 추정에 실패했습니다.')
    } finally {
      setScheduling(false)
    }
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
              onClick={handleAutoSchedule}
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
