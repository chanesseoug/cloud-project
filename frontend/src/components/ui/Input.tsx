
import { useId, useState } from 'react'

import type {
  InputHTMLAttributes,
  ReactNode,
} from 'react'

import { Eye, EyeOff } from 'lucide-react'
import clsx from 'clsx'

interface InputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  icon?: ReactNode
}

export function Input({
  label,
  error,
  icon,
  type = 'text',
  className,
  id,
  ...props
}: InputProps) {
  const generatedId = useId()

  const inputId = id || generatedId

  const [showPassword, setShowPassword] =
    useState(false)

  const isPassword = type === 'password'

  const inputType =
    isPassword && showPassword ? 'text' : type

  return (
    <div className="space-y-2">
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-slate-700"
      >
        {label}
      </label>

      <div className="relative">
        {icon && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400"
          >
            {icon}
          </span>
        )}

        <input
          {...props}
          id={inputId}
          type={inputType}
          aria-invalid={Boolean(error)}
          aria-describedby={
            error ? `${inputId}-error` : undefined
          }
          className={clsx(
            'min-h-12 w-full rounded-xl border bg-white py-3',
            'text-sm text-slate-900 outline-none transition',
            'placeholder:text-slate-400',
            'focus:border-brand-500 focus:ring-4 focus:ring-brand-100',
            icon ? 'pl-12' : 'pl-4',
            isPassword ? 'pr-12' : 'pr-4',
            error
              ? 'border-red-400'
              : 'border-slate-200',
            className,
          )}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() =>
              setShowPassword(!showPassword)
            }
            aria-label={
              showPassword
                ? 'Masquer le mot de passe'
                : 'Afficher le mot de passe'
            }
            aria-pressed={showPassword}
            className="absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-brand-600"
          >
            {showPassword
              ? <EyeOff size={18} />
              : <Eye size={18} />}
          </button>
        )}
      </div>

      {error && (
        <p
          id={`${inputId}-error`}
          className="text-xs text-red-600"
        >
          {error}
        </p>
      )}
    </div>
  )
}
