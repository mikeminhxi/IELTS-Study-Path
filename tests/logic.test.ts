import { describe, expect, it } from 'vitest'
import { grade, normalize } from '../src/lib/grading'
import { newCard, review } from '../src/lib/srs'
import { initialState, reducer, scoreOf, streak } from '../src/lib/state'
import { addDays } from '../src/lib/date'

describe('grading', () => {
  it('normalizes case, punctuation and apostrophes', () => {
    expect(normalize("  Doesn’t  Drink. ")).toBe("doesn't drink")
  })
  it('grades all exercise types', () => {
    expect(grade({ type: 'mcq', prompt: '', options: ['a', 'b'], answer: 1, explain: '' }, 1)).toBe(true)
    expect(grade({ type: 'fill', prompt: '', answers: ["doesn't drink", 'does not drink'], explain: '' }, 'Does not drink')).toBe(true)
    expect(grade({ type: 'fill', prompt: '', answers: ['went'], explain: '' }, 'goed')).toBe(false)
    const r = { type: 'reorder' as const, prompt: '', words: ['It', 'is', 'cloudy', 'today'], alternatives: [['Today', 'it', 'is', 'cloudy']], explain: '' }
    expect(grade(r, ['Today', 'it', 'is', 'cloudy'])).toBe(true)
    expect(grade(r, ['is', 'It', 'cloudy', 'today'])).toBe(false)
  })
})

describe('srs', () => {
  const today = '2026-01-10'
  it('schedules growing intervals', () => {
    let c = review(newCard(today), 2, today)
    expect(c.interval).toBe(1)
    expect(c.due).toBe('2026-01-11')
    c = review(c, 2, c.due)
    expect(c.interval).toBe(3)
    c = review(c, 2, c.due)
    expect(c.interval).toBe(8)
  })
  it('resets on forget and keeps due today', () => {
    const c = review(review(newCard(today), 3, today), 0, today)
    expect(c.interval).toBe(0)
    expect(c.due).toBe(today)
    expect(c.ease).toBeLessThan(2.65)
  })
})

describe('state', () => {
  it('records only first attempt and computes score', () => {
    let s = reducer(initialState, { type: 'openLesson', id: '1-1', exerciseCount: 2 })
    s = reducer(s, { type: 'answer', id: '1-1', index: 0, correct: false })
    s = reducer(s, { type: 'answer', id: '1-1', index: 0, correct: true })
    s = reducer(s, { type: 'answer', id: '1-1', index: 1, correct: true })
    expect(s.lessons['1-1'].results).toEqual([false, true])
    expect(scoreOf(s.lessons['1-1'])).toBe(50)
  })
  it('counts streak including yesterday', () => {
    const t = '2026-03-10'
    const log = { [addDays(t, -1)]: { seconds: 120, lessons: 0, cards: 0 }, [addDays(t, -2)]: { seconds: 0, lessons: 1, cards: 0 } }
    expect(streak(log, t)).toBe(2)
    expect(streak({}, t)).toBe(0)
  })
})

describe('settings import', () => {
  it('defaults palette for old exports', async () => {
    const { parseImported } = await import('../src/lib/state')
    const s = parseImported({ version: 1, lessons: {}, cards: {}, settings: { theme: 'dark' } })
    expect(s?.settings.palette).toBe('indigo')
    expect(s?.settings.theme).toBe('dark')
  })
})
