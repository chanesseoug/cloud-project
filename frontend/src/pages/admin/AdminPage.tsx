
import { useEffect, useState } from 'react'

import { Link } from 'react-router-dom'

import {
  ArrowLeft,
  ShieldCheck,
  Users,
  DoorOpen,
  CalendarDays,
  Loader2,
} from 'lucide-react'

import api, {
  getApiError,
} from '../../api/client'

interface AdminStats {
  total_users: number
  total_rooms: number
  active_rooms: number
  total_reservations: number
  confirmed_reservations: number
  cancelled_reservations: number
}

export default function AdminPage() {
  const [stats, setStats] =
    useState<AdminStats | null>(null)

  const [error, setError] = useState('')

  const [loading, setLoading] =
    useState(true)

  useEffect(() => {
    const controller = new AbortController()

    async function loadStats() {
      try {
        const response = await api.get<AdminStats>(
          '/admin/stats',
          {
            signal: controller.signal,
          },
        )

        if (!controller.signal.aborted) {
          setStats(response.data)
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(getApiError(err))
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    void loadStats()

    return () => controller.abort()
  }, [])

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-12">

      <div className="mx-auto max-w-5xl">

        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-medium text-brand-600 hover:text-brand-800"
        >
          <ArrowLeft size={17} />
          Retour au tableau de bord
        </Link>

        <div className="mt-8 flex items-center gap-4">

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 text-white">
            <ShieldCheck size={29} />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Administration
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Espace réservé aux administrateurs.
            </p>
          </div>

        </div>

        {loading && (
          <div
            role="status"
            className="mt-12 flex items-center gap-3 text-slate-500"
          >
            <Loader2
              className="animate-spin"
              size={22}
            />

            Chargement des statistiques...
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="mt-8 rounded-xl bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {stats && (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {[
              {
                label: 'Utilisateurs',
                value: stats.total_users,
                icon: Users,
              },
              {
                label: 'Salles',
                value: stats.total_rooms,
                icon: DoorOpen,
              },
              {
                label: 'Salles actives',
                value: stats.active_rooms,
                icon: DoorOpen,
              },
              {
                label: 'Réservations',
                value: stats.total_reservations,
                icon: CalendarDays,
              },
              {
                label: 'Confirmées',
                value: stats.confirmed_reservations,
                icon: CalendarDays,
              },
              {
                label: 'Annulées',
                value: stats.cancelled_reservations,
                icon: CalendarDays,
              },
            ].map((item) => {
              const Icon = item.icon

              return (
                <div
                  key={item.label}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <Icon
                    size={24}
                    className="text-brand-600"
                  />

                  <p className="mt-4 text-sm text-slate-500">
                    {item.label}
                  </p>

                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {item.value}
                  </p>
                </div>
              )
            })}

          </div>
        )}

      </div>
    </main>
  )
}
