import { addDays } from './date'

/** Trạng thái một thẻ flashcard (SM-2 rút gọn, theo ngày). */
export interface CardState {
  ease: number
  interval: number // số ngày
  reps: number
  due: string // YYYY-MM-DD
  lapses: number
}

export type Grade = 0 | 1 | 2 | 3 // Quên, Khó, Nhớ, Dễ

export const GRADE_LABELS: Record<Grade, string> = { 0: 'Quên', 1: 'Khó', 2: 'Nhớ', 3: 'Dễ' }

export function newCard(today: string): CardState {
  return { ease: 2.5, interval: 0, reps: 0, due: today, lapses: 0 }
}

export function review(card: CardState, grade: Grade, today: string): CardState {
  if (grade === 0) {
    return { ...card, ease: Math.max(1.3, card.ease - 0.2), interval: 0, reps: 0, due: today, lapses: card.lapses + 1 }
  }
  let interval: number
  let ease = card.ease
  if (card.reps === 0) {
    interval = grade === 3 ? 3 : 1
  } else if (card.reps === 1 && grade >= 2) {
    interval = grade === 3 ? 6 : 3
  } else {
    const base = Math.max(1, card.interval)
    if (grade === 1) interval = Math.ceil(base * 1.2)
    else if (grade === 2) interval = Math.ceil(base * ease)
    else interval = Math.ceil(base * ease * 1.3)
  }
  if (grade === 1) ease = Math.max(1.3, ease - 0.15)
  if (grade === 3) ease = ease + 0.15
  return { ...card, ease, interval, reps: card.reps + 1, due: addDays(today, interval) }
}

/** Gợi ý khoảng thời gian cho nút đánh giá. */
export function previewInterval(card: CardState, grade: Grade, today: string): string {
  if (grade === 0) return 'Hôm nay'
  const n = review(card, grade, today).interval
  return n === 1 ? '1 ngày' : `${n} ngày`
}

export function isLearned(card: CardState): boolean {
  return card.interval >= 7
}
