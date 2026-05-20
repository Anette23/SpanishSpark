export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const clientToken = req.headers['x-feedback-token']
  const serverSecret = process.env.FEEDBACK_SECRET
  if (!serverSecret || clientToken !== serverSecret) return res.status(401).json({ error: 'Unauthorized' })

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return res.status(503).json({ error: 'Not configured' })

  const { word, context } = req.body ?? {}
  if (!word || typeof word !== 'string' || word.length > 100) {
    return res.status(400).json({ error: 'Invalid word' })
  }
  if (context !== undefined && (typeof context !== 'string' || context.length > 500)) {
    return res.status(400).json({ error: 'Invalid context' })
  }

  const prompt = context
    ? `Translate the English word or phrase "${word}" to Slovak. The sentence context is: "${context}". Reply with ONLY the Slovak translation — one short phrase, no explanation.`
    : `Translate the English word "${word}" to Slovak. Reply with ONLY the Slovak translation — one short phrase, no explanation.`

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 60,
        messages: [{ role: 'user', content: prompt }],
      }),
    })
    if (!response.ok) return res.status(502).json({ error: 'AI error' })
    const data = await response.json()
    const translation = data.content?.[0]?.text?.trim() ?? ''
    return res.status(200).json({ translation })
  } catch {
    return res.status(500).json({ error: 'Internal error' })
  }
}
