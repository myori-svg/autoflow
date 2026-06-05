import type { Request, Response } from 'express'
import { estimateTaskDuration } from '../services/gemini'

export async function estimateHandler(req: Request, res: Response): Promise<void> {
  const { title, description, importance, deadline } = req.body as {
    title?: string
    description?: string
    importance?: 'low' | 'medium' | 'high'
    deadline?: string
  }

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    res.status(400).json({ error: '할일 제목은 필수입니다.' })
    return
  }

  if (!deadline || typeof deadline !== 'string') {
    res.status(400).json({ error: '마감일은 필수입니다.' })
    return
  }

  try {
    const result = await estimateTaskDuration({ title: title.trim(), description, importance, deadline })
    res.json(result)
  } catch (err) {
    const message = err instanceof Error ? err.message : '알 수 없는 오류'
    res.status(502).json({ error: `AI 추정 실패: ${message}` })
  }
}
