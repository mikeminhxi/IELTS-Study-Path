export function ProgressBar({ value, color = 'var(--primary)', label }: { value: number; color?: string; label: string }) {
  const v = Math.max(0, Math.min(100, value))
  return (
    <div role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(v)} className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
      <div className="h-full rounded-full transition-[width] duration-300 ease-out" style={{ width: `${v}%`, background: color }} />
    </div>
  )
}
