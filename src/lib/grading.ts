import type { Exercise } from '../content/types'

/** Chuẩn hoá câu trả lời: chữ thường, bỏ dấu câu, gộp khoảng trắng, thống nhất dấu nháy. */
export function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[‘’`´]/g, "'")
    .replace(/[.,!?;:"“”]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export type Response = number | string | string[]

export function grade(ex: Exercise, response: Response): boolean {
  switch (ex.type) {
    case 'mcq':
      return response === ex.answer
    case 'fill': {
      const r = normalize(String(response))
      return ex.answers.some((a) => normalize(a) === r)
    }
    case 'reorder': {
      if (!Array.isArray(response)) return false
      const r = normalize(response.join(' '))
      return [ex.words, ...(ex.alternatives ?? [])].some((w) => normalize(w.join(' ')) === r)
    }
  }
}

export function correctAnswerText(ex: Exercise): string {
  switch (ex.type) {
    case 'mcq':
      return ex.options[ex.answer]
    case 'fill':
      return ex.answers[0]
    case 'reorder':
      return ex.words.join(' ')
  }
}

/** Xáo trộn ổn định theo seed (để thứ tự từ không đổi khi render lại). */
export function seededShuffle<T>(arr: T[], seed: number): T[] {
  const a = [...arr]
  let s = seed || 1
  const rand = () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
