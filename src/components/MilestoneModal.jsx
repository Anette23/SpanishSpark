import { useEffect } from 'react'
import { clearNewMilestone } from '../habitStore'

export default function MilestoneModal({ milestone, onClose }) {
  useEffect(() => {
    const t = setTimeout(() => {
      clearNewMilestone()
      onClose()
    }, 6000)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="milestone-modal" onClick={e => e.stopPropagation()}>
        <div className="milestone-emoji">{milestone.emoji}</div>
        <div className="milestone-badge">MILESTONE UNLOCKED</div>
        <h2 className="milestone-name">{milestone.label}</h2>
        <p className="milestone-days">{milestone.days}-day streak!</p>
        <div className="milestone-xp">+{milestone.xp} XP</div>
        <div className="confetti">
          {Array.from({ length: 20 }).map((_, i) => (
            <span key={i} className="confetti-piece" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 1}s`,
              backgroundColor: ['#6366f1','#10b981','#f59e0b','#ef4444','#3b82f6'][i % 5]
            }} />
          ))}
        </div>
        <button className="btn-primary" onClick={onClose}>Awesome! 🎉</button>
      </div>
    </div>
  )
}
