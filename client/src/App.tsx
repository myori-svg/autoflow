import { DatePicker } from './components/DatePicker'
import { TaskInput } from './components/TaskInput'
import { useTaskForm } from './hooks/useTaskForm'

function App() {
  const { title, deadline, setTitle, setDeadline } = useTaskForm()

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center pt-16 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h1 className="text-xl font-semibold text-gray-900 mb-6">새 할일 추가</h1>
        <div className="flex flex-col gap-4">
          <TaskInput value={title} onChange={setTitle} />
          <DatePicker selected={deadline} onSelect={setDeadline} />
        </div>
      </div>
    </div>
  )
}

export default App
