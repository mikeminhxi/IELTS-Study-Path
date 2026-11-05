import { Fragment } from 'react'

/** Hiển thị văn bản có **in đậm**; các đoạn /…/ IPA dùng font IPA. */
export function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith('**') && p.endsWith('**') ? (
          <strong key={i} className="font-semibold text-fg">
            <Ipa text={p.slice(2, -2)} />
          </strong>
        ) : (
          <Fragment key={i}>
            <Ipa text={p} />
          </Fragment>
        ),
      )}
    </>
  )
}

function Ipa({ text }: { text: string }) {
  const parts = text.split(/(\/[^/\s][^/]*\/)/g)
  return (
    <>
      {parts.map((p, i) =>
        /^\/[^/]+\/$/.test(p) ? (
          <span key={i} className="ipa">
            {p}
          </span>
        ) : (
          <Fragment key={i}>{p}</Fragment>
        ),
      )}
    </>
  )
}
