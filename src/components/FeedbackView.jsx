export default function FeedbackView({ feedback, loading, error, taskType }) {
  if (loading) {
    return (
      <div className="feedback-box feedback-loading">
        <div className="feedback-spinner" />
        <p>Analyzujem tvoju španielčinu...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="feedback-box feedback-error">
        <p>⚠️ {error}</p>
      </div>
    )
  }

  if (!feedback) return null

  return (
    <div className="feedback-box">
      <div className="feedback-title">📝 Spätná väzba</div>

      {feedback.corrections?.length > 0 && (
        <div className="feedback-section">
          <div className="feedback-section-label corrections">✏️ Opravy</div>
          <ul>
            {feedback.corrections.map((c, i) => <li key={i}>{c}</li>)}
          </ul>
        </div>
      )}

      {feedback.suggestions?.length > 0 && (
        <div className="feedback-section">
          <div className="feedback-section-label suggestions">💡 Lepšie výrazy</div>
          <ul>
            {feedback.suggestions.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </div>
      )}

      {feedback.corrections?.length === 0 && feedback.suggestions?.length === 0 && (
        <div className="feedback-section">
          <p className="feedback-perfect">🎯 Žiadne opravy — skvelá práca!</p>
        </div>
      )}

      {feedback.praise && (
        <div className="feedback-praise">⭐ {feedback.praise}</div>
      )}
    </div>
  )
}
