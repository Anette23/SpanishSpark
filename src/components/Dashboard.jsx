import { MILESTONES, getLevel, getNextMilestone, getSessionDuration, formatDuration } from '../habitStore'
import { getCurrentChallenge, isWeeklyChallengeComplete } from '../weeklyChallenge'
import { getWordOfDay } from '../wordOfTheDay'
import { saveWord, getDueWords, getVocabulary } from '../vocabularyStore'
import { getFlashcardStats } from '../flashcardStore'
import { SYNONYM_WORDS, PREPOSITION_PHRASES, IDIOM_PHRASES, SHADOWING_SENTENCES } from '../bonusExercises'
import { GRAMMAR_EXERCISES } from '../grammarExercises'
import { useState } from 'react'

export default function Dashboard({ state, todayStatus, onStartTask, onOpenSettings, onOpenHistory, onOpenStats, darkMode, onToggleDark, freezesAvailable, onFreezeStreak }) {
  const wordOfDay = getWordOfDay()
  const [wotdSaved, setWotdSaved] = useState(() => {
    const vocab = getVocabulary()
    return vocab.some(w => w.word === wordOfDay.word)
  })
  const [wotdSpeaking, setWotdSpeaking] = useState(false)
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

  function speakWord() {
    if (wotdSpeaking || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utt = new SpeechSynthesisUtterance(wordOfDay.word)
    utt.lang = 'es-ES'
    utt.rate = 0.85
    utt.onstart = () => setWotdSpeaking(true)
    utt.onend = () => setWotdSpeaking(false)
    utt.onerror = () => setWotdSpeaking(false)
    window.speechSynthesis.speak(utt)
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

  // Recommended exercise of the day — rotates daily through beginner-friendly picks
  const DAILY_RECS = [
    { view: 'grammarcards',   icon: '📋', title: 'Gramatické karty',     desc: 'Precvič si pravidlá gramatiky A1 — ideálne pre začiatočníkov!' },
    { view: 'translation',    icon: '🔁', title: 'Prelož vetu',           desc: 'Prekladaj slovenské vety do španielčiny.' },
    { view: 'numbers',        icon: '🔢', title: 'Čísla a čas',           desc: 'Precvič čísla, hodiny, dni a mesiace.' },
    { view: 'grammar',        icon: '📚', title: 'Gramatika — dopĺňanie', desc: 'Doplň správne slovo — slovesá a kľúčové štruktúry.' },
    { view: 'dialog',         icon: '🗣️', title: 'Dialóg',                desc: 'Nacvič rozhovor zo skutočného života.' },
    { view: 'reading',        icon: '📖', title: 'Čítanie',               desc: 'Prečítaj krátky text a odpovedz na otázky.' },
    { view: 'errorcorrection',icon: '🔧', title: 'Oprav chybu',           desc: 'Nájdi gramatickú chybu v každej vete.' },
  ]
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000)
  const todayRec = DAILY_RECS[dayOfYear % DAILY_RECS.length]

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
          <p className="dash-subtitle">2 minúty dennej španielčiny</p>
        </div>
        <div className="dash-header-actions">
          <button className="btn-settings" onClick={onToggleDark} title="Prepnúť tmavý režim">{darkMode ? '☀️' : '🌙'}</button>
          <button className="btn-settings" onClick={onOpenHistory} title="História">📚</button>
          <button className="btn-settings" onClick={onOpenStats} title="Štatistiky">📊</button>
          <button className="btn-settings" onClick={onOpenSettings} title="Nastavenia">⚙️</button>
        </div>
      </div>

      {/* Mobile-only compact streak badge */}
      <div className="streak-mini">
        <div className="streak-mini-flame">🔥</div>
        <div className="streak-mini-body">
          <div className="streak-mini-top">
            <span className="streak-mini-num">{streak}</span>
            <span className="streak-mini-label"> dňová séria</span>
            {(todayStatus.writingDone || todayStatus.speakingDone) &&
              <span className="streak-mini-done">✓ dnes</span>
            }
            {todayFrozen && <span className="streak-mini-done" style={{background:'#bfdbfe',color:'#1e40af'}}>🧊 zmrazená</span>}
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
            <div className="streak-label">dňová séria</div>
            <div className="streak-best">Rekord: {longestStreak} dní</div>
            {todayFrozen && <div className="freeze-badge">🧊 Séria dnes zmrazená</div>}
            {showFreeze && (
              <button className="btn-freeze" onClick={onFreezeStreak}>
                🧊 Zmraziť sériu <span className="freeze-count">({freezesAvailable} zostatok tento týždeň)</span>
              </button>
            )}

            {streak > 0 && (
              <div style={{ marginTop: 8 }}>
                <button
                  onClick={handleShare}
                  style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: 13, cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
                >
                  {shareMsg || '📤 Zdieľať moju sériu'}
                </button>
              </div>
            )}

            {nextMilestone && (
              <div className="milestone-progress">
                <div className="milestone-progress-label">
                  Ďalší: {nextMilestone.emoji} {nextMilestone.label} ({nextMilestone.days} dní)
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
              <div className="xp-label">{xp - currentFloor} / {nextXp - currentFloor} do úrovne {level + 1}</div>
            </div>
          </div>

          <div className="stats-row">
            <div className="stat-box">
              <div className="stat-number">{totalDays}</div>
              <div className="stat-label">Dokončené dni</div>
            </div>
            <div className="stat-box">
              <div className="stat-number">{unlockedMilestones.length}</div>
              <div className="stat-label">Míľniky</div>
            </div>
            <div className="stat-box">
              <div className="stat-number">{formatDuration(duration)}</div>
              <div className="stat-label">Dĺžka session</div>
            </div>
          </div>

          <ActivityGraph history={state.history || []} />

          <div className="milestones-section">
            <h3>Míľniky</h3>
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

          <SkillsProgress />
        </div>

        {/* Right column: today's tasks & bonus */}
        <div className="dash-right">
          <div className="today-section">
            <h3>Dnešná výzva <span className="duration-badge">{formatDuration(duration)} každé</span></h3>
            <div className="tasks-grid">
              <TaskCard
                icon="✍️"
                title="Písanie"
                desc="Napíš niekoľko viet po španielsky na tému dňa"
                done={todayStatus.writingDone}
                color="purple"
                onStart={() => onStartTask('writing')}
              />
              <TaskCard
                icon="🎤"
                title="Rozprávanie"
                desc="Povedz svoju odpoveď nahlas po španielsky"
                done={todayStatus.speakingDone}
                color="green"
                onStart={() => onStartTask('speaking')}
              />
            </div>

            {todayStatus.writingDone && todayStatus.speakingDone ? (
              <div className="all-done-banner">
                🎉 Obe úlohy hotové! Uvidíme sa zajtra!
              </div>
            ) : (todayStatus.writingDone || todayStatus.speakingDone) ? (
              <div className="streak-done-banner">
                🔥 Séria zachránená! Dokonči druhú úlohu pre extra XP.
              </div>
            ) : null}
          </div>

          <div className={`weekly-card ${weeklyDone ? 'weekly-done' : ''}`}>
            <div className="weekly-top">
              <span className="weekly-icon">🏆</span>
              <div>
                <div className="weekly-label">Týždenná výzva</div>
                <div className="weekly-title">{weeklyChallenge.title}</div>
              </div>
              {weeklyDone && <div className="weekly-badge">Hotovo!</div>}
            </div>
            <p className="weekly-prompt">{weeklyChallenge.prompt}</p>
            {!weeklyDone && (
              <button className="btn-weekly-start" onClick={() => onStartTask('weekly')}>
                Začať výzvu +50 XP
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 4 }}>
              <div className="wotd-word" style={{ marginBottom: 0 }}>{wordOfDay.word}</div>
              <button
                onClick={speakWord}
                disabled={wotdSpeaking || !('speechSynthesis' in window)}
                style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 8, padding: '4px 10px', cursor: 'pointer', fontSize: 16, color: '#fff', flexShrink: 0 }}
                title="Vypočuť výslovnosť"
              >
                {wotdSpeaking ? '🔊' : '▶'}
              </button>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>🇸🇰 {wordOfDay.sk}</div>
            </div>
            <div className="wotd-definition">{wordOfDay.definition}</div>
            <div className="wotd-example">"{wordOfDay.example}"</div>
            <button
              className={`btn-secondary wotd-save-btn ${wotdSaved ? 'wotd-saved' : ''}`}
              onClick={handleSaveWotd}
              disabled={wotdSaved}
            >
              {wotdSaved ? '✓ Uložené do slovníčka' : '+ Uložiť do slovníčka'}
            </button>
          </div>

          {/* Recommended exercise of the day */}
          <div style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: 16, padding: '14px 18px', marginBottom: 4 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: 1, marginBottom: 6 }}>✨ ODPORÚČANÉ DNES</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 28 }}>{todayRec.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: '#fff', fontSize: 15 }}>{todayRec.title}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>{todayRec.desc}</div>
              </div>
              <button
                onClick={() => onStartTask(todayRec.view)}
                style={{ background: 'rgba(255,255,255,0.2)', border: '1.5px solid rgba(255,255,255,0.4)', borderRadius: 10, color: '#fff', fontWeight: 700, fontSize: 14, padding: '8px 14px', cursor: 'pointer', whiteSpace: 'nowrap' }}
              >
                Začať →
              </button>
            </div>
          </div>

          <div className="bonus-section">
            <h3>Extra cvičenia</h3>
            <p className="bonus-note">Voliteľné — nie sú potrebné pre sériu</p>
            <button className="btn-mixed" onClick={() => onStartTask('mixed')}>
              🔀 Zmiešané cvičenie
              <span className="btn-mixed-sub">5 rôznych zručností v jednej session</span>
            </button>
            <button className="btn-vocab" onClick={() => onStartTask('reading')}>
              📖 Čítanie
              <span className="btn-vocab-sub">Prečítaj krátky text a odpovedz na otázky</span>
            </button>
            <button className="btn-vocab" onClick={() => onStartTask('vocabpacks')} style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)' }}>
              📦 Tematické balíčky
              <span className="btn-vocab-sub">Tematické slovíčka: reštaurácia, rodina, čas...</span>
            </button>
            <button className="btn-vocab" onClick={() => onStartTask('vocabulary')} style={{ background: 'linear-gradient(135deg, #10b981, #3b82f6)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                📗 Môj slovníček
                {vocabDueCount > 0 && (
                  <span style={{ background: '#fef3c7', color: '#92400e', borderRadius: 10, padding: '1px 8px', fontSize: 12, fontWeight: 700 }}>
                    {vocabDueCount} na opakovanie
                  </span>
                )}
              </span>
              <span className="btn-vocab-sub">Slovíčka uložené z cvičení a chatu</span>
            </button>
            <div className="tasks-grid">
              <BonusCard
                icon="🔤" title="Synonymá"
                desc="Nájdi synonymá k španielskemu slovu"
                color="blue" onStart={() => onStartTask('synonyms')}
              />
              <BonusCard
                icon="📝" title="Predložky"
                desc="Doplň správnu predložku do vety"
                color="orange" onStart={() => onStartTask('prepositions')}
              />
              <BonusCard
                icon="💬" title="Idiomy"
                desc="Doplň chýbajúce slovo do idiomatického výrazu"
                color="purple" onStart={() => onStartTask('idioms')}
              />
              <BonusCard
                icon="🎧" title="Shadowing"
                desc="Počúvaj vetu a zopakuj ju nahlas"
                color="teal" onStart={() => onStartTask('shadowing')}
              />
              <BonusCard
                icon="📚" title="Gramatika"
                desc="Doplň správny tvar — slovesá, časy, rod"
                color="green" onStart={() => onStartTask('grammar')}
              />
              <BonusCard
                icon="📋" title="Gramatické karty"
                desc="Pravidlá A1/A2 s príkladmi — klepni a preskúmaj"
                color="green" onStart={() => onStartTask('grammarcards')}
              />
              <BonusCard
                icon="🔁" title="Prelož vetu"
                desc="Preložte slovenské vety do španielčiny"
                color="purple" onStart={() => onStartTask('translation')}
              />
              <BonusCard
                icon="🗣️" title="Dialóg"
                desc="Nacvič rozhovor — kaviareň, lekár, hotel..."
                color="blue" onStart={() => onStartTask('dialog')}
              />
              <BonusCard
                icon="🔢" title="Čísla a čas"
                desc="Čísla, hodiny, dni, mesiace — precvič po španielsky"
                color="teal" onStart={() => onStartTask('numbers')}
              />
              <BonusCard
                icon="🔀" title="Zoradenie vety"
                desc="Poskladaj slová do správnej španielskej vety"
                color="orange" onStart={() => onStartTask('reorder')}
              />
              <BonusCard
                icon="🎧" title="Počúvanie"
                desc="Počúvaj vetu a doplň chýbajúce slovo"
                color="teal" onStart={() => onStartTask('listening')}
              />
              <BonusCard
                icon="🃏" title="Kvíz slovíčok"
                desc="Otestuj sa na uložených slovíčkach"
                color="blue" onStart={() => onStartTask('vocabquiz')}
              />
              <BonusCard
                icon="📊" title="Slabé miesta"
                desc="Pozri svoje najčastejšie chyby"
                color="purple" onStart={() => onStartTask('weakspots')}
              />
              <BonusCard
                icon="🔧" title="Oprav chybu"
                desc="Nájdi a oprav gramatickú chybu vo vete"
                color="orange" onStart={() => onStartTask('errorcorrection')}
              />
              <BonusCard
                icon="🔗" title="Kolokácie"
                desc="Ktoré slová patria k sebe? hacer/tener, mucho/muy..."
                color="blue" onStart={() => onStartTask('collocations')}
              />
              <BonusCard
                icon="🌿" title="Slovné rodiny"
                desc="Doplň správny tvar slova do vety"
                color="green" onStart={() => onStartTask('wordfamilies')}
              />
              <BonusCard
                icon="💫" title="Zvratné slovesá"
                desc="levantarse, llamarse, acostarse — precvič zvratné slovesá"
                color="teal" onStart={() => onStartTask('phrasalverbs')}
              />
              <BonusCard
                icon="🎙️" title="Diktát"
                desc="Počúvaj celú vetu a napíš každé slovo"
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
      <div className="activity-label">Posledných 30 dní</div>
      <div className="activity-grid">
        {cells.map(({ dateStr, cls, day }) => (
          <div key={dateStr} className={`act-dot ${cls}`} title={dateStr}>
            <span className="act-day">{day}</span>
          </div>
        ))}
      </div>
      <div className="calendar-legend">
        <span className="cal-legend-dot" style={{ background: 'var(--green)' }} />obe
        <span className="cal-legend-dot" style={{ background: 'var(--green-light)', border: '1px solid var(--green)' }} />jedna
        <span className="cal-legend-dot" style={{ background: 'var(--border)' }} />žiadna
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
      <button className={`btn-task btn-task-${color}`} onClick={onStart}>Začať</button>
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
        ? <div className="task-card-complete">Hotovo!</div>
        : <button className={`btn-task btn-task-${color}`} onClick={onStart}>Začať</button>
      }
    </div>
  )
}

