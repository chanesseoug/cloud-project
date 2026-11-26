
import type { ButtonHTMLAttributes } from 'react'

import { Loader2 } from 'lucide-react'
import clsx from 'clsx'

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  variant?: 'primary' | 'secondary' | 'danger'
}

export function Button({
  children,
  loading = false,
  variant = 'primary',
  className,
  disabled,
  type = 'button',
  ...props
}: ButtonProps) {
  const variants = {
    primary:
      'bg-brand-600 text-white hover:bg-brand-700 shadow-sm shadow-brand-200',

    secondary:
      'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50',

    danger:
      'bg-red-600 text-white hover:bg-red-700',
  }

  return (
    <button
      {...props}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading}
      className={clsx(
        'inline-flex min-h-12 items-center justify-center gap-2',
        'rounded-xl px-5 py-3 text-sm font-semibold',
        'transition-all duration-200',
        'focus-visible:outline-2 focus-visible:outline-offset-2',
        'focus-visible:outline-brand-600',
        'disabled:cursor-not-allowed disabled:opacity-60',
        variants[variant],
        className,
      )}
    >
      {loading && (
        <Loader2
          size={18}
          className="animate-spin"
          aria-hidden="true"
        />
      )}

      {children}
    </button>
  )
}
