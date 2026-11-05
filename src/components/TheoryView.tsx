import { AlertTriangle, Lightbulb } from 'lucide-react'
import type { TheoryBlock } from '../content/types'
import { RichText } from './RichText'

export function TheoryView({ blocks }: { blocks: TheoryBlock[] }) {
  return (
    <div className="space-y-4">
      {blocks.map((b, i) => {
        switch (b.type) {
          case 'h':
            return (
              <h3 key={i} className="pt-2 text-lg font-bold">
                <RichText text={b.text} />
              </h3>
            )
          case 'p':
            return (
              <p key={i} className="text-fg/90">
                <RichText text={b.text} />
              </p>
            )
          case 'list':
            return (
              <ul key={i} className="list-disc space-y-1.5 pl-5 marker:text-primary">
                {b.items.map((it, j) => (
                  <li key={j}>
                    <RichText text={it} />
                  </li>
                ))}
              </ul>
            )
          case 'table':
            return (
              <div key={i}>
              {b.head.length > 3 && <p className="mb-1 text-xs text-muted-fg sm:hidden">Vuốt ngang để xem hết bảng →</p>}
              <div className="-mx-1 overflow-x-auto rounded-2xl border border-border" tabIndex={0} role="region" aria-label="Bảng">
                <table className="w-full border-collapse text-left text-[15px]">
                  <thead className="bg-muted">
                    <tr>
                      {b.head.map((h, j) => (
                        <th key={j} scope="col" className="min-w-[4.5rem] px-2.5 py-2.5 sm:px-3 align-bottom font-semibold">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {b.rows.map((r, j) => (
                      <tr key={j} className="border-t border-border">
                        {r.map((c, k) => (
                          <td key={k} className="px-2.5 py-2.5 align-top sm:px-3">
                            <RichText text={c} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              </div>
            )
          case 'tip':
            return (
              <div key={i} className="flex gap-3 rounded-2xl bg-success-soft p-4">
                <Lightbulb aria-hidden className="mt-0.5 shrink-0 text-success" size={20} />
                <p>
                  <span className="sr-only">Mẹo: </span>
                  <RichText text={b.text} />
                </p>
              </div>
            )
          case 'warn':
            return (
              <div key={i} className="flex gap-3 rounded-2xl bg-warning-soft p-4">
                <AlertTriangle aria-hidden className="mt-0.5 shrink-0 text-warning" size={20} />
                <p>
                  <span className="sr-only">Lưu ý: </span>
                  <RichText text={b.text} />
                </p>
              </div>
            )
        }
      })}
    </div>
  )
}
