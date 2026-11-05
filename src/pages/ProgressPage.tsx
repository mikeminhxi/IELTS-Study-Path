import { BookOpenCheck, Clock, Flame, GraduationCap } from 'lucide-react'
import { ProgressBar } from '../components/ProgressBar'
import { stages } from '../content/roadmap'
import { addDays, dayKey } from '../lib/date'
import { stageProgress } from '../lib/progress'
import { isLearned } from '../lib/srs'
import { streak } from '../lib/state'
import { useStore } from '../lib/store'

const WEEKS = 12
// Thang tuần tự một màu (primary), nhạt → đậm.
const LEVELS = ['var(--muted)', 'color-mix(in oklab, var(--primary) 30%, var(--card))', 'color-mix(in oklab, var(--primary) 55%, var(--card))', 'color-mix(in oklab, var(--primary) 80%, var(--card))', 'var(--primary)']

function level(min: number, goal: number, active: boolean) {
  if (min <= 0) return active ? 1 : 0
  const r = min / goal
  return r < 0.34 ? 1 : r < 0.67 ? 2 : r < 1 ? 3 : 4
}

export default function ProgressPage() {
  const { state } = useStore()
  const goal = state.settings.dailyGoalMin
  const today = dayKey()
  const st = streak(state.log)
  const totalMin = Math.round(Object.values(state.log).reduce((a, l) => a + l.seconds, 0) / 60)
  const done = Object.values(state.lessons).filter((l) => l.status === 'done')
  const avg = done.length ? Math.round(done.reduce((a, l) => a + l.best, 0) / done.length) : 0
  const cards = Object.values(state.cards)
  const learned = cards.filter(isLearned).length

  // Lưới: cột = tuần, hàng = thứ (T2 → CN). Ngày cuối cùng = hôm nay.
  const todayDow = (new Date(today + 'T00:00:00').getDay() + 6) % 7 // 0 = T2
  const start = addDays(today, -(WEEKS - 1) * 7 - todayDow)
  const cells: { key: string; min: number; active: boolean; future: boolean }[] = []
  for (let i = 0; i < WEEKS * 7; i++) {
    const k = addDays(start, i)
    const l = state.log[k]
    cells.push({ key: k, min: Math.floor((l?.seconds ?? 0) / 60), active: !!l && (l.seconds > 0 || l.lessons > 0 || l.cards > 0), future: k > today })
  }
  const activeDays = cells.filter((c) => c.active).length

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Tiến độ</h1>

      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Tile icon={<Flame aria-hidden size={20} className="text-warning" />} label="Chuỗi ngày học" value={`${st}`} unit="ngày" />
        <Tile icon={<Clock aria-hidden size={20} className="text-primary" />} label="Tổng thời gian" value={`${totalMin}`} unit="phút" />
        <Tile icon={<BookOpenCheck aria-hidden size={20} className="text-success" />} label="Bài đã xong" value={`${done.length}`} unit={done.length ? `TB ${avg}%` : ''} />
        <Tile icon={<GraduationCap aria-hidden size={20} className="text-primary" />} label="Từ đã thuộc" value={`${learned}`} unit={`/ ${cards.length} thẻ`} />
      </dl>

      <section className="card p-5" aria-labelledby="heat-title">
        <h2 id="heat-title" className="font-bold">
          Lịch học {WEEKS} tuần gần nhất
        </h2>
        <p className="text-sm text-muted-fg">
          {activeDays} ngày có học · Mục tiêu {goal} phút/ngày
        </p>
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          <div className="grid grid-rows-7 gap-[3px] pt-0 text-[11px] leading-[14px] text-muted-fg" aria-hidden>
            {['T2', '', 'T4', '', 'T6', '', 'CN'].map((d, i) => (
              <span key={i} className="h-[14px] sm:h-4">
                {d}
              </span>
            ))}
          </div>
          <div className="grid grid-flow-col grid-rows-7 gap-[3px]" role="img" aria-label={`Lịch học: ${activeDays} ngày có học trong ${WEEKS} tuần`}>
            {cells.map((c) => {
              const label = `${c.key.split('-').reverse().join('/')}: ${c.min} phút`
              return (
                <span
                  key={c.key}
                  title={c.future ? undefined : label}
                  className="h-[14px] w-[14px] rounded-[4px] sm:h-4 sm:w-4"
                  style={{
                    background: c.future ? 'transparent' : LEVELS[level(c.min, goal, c.active)],
                    outline: c.key === today ? '2px solid var(--fg)' : undefined,
                    outlineOffset: c.key === today ? '-1px' : undefined,
                  }}
                />
              )
            })}
          </div>
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-fg" aria-hidden>
          Ít
          {LEVELS.map((l, i) => (
            <span key={i} className="h-3 w-3 rounded-[3px]" style={{ background: l }} />
          ))}
          Đạt mục tiêu
        </div>
      </section>

      <section className="card p-5" aria-labelledby="stage-title">
        <h2 id="stage-title" className="font-bold">
          Theo giai đoạn
        </h2>
        <ul className="mt-3 space-y-4">
          {stages.map((s) => {
            const p = stageProgress(state, s.id)
            return (
              <li key={s.id}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="font-semibold">
                    GĐ {s.id} · {s.name} {!s.available && <span className="font-normal text-muted-fg">(sắp có)</span>}
                  </span>
                  <span className="tabular-nums text-muted-fg">
                    {p.done}/{p.total} bài
                  </span>
                </div>
                <ProgressBar value={p.pct} color={`var(--stage-${s.id})`} label={`Giai đoạn ${s.id}: ${p.pct}%`} />
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}

function Tile({ icon, label, value, unit }: { icon: React.ReactNode; label: string; value: string; unit: string }) {
  return (
    <div className="card p-4">
      <dt className="flex items-center gap-1.5 text-sm font-medium text-muted-fg">
        {icon}
        {label}
      </dt>
      <dd className="mt-1">
        <span className="text-2xl font-bold tabular-nums">{value}</span> <span className="text-sm text-muted-fg">{unit}</span>
      </dd>
    </div>
  )
}
