export default function OnboardingModal({ onClose }) {
  if (localStorage.getItem('onboarded')) return null

  function handleStart() {
    localStorage.setItem('onboarded', '1')
    onClose()
  }

  const features = [
    { emoji: '🔥', text: 'Build a daily streak — just 2 minutes counts' },
    { emoji: '🤖', text: 'Get AI feedback on your writing and speaking' },
    { emoji: '📖', text: 'Reading, grammar, vocabulary and 8 more exercises' },
    { emoji: '📊', text: 'Track your progress and fix weak spots' },
  ]

  return (
    <div className="modal-overlay">
      <div
        style={{
          background: 'var(--card)',
          borderRadius: 20,
          padding: 28,
          maxWidth: 380,
          width: '90%',
          boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 52, marginBottom: 10, lineHeight: 1 }}>⚡</div>

        <h2 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 700, color: 'var(--text)' }}>
          ¡Bienvenida a SpanishSpark!
        </h2>

        <p style={{ margin: '0 0 20px', fontSize: 15, color: 'var(--muted)', lineHeight: 1.4 }}>
          Tu práctica diaria de español empieza ahora.
        </p>

        <div style={{ textAlign: 'left', marginBottom: 24 }}>
          {features.map(({ emoji, text }) => (
            <div
              key={text}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
                marginBottom: 10,
              }}
            >
              <span style={{ fontSize: 18, flexShrink: 0, lineHeight: 1.4 }}>{emoji}</span>
              <span style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.5 }}>{text}</span>
            </div>
          ))}
        </div>

        <button className="btn-primary" onClick={handleStart} style={{ width: '100%', fontSize: 16 }}>
          Get started! →
        </button>
      </div>
    </div>
  )
}
