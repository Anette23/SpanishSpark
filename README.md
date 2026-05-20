# ⚡ SpanishSpark

A habit-forming app for daily Spanish practice, built on the **2-minute rule** from James Clear's *Atomic Habits*.

🌐 **Live app:** [spanishspark.vercel.app](https://spanishspark.vercel.app/)

---

## The idea

The hardest part of building a habit isn't doing it — it's starting. SpanishSpark removes the friction by asking for just **2 minutes a day**: one for writing, one for speaking. That's it. Small enough to always say yes to, consistent enough to actually work.

Inspired by James Clear's *Atomic Habits* and the principle that a 1% improvement every day leads to remarkable results over time.

---

## What it does

### Daily practice
- ✍️ **Daily writing** — a fresh Spanish prompt every day, a countdown timer, a text area to write freely
- 🎤 **Daily speaking** — speak out loud in Spanish to the prompt, with optional voice recording
- 📝 **AI feedback** — after each session, get corrections and suggestions from Claude
- 💬 **Chat en español** — free conversation with an AI partner in Spanish; get grammar feedback at any time

### Progress & motivation
- 🔥 **Streak tracking** — daily streak with freeze option (1 per week) to protect your streak
- ⭐ **XP & levels** — earn XP for every session and bonus exercise, level up over time
- 🏆 **Milestones** — unlock achievements at 3, 7, 14, 21, 30, 60, 100 and 365 days
- ⏱️ **Progressive difficulty** — session length grows automatically as you build the habit (2:00 → 4:00)
- 🏅 **Weekly challenge** — a themed writing/speaking challenge that resets every week (+50 XP)
- 📊 **Statistics page** — weekly XP bar chart, 90-day activity heatmap, session breakdown, vocabulary count, top weak spots

### Extra practice (optional, not required for streak)
- 🔤 **Synonyms** — recall synonyms for Spanish words, then write a sentence using one (AI checks it)
- 📝 **Prepositions** — fill-in-the-blank exercises with Spanish prepositions, then use the phrase in a sentence
- 💬 **Idioms** — fill-in-the-blank with common Spanish idioms, then practise using them
- 📚 **Grammar Fill** — exercises across categories (ser/estar, gustar, tener, reflexives, past tense and more)
- 📋 **Grammar Cards** — A1/A2 grammar rules with examples and tips — tap to browse and expand
- 🎧 **Shadowing** — listen to a Spanish sentence, repeat it out loud; "Play slower" and "Very slow" buttons; tap any missed word to hear it
- 🔀 **Mixed Practice** — one exercise from every section in a single session, with sentence practice for each
- 📖 **Reading** — short Spanish texts at A1/A2 level with comprehension questions; Slovak translations; write a reaction
- 📗 **My Vocabulary** — a personal word notebook; save words directly from exercises, chat, or the word of the day; export as CSV
- 📦 **Vocabulary Packs** — thematic word sets: V reštaurácii, Nakupovanie, Rodina, Čísla a čas, Cestovanie, Zdravie — save words to your vocabulary
- 🃏 **Vocabulary Quiz** — test yourself on your saved vocabulary in both directions (Eslovaco → Español and Español → Eslovaco); due words shown first (spaced repetition)
- 🎙️ **Listening Dictation** — hear a full Spanish sentence (text hidden), type every word; "Play slower" and "Very slow" buttons; word-level result after checking
- 🔀 **Sentence Reorder** — tap words to arrange them into a correct Spanish sentence
- 🎧 **Listening Gaps** — hear a sentence, type the missing word
- 📊 **Weak Spots** — automatic error-pattern tracker showing a ranked bar chart of recurring mistakes
- 📅 **Palabra del día** — a curated A1/A2 Spanish word each day with Slovak translation, definition and example sentence; one-tap TTS pronunciation; one-tap save to vocabulary

### Beginner-focused exercises (A1/A2)
- 🔧 **Error Correction** — spot and fix the grammar mistake in a Spanish sentence (A1/A2)
- 🔗 **Collocations** — choose the word that goes with the gap: hacer/tener, mucho/muy and more
- 🌿 **Word Families** — type the correct word form (noun/verb/adjective) that fits the sentence
- 💫 **Verbos reflexivos** — levantarse, llamarse, acostarse and other reflexive verbs
- 🔁 **Prelož vetu** — translate Slovak sentences into Spanish (SK → ES), with flexible matching and hints
- 🗣️ **Dialóg** — scripted real-life conversations: café, doctor, hotel — practice turn by turn
- 🔢 **Čísla a čas** — practice numbers, clock times, days, months, dates and frequency expressions in Spanish

### Dashboard
- ✨ **Odporúčané cvičenie dňa** — a highlighted daily recommendation that rotates through beginner-friendly exercises
- 📈 **Môj pokrok** — per-skill progress bars (Grammar, Prepositions, Idioms, Synonyms, Shadowing) showing learned/total items and items due for review

### Spaced repetition
Every bonus exercise feeds a per-item spaced repetition system. Weak items come back sooner; mastered items fade out. Each section has a **daily goal of 5** and awards +20 XP on completion. A **Review** button appears whenever cards are due.

### Connected learning
Sentences you write in exercises are saved. When you open **Chat en español**, the AI is told which phrases you've been practising and naturally steers the conversation so you get a chance to use them for real.

### Word of the Day TTS
Tap the ▶ button next to *Palabra del día* to hear the word pronounced in Spanish using the browser's built-in speech synthesis.

### Daily reminder
- 🔔 **Browser notifications** — opt-in daily reminder at a chosen hour; only fires if today's tasks aren't done yet

### Other features
- 📤 **Import / Export backup** — export a JSON backup of all progress; restore it from Settings
- 📢 **Share my streak** — share or copy your streak text with one tap
- 👋 **Onboarding modal** — first-run welcome screen for new users
- 🌙 **Dark mode** — toggle in the header

### Installable (PWA)
SpanishSpark is a Progressive Web App — you can install it on your phone's home screen for a native app experience, including offline support for the app shell.

---

## Tech stack

- **React** + **Vite** — frontend SPA
- **localStorage** — all progress stored locally; no account, no backend
- **Anthropic API** (Claude Haiku) — AI feedback, sentence checking, chat, word translation
- **Web Speech API** — voice recording and text-to-speech in `es-ES`
- **Vercel** — hosting + serverless API routes
- **PWA** — manifest + service worker for installability and offline support

---

## AI features setup

AI features (feedback, sentence checking, chat) are optional. To enable them:

1. Get an API key at [console.anthropic.com](https://console.anthropic.com)
2. Add it as `ANTHROPIC_API_KEY` in your Vercel environment variables

---

## Run locally

```bash
git clone https://github.com/Anette23/SpanishSpark.git
cd SpanishSpark
npm install
npm run dev
```

Create a `.env.local` file for AI features:

```
ANTHROPIC_API_KEY=your_anthropic_key
```

---

*Inspired by [Atomic Habits](https://jamesclear.com/atomic-habits) by James Clear.*
