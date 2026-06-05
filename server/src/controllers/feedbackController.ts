import type { Request, Response } from 'express'
import type { FeedbackResult } from '../models/Feedback'
import { Feedback } from '../models/Feedback'

const VALID_RESULTS: FeedbackResult[] = ['accurate', 'too_long', 'too_short']

export async function saveFeedbackHandler(req: Request, res: Response): Promise<void> {
  const { taskTitle, estimatedHours, actualResult } = req.body as {
    taskTitle?: string
    estimatedHours?: number
    actualResult?: string
  }

  if (!taskTitle || typeof taskTitle !== 'string' || taskTitle.trim().length === 0) {
    res.status(400).json({ error: '할일 제목은 필수입니다.' })
    return
  }

  if (typeof estimatedHours !== 'number' || estimatedHours <= 0) {
    res.status(400).json({ error: '예상 소요 시간은 양수여야 합니다.' })
    return
  }

  if (!actualResult || !VALID_RESULTS.includes(actualResult as FeedbackResult)) {
    res.status(400).json({ error: `actualResult는 ${VALID_RESULTS.join(', ')} 중 하나여야 합니다.` })
    return
  }

  try {
    await Feedback.create({ taskTitle: taskTitle.trim(), estimatedHours, actualResult: actualResult as FeedbackResult })
    res.status(201).json({ message: '피드백이 저장되었습니다.' })
  } catch (err) {
    const message = err instanceof Error ? err.message : '알 수 없는 오류'
    res.status(500).json({ error: `피드백 저장 실패: ${message}` })
  }
}
