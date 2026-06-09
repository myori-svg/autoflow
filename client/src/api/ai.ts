import type { EstimateResponse } from '../types'

export async function estimateTask(title: string, deadline: Date): Promise<EstimateResponse> {
  const res = await fetch('/api/ai/estimate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, deadline: deadline.toISOString() }),
  })
  if (!res.ok) throw new Error(`서버 오류: ${res.status}`)
  return res.json() as Promise<EstimateResponse>
}
