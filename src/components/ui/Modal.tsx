import { useEffect, useRef, type ReactNode } from 'react'

interface ModalProps {
  title: string
  onClose: () => void
  children: ReactNode
}

/**
 * Uses the native <dialog> element. showModal() gives focus trapping,
 * closing with Escape and an inert background without extra code.
 *
 * Render it only while it should be open. Every way of closing (Escape,
 * close button, backdrop click) goes through dialog.close(), which fires
 * a single "close" event that calls onClose.
 */
export function Modal({ title, onClose, children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (dialog && !dialog.open) dialog.showModal()
  }, [])

  const close = () => dialogRef.current?.close()

  return (
    <dialog
      ref={dialogRef}
      aria-label={title}
      onClose={onClose}
      // A click on the <dialog> itself (not its content) is a click on the backdrop.
      onClick={(e) => e.target === e.currentTarget && close()}
      className="m-auto w-[calc(100%-2rem)] max-w-lg rounded-2xl bg-white p-0 shadow-xl"
    >
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <h2 className="font-semibold">{title}</h2>
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="rounded-lg px-2 py-1 text-xl leading-none text-slate-500 hover:bg-slate-100"
        >
          ×
        </button>
      </div>
      <div className="max-h-[70dvh] overflow-y-auto p-5">{children}</div>
    </dialog>
  )
}
