import type { VocabItem } from './types'

/** Tạo nhanh một mục từ vựng; id = <lessonId>:<word>. */
export function vocab(lessonId: string, rows: [string, string, string, string, string][]): VocabItem[] {
  return rows.map(([word, ipa, pos, vi, example]) => ({
    id: `${lessonId}:${word.toLowerCase().replace(/\s+/g, '-')}`,
    word,
    ipa,
    pos,
    vi,
    example,
  }))
}
