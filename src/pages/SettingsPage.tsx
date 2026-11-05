import { Download, Upload, Volume2 } from 'lucide-react'
import { useRef, useState } from 'react'
import { dayKey } from '../lib/date'
import { parseImported, type Settings } from '../lib/state'
import { useStore } from '../lib/store'
import { speak, ttsSupported } from '../lib/tts'

export default function SettingsPage() {
  const { state, dispatch } = useStore()
  const s = state.settings
  const set = (patch: Partial<Settings>) => dispatch({ type: 'updateSettings', patch })
  const fileRef = useRef<HTMLInputElement>(null)
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)

  const exportData = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `ielts-roadmap-${dayKey()}.json`
    a.click()
    URL.revokeObjectURL(a.href)
    setMsg({ ok: true, text: 'Đã xuất file tiến độ.' })
  }

  const importData = async (file: File) => {
    try {
      const parsed = parseImported(JSON.parse(await file.text()))
      if (!parsed) throw new Error()
      if (!confirm('Nhập file này sẽ thay thế toàn bộ tiến độ hiện tại. Tiếp tục?')) return
      dispatch({ type: 'hydrate', state: parsed })
      setMsg({ ok: true, text: 'Đã nhập tiến độ thành công.' })
    } catch {
      setMsg({ ok: false, text: 'File không hợp lệ. Hãy chọn file .json được xuất từ app này.' })
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Cài đặt</h1>

      <Section title="Học tập">
        <Field label="Mục tiêu mỗi ngày" htmlFor="goal">
          <select id="goal" value={s.dailyGoalMin} onChange={(e) => set({ dailyGoalMin: Number(e.target.value) })} className="select">
            {[10, 15, 20, 30, 45, 60].map((m) => (
              <option key={m} value={m}>
                {m} phút
              </option>
            ))}
          </select>
        </Field>
        <Field label="Điểm tối thiểu để qua bài" htmlFor="pass">
          <select id="pass" value={s.passThreshold} onChange={(e) => set({ passThreshold: Number(e.target.value) })} className="select">
            {[50, 60, 70, 80, 90].map((m) => (
              <option key={m} value={m}>
                {m}%
              </option>
            ))}
          </select>
        </Field>
      </Section>

      <Section title="Giọng đọc">
        {!ttsSupported && <p className="text-warning">Trình duyệt này không hỗ trợ đọc văn bản.</p>}
        <Segmented
          label="Giọng"
          value={s.accent}
          options={[
            { v: 'en-GB', l: 'Anh – Anh' },
            { v: 'en-US', l: 'Anh – Mỹ' },
          ]}
          onChange={(v) => set({ accent: v as Settings['accent'] })}
        />
        <Segmented
          label="Tốc độ"
          value={String(s.rate)}
          options={[
            { v: '0.75', l: 'Chậm 0.75×' },
            { v: '1', l: 'Bình thường 1×' },
          ]}
          onChange={(v) => set({ rate: Number(v) })}
        />
        {ttsSupported && (
          <button className="btn btn-ghost" onClick={() => speak('Hello! Nice to meet you.', s.accent, s.rate)}>
            <Volume2 aria-hidden size={18} /> Nghe thử
          </button>
        )}
      </Section>

      <Section title="Giao diện">
        <PalettePicker value={s.palette} onChange={(v) => set({ palette: v })} />
        <Segmented
          label="Sáng / tối"
          value={s.theme}
          options={[
            { v: 'system', l: 'Theo máy' },
            { v: 'light', l: 'Sáng' },
            { v: 'dark', l: 'Tối' },
          ]}
          onChange={(v) => set({ theme: v as Settings['theme'] })}
        />
      </Section>

      <Section title="Dữ liệu">
        <p className="text-sm text-muted-fg">Tiến độ chỉ lưu trên thiết bị này. Xuất file để sao lưu hoặc chuyển sang máy khác.</p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button className="btn btn-ghost" onClick={exportData}>
            <Download aria-hidden size={18} /> Xuất tiến độ (.json)
          </button>
          <button className="btn btn-ghost" onClick={() => fileRef.current?.click()}>
            <Upload aria-hidden size={18} /> Nhập tiến độ
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="sr-only"
            tabIndex={-1}
            aria-hidden
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) importData(f)
              e.target.value = ''
            }}
          />
        </div>
        {msg && (
          <p role="status" className={msg.ok ? 'text-success' : 'text-danger'}>
            {msg.text}
          </p>
        )}
        <button
          className="btn mt-2 border-2 border-danger bg-card text-danger hover:bg-danger-soft"
          onClick={() => {
            if (confirm('Xoá toàn bộ tiến độ, thẻ ôn tập và cài đặt? Không thể hoàn tác.')) {
              dispatch({ type: 'reset' })
              setMsg({ ok: true, text: 'Đã xoá dữ liệu.' })
            }
          }}
        >
          Xoá toàn bộ dữ liệu
        </button>
      </Section>

      <p className="text-center text-xs text-muted-fg">Lộ trình IELTS · phiên bản {__APP_VERSION__}</p>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="card space-y-4 p-5">
      <h2 className="font-bold">{title}</h2>
      {children}
    </section>
  )
}

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <label htmlFor={htmlFor} className="font-medium">
        {label}
      </label>
      {children}
    </div>
  )
}

function Segmented({ label, value, options, onChange }: { label: string; value: string; options: { v: string; l: string }[]; onChange: (v: string) => void }) {
  return (
    <fieldset>
      <legend className="mb-2 font-medium">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <label
            key={o.v}
            className={`flex min-h-[44px] cursor-pointer items-center rounded-xl border-2 px-4 font-medium transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-primary ${
              value === o.v ? 'border-primary bg-muted text-primary' : 'border-border hover:bg-muted'
            }`}
          >
            <input type="radio" name={label} value={o.v} checked={value === o.v} onChange={() => onChange(o.v)} className="sr-only" />
            {o.l}
          </label>
        ))}
      </div>
    </fieldset>
  )
}

const PALETTES: { v: Settings['palette']; l: string; desc: string; colors: string[] }[] = [
  { v: 'indigo', l: 'Tím', desc: 'Mặc định, tập trung', colors: ['#4f46e5', '#eef2ff', '#818cf8'] },
  { v: 'pink', l: 'Hồng', desc: 'Nhẹ nhàng, tươi tắn', colors: ['#be185d', '#fdf2f8', '#f472b6'] },
  { v: 'sepia', l: 'Sepia', desc: 'Giấy cũ, dịu mắt', colors: ['#8a4b14', '#f4ecd8', '#e0a458'] },
]

function PalettePicker({ value, onChange }: { value: Settings['palette']; onChange: (v: Settings['palette']) => void }) {
  return (
    <fieldset>
      <legend className="mb-2 font-medium">Bộ màu</legend>
      <div className="grid grid-cols-3 gap-2">
        {PALETTES.map((p) => {
          const active = value === p.v
          return (
            <label
              key={p.v}
              className={`flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 p-3 text-center transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-primary ${
                active ? 'border-primary bg-muted' : 'border-border hover:bg-muted'
              }`}
            >
              <input type="radio" name="palette" value={p.v} checked={active} onChange={() => onChange(p.v)} className="sr-only" />
              <span aria-hidden className="flex -space-x-1.5">
                {p.colors.map((c) => (
                  <span key={c} className="h-6 w-6 rounded-full border-2 border-card" style={{ background: c }} />
                ))}
              </span>
              <span className={`font-semibold ${active ? 'text-primary' : ''}`}>{p.l}</span>
              <span className="text-xs leading-tight text-muted-fg">{p.desc}</span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
