import { MILESTONES, getLevel, getNextMilestone, getSessionDuration, formatDuration } from '../habitStore'
import { getCurrentChallenge, isWeeklyChallengeComplete } from '../weeklyChallenge'
import { getWordOfDay } from '../wordOfTheDay'
import { saveWord, getDueWords, getVocabulary } from '../vocabularyStore'
import { useState } from 'react'

export default function Dashboard({ state, todayStatus, onStartTask, onOpenSettings, onOpenHistory, onOpenStats, darkMode, onToggleDark, freezesAvailable, onFreezeStreak }) {
  const wordOfDay = getWordOfDay()
  const [wotdSaved, setWotdSaved] = useState(() => {
    const vocab = getVocabulary()
    return vocab.some(w => w.word === wordOfDay.word)
  })
  const vocabDueCount = getDueWords().length
  const [shareMsg, setShareMsg] = useState('')

  function handleShare() {
    const text = `¡Llevo 🔥 ${streak} días practicando español con SpanishSpark! ⚡`
    if (navigator.share) {
      navigator.share({ text }).catch(() => {})
    } else {
      navigator.clipboard?.writeText(text).then(() => {
        setShareMsg('Copied to clipboard!')
        setTimeout(() => setShareMsg(''), 2500)
      })
    }
  }

  function handleSaveWotd() {
    saveWord({ word: wordOfDay.word, translation: wordOfDay.sk, context: wordOfDay.example, source: 'wotd' })
    setWotdSaved(true)
  }

  const { streak, longestStreak, totalDays, xp, unlockedMilestones } = state
  const { level, progress, nextXp, currentFloor } = getLevel(xp)
  const nextMilestone = getNextMilestone(streak, unlockedMilestones)
  const duration = getSessionDuration(totalDays)

  const weeklyChallenge = getCurrentChallenge()
  const weeklyDone      = isWeeklyChallengeComplete(state)

  const streakMilestoneProgress = nextMilestone
    ? ((streak / nextMilestone.days) * 100)
    : 100

  const todayEntry = state.history?.find(h => h.date === new Date().toISOString().slice(0, 10))
  const todayFrozen = todayEntry?.frozen ?? false
  const showFreeze = freezesAvailable > 0 && streak > 0 && !todayStatus.writingDone && !todayStatus.speakingDone && !todayFrozen

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dash-header">
        <div>
          <h1>SpanishSpark <span className="spark">⚡</span></h1>
          <p className="dash-subtitle">2-minute daily Spanish practice</p>
        </div>
        <div className="dash-header-actions">
          <button className="btn-settings" onClick={onToggleDark} title="Toggle dark mode">{darkMode ? '☀️' : '🌙'}</button>
          <button className="btn-settings" onClick={onOpenHistory} title="History">📚</button>
          <button className="btn-settings" onClick={onOpenStats} title="Stats">📊</button>
          <button className="btn-settings" onClick={onOpenSettings} title="Settings">⚙️</button>
        </div>
      </div>

      {/* Mobile-only compact streak badge */}
      <div className="streak-mini">
        <div className="streak-mini-flame">🔥</div>
        <div className="streak-mini-body">
          <div className="streak-mini-top">
            <span className="streak-mini-num">{streak}</span>
            <span className="streak-mini-label"> day streak</span>
            {(todayStatus.writingDone || todayStatus.speakingDone) &&
              <span className="streak-mini-done">✓ today</span>
            }
            {todayFrozen && <span className="streak-mini-done" style={{background:'#bfdbfe',color:'#1e40af'}}>🧊 frozen</span>}
          </div>
          {nextMilestone && (
            <div className="streak-mini-bar-wrap">
              <div className="streak-mini-bar">
                <div className="streak-mini-fill" style={{ width: `${Math.min(streakMilestoneProgress, 100)}%` }} />
              </div>
              <span className="streak-mini-next">{nextMilestone.emoji} {nextMilestone.days}d</span>
            </div>
          )}
        </div>
      </div>

      <div className="dash-columns">
        {/* Left column: progress & stats */}
        <div className="dash-left">
          <div className="streak-card">
            <div className="streak-flame">🔥</div>
            <div className="streak-number">{streak}</div>
            <div className="streak-label">day streak</div>
            <div className="streak-best">Best: {longestStreak} days</div>
            {todayFrozen && <div className="freeze-badge">🧊 Streak frozen today</div>}
            {showFreeze && (
              <button className="btn-freeze" onClick={onFreezeStreak}>
                🧊 Freeze streak <span className="freeze-count">({freezesAvailable} left this week)</span>
              </button>
            )}

            {streak > 0 && (
              <div style={{ marginTop: 8 }}>
                <button
                  onClick={handleShare}
                  style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: 13, cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
                >
                  {shareMsg || '📤 Share my streak'}
                </button>
              </div>
            )}

            {nextMilestone && (
              <div className="milestone-progress">
                <div className="milestone-progress-label">
                  Next: {nextMilestone.emoji} {nextMilestone.label} ({nextMilestone.days} days)
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill progress-streak"
                    style={{ width: `${Math.min(streakMilestoneProgress, 100)}%` }}
                  />
                </div>
                <div className="progress-text">{streak} / {nextMilestone.days}</div>
              </div>
            )}
          </div>

          <div className="xp-card">
            <div className="xp-left">
              <div className="level-badge">Lv {level}</div>
              <div className="xp-total">{xp} XP total</div>
            </div>
            <div className="xp-right">
              <div className="progress-bar">
                <div className="progress-fill progress-xp" style={{ width: `${progress}%` }} />
              </div>
              <div className="xp-label">{xp - currentFloor} / {nextXp - currentFloor} to level {level + 1}</div>
            </div>
          </div>

          <div className="stats-row">
            <div className="stat-box">
              <div className="stat-number">{totalDays}</div>
              <div className="stat-label">Days completed</div>
            </div>
            <div className="stat-box">
              <div className="stat-number">{unlockedMilestones.length}</div>
              <div className="stat-label">Milestones</div>
            </div>
            <div className="stat-box">
              <div className="stat-number">{formatDuration(duration)}</div>
              <div className="stat-label">Session length</div>
            </div>
          </div>

          <ActivityGraph history={state.history || []} />

          <div className="milestones-section">
            <h3>Milestones</h3>
            <div className="milestones-grid">
              {MILESTONES.map(m => {
                const unlocked = unlockedMilestones.includes(m.days)
                return (
                  <div key={m.days} className={`milestone-chip ${unlocked ? 'unlocked' : 'locked'}`}>
                    <span className="m-emoji">{unlocked ? m.emoji : '🔒'}</span>
                    <span className="m-label">{m.label}</span>
                    <span className="m-days">{m.days}d</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right column: today's tasks & bonus */}
        <div className="dash-right">
          <div className="today-section">
            <h3>Reto de hoy <span className="duration-badge">{formatDuration(duration)} cada uno</span></h3>
            <div className="tasks-grid">
              <TaskCard
                icon="✍️"
                title="Writing"
                desc="Escribe en español sobre el tema del día"
                done={todayStatus.writingDone}
                color="purple"
                onStart={() => onStartTask('writing')}
              />
              <TaskCard
                icon="🎤"
                title="Speaking"
                desc="Speak out loud about the prompt of the day"
                done={todayStatus.speakingDone}
                color="green"
                onStart={() => onStartTask('speaking')}
              />
            </div>

            {todayStatus.writingDone && todayStatus.speakingDone ? (
              <div className="all-done-banner">
                🎉 Both tasks done for today! See you tomorrow!
              </div>
            ) : (todayStatus.writingDone || todayStatus.speakingDone) ? (
              <div className="streak-done-banner">
                🔥 Streak secured! Complete the other task for extra XP.
              </div>
            ) : null}
          </div>

          <div className={`weekly-card ${weeklyDone ? 'weekly-done' : ''}`}>
            <div className="weekly-top">
              <span className="weekly-icon">🏆</span>
              <div>
                <div className="weekly-label">Weekly Challenge</div>
                <div className="weekly-title">{weeklyChallenge.title}</div>
              </div>
              {weeklyDone && <div className="weekly-badge">Done!</div>}
            </div>
            <p className="weekly-prompt">{weeklyChallenge.prompt}</p>
            {!weeklyDone && (
              <button className="btn-weekly-start" onClick={() => onStartTask('weekly')}>
                Start Challenge +50 XP
              </button>
            )}
          </div>

          <button className="btn-chat" onClick={() => onStartTask('chat')}>
            💬 Chat en español
            <span className="btn-chat-sub">Conversación libre con IA</span>
          </button>

          {/* Word of the Day */}
          <div className="word-of-day-card">
            <div className="wotd-top">
              <span className="wotd-badge">{wordOfDay.level}</span>
              <span className="wotd-label">Palabra del día</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap', marginBottom: 4 }}>
              <div className="wotd-word" style={{ marginBottom: 0 }}>{wordOfDay.word}</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>🇸🇰 {wordOfDay.sk}</div>
            </div>
            <div className="wotd-definition">{wordOfDay.definition}</div>
            <div className="wotd-example">"{wordOfDay.example}"</div>
            <button
              className={`btn-secondary wotd-save-btn ${wotdSaved ? 'wotd-saved' : ''}`}
              onClick={handleSaveWotd}
              disabled={wotdSaved}
            >
              {wotdSaved ? '✓ Saved to vocabulary' : '+ Save to vocabulary'}
            </button>
          </div>

          <div className="bonus-section">
            <h3>Extra Practice</h3>
            <p className="bonus-note">Optional — not required for streak</p>
            <button className="btn-mixed" onClick={() => onStartTask('mixed')}>
              🔀 Mixed Practice
              <span className="btn-mixed-sub">5 skills in one session — with sentence practice</span>
            </button>
            <button className="btn-vocab" onClick={() => onStartTask('reading')}>
              📖 Reading
              <span className="btn-vocab-sub">Read short texts and answer comprehension questions</span>
            </button>
            <button className="btn-vocab" onClick={() => onStartTask('vocabulary')} style={{ background: 'linear-gradient(135deg, #10b981, #3b82f6)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                📗 My Vocabulary
                {vocabDueCount > 0 && (
                  <span style={{ background: '#fef3c7', color: '#92400e', borderRadius: 10, padding: '1px 8px', fontSize: 12, fontWeight: 700 }}>
                    {vocabDueCount} due
                  </span>
                )}
              </span>
              <span className="btn-vocab-sub">Words you saved from exercises and chat</span>
            </button>
            <div className="tasks-grid">
              <BonusCard
                icon="🔤" title="Synonyms"
                desc="Find synonyms for today's word"
                color="blue" onStart={() => onStartTask('synonyms')}
              />
              <BonusCard
                icon="📝" title="Prepositions"
                desc="Fill in the missing preposition"
                color="orange" onStart={() => onStartTask('prepositions')}
              />
              <BonusCard
                icon="💬" title="Idioms"
                desc="Fill in the missing word in an idiom"
                color="purple" onStart={() => onStartTask('idioms')}
              />
              <BonusCard
                icon="🎧" title="Shadowing"
                desc="Listen and repeat a sentence"
                color="teal" onStart={() => onStartTask('shadowing')}
              />
              <BonusCard
                icon="📚" title="Grammar"
                desc="Fill in the blank — tenses, articles, conditionals and more"
                color="green" onStart={() => onStartTask('grammar')}
              />
              <BonusCard
                icon="🔀" title="Reorder"
                desc="Arrange words into a correct sentence"
                color="orange" onStart={() => onStartTask('reorder')}
              />
              <BonusCard
                icon="🎧" title="Listening"
                desc="Hear a sentence and fill in the missing word"
                color="teal" onStart={() => onStartTask('listening')}
              />
              <BonusCard
                icon="🃏" title="Vocab Quiz"
                desc="Test yourself on your saved vocabulary"
                color="blue" onStart={() => onStartTask('vocabquiz')}
              />
              <BonusCard
                icon="📊" title="Weak Spots"
                desc="See your most common error patterns"
                color="purple" onStart={() => onStartTask('weakspots')}
              />
              <BonusCard
                icon="🔧" title="Error Correction"
                desc="Find and fix the grammar mistake in each sentence"
                color="orange" onStart={() => onStartTask('errorcorrection')}
              />
              <BonusCard
                icon="🔗" title="Collocations"
                desc="¿Qué palabras van juntas? hacer/tener, mucho/muy y más"
                color="blue" onStart={() => onStartTask('collocations')}
              />
              <BonusCard
                icon="🌿" title="Word Families"
                desc="Complete the sentence with the correct word form"
                color="green" onStart={() => onStartTask('wordfamilies')}
              />
              <BonusCard
                icon="💫" title="Phrasal Verbs"
                desc="Verbos reflexivos: levantarse, llamarse, acostarse..."
                color="teal" onStart={() => onStartTask('phrasalverbs')}
              />
              <BonusCard
                icon="🎙️" title="Dictation"
                desc="Hear a full sentence and type every word you heard"
                color="teal" onStart={() => onStartTask('dictation')}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ActivityGraph({ history }) {
  const DAYS = 30
  const today = new Date()
  const cells = Array.from({ length: DAYS }, (_, i) => {
    const d = new Date(today)
    d.setDate(d.getDate() - (DAYS - 1 - i))
    const dateStr = d.toISOString().slice(0, 10)
    const entry = history.find(h => h.date === dateStr)
    const cls = !entry                                      ? 'cal-empty'
              : entry.writingDone && entry.speakingDone     ? 'cal-full'
              : (entry.writingDone || entry.speakingDone)   ? 'cal-half'
              : 'cal-empty'
    const day = d.getDate()
    return { dateStr, cls, day }
  })

  return (
    <div className="activity-graph">
      <div className="activity-label">Last 30 days</div>
      <div className="activity-grid">
        {cells.map(({ dateStr, cls, day }) => (
          <div key={dateStr} className={`act-dot ${cls}`} title={dateStr}>
            <span className="act-day">{day}</span>
          </div>
        ))}
      </div>
      <div className="calendar-legend">
        <span className="cal-legend-dot" style={{ background: 'var(--green)' }} />both
        <span className="cal-legend-dot" style={{ background: 'var(--green-light)', border: '1px solid var(--green)' }} />one
        <span className="cal-legend-dot" style={{ background: 'var(--border)' }} />none
      </div>
    </div>
  )
}

function BonusCard({ icon, title, desc, color, onStart }) {
  return (
    <div className={`task-card task-card-${color}`}>
      <div className="task-card-icon">{icon}</div>
      <div className="task-card-body">
        <div className="task-card-title">{title}</div>
        <div className="task-card-desc">{desc}</div>
      </div>
      <button className={`btn-task btn-task-${color}`} onClick={onStart}>Start</button>
    </div>
  )
}

function TaskCard({ icon, title, desc, done, color, onStart }) {
  return (
    <div className={`task-card task-card-${color} ${done ? 'task-done' : ''}`}>
      <div className="task-card-icon">{done ? '✅' : icon}</div>
      <div className="task-card-body">
        <div className="task-card-title">{title}</div>
        <div className="task-card-desc">{desc}</div>
      </div>
      {done
        ? <div className="task-card-complete">Done!</div>
        : <button className={`btn-task btn-task-${color}`} onClick={onStart}>Start</button>
      }
    </div>
  )
}
