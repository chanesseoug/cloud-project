
import {
  AlertCircle,
  RefreshCw,
} from 'lucide-react'

import { Button } from './Button'

interface ErrorStateProps {
  message: string
  onRetry: () => void
}

export function ErrorState({
  message,
  onRetry,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center rounded-2xl border border-red-100 bg-white px-6 py-12 text-center"
    >

      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
        <AlertCircle size={28} />
      </div>

      <h3 className="mt-4 text-lg font-semibold text-slate-900">
        Impossible de charger les données
      </h3>

      <p className="mt-2 max-w-md text-sm text-slate-500">
        {message}
      </p>

      <Button
        onClick={onRetry}
        className="mt-6"
        variant="secondary"
      >
        <RefreshCw size={17} />
        Réessayer
      </Button>

    </div>
  )
}
