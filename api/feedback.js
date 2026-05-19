export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const clientToken = req.headers['x-feedback-token']
  const serverSecret = process.env.FEEDBACK_SECRET
  if (!serverSecret || clientToken !== serverSecret) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return res.status(503).json({ error: 'AI feedback not configured on server' })
  }

  const { taskType, text } = req.body ?? {}

  if (!text || typeof text !== 'string' || !text.trim()) {
    return res.status(400).json({ error: 'Missing text' })
  }
  if (text.length > 2000) {
    return res.status(400).json({ error: 'Text too long (max 2000 characters)' })
  }
  if (!['writing', 'speaking'].includes(taskType)) {
    return res.status(400).json({ error: 'Invalid taskType' })
  }

  const sanitized = text
    .replace(/<[^>]*>/g, '')
    .replace(/[\x00-\x08\x0b-\x1f\x7f]/g, '')
    .replace(/<\/student_text>/gi, '[/student_text]')
    .slice(0, 2000)

  const taskLabel = taskType === 'writing' ? 'written' : 'spoken'
  const userPrompt = `Give feedback on this Spanish text ${taskLabel} by a Slovak A1/A2-level learner:

<student_text>
${sanitized}
</student_text>

Respond only with valid JSON in this exact format:
{ "corrections": ["..."], "suggestions": ["..."], "praise": "..." }`

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
        max_tokens: 300,
        system: `You are a friendly Spanish teacher. Give short encouraging feedback to a beginner (A1/A2 level) Slovak learner.
Be concise — max 2 corrections, max 2 suggestions, 1 praise sentence.
corrections: specific grammar/spelling fixes in Spanish (empty array if no errors). Quote the mistake and the correction.
suggestions: better word choices or natural phrases in Spanish.
praise: one short motivating sentence.
Keep corrections simple — focus only on the most important errors for a beginner.
Respond ONLY with the JSON object, no other text.`,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    })

    if (!response.ok) {
      return res.status(502).json({ error: 'AI service unavailable' })
    }

    const data = await response.json()
    const raw = data.content?.[0]?.text ?? ''
    const match = raw.match(/\{[\s\S]*\}/)
    if (!match) {
      return res.status(502).json({ error: 'Unexpected AI response format' })
    }
    const json = JSON.parse(match[0])
    return res.status(200).json(json)
  } catch {
    return res.status(500).json({ error: 'Internal server error' })
  }
}
