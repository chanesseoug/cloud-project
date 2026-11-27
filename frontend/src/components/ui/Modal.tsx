
import {
  useEffect,
  useId,
  useRef,
} from 'react'

import type { ReactNode } from 'react'

import { X } from 'lucide-react'

interface ModalProps {
  title: string
  children: ReactNode
  onClose: () => void
  busy?: boolean
}

export function Modal({
  title,
  children,
  onClose,
  busy = false,
}: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = ref.current

    if (!dialog) return

    const previousOverflow =
      document.body.style.overflow

    if (!dialog.open) {
      dialog.showModal()
    }

    document.body.style.overflow = 'hidden'

    return () => {
      if (dialog.open) {
        dialog.close()
      }

      document.body.style.overflow =
        previousOverflow
    }
  }, [])

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault()

        if (!busy) {
          onClose()
        }
      }}
      className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-2xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-950/60 backdrop:backdrop-blur-sm"
    >

      <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-slate-100 bg-white px-6 py-5">

        <h2
          id={titleId}
          className="text-lg font-bold text-slate-900"
        >
          {title}
        </h2>

        <button
          type="button"
          aria-label="Fermer la fenêtre"
          disabled={busy}
          onClick={onClose}
          className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 disabled:opacity-40"
        >
          <X size={21} />
        </button>

      </header>

      <div className="p-6">
        {children}
      </div>

    </dialog>
  )
}
