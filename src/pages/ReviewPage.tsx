import { CheckCircle2, Layers, RotateCw } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ProgressBar } from '../components/ProgressBar'
import { SpeakButton } from '../components/SpeakButton'
import { loadStage } from '../content/roadmap'
import type { VocabItem } from '../content/types'
import { dayKey } from '../lib/date'
import { seededShuffle } from '../lib/grading'
import { GRADE_LABELS, isLearned, previewInterval, type Grade } from '../lib/srs'
import { useStore, useStudyTimer } from '../lib/store'

const GRADE_STYLE: Record<Grade, string> = {
  0: 'border-danger text-danger',
  1: 'border-warning text-warning',
  2: 'border-primary text-primary',
  3: 'border-success text-success',
}

export default function ReviewPage() {
  useStudyTimer()
  const { state, dispatch } = useStore()
  const [vocab, setVocab] = useState<Map<string, VocabItem> | null>(null)
  const today = dayKey()

  const stageIds = useMemo(() => [...new Set(Object.keys(state.cards).map((id) => Number(id.split('-')[0])))], [state.cards])
  useEffect(() => {
    Promise.all(stageIds.map(loadStage)).then((all) => {
      const m = new Map<string, VocabItem>()
      all.flat().forEach((l) => l.vocab.forEach((v) => m.set(v.id, v)))
      setVocab(m)
    })
  }, [stageIds])

  // Hàng đợi cố định khi bắt đầu phiên; thẻ "Quên" được đưa xuống cuối.
  const [queue, setQueue] = useState<string[] | null>(null)
  const [reviewed, setReviewed] = useState(0)
  const [flipped, setFlipped] = useState(false)

  useEffect(() => {
    if (queue === null && vocab) {
      const due = Object.entries(state.cards)
        .filter(([id, c]) => c.due <= today && vocab.has(id))
        .map(([id]) => id)
      setQueue(seededShuffle(due, Date.now() % 100000))
    }
  }, [queue, vocab, state.cards, today])

  const currentId = queue?.[0]
  const current = currentId ? vocab?.get(currentId) : undefined
  const card = currentId ? state.cards[currentId] : undefined

  const rate = (g: Grade) => {
    if (!currentId) return
    dispatch({ type: 'reviewCard', id: currentId, grade: g })
    setReviewed((n) => n + 1)
    setFlipped(false)
    setQueue((q) => (q ? (g === 0 ? [...q.slice(1), q[0]] : q.slice(1)) : q))
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!current || (e.target as HTMLElement)?.tagName === 'INPUT') return
      if (!flipped && (e.key === ' ' || e.key === 'Enter')) {
        e.preventDefault()
        setFlipped(true)
      } else if (flipped && ['1', '2', '3', '4'].includes(e.key)) {
        rate((Number(e.key) - 1) as Grade)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const total = Object.keys(state.cards).length
  const learned = Object.values(state.cards).filter(isLearned).length

  if (!vocab || queue === null) return <p className="p-8 text-center text-muted-fg" role="status">Đang tải thẻ…</p>

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Ôn tập từ vựng</h1>
          <p className="text-muted-fg">
            {total} thẻ · {learned} đã thuộc (khoảng ôn ≥ 7 ngày)
          </p>
        </div>
      </div>

      {total === 0 ? (
        <div className="card p-8 text-center">
          <Layers aria-hidden size={40} className="mx-auto text-primary" />
          <p className="mt-3 text-lg font-semibold">Chưa có thẻ nào</p>
          <p className="text-muted-fg">Từ vựng sẽ tự động vào đây khi bạn học tới phần Từ vựng của mỗi bài.</p>
          <Link to="/" className="btn btn-primary mt-5">
            Đến lộ trình
          </Link>
        </div>
      ) : !current || !card ? (
        <div className="card pop-in p-8 text-center" role="status">
          <CheckCircle2 aria-hidden size={40} className="mx-auto text-success" />
          <p className="mt-3 text-lg font-semibold">{reviewed > 0 ? `Xong! Bạn đã ôn ${reviewed} lượt thẻ.` : 'Hôm nay không còn thẻ nào cần ôn.'}</p>
          <p className="text-muted-fg">Quay lại vào ngày mai để giữ trí nhớ lâu dài.</p>
          <Link to="/" className="btn btn-primary mt-5">
            Học bài mới
          </Link>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-3">
            <span className="shrink-0 text-sm font-semibold text-muted-fg">Còn {queue.length} thẻ</span>
            <ProgressBar value={(reviewed / (reviewed + queue.length)) * 100} label="Tiến độ phiên ôn tập" color="var(--success)" />
          </div>

          <div className="card pop-in flex min-h-[320px] flex-col items-center justify-center p-6 text-center" key={`${currentId}-${reviewed}`} aria-live="polite">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-fg">{flipped ? 'Mặt sau' : 'Bạn có nhớ nghĩa của từ này?'}</p>
            <div className="mt-3 flex items-center gap-2">
              <p className="text-3xl font-bold sm:text-4xl">{current.word}</p>
              <SpeakButton text={current.word} />
            </div>
            {flipped && (
              <div className="pop-in mt-3 space-y-1">
                <p className="ipa text-lg text-primary">
                  {current.ipa} <span className="font-sans text-sm text-muted-fg">({current.pos})</span>
                </p>
                <p className="text-xl font-semibold">{current.vi}</p>
                <p className="flex items-center justify-center gap-1 italic text-muted-fg">
                  {current.example}
                  <SpeakButton text={current.example} size="sm" label="Nghe câu ví dụ" />
                </p>
              </div>
            )}
          </div>

          {!flipped ? (
            <button className="btn btn-primary w-full" onClick={() => setFlipped(true)}>
              <RotateCw aria-hidden size={18} /> Lật thẻ
            </button>
          ) : (
            <div className="grid grid-cols-4 gap-2" role="group" aria-label="Mức độ nhớ">
              {([0, 1, 2, 3] as Grade[]).map((g) => (
                <button key={g} onClick={() => rate(g)} className={`btn h-auto min-h-[64px] flex-col gap-0.5 border-2 bg-card px-1 py-2 leading-tight ${GRADE_STYLE[g]} hover:bg-muted`}>
                  <span>{GRADE_LABELS[g]}</span>
                  <span className="whitespace-nowrap text-xs font-medium text-muted-fg">{previewInterval(card, g, today)}</span>
                </button>
              ))}
            </div>
          )}
          <p className="hidden text-center text-sm text-muted-fg sm:block">Phím tắt: Space để lật · 1–4 để đánh giá</p>
        </>
      )}
    </div>
  )
}
