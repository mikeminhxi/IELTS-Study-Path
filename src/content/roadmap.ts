import type { Lesson, Stage } from './types'

const m = (id: string, title: string, focus: string, topic: string, minutes = 35) => ({ id, title, focus, topic, minutes })
const review = (stage: number) => ({
  id: `${stage}-r`,
  title: `Ôn tập giai đoạn ${stage}`,
  focus: 'Tổng hợp kiến thức cả giai đoạn',
  topic: 'Tổng hợp',
  minutes: 25,
  isReview: true,
})

export const stages: Stage[] = [
  {
    id: 1,
    name: 'Nền móng',
    level: 'A1 → A2',
    weeks: 8,
    description: 'Phát âm chuẩn, các thì cơ bản và từ vựng đời sống hằng ngày.',
    available: true,
    lessons: [
      m('1-1', 'Phát âm: nguyên âm IPA', 'Nguyên âm ngắn/dài, nguyên âm đôi', 'Chào hỏi', 30),
      m('1-2', 'Phát âm: phụ âm & âm cuối', 'Âm cuối, đuôi -s/-es và -ed', 'Số đếm, thời gian'),
      m('1-3', 'Trọng âm & ngữ điệu', 'Trọng âm từ, nhấn câu, ngữ điệu câu hỏi', 'Gia đình', 30),
      m('1-4', 'Danh từ & mạo từ', 'Số ít/số nhiều, a/an/the', 'Đồ vật, nhà cửa'),
      m('1-5', 'Đại từ & động từ to be', 'Câu giới thiệu bản thân', 'Nghề nghiệp, quốc tịch', 30),
      m('1-6', 'Thì hiện tại đơn', 'Thói quen, trạng từ tần suất', 'Thói quen hằng ngày', 40),
      m('1-7', 'Thì hiện tại tiếp diễn', 'Phân biệt với hiện tại đơn', 'Hoạt động, thời tiết'),
      m('1-8', 'Thì quá khứ đơn', 'Động từ có quy tắc / bất quy tắc', 'Kỳ nghỉ, cuối tuần', 40),
      m('1-9', 'Nói về tương lai', 'will và be going to', 'Kế hoạch', 30),
      m('1-10', 'Tính từ & so sánh', 'So sánh hơn, so sánh nhất', 'Mô tả người, nơi chốn', 40),
      m('1-11', 'Giới từ thời gian & nơi chốn', 'in / on / at, chỉ đường', 'Thành phố, chỉ đường'),
      m('1-12', 'Đặt câu hỏi', 'Câu hỏi Yes/No và Wh-', 'Ăn uống, mua sắm'),
      review(1),
    ],
  },
  {
    id: 2,
    name: 'Tiền trung cấp',
    level: 'A2 → B1',
    weeks: 10,
    description: 'Thì hoàn thành, câu điều kiện, bị động và từ vựng theo chủ đề IELTS.',
    available: false,
    lessons: [
      m('2-1', 'Hiện tại hoàn thành', 'for/since, already/yet', 'Trải nghiệm'),
      m('2-2', 'Quá khứ tiếp diễn & kể chuyện', 'when/while, trình tự kể', 'Kỷ niệm'),
      m('2-3', 'Động từ khuyết thiếu', 'can, must, should, have to', 'Quy định, lời khuyên'),
      m('2-4', 'Câu điều kiện 0, 1, 2', 'Giả định thực tế / không thực tế', 'Môi trường'),
      m('2-5', 'Câu bị động cơ bản', 'Hiện tại & quá khứ', 'Sản xuất, phát minh'),
      m('2-6', 'Mệnh đề quan hệ', 'who, which, that, where', 'Con người, địa điểm'),
      m('2-7', 'V-ing và to V', 'Động từ theo sau', 'Sở thích'),
      m('2-8', 'Đếm được / không đếm được', 'much, many, a few, a little', 'Thực phẩm, sức khoẻ'),
      m('2-9', 'Từ nối cơ bản', 'and, but, because, so, although', 'Giáo dục'),
      m('2-10', 'Collocations thông dụng', 'make/do/take/have + N', 'Công việc'),
      m('2-11', 'Cấu tạo từ', 'Tiền tố, hậu tố', 'Công nghệ'),
      m('2-12', 'Viết đoạn văn & nói 1–2 phút', 'Cấu trúc đoạn văn đơn giản', 'Quê hương'),
      review(2),
    ],
  },
  {
    id: 3,
    name: 'Cầu nối IELTS',
    level: 'B1 → B2',
    weeks: 10,
    description: 'Làm quen kỹ năng học thuật: paraphrasing, AWL, đọc – nghe hiểu, nêu quan điểm.',
    available: false,
    lessons: [
      m('3-1', 'IELTS là gì?', '4 kỹ năng, band score (kiến thức)', 'Tổng quan'),
      m('3-2', 'Paraphrasing', 'Từ đồng nghĩa, đổi cấu trúc', 'Kỹ năng xuyên suốt'),
      m('3-3', 'Academic Word List', 'AWL sublist 1–3', 'Từ vựng học thuật'),
      m('3-4', 'Câu ghép & câu phức', 'Mệnh đề trạng ngữ', 'Đa dạng cấu trúc'),
      m('3-5', 'Điều kiện loại 3, hỗn hợp, wish', 'Giả định quá khứ', 'Tiếc nuối'),
      m('3-6', 'Mô tả xu hướng & số liệu', 'increase, decline, sharply…', 'Số liệu'),
      m('3-7', 'Nêu quan điểm', 'Đồng ý/phản đối, lý do & ví dụ', 'Tranh luận'),
      m('3-8', 'Kỹ năng đọc', 'Skimming, scanning', 'Đọc hiểu'),
      m('3-9', 'Kỹ năng nghe', 'Ý chính vs chi tiết', 'Nghe hiểu'),
      m('3-10', 'Đoạn văn học thuật', 'Topic sentence → ví dụ', 'Viết'),
      m('3-11', 'Nói trôi chảy', 'Mở rộng câu trả lời', 'Nói'),
      m('3-12', 'Tổng kết & định hướng', 'Tự đánh giá 4 kỹ năng', 'Bước tiếp theo'),
      review(3),
    ],
  },
]

