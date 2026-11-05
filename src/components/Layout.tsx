import { BarChart3, Layers, Map, Settings } from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'
import { useStore } from '../lib/store'
import { dayKey } from '../lib/date'

const NAV = [
  { to: '/', label: 'Lộ trình', icon: Map, end: true },
  { to: '/review', label: 'Ôn tập', icon: Layers, end: false },
  { to: '/progress', label: 'Tiến độ', icon: BarChart3, end: false },
  { to: '/settings', label: 'Cài đặt', icon: Settings, end: false },
]

export function useDueCount() {
  const { state } = useStore()
  const today = dayKey()
  return Object.values(state.cards).filter((c) => c.due <= today).length
}

export function Layout() {
  const due = useDueCount()
  return (
    <div className="min-h-dvh lg:flex">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-card focus:p-3">
        Bỏ qua điều hướng
      </a>
      <aside className="hidden border-r border-border bg-card lg:sticky lg:top-0 lg:flex lg:h-dvh lg:w-64 lg:shrink-0 lg:flex-col lg:p-5">
        <Brand />
        <nav aria-label="Chính" className="mt-8 flex flex-col gap-1">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                `flex min-h-[48px] items-center gap-3 rounded-xl px-3 font-medium transition-colors ${isActive ? 'bg-muted text-primary' : 'text-muted-fg hover:bg-muted hover:text-fg'}`
              }
            >
              <n.icon aria-hidden size={20} />
              {n.label}
              {n.to === '/review' && due > 0 && <Badge n={due} />}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="flex items-center px-4 pt-4 lg:hidden">
          <Brand />
        </header>
        <main id="main" className="mx-auto w-full max-w-3xl px-4 pb-28 pt-4 lg:px-8 lg:pb-12 lg:pt-10">
          <Outlet />
        </main>
      </div>

      <nav
        aria-label="Chính"
        className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-4 border-t border-border bg-card/95 backdrop-blur lg:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {NAV.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.end}
            className={({ isActive }) =>
              `relative flex min-h-[60px] flex-col items-center justify-center gap-0.5 text-xs font-semibold transition-colors ${isActive ? 'text-primary' : 'text-muted-fg'}`
            }
          >
            <span className="relative">
              <n.icon aria-hidden size={22} />
              {n.to === '/review' && due > 0 && (
                <span className="absolute -right-3 -top-1.5">
                  <Badge n={due} />
                </span>
              )}
            </span>
            {n.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

function Badge({ n }: { n: number }) {
  return (
    <span className="ml-auto inline-flex h-5 min-w-5 items-center justify-center whitespace-nowrap rounded-full bg-danger px-1.5 text-[11px] font-bold leading-none text-white" aria-label={`${n} thẻ đến hạn`}>
      {n > 99 ? '99+' : n}
    </span>
  )
}

function Brand() {
  return (
    <div className="flex items-center gap-2.5">
      <img src="./icon.svg" alt="" width={36} height={36} className="rounded-xl" />
      <div className="leading-tight">
        <p className="font-bold">Lộ trình IELTS</p>
        <p className="text-xs text-muted-fg">Nền tảng từ căn bản</p>
      </div>
    </div>
  )
}
