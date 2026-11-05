import { ArrowLeft, ArrowRight, CheckCircle2, PartyPopper, Target, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ExerciseRunner } from '../components/ExerciseRunner'
import { ProgressBar } from '../components/ProgressBar'
import { RichText } from '../components/RichText'
import { SpeakButton } from '../components/SpeakButton'
import { TheoryView } from '../components/TheoryView'
import { buildReviewLesson, findMeta, loadStage, nextLessonId, stages } from '../content/roadmap'
import type { Lesson } from '../content/types'
import { scoreOf } from '../lib/state'
import { useStore, useStudyTimer } from '../lib/store'

type SectionKey = 'objectives' | 'theory' | 'examples' | 'exercises' | 'vocab' | 'summary'
const SECTION_LABEL: Record<SectionKey, string> = {
  objectives: 'Mục tiêu',
  theory: 'Lý thuyết',
  examples: 'Ví dụ',
  exercises: 'Luyện tập',
  vocab: 'Từ vựng',
  summary: 'Tổng kết',
}

export default function LessonPage() {
  const { id = '' } = useParams()
  const meta = findMeta(id)
  const [lesson, setLesson] = useState<Lesson | null | undefined>(undefined)

  useEffect(() => {
    let alive = true
    if (!meta || !meta.stageAvailable) {
      setLesson(null)
      return
    }
    loadStage(meta.stageId).then((lessons) => {
      if (!alive) return
      if (meta.isReview) {
        const stage = stages.find((s) => s.id === meta.stageId)!
        setLesson(buildReviewLesson(stage, lessons))
      } else {
        setLesson(lessons.find((l) => l.id === id) ?? null)
      }
    })
    return () => {
      alive = false
    }
  }, [id, meta])

  if (lesson === undefined) return <p className="p-8 text-center text-muted-fg" role="status">Đang tải bài học…</p>
  if (lesson === null)
    return (
      <div className="mx-auto max-w-md p-8 text-center">
        <p className="text-lg font-semibold">Bài học này chưa có nội dung.</p>
        <Link to="/" className="btn btn-primary mt-4">
          Về lộ trình
        </Link>
      </div>
    )
  return <LessonView key={lesson.id} lesson={lesson} />
}

