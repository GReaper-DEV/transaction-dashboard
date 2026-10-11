import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
}

export function Button({ variant = 'primary', className, ...props }: ButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-medium transition-colors',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 disabled:opacity-50',
        variant === 'primary'
          ? 'bg-slate-900 text-white hover:bg-slate-700'
          : 'bg-white text-slate-900 ring-1 ring-slate-300 ring-inset hover:bg-slate-50',
        className,
      )}
      {...props}
    />
  )
}
