export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const clientToken = req.headers['x-feedback-token']
  const serverSecret = process.env.FEEDBACK_SECRET
  if (!serverSecret || clientToken !== serverSecret) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return res.status(503).json({ error: 'NOT_CONFIGURED' })

  const { word, sentence } = req.body ?? {}
  if (!word || !sentence || typeof sentence !== 'string' || !sentence.trim()) {
    return res.status(400).json({ error: 'Missing word or sentence' })
  }

  const sanitized = sentence
    .replace(/<[^>]*>/g, '')
    .replace(/[\x00-\x08\x0b-\x1f\x7f]/g, '')
    .slice(0, 300)

  const userPrompt = `A Slovak learner was asked to write a Spanish sentence using the word "${word}" (or a close synonym).
Their sentence: "${sanitized}"

Check:
1. Does the sentence use "${word}" or a synonym naturally and correctly in Spanish?
2. Are there any grammar mistakes (suitable feedback for A1/A2 level)?

Reply ONLY with JSON: { "ok": true/false, "feedback": "one short sentence" }
- If correct: ok=true, feedback = brief praise + maybe one simple tip
- If wrong: ok=false, feedback = what is wrong + corrected version in quotes`

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
        max_tokens: 150,
        system: 'You are a concise Spanish teacher for beginners. Reply only with the JSON object, no other text.',
        messages: [{ role: 'user', content: userPrompt }],
      }),
    })

    if (!response.ok) return res.status(502).json({ error: 'AI service unavailable' })

    const data = await response.json()
    const raw = data.content?.[0]?.text ?? ''
    const match = raw.match(/\{[\s\S]*\}/)
    if (!match) return res.status(502).json({ error: 'Bad AI response' })
    return res.status(200).json(JSON.parse(match[0]))
  } catch {
    return res.status(500).json({ error: 'Internal server error' })
  }
}