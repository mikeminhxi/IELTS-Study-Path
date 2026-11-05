import { Check, RotateCcw, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { Exercise } from '../content/types'
import { correctAnswerText, grade, seededShuffle, type Response } from '../lib/grading'
import { scoreOf } from '../lib/state'
import { useStore } from '../lib/store'
import { ProgressBar } from './ProgressBar'
import { RichText } from './RichText'
import { SpeakButton } from './SpeakButton'

const TYPE_LABEL: Record<Exercise['type'], string> = {
  mcq: 'Chọn đáp án đúng',
  fill: 'Điền vào chỗ trống',
  reorder: 'Sắp xếp thành câu đúng',
}

export function ExerciseRunner({ lessonId, exercises, onPassed }: { lessonId: string; exercises: Exercise[]; onPassed: () => void }) {
  const { state, dispatch } = useStore()
  const p = state.lessons[lessonId]
  const threshold = state.settings.passThreshold
  const [practice, setPractice] = useState<number[] | null>(null) // ôn lại câu sai (không tính điểm)
  const [practicePos, setPracticePos] = useState(0)

  if (!p) return null
  const finished = p.exIndex >= exercises.length

  if (practice) {
    const idx = practice[practicePos]
    if (idx === undefined) {
      return (
        <div className="card pop-in p-6 text-center">
          <p className="text-lg font-semibold">Bạn đã ôn lại hết các câu sai.</p>
          <button className="btn btn-primary mt-4" onClick={() => setPractice(null)}>
            Xem kết quả
          </button>
        </div>
      )
    }
    return (
      <Question
        key={`p-${idx}-${practicePos}`}
        ex={exercises[idx]}
        seed={idx + 7}
        header={`Ôn câu sai ${practicePos + 1}/${practice.length}`}
        progress={(practicePos / practice.length) * 100}
        onChecked={() => {}}
        onNext={() => setPracticePos((n) => n + 1)}
      />
    )
  }

  if (finished) {
    const score = scoreOf(p)
    const passed = score >= threshold
    const wrong = p.results.map((r, i) => (r ? -1 : i)).filter((i) => i >= 0)
    return (
      <div className="card pop-in p-6 text-center" aria-live="polite">
        <p className="text-sm font-semibold uppercase tracking-wide text-muted-fg">Kết quả luyện tập</p>
        <p className={`mt-2 text-5xl font-bold ${passed ? 'text-success' : 'text-warning'}`}>{score}%</p>
        <p className="mt-2 text-muted-fg">
          Đúng ngay lần đầu {p.results.filter(Boolean).length}/{exercises.length} câu · Cần ≥ {threshold}% để qua bài
        </p>
        <p className="mt-3 font-medium">{passed ? 'Tốt lắm! Bạn đã đạt yêu cầu.' : 'Chưa đạt. Xem lại lý thuyết rồi thử lại nhé.'}</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          {wrong.length > 0 && (
            <button
              className="btn btn-ghost"
              onClick={() => {
                setPractice(wrong)
                setPracticePos(0)
              }}
            >
              Ôn lại {wrong.length} câu sai
            </button>
          )}
          <button className="btn btn-ghost" onClick={() => dispatch({ type: 'restartExercises', id: lessonId, exerciseCount: exercises.length })}>
            <RotateCcw aria-hidden size={18} /> Làm lại từ đầu
          </button>
          {passed && (
            <button className="btn btn-primary" onClick={onPassed}>
              Tiếp tục
            </button>
          )}
        </div>
      </div>
    )
  }

  const i = p.exIndex
  return (
    <Question
      key={`q-${i}`}
      ex={exercises[i]}
      seed={i + 1}
      header={`Câu ${i + 1}/${exercises.length}`}
      progress={(i / exercises.length) * 100}
      onChecked={(correct) => dispatch({ type: 'answer', id: lessonId, index: i, correct })}
      onNext={() => dispatch({ type: 'setExIndex', id: lessonId, index: i + 1 })}
    />
  )
}

function Question({
  ex,
  seed,
  header,
  progress,
  onChecked,
  onNext,
}: {
  ex: Exercise
  seed: number
  header: string
  progress: number
  onChecked: (correct: boolean) => void
  onNext: () => void
}) {
  const [response, setResponse] = useState<Response | null>(ex.type === 'reorder' ? [] : null)
  const [result, setResult] = useState<boolean | null>(null)
  const feedbackRef = useRef<HTMLDivElement>(null)

  const canCheck =
    response !== null && (ex.type === 'fill' ? String(response).trim() !== '' : ex.type === 'reorder' ? (response as string[]).length === ex.words.length : true)

  const check = () => {
    if (!canCheck || result !== null) return
    const ok = grade(ex, response!)
    setResult(ok)
    onChecked(ok)
  }

  const retry = () => {
    setResult(null)
    setResponse(ex.type === 'reorder' ? [] : null)
  }

  useEffect(() => {
    if (result !== null) {
      feedbackRef.current?.focus({ preventScroll: true })
      feedbackRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
  }, [result])

  return (
    <div className="pop-in">
      <div className="mb-4 flex items-center gap-3">
        <span className="shrink-0 text-sm font-semibold text-muted-fg">{header}</span>
        <ProgressBar value={progress} label="Tiến độ luyện tập" />
      </div>
      <div className="card p-5 sm:p-6">
        <p className="text-sm font-semibold text-primary">{TYPE_LABEL[ex.type]}</p>
        <p className="mt-2 text-xl font-semibold leading-snug">
          <RichText text={ex.prompt} />
        </p>
        <div className="mt-5">
          {ex.type === 'mcq' && <McqInput ex={ex} value={response as number | null} disabled={result !== null} onChange={setResponse} />}
          {ex.type === 'fill' && <FillInput ex={ex} value={(response as string) ?? ''} disabled={result !== null} onChange={setResponse} onSubmit={check} />}
          {ex.type === 'reorder' && <ReorderInput ex={ex} seed={seed} value={response as string[]} disabled={result !== null} onChange={setResponse} />}
        </div>
      </div>

      {result !== null && (
        <div
          ref={feedbackRef}
          tabIndex={-1}
          role="status"
          className={`pop-in mt-4 scroll-mb-28 rounded-2xl border-2 p-4 outline-none ${result ? 'border-success bg-success-soft' : 'border-danger bg-danger-soft'}`}
        >
          <p className={`flex items-center gap-2 font-bold ${result ? 'text-success' : 'text-danger'}`}>
            {result ? <Check aria-hidden size={20} /> : <X aria-hidden size={20} />}
            {result ? 'Chính xác!' : 'Chưa đúng'}
          </p>
          {!result && (
            <p className="mt-1">
              Đáp án: <strong>{correctAnswerText(ex)}</strong>
            </p>
          )}
          <p className="mt-1 text-fg/90">
            <RichText text={ex.explain} />
          </p>
        </div>
      )}

      <div className="sticky bottom-0 z-10 -mx-4 mt-6 border-t border-border bg-bg/95 px-4 py-3 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0" style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}>
        {result === null ? (
          <button className="btn btn-primary w-full" disabled={!canCheck} onClick={check}>
            Kiểm tra
          </button>
        ) : (
          <div className="flex gap-3">
            {!result && (
              <button className="btn btn-ghost flex-1" onClick={retry}>
                Thử lại
              </button>
            )}
            <button className="btn btn-primary flex-1" onClick={onNext}>
              Tiếp tục
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function McqInput({ ex, value, disabled, onChange }: { ex: Extract<Exercise, { type: 'mcq' }>; value: number | null; disabled: boolean; onChange: (v: number) => void }) {
  return (
    <div role="radiogroup" aria-label="Các lựa chọn" className="grid gap-3">
      {ex.options.map((o, i) => {
        const selected = value === i
        const showCorrect = disabled && i === ex.answer
        const showWrong = disabled && selected && i !== ex.answer
        return (
          <button
            key={i}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={disabled}
            onClick={() => onChange(i)}
            className={`flex min-h-[52px] items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left transition-colors ${
              showCorrect
                ? 'border-success bg-success-soft'
                : showWrong
                  ? 'border-danger bg-danger-soft'
                  : selected
                    ? 'border-primary bg-muted'
                    : 'border-border bg-card hover:bg-muted'
            } disabled:cursor-default`}
          >
            <span
              aria-hidden
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${selected ? 'bg-primary text-on-primary' : 'bg-muted text-muted-fg'}`}
            >
              {String.fromCharCode(65 + i)}
            </span>
            <span className="font-medium">
              <RichText text={o} />
            </span>
            {showCorrect && <Check aria-label="Đáp án đúng" className="ml-auto text-success" size={20} />}
            {showWrong && <X aria-label="Lựa chọn sai" className="ml-auto text-danger" size={20} />}
          </button>
        )
      })}
    </div>
  )
}

function FillInput({
  ex,
  value,
  disabled,
  onChange,
  onSubmit,
}: {
  ex: Extract<Exercise, { type: 'fill' }>
  value: string
  disabled: boolean
  onChange: (v: string) => void
  onSubmit: () => void
}) {
  const ref = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (window.matchMedia('(pointer: fine)').matches) ref.current?.focus()
  }, [])
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit()
      }}
    >
      <label htmlFor="fill-answer" className="mb-2 block text-sm font-medium text-muted-fg">
        Câu trả lời của bạn{ex.hint ? ` (gợi ý: ${ex.hint})` : ''}
      </label>
      <input
        id="fill-answer"
        ref={ref}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
        enterKeyHint="done"
        className="h-14 w-full rounded-2xl border-2 border-border bg-card px-4 text-lg outline-none focus:border-primary disabled:opacity-80"
      />
    </form>
  )
}

function ReorderInput({
  ex,
  seed,
  value,
  disabled,
  onChange,
}: {
  ex: Extract<Exercise, { type: 'reorder' }>
  seed: number
  value: string[]
  disabled: boolean
  onChange: (v: string[]) => void
}) {
  // Mỗi token có chỉ số riêng để xử lý từ trùng lặp (vd. "the" xuất hiện 2 lần).
  const tokens = useMemo(() => {
    const idx = ex.words.map((_, i) => i)
    let s = seededShuffle(idx, seed * 31 + ex.words.length)
    if (s.every((v, i) => v === i) && s.length > 1) s = [...s.slice(1), s[0]]
    return s
  }, [ex.words, seed])
  const [picked, setPicked] = useState<number[]>([])

  useEffect(() => {
    if (value.length === 0) setPicked([])
  }, [value])

  const update = (next: number[]) => {
    setPicked(next)
    onChange(next.map((i) => ex.words[i]))
  }

  return (
    <div>
      <div
        aria-label="Câu của bạn"
        className="flex min-h-[64px] flex-wrap content-start gap-2 rounded-2xl border-2 border-dashed border-border bg-muted/50 p-3"
      >
        {picked.length === 0 && <span className="self-center text-muted-fg">Chạm vào các từ bên dưới theo đúng thứ tự</span>}
        {picked.map((ti, pos) => (
          <button
            key={`${ti}`}
            type="button"
            disabled={disabled}
            onClick={() => update(picked.filter((_, k) => k !== pos))}
            aria-label={`Bỏ từ ${ex.words[ti]}`}
            className="min-h-[44px] rounded-xl border-2 border-primary bg-card px-3 font-medium disabled:cursor-default"
          >
            {ex.words[ti]}
          </button>
        ))}
      </div>
      <div aria-label="Các từ" className="mt-4 flex flex-wrap gap-2">
        {tokens.map((ti) => {
          const used = picked.includes(ti)
          return (
            <button
              key={ti}
              type="button"
              disabled={disabled || used}
              onClick={() => update([...picked, ti])}
              className={`min-h-[44px] rounded-xl border-2 px-3 font-medium transition-colors ${used ? 'border-transparent bg-muted text-transparent' : 'border-border bg-card hover:bg-muted'}`}
              aria-hidden={used}
            >
              {ex.words[ti]}
            </button>
          )
        })}
      </div>
      {disabled && (
        <div className="mt-3 flex items-center gap-1 text-muted-fg">
          <SpeakButton text={ex.words.join(' ')} label="Nghe câu đúng" size="sm" /> Nghe câu đúng
        </div>
      )}
    </div>
  )
}
