export type Accent = 'en-GB' | 'en-US'

export const ttsSupported = typeof window !== 'undefined' && 'speechSynthesis' in window

let voices: SpeechSynthesisVoice[] = []
if (ttsSupported) {
  const load = () => {
    voices = window.speechSynthesis.getVoices()
  }
  load()
  window.speechSynthesis.addEventListener?.('voiceschanged', load)
}

function pickVoice(accent: Accent): SpeechSynthesisVoice | undefined {
  const lang = accent.toLowerCase()
  const exact = voices.filter((v) => v.lang.toLowerCase().replace('_', '-') === lang)
  return exact.find((v) => /google|natural|premium|enhanced/i.test(v.name)) ?? exact[0] ?? voices.find((v) => v.lang.startsWith('en'))
}

export function speak(text: string, accent: Accent, rate: number, onEnd?: () => void) {
  if (!ttsSupported) return
  const synth = window.speechSynthesis
  synth.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = accent
  const v = pickVoice(accent)
  if (v) u.voice = v
  u.rate = rate
  if (onEnd) {
    u.onend = onEnd
    u.onerror = onEnd
  }
  synth.speak(u)
}

export function stopSpeaking() {
  if (ttsSupported) window.speechSynthesis.cancel()
}