function LessonView({ lesson }: { lesson: Lesson }) {
  useStudyTimer()
  const { state, dispatch } = useStore()
  const navigate = useNavigate()
  const p = state.lessons[lesson.id]
  const mainRef = useRef<HTMLHeadingElement>(null)
  const [justCompleted, setJustCompleted] = useState(false)

  const sections: SectionKey[] = (['objectives', 'theory', 'examples', 'exercises', 'vocab', 'summary'] as SectionKey[]).filter(
    (s) => !(s === 'examples' && lesson.examples.length === 0) && !(s === 'vocab' && lesson.vocab.length === 0),
  )

  useEffect(() => {
    dispatch({ type: 'openLesson', id: lesson.id, exerciseCount: lesson.exercises.length })
  }, [dispatch, lesson.id, lesson.exercises.length])

  const sectionIndex = Math.min(p?.section ?? 0, sections.length - 1)
  const section = sections[sectionIndex]

  useEffect(() => {
    if (section === 'vocab') dispatch({ type: 'addCards', ids: lesson.vocab.map((v) => v.id) })
  }, [section, dispatch, lesson.vocab])

  if (!p) return null

  const go = (i: number) => {
    dispatch({ type: 'setSection', id: lesson.id, section: i })
    window.scrollTo({ top: 0 })
    requestAnimationFrame(() => mainRef.current?.focus())
  }

  const score = scoreOf(p)
  const allAnswered = p.results.every((r) => r !== null)
  const passed = allAnswered && score >= state.settings.passThreshold
  const nextId = nextLessonId(lesson.id)
  const nextMeta = nextId ? findMeta(nextId) : undefined
  const exIdx = sections.indexOf('exercises')

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-20 border-b border-border bg-bg/95 backdrop-blur" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-2">
          <Link to="/" aria-label="Đóng bài học, về lộ trình" className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full hover:bg-muted">
            <X aria-hidden size={22} />
          </Link>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{lesson.title}</p>
            <ProgressBar value={((sectionIndex + 1) / sections.length) * 100} label="Tiến độ bài học" color={`var(--stage-${lesson.stageId})`} />
          </div>
        </div>
        <nav aria-label="Các phần của bài" className="mx-auto max-w-3xl overflow-x-auto px-4 pb-2">
          <ol className="flex gap-2">
            {sections.map((s, i) => (
              <li key={s}>
                <button
                  type="button"
                  onClick={() => go(i)}
                  aria-current={i === sectionIndex ? 'step' : undefined}
                  className={`flex min-h-[36px] items-center gap-1 whitespace-nowrap rounded-full px-3 text-sm font-semibold transition-colors ${
                    i === sectionIndex ? 'bg-primary text-on-primary' : 'bg-muted text-muted-fg hover:text-fg'
                  }`}
                >
                  {s === 'exercises' && passed && <CheckCircle2 aria-hidden size={14} />}
                  {i + 1}. {SECTION_LABEL[s]}
                </button>
              </li>
            ))}
          </ol>
        </nav>
      </header>

      <main id="main" className="mx-auto max-w-3xl px-4 pb-10 pt-6">
        <h1 ref={mainRef} tabIndex={-1} className="mb-5 text-2xl font-bold outline-none">
          {SECTION_LABEL[section]}
        </h1>

        {section === 'objectives' && (
          <div className="space-y-4">
            <div className="card p-5">
              <p className="text-sm font-semibold text-muted-fg">
                {lesson.focus} · Chủ đề: {lesson.topic} · ~{lesson.minutes} phút
              </p>
              <h2 className="mt-3 flex items-center gap-2 font-bold">
                <Target aria-hidden size={20} className="text-primary" /> Sau bài này, bạn sẽ:
              </h2>
              <ul className="mt-2 space-y-2">
                {lesson.objectives.map((o, i) => (
                  <li key={i} className="flex gap-2">
                    <CheckCircle2 aria-hidden size={20} className="mt-0.5 shrink-0 text-success" />
                    <span>
                      <RichText text={o} />
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {section === 'theory' && (
          <div className="card p-5 sm:p-6">
            <TheoryView blocks={lesson.theory} />
          </div>
        )}

        {section === 'examples' && (
          <ul className="space-y-3">
            {lesson.examples.map((e, i) => (
              <li key={i} className="card flex items-start gap-3 p-4">
                <SpeakButton text={e.en} />
                <div className="min-w-0">
                  <p className="text-lg font-semibold leading-snug">{e.en}</p>
                  {e.ipa && <p className="ipa text-sm text-primary">{e.ipa}</p>}
                  <p className="text-muted-fg">{e.vi}</p>
                </div>
              </li>
            ))}
          </ul>
        )}

        {section === 'exercises' && <ExerciseRunner lessonId={lesson.id} exercises={lesson.exercises} onPassed={() => go(sectionIndex + 1)} />}

        {section === 'vocab' && (
          <>
            <p className="mb-4 text-muted-fg">{lesson.vocab.length} từ này đã được thêm vào bộ thẻ Ôn tập.</p>
            <ul className="grid gap-3 sm:grid-cols-2">
              {lesson.vocab.map((v) => (
                <li key={v.id} className="card flex items-start gap-2 p-4">
                  <SpeakButton text={v.word} size="sm" />
                  <div className="min-w-0">
                    <p className="font-bold">
                      {v.word} <span className="text-sm font-medium text-muted-fg">({v.pos})</span>
                    </p>
                    <p className="ipa text-sm text-primary">{v.ipa}</p>
                    <p>{v.vi}</p>
                    <p className="mt-1 text-sm italic text-muted-fg">{v.example}</p>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}

        {section === 'summary' && (
          <div className="space-y-4">
            <div className="card p-5">
              <h2 className="font-bold">Ghi nhớ</h2>
              <ul className="mt-2 space-y-2">
                {lesson.summary.map((s, i) => (
                  <li key={i} className="flex gap-2">
                    <span aria-hidden className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                    <span>
                      <RichText text={s} />
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {justCompleted || (p.status === 'done' && passed) ? (
              <div className="card pop-in border-success p-6 text-center" role="status">
                <PartyPopper aria-hidden size={40} className="mx-auto text-success" />
                <p className="mt-2 text-xl font-bold">Hoàn thành bài học!</p>
                <p className="text-muted-fg">Điểm luyện tập: {score}%</p>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <Link to="/" className="btn btn-ghost">
                    Về lộ trình
                  </Link>
                  {nextMeta && (
                    <Link to={`/lesson/${nextMeta.id}`} className="btn btn-primary">
                      Bài tiếp: {nextMeta.title} <ArrowRight aria-hidden size={18} />
                    </Link>
                  )}
                </div>
              </div>
            ) : passed ? (
              <button
                className="btn btn-primary w-full"
                onClick={() => {
                  dispatch({ type: 'completeLesson', id: lesson.id })
                  setJustCompleted(true)
                }}
              >
                <CheckCircle2 aria-hidden size={20} /> Hoàn thành bài
              </button>
            ) : (
              <div className="rounded-2xl bg-warning-soft p-4">
                <p>
                  Bạn cần làm xong phần <strong>Luyện tập</strong> với điểm ≥ {state.settings.passThreshold}% để hoàn thành bài
                  {allAnswered ? ` (hiện tại: ${score}%)` : ''}.
                </p>
                <button className="btn btn-primary mt-3" onClick={() => go(exIdx)}>
                  Đến phần Luyện tập
                </button>
              </div>
            )}
          </div>
        )}

        {section !== 'exercises' && section !== 'summary' && (
          <div className="mt-8 flex gap-3">
            {sectionIndex > 0 && (
              <button className="btn btn-ghost" onClick={() => go(sectionIndex - 1)} aria-label="Phần trước">
                <ArrowLeft aria-hidden size={18} />
              </button>
            )}
            <button className="btn btn-primary flex-1" onClick={() => go(sectionIndex + 1)}>
              Tiếp: {SECTION_LABEL[sections[sectionIndex + 1]]} <ArrowRight aria-hidden size={18} />
            </button>
          </div>
        )}
        {section === 'summary' && !justCompleted && p.status !== 'done' && (
          <button className="btn btn-ghost mt-4 w-full" onClick={() => navigate('/')}>
            Lưu và về lộ trình
          </button>
        )}
      </main>
    </div>
  )
}