function SkillsProgress() {
  const level = localStorage.getItem('exerciseLevel') || 'A1'
  const skills = [
    { key: 'grammar',      label: 'Gramatika',    icon: '📚', items: GRAMMAR_EXERCISES.filter(e => e.level === level) },
    { key: 'prepositions', label: 'Predložky',    icon: '📝', items: PREPOSITION_PHRASES.filter(e => e.level === level) },
    { key: 'idioms',       label: 'Idiomy',       icon: '💬', items: IDIOM_PHRASES.filter(e => e.level === level) },
    { key: 'synonyms',     label: 'Synonymá',     icon: '🔤', items: SYNONYM_WORDS.filter(e => e.level === level) },
    { key: 'shadowing',    label: 'Shadowing',    icon: '🎧', items: SHADOWING_SENTENCES.filter(e => e.level === level) },
  ]

  const rows = skills.map(s => {
    const stats = getFlashcardStats(s.key, s.items)
    const pct = stats.total > 0 ? Math.round(stats.learned / stats.total * 100) : 0
    return { ...s, ...stats, pct }
  })

  const anyStarted = rows.some(r => r.learned > 0 || r.due > 0)

  return (
    <div className="milestones-section">
      <h3>Môj pokrok — {level}</h3>
      {!anyStarted ? (
        <p style={{ fontSize: 13, color: 'var(--muted)', margin: '4px 0 0' }}>
          Ešte žiadne cvičenia. Začni s Extra Practice! 👇
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 6 }}>
          {rows.map(r => (
            <div key={r.key}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 3 }}>
                <span style={{ color: 'var(--text)' }}>{r.icon} {r.label}</span>
                <span style={{ color: 'var(--muted)', fontSize: 12 }}>
                  {r.learned}/{r.total}
                  {r.due > 0 && <span style={{ color: '#f59e0b', fontWeight: 700, marginLeft: 6 }}> · {r.due} na op.</span>}
                </span>
              </div>
              <div style={{ height: 6, borderRadius: 4, background: 'var(--border)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${r.pct}%`, background: 'var(--green)', borderRadius: 4, transition: 'width 0.4s' }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
