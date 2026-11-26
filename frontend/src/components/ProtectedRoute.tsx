
import { Navigate, Outlet } from 'react-router-dom'

import { Loader2 } from 'lucide-react'

import { useAuth } from '../hooks/useAuth'

export function ProtectedRoute() {
  const {
    isAuthenticated,
    isLoading,
  } = useAuth()

  if (isLoading) {
    return (
      <div
        role="status"
        className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50"
      >
        <Loader2
          size={32}
          className="animate-spin text-brand-600"
        />

        <p className="text-sm text-slate-500">
          Vérification de votre session...
        </p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
