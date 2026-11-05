/** Khối nội dung lý thuyết. Văn bản hỗ trợ **in đậm** và `mã`. */
export type TheoryBlock =
  | { type: 'h'; text: string }
  | { type: 'p'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'table'; head: string[]; rows: string[][] }
  | { type: 'tip'; text: string }
  | { type: 'warn'; text: string }

export interface Example {
  en: string
  vi: string
  ipa?: string
}

export type Exercise =
  | {
      type: 'mcq'
      prompt: string
      options: string[]
      /** chỉ số đáp án đúng trong options */
      answer: number
      explain: string
    }
  | {
      type: 'fill'
      /** dùng ___ cho chỗ trống */
      prompt: string
      /** các đáp án chấp nhận được */
      answers: string[]
      hint?: string
      explain: string
    }
  | {
      type: 'reorder'
      /** nghĩa tiếng Việt / gợi ý */
      prompt: string
      /** các từ theo thứ tự đúng */
      words: string[]
      /** các thứ tự khác cũng đúng */
      alternatives?: string[][]
      explain: string
    }

export interface VocabItem {
  id: string
  word: string
  ipa: string
  pos: string
  vi: string
  example: string
}

export interface Lesson {
  id: string
  stageId: number
  title: string
  focus: string
  topic: string
  minutes: number
  objectives: string[]
  theory: TheoryBlock[]
  examples: Example[]
  exercises: Exercise[]
  vocab: VocabItem[]
  summary: string[]
}

export interface LessonMeta {
  id: string
  title: string
  focus: string
  topic: string
  minutes: number
  isReview?: boolean
}

export interface Stage {
  id: number
  name: string
  level: string
  weeks: number
  description: string
  available: boolean
  lessons: LessonMeta[]
}
