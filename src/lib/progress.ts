import { allLessonMeta, stages } from '../content/roadmap'
import type { AppState } from './state'

export type LessonStatus = 'locked' | 'available' | 'in_progress' | 'done' | 'coming'

export function lessonStatus(state: AppState, id: string): LessonStatus {
  const meta = allLessonMeta.find((l) => l.id === id)
  if (!meta || !meta.stageAvailable) return 'coming'
  const p = state.lessons[id]
  if (p?.status === 'done') return 'done'
  if (p) return 'in_progress'
  const list = allLessonMeta.filter((l) => l.stageAvailable)
  const i = list.findIndex((l) => l.id === id)
  if (i === 0) return 'available'
  return state.lessons[list[i - 1].id]?.status === 'done' ? 'available' : 'locked'
}

export function stageProgress(state: AppState, stageId: number) {
  const s = stages.find((x) => x.id === stageId)!
  const done = s.lessons.filter((l) => state.lessons[l.id]?.status === 'done').length
  return { done, total: s.lessons.length, pct: Math.round((done / s.lessons.length) * 100) }
}

/** Bài nên học tiếp: bài đang học gần nhất chưa xong, nếu không thì bài đầu tiên chưa xong. */
export function continueLessonId(state: AppState): string | undefined {
  const last = state.lastLessonId
  if (last && state.lessons[last]?.status === 'in_progress') return last
  return allLessonMeta.find((l) => l.stageAvailable && state.lessons[l.id]?.status !== 'done')?.id
}
