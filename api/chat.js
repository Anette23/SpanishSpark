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
    return res.status(503).json({ error: 'Not configured' })
  }

  const { messages, mode, practicedPhrases, sessionContext } = req.body ?? {}

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Missing messages' })
  }

  const sanitizedMessages = messages
    .filter(m => m && ['user', 'assistant'].includes(m.role) && typeof m.content === 'string')
    .slice(-20)
    .map(m => ({
      role: m.role,
      content: m.content
        .replace(/<[^>]*>/g, '')
        .replace(/[\x00-\x08\x0b-\x1f\x7f]/g, '')
        .slice(0, 1000),
    }))

  if (sanitizedMessages.length === 0) {
    return res.status(400).json({ error: 'Invalid messages' })
  }

  const isFeedback = mode === 'feedback'

  const systemPrompt = isFeedback
    ? `You are a Spanish teacher reviewing a conversation with an A1/A2-level Slovak learner.
Analyse their Spanish and respond ONLY with valid JSON in this exact format:
{ "corrections": ["..."], "suggestions": ["..."], "praise": "..." }
corrections: up to 3 specific grammar or phrasing mistakes (quote original + correction). Focus on beginner-level issues.
suggestions: up to 2 vocabulary or style improvements appropriate for A1/A2.
praise: one encouraging sentence about what they did well.
Respond ONLY with the JSON object, nothing else.`
    : `You are a friendly Spanish conversation partner. The user is a Slovak learner at A1/A2 level — a true beginner.
Rules:
- Always respond in Spanish. Use simple, clear sentences.
- Keep vocabulary at A1/A2 level — basic everyday words, present tense mostly.
- Keep replies short (2–3 sentences max).
- Ask one simple follow-up question to keep the conversation going.
- Use simple structures: no subjunctive, no complex conditionals.
- Do NOT explicitly correct grammar mistakes during the conversation — just be a natural partner.
- Be warm, encouraging, and patient.${
  sessionContext?.prompt
    ? `\n- Today the user did a ${sessionContext.taskType} exercise with this prompt: "${sessionContext.prompt}".${sessionContext.text ? ` They wrote/said: "${sessionContext.text.slice(0, 300)}". Build on this topic naturally — ask follow-up questions about it.` : ' Continue the conversation around this topic.'}`
    : ''
}${
  Array.isArray(practicedPhrases) && practicedPhrases.length > 0
    ? `\n- The user has recently practiced these Spanish phrases: ${practicedPhrases.map(p => `"${p}"`).join(', ')}. Naturally create a context where they can use one.`
    : ''
}`

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
        max_tokens: isFeedback ? 400 : 150,
        system: systemPrompt,
        messages: isFeedback
          ? [{
              role: 'user',
              content: `Please review this conversation and give feedback:\n\n${
                sanitizedMessages.map(m => `${m.role === 'user' ? 'Learner' : 'AI'}: ${m.content}`).join('\n')
              }`,
            }]
          : sanitizedMessages,
      }),
    })

    if (!response.ok) {
      return res.status(502).json({ error: 'AI service unavailable' })
    }

    const data = await response.json()
    const text = data.content?.[0]?.text ?? ''

    if (isFeedback) {
      const match = text.match(/\{[\s\S]*\}/)
      if (!match) return res.status(502).json({ error: 'Unexpected response format' })
      try { return res.status(200).json(JSON.parse(match[0])) } catch {
        return res.status(502).json({ error: 'Invalid AI response format' })
      }
    }

    return res.status(200).json({ reply: text.trim() })
  } catch {
    return res.status(500).json({ error: 'Internal server error' })
  }
}
