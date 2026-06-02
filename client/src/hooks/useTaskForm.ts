import { useEffect, useState } from 'react'

const STORAGE_KEY = 'autoflow_task_draft'

type TaskDraft = {
  title: string
  deadline: string | null
}

type UseTaskFormReturn = {
  title: string
  deadline: Date | undefined
  setTitle: (value: string) => void
  setDeadline: (date: Date | undefined) => void
  clearDraft: () => void
}

export function useTaskForm(): UseTaskFormReturn {
  const [title, setTitleState] = useState<string>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) return ''
      const draft = JSON.parse(stored) as TaskDraft
      return draft.title ?? ''
    } catch {
      return ''
    }
  })

  const [deadline, setDeadlineState] = useState<Date | undefined>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) return undefined
      const draft = JSON.parse(stored) as TaskDraft
      return draft.deadline ? new Date(draft.deadline) : undefined
    } catch {
      return undefined
    }
  })

  useEffect(() => {
    const draft: TaskDraft = {
      title,
      deadline: deadline ? deadline.toISOString() : null,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft))
  }, [title, deadline])

  const setTitle = (value: string) => setTitleState(value)
  const setDeadline = (date: Date | undefined) => setDeadlineState(date)

  const clearDraft = () => {
    localStorage.removeItem(STORAGE_KEY)
    setTitleState('')
    setDeadlineState(undefined)
  }

  return { title, deadline, setTitle, setDeadline, clearDraft }
}