export const allLessonMeta = stages.flatMap((s) => s.lessons.map((l) => ({ ...l, stageId: s.id, stageAvailable: s.available })))

export function findMeta(id: string) {
  return allLessonMeta.find((l) => l.id === id)
}

/** Bài kế tiếp trong lộ trình (chỉ trong các giai đoạn đã có nội dung). */
export function nextLessonId(id: string): string | undefined {
  const list = allLessonMeta.filter((l) => l.stageAvailable)
  const i = list.findIndex((l) => l.id === id)
  return i >= 0 ? list[i + 1]?.id : undefined
}

const loaders: Record<number, () => Promise<{ lessons: Lesson[] }>> = {
  1: () => import('./stage1'),
}

/** Tải nội dung một giai đoạn (code-split theo giai đoạn). */
export async function loadStage(stageId: number): Promise<Lesson[]> {
  const load = loaders[stageId]
  if (!load) return []
  return (await load()).lessons
}

/** Bài ôn tập: lấy 2 câu từ mỗi bài trong giai đoạn (cố định để có thể tiếp tục giữa chừng). */
export function buildReviewLesson(stage: Stage, lessons: Lesson[]): Lesson {
  const exercises = lessons.flatMap((l, n) => {
    const len = l.exercises.length
    const a = n % len
    const b = (n + 5) % len
    return [l.exercises[a], l.exercises[b]]
  })
  return {
    id: `${stage.id}-r`,
    stageId: stage.id,
    title: `Ôn tập giai đoạn ${stage.id}`,
    focus: 'Tổng hợp kiến thức cả giai đoạn',
    topic: 'Tổng hợp',
    minutes: 25,
    objectives: [
      `Kiểm tra lại kiến thức trọng tâm của ${lessons.length} bài trong giai đoạn "${stage.name}".`,
      'Phát hiện phần còn yếu để học lại trước khi sang giai đoạn mới.',
    ],
    theory: [
      { type: 'p', text: 'Đây là bài **ôn tập**, không phải bài thi. Mỗi bài trong giai đoạn có 2 câu hỏi. Làm sai câu nào, hãy xem lại bài tương ứng.' },
      { type: 'table', head: ['Bài', 'Trọng tâm'], rows: lessons.map((l) => [l.title, l.focus]) },
    ],
    examples: [],
    exercises,
    vocab: [],
    summary: lessons.map((l) => `${l.title}: ${l.summary[0]}`),
  }
}
