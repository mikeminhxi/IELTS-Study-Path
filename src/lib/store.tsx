import { createContext, useContext, useEffect, useReducer, useRef, useState, type Dispatch, type ReactNode } from 'react'
import { getItem, requestPersistence, setItem } from './storage'
import { initialState, parseImported, reducer, type Action, type AppState } from './state'

const KEY = 'state'

const Ctx = createContext<{ state: AppState; dispatch: Dispatch<Action> } | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [ready, setReady] = useState(false)
  const latest = useRef(state)
  latest.current = state

  useEffect(() => {
    getItem<unknown>(KEY).then((raw) => {
      const parsed = raw ? parseImported(raw) : null
      if (parsed) dispatch({ type: 'hydrate', state: parsed })
      setReady(true)
      requestPersistence()
    })
  }, [])

  // Lưu tự động (debounce) + lưu ngay khi rời trang.
  useEffect(() => {
    if (!ready) return
    const t = setTimeout(() => setItem(KEY, state), 150)
    return () => clearTimeout(t)
  }, [state, ready])

  useEffect(() => {
    const flush = () => {
      if (document.visibilityState === 'hidden') setItem(KEY, latest.current)
    }
    const flushNow = () => setItem(KEY, latest.current)
    document.addEventListener('visibilitychange', flush)
    window.addEventListener('pagehide', flushNow)
    return () => {
      document.removeEventListener('visibilitychange', flush)
      window.removeEventListener('pagehide', flushNow)
    }
  }, [])

  // Giao diện sáng/tối.
  const theme = state.settings.theme
  const palette = state.settings.palette
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const apply = () => {
      const dark = theme === 'dark' || (theme === 'system' && mq.matches)
      const root = document.documentElement
      root.dataset.theme = dark ? 'dark' : 'light'
      root.dataset.palette = palette
      const css = getComputedStyle(root)
      const color = css.getPropertyValue(dark ? '--bg' : '--primary').trim()
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', color)
    }
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [theme, palette])

  if (!ready) return null
  return <Ctx.Provider value={{ state, dispatch }}>{children}</Ctx.Provider>
}

export function useStore() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useStore phải nằm trong StoreProvider')
  return v
}

/** Đếm thời gian học khi trang đang hiển thị (mỗi 15 giây). */
export function useStudyTimer() {
  const { dispatch } = useStore()
  useEffect(() => {
    const id = setInterval(() => {
      if (document.visibilityState === 'visible') dispatch({ type: 'addTime', seconds: 15 })
    }, 15000)
    return () => clearInterval(id)
  }, [dispatch])
}
