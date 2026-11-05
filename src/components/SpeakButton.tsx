import { Volume2 } from 'lucide-react'
import { useState } from 'react'
import { useStore } from '../lib/store'
import { speak, ttsSupported } from '../lib/tts'

export function SpeakButton({ text, label, size = 'md' }: { text: string; label?: string; size?: 'sm' | 'md' }) {
  const { state } = useStore()
  const [playing, setPlaying] = useState(false)
  if (!ttsSupported) return null
  const dim = size === 'sm' ? 'h-10 w-10' : 'h-11 w-11'
  return (
    <button
      type="button"
      aria-label={label ?? `Nghe: ${text}`}
      onClick={(e) => {
        e.stopPropagation()
        setPlaying(true)
        speak(text, state.settings.accent, state.settings.rate, () => setPlaying(false))
      }}
      className={`${dim} inline-flex shrink-0 items-center justify-center rounded-full text-primary transition-colors hover:bg-muted ${playing ? 'bg-muted' : ''}`}
    >
      <Volume2 aria-hidden size={size === 'sm' ? 18 : 20} strokeWidth={2} />
    </button>
  )
}
