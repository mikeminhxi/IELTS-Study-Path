import { describe, expect, it } from 'vitest'
import { lessons } from '../src/content/stage1'
import { buildReviewLesson, stages } from '../src/content/roadmap'

describe('stage 1 content', () => {
  it('matches roadmap metadata', () => {
    const ids = stages[0].lessons.filter((l) => !l.isReview).map((l) => l.id)
    expect(lessons.map((l) => l.id)).toEqual(ids)
  })
  for (const l of lessons) {
    it(`${l.id} has all sections and valid exercises`, () => {
      expect(l.objectives.length).toBeGreaterThan(0)
      expect(l.theory.length).toBeGreaterThan(0)
      expect(l.examples.length).toBeGreaterThanOrEqual(5)
      expect(l.exercises.length).toBeGreaterThanOrEqual(8)
      expect(l.vocab.length).toBeGreaterThanOrEqual(10)
      expect(l.summary.length).toBeGreaterThan(0)
      for (const ex of l.exercises) {
        if (ex.type === 'mcq') {
          expect(ex.answer).toBeLessThan(ex.options.length)
          expect(new Set(ex.options).size).toBe(ex.options.length)
        }
        if (ex.type === 'fill') expect(ex.prompt).toContain('___')
        if (ex.type === 'reorder')
          for (const alt of ex.alternatives ?? []) expect([...alt].map((w) => w.toLowerCase()).sort()).toEqual([...ex.words].map((w) => w.toLowerCase()).sort())
      }
    })
  }
  it('vocab ids are unique', () => {
    const ids = lessons.flatMap((l) => l.vocab.map((v) => v.id))
    expect(new Set(ids).size).toBe(ids.length)
  })
  it('builds review with 2 questions per lesson', () => {
    expect(buildReviewLesson(stages[0], lessons).exercises.length).toBe(24)
  })
})
