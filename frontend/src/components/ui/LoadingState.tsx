
import { Loader2 } from 'lucide-react'

interface LoadingStateProps {
  message?: string
}

export function LoadingState({
  message = 'Chargement des données...',
}: LoadingStateProps) {
  return (
    <div
      role="status"
      className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-8"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50">
        <Loader2
          size={27}
          className="animate-spin text-brand-600"
          aria-hidden="true"
        />
      </div>

      <p className="mt-4 text-sm text-slate-500">
        {message}
      </p>
    </div>
  )
}
