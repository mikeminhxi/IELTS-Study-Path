import { CheckCircle2, ChevronDown, Circle, Clock, Flame, Layers, Lock, PlayCircle, Star } from 'lucide-react'
import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ProgressBar } from '../components/ProgressBar'
import { useDueCount } from '../components/Layout'
import { findMeta, stages } from '../content/roadmap'
import type { LessonMeta, Stage } from '../content/types'
import { dayKey } from '../lib/date'
import { continueLessonId, lessonStatus, stageProgress, type LessonStatus } from '../lib/progress'
import { streak } from '../lib/state'
import { useStore } from '../lib/store'

export default function Home() {
  const { state } = useStore()
  const navigate = useNavigate()
  const due = useDueCount()
  const nextId = continueLessonId(state)
  const next = nextId ? findMeta(nextId) : undefined
  const started = Object.keys(state.lessons).length > 0
  const today = state.log[dayKey()]
  const minutes = Math.floor((today?.seconds ?? 0) / 60)
  const goal = state.settings.dailyGoalMin
  const st = streak(state.log)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [pendingId, setPendingId] = useState<string | null>(null)

  const open = (id: string, status: LessonStatus) => {
    if (status === 'coming') return
    if (status === 'locked') {
      setPendingId(id)
      dialogRef.current?.showModal()
      return
    }
    navigate(`/lesson/${id}`)
  }

  return (
    <div className="space-y-6">
      <section aria-labelledby="continue-title" className="card overflow-hidden">
        <div className="bg-primary p-5 text-on-primary sm:p-6">
          <p className="text-sm font-medium opacity-90">{started ? 'Tiếp tục hành trình' : 'Bắt đầu hành trình'}</p>
          {next ? (
            <>
              <h1 id="continue-title" className="mt-1 text-2xl font-bold leading-tight">
                {next.title}
              </h1>
              <p className="mt-1 text-sm opacity-90">
                Giai đoạn {next.stageId} · Bài {next.id.replace('-', '.').replace('.r', ' – ôn tập')} · {next.topic}
              </p>
              <Link
                to={`/lesson/${next.id}`}
                className="btn mt-4 bg-card font-bold text-primary shadow-[inset_0_-3px_0_rgb(0_0_0/0.08)] hover:brightness-95"
              >
                <PlayCircle aria-hidden size={20} />
                {started ? 'Học tiếp' : 'Bắt đầu bài 1.1'}
                <span className="font-normal opacity-80">· {next.minutes} phút</span>
              </Link>
            </>
          ) : (
            <h1 id="continue-title" className="mt-1 text-2xl font-bold">
              Bạn đã hoàn thành mọi bài hiện có. Nội dung mới sắp ra mắt!
            </h1>
          )}
        </div>
        <dl className="grid grid-cols-3 divide-x divide-border">
          <Stat icon={<Flame aria-hidden size={18} className="text-warning" />} label="Chuỗi ngày" value={`${st}`} />
          <Stat icon={<Clock aria-hidden size={18} className="text-primary" />} label="Hôm nay" value={`${minutes}/${goal}′`} />
          <Link to="/review" className="block transition-colors hover:bg-muted">
            <Stat icon={<Layers aria-hidden size={18} className="text-success" />} label="Thẻ cần ôn" value={`${due}`} />
          </Link>
        </dl>
      </section>

      <section aria-labelledby="roadmap-title">
        <h2 id="roadmap-title" className="mb-3 text-xl font-bold">
          Lộ trình của bạn
        </h2>
        <ol className="space-y-4">
          {stages.map((s) => (
            <StageCard key={s.id} stage={s} onOpen={open} />
          ))}
        </ol>
      </section>

      <dialog
        ref={dialogRef}
        aria-labelledby="skip-title"
        className="m-auto w-[min(92vw,420px)] rounded-3xl border border-border bg-card p-6 text-fg backdrop:bg-black/50"
        onClose={() => setPendingId(null)}
      >
        <h2 id="skip-title" className="text-lg font-bold">
          Học vượt bài này?
        </h2>
        <p className="mt-2 text-muted-fg">Bạn chưa hoàn thành bài trước. Lộ trình được sắp xếp từ dễ đến khó, nên học theo thứ tự sẽ hiệu quả hơn.</p>
        <form method="dialog" className="mt-5 flex gap-3">
          <button className="btn btn-ghost flex-1" value="cancel">
            Để sau
          </button>
          <button
            className="btn btn-primary flex-1"
            value="ok"
            onClick={() => {
              if (pendingId) navigate(`/lesson/${pendingId}`)
            }}
          >
            Vẫn học
          </button>
        </form>
      </dialog>
    </div>
  )
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center px-2 py-3 text-center">
      <dt className="flex items-center gap-1 text-xs font-medium text-muted-fg">
        {icon}
        {label}
      </dt>
      <dd className="text-lg font-bold tabular-nums">{value}</dd>
    </div>
  )
}

