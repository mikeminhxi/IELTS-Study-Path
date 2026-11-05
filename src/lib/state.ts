import { dayKey } from './date'
import { newCard, review, type CardState, type Grade } from './srs'
import type { Accent } from './tts'

export interface LessonProgress {
  status: 'in_progress' | 'done'
  section: number
  exIndex: number
  /** kết quả lần trả lời đầu tiên của từng câu (null = chưa làm) */
  results: (boolean | null)[]
  best: number
  attempts: number
  updatedAt: number
}

export interface DayLog {
  seconds: number
  lessons: number
  cards: number
}

export interface Settings {
  dailyGoalMin: number
  accent: Accent
  rate: number
  theme: 'system' | 'light' | 'dark'
  passThreshold: number
}

export interface AppState {
  version: 1
  lessons: Record<string, LessonProgress>
  cards: Record<string, CardState>
  log: Record<string, DayLog>
  settings: Settings
  lastLessonId?: string
}

export const defaultSettings: Settings = {
  dailyGoalMin: 20,
  accent: 'en-GB',
  rate: 1,
  theme: 'system',
  passThreshold: 70,
}

export const initialState: AppState = {
  version: 1,
  lessons: {},
  cards: {},
  log: {},
  settings: defaultSettings,
}

export type Action =
  | { type: 'hydrate'; state: AppState }
  | { type: 'openLesson'; id: string; exerciseCount: number }
  | { type: 'setSection'; id: string; section: number }
  | { type: 'answer'; id: string; index: number; correct: boolean }
  | { type: 'setExIndex'; id: string; index: number }
  | { type: 'restartExercises'; id: string; exerciseCount: number }
  | { type: 'completeLesson'; id: string }
  | { type: 'addCards'; ids: string[] }
  | { type: 'reviewCard'; id: string; grade: Grade }
  | { type: 'addTime'; seconds: number }
  | { type: 'updateSettings'; patch: Partial<Settings> }
  | { type: 'reset' }

function bumpLog(state: AppState, patch: Partial<DayLog>): Record<string, DayLog> {
  const k = dayKey()
  const cur = state.log[k] ?? { seconds: 0, lessons: 0, cards: 0 }
  return {
    ...state.log,
    [k]: {
      seconds: cur.seconds + (patch.seconds ?? 0),
      lessons: cur.lessons + (patch.lessons ?? 0),
      cards: cur.cards + (patch.cards ?? 0),
    },
  }
}

export function scoreOf(p: LessonProgress | undefined): number {
  if (!p || p.results.length === 0) return 0
  const correct = p.results.filter((r) => r === true).length
  return Math.round((correct / p.results.length) * 100)
}

function patchLesson(state: AppState, id: string, patch: Partial<LessonProgress>): AppState {
  const cur = state.lessons[id]
  if (!cur) return state
  return { ...state, lessons: { ...state.lessons, [id]: { ...cur, ...patch, updatedAt: Date.now() } } }
}

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'hydrate':
      return action.state
    case 'openLesson': {
      const cur = state.lessons[action.id]
      if (cur && cur.results.length === action.exerciseCount) return { ...state, lastLessonId: action.id }
      const fresh: LessonProgress = {
        status: cur?.status ?? 'in_progress',
        section: cur?.section ?? 0,
        exIndex: 0,
        results: Array(action.exerciseCount).fill(null),
        best: cur?.best ?? 0,
        attempts: cur?.attempts ?? 0,
        updatedAt: Date.now(),
      }
      return { ...state, lastLessonId: action.id, lessons: { ...state.lessons, [action.id]: fresh } }
    }
    case 'setSection':
      return patchLesson(state, action.id, { section: action.section })
    case 'answer': {
      const cur = state.lessons[action.id]
      if (!cur || cur.results[action.index] !== null) return state
      const results = [...cur.results]
      results[action.index] = action.correct
      return patchLesson(state, action.id, { results })
    }
    case 'setExIndex':
      return patchLesson(state, action.id, { exIndex: action.index })
    case 'restartExercises':
      return patchLesson(state, action.id, { exIndex: 0, results: Array(action.exerciseCount).fill(null) })
    case 'completeLesson': {
      const cur = state.lessons[action.id]
      if (!cur) return state
      const score = scoreOf(cur)
      const firstTime = cur.status !== 'done'
      const next = patchLesson(state, action.id, {
        status: 'done',
        best: Math.max(cur.best, score),
        attempts: cur.attempts + 1,
      })
      return firstTime ? { ...next, log: bumpLog(next, { lessons: 1 }) } : next
    }
    case 'addCards': {
      const today = dayKey()
      const missing = action.ids.filter((id) => !state.cards[id])
      if (missing.length === 0) return state
      const cards = { ...state.cards }
      for (const id of missing) cards[id] = newCard(today)
      return { ...state, cards }
    }
    case 'reviewCard': {
      const card = state.cards[action.id]
      if (!card) return state
      return {
        ...state,
        cards: { ...state.cards, [action.id]: review(card, action.grade, dayKey()) },
        log: bumpLog(state, { cards: 1 }),
      }
    }
    case 'addTime':
      return { ...state, log: bumpLog(state, { seconds: action.seconds }) }
    case 'updateSettings':
      return { ...state, settings: { ...state.settings, ...action.patch } }
    case 'reset':
      return initialState
  }
}

/** Kiểm tra sơ bộ dữ liệu nhập vào. */
export function parseImported(raw: unknown): AppState | null {
  if (!raw || typeof raw !== 'object') return null
  const s = raw as Partial<AppState>
  if (s.version !== 1 || typeof s.lessons !== 'object' || typeof s.cards !== 'object') return null
  return {
    version: 1,
    lessons: s.lessons ?? {},
    cards: s.cards ?? {},
    log: s.log ?? {},
    settings: { ...defaultSettings, ...(s.settings ?? {}) },
    lastLessonId: s.lastLessonId,
  }
}

/** Chuỗi ngày học liên tiếp (tính đến hôm nay, hoặc hôm qua nếu hôm nay chưa học). */
export function streak(log: Record<string, DayLog>, today = dayKey()): number {
  const active = (k: string) => {
    const l = log[k]
    return !!l && (l.seconds >= 60 || l.lessons > 0 || l.cards > 0)
  }
  const d = new Date(today + 'T00:00:00')
  if (!active(today)) d.setDate(d.getDate() - 1)
  let n = 0
  while (active(dayKey(d))) {
    n++
    d.setDate(d.getDate() - 1)
  }
  return n
}
