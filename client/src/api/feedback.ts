export async function saveFeedback(feedback: string): Promise<void> {
  const res = await fetch('/api/feedback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ feedback }),
  })
  if (!res.ok) throw new Error(`서버 오류: ${res.status}`)
}
