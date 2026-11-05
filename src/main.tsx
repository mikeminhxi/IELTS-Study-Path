import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Route, Routes } from 'react-router-dom'
import '@fontsource/be-vietnam-pro/vietnamese-400.css'
import '@fontsource/be-vietnam-pro/vietnamese-600.css'
import '@fontsource/be-vietnam-pro/vietnamese-700.css'
import '@fontsource/be-vietnam-pro/latin-400.css'
import '@fontsource/be-vietnam-pro/latin-600.css'
import '@fontsource/be-vietnam-pro/latin-700.css'
import '@fontsource/noto-sans/latin-ext-400.css'
import './index.css'
import { Layout } from './components/Layout'
import { StoreProvider } from './lib/store'
import Home from './pages/Home'

const LessonPage = lazy(() => import('./pages/LessonPage'))
const ReviewPage = lazy(() => import('./pages/ReviewPage'))
const ProgressPage = lazy(() => import('./pages/ProgressPage'))
const SettingsPage = lazy(() => import('./pages/SettingsPage'))

function Loading() {
  return <div className="p-8 text-center text-muted-fg" role="status">Đang tải…</div>
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StoreProvider>
      <HashRouter>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/lesson/:id" element={<LessonPage />} />
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="review" element={<ReviewPage />} />
              <Route path="progress" element={<ProgressPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="*" element={<Home />} />
            </Route>
          </Routes>
        </Suspense>
      </HashRouter>
    </StoreProvider>
  </StrictMode>,
)