function StageCard({ stage, onOpen }: { stage: Stage; onOpen: (id: string, s: LessonStatus) => void }) {
  const { state } = useStore()
  const prog = stageProgress(state, stage.id)
  const color = `var(--stage-${stage.id})`
  const [expanded, setExpanded] = useState(stage.available)
  const listId = `stage-${stage.id}-lessons`

  return (
    <li className="card overflow-hidden">
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={listId}
        onClick={() => setExpanded((e) => !e)}
        className="flex w-full items-start gap-4 p-5 text-left transition-colors hover:bg-muted/60"
      >
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-lg font-bold text-white" style={{ background: color }} aria-hidden>
          {stage.id}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-x-2">
            <span className="text-lg font-bold">
              Giai đoạn {stage.id} · {stage.name}
            </span>
            {!stage.available && <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-muted-fg">Sắp có</span>}
          </span>
          <span className="block text-sm text-muted-fg">
            {stage.level} · ~{stage.weeks} tuần · {stage.lessons.length} bài
          </span>
          <span className="mt-1 block text-sm">{stage.description}</span>
          {stage.available && (
            <span className="mt-3 flex items-center gap-3">
              <ProgressBar value={prog.pct} color={color} label={`Tiến độ giai đoạn ${stage.id}`} />
              <span className="shrink-0 text-sm font-semibold tabular-nums">
                {prog.done}/{prog.total}
              </span>
            </span>
          )}
        </span>
        <ChevronDown aria-hidden size={20} className={`mt-1 shrink-0 text-muted-fg transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>
      {expanded && (
        <ul id={listId} className="border-t border-border">
          {stage.lessons.map((l) => (
            <LessonRow key={l.id} lesson={l} status={lessonStatus(state, l.id)} color={color} onOpen={onOpen} best={state.lessons[l.id]?.best} />
          ))}
        </ul>
      )}
    </li>
  )
}

function LessonRow({ lesson, status, color, onOpen, best }: { lesson: LessonMeta; status: LessonStatus; color: string; onOpen: (id: string, s: LessonStatus) => void; best?: number }) {
  const num = lesson.isReview ? '★' : lesson.id.replace('-', '.')
  const statusText: Record<LessonStatus, string> = {
    done: 'Đã xong',
    in_progress: 'Đang học',
    available: 'Có thể học',
    locked: 'Chưa mở',
    coming: 'Sắp có',
  }
  const Icon = status === 'done' ? CheckCircle2 : status === 'in_progress' ? PlayCircle : status === 'locked' || status === 'coming' ? Lock : lesson.isReview ? Star : Circle
  const dim = status === 'locked' || status === 'coming'
  return (
    <li className="border-b border-border last:border-0">
      <button
        type="button"
        disabled={status === 'coming'}
        onClick={() => onOpen(lesson.id, status)}
        className={`flex min-h-[64px] w-full items-center gap-3 px-5 py-3 text-left transition-colors hover:bg-muted/60 disabled:cursor-default disabled:hover:bg-transparent ${dim ? 'text-muted-fg' : ''}`}
      >
        <span className="w-8 shrink-0 text-center text-sm font-bold tabular-nums" style={{ color: dim ? undefined : color }} aria-hidden>
          {num}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-semibold leading-snug">{lesson.title}</span>
          <span className="block truncate text-sm text-muted-fg">
            {lesson.focus} · {lesson.minutes} phút
          </span>
        </span>
        {status === 'done' && best !== undefined && <span className="text-sm font-semibold tabular-nums text-success">{best}%</span>}
        <Icon aria-hidden size={22} className={status === 'done' ? 'text-success' : status === 'in_progress' ? 'text-primary' : ''} />
        <span className="sr-only">{statusText[status]}</span>
      </button>
    </li>
  )
}
