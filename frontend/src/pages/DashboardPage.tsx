
import { useState } from 'react'

import { Link } from 'react-router-dom'

import {
  DoorOpen,
  CheckCircle2,
  CalendarCheck,
  Clock,
  Plus,
  RefreshCw,
  ArrowUpRight,
  CalendarDays,
} from 'lucide-react'

import { useAuth } from '../hooks/useAuth'
import { useDashboard } from '../hooks/useDashboard'

import {
  getGreeting,
  formatDateTime,
  formatTime,
} from '../utils/format'

import {
  StatCard,
} from '../components/dashboard/StatCard'

import {
  RoomPreview,
} from '../components/dashboard/RoomPreview'

import {
  UpcomingReservations,
} from '../components/dashboard/UpcomingReservations'

import {
  LoadingState,
} from '../components/ui/LoadingState'

import {
  ErrorState,
} from '../components/ui/ErrorState'

import { Button } from '../components/ui/Button'

export default function DashboardPage() {
  const { user } = useAuth()

  const {
    data,
    error,
    isLoading,
    refresh,
  } = useDashboard()

  const [greeting] = useState(
    () => getGreeting(),
  )

  const firstName =
    user?.full_name.trim().split(/\s+/)[0] ||
    'utilisateur'

  return (
    <div className="space-y-7">

      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {greeting}, {firstName} !
          </h1>

          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            Voici un aperçu de vos espaces
            et de vos prochaines réunions.
          </p>
        </div>

        <Link
          to="/rooms"
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
        >
          <Plus size={19} />
          Réserver une salle
        </Link>

      </div>

      <section className="relative overflow-hidden rounded-2xl bg-slate-950 px-6 py-7 text-white sm:px-8">

        <div
          aria-hidden="true"
          className="absolute -right-20 -top-32 h-80 w-80 rounded-full bg-brand-600/30 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="absolute -bottom-36 right-40 h-64 w-64 rounded-full bg-indigo-600/20 blur-3xl"
        />

        <div className="relative z-10 flex items-center justify-between gap-5">

          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-medium text-brand-300">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
              Votre espace de travail
            </span>

            <h2 className="mt-4 text-xl font-bold tracking-tight sm:text-2xl">
              Organisez vos réunions
              en toute simplicité.
            </h2>

            <p className="mt-3 max-w-lg text-sm leading-relaxed text-slate-400">
              Retrouvez les salles disponibles
              et gérez vos réservations depuis
              un espace unique.
            </p>

            <Link
              to="/rooms"
              className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-brand-300 transition hover:text-white"
            >
              Explorer les salles

              <ArrowUpRight size={16} />
            </Link>
          </div>

          <div
            aria-hidden="true"
            className="hidden h-28 w-28 shrink-0 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-brand-300 sm:flex"
          >
            <CalendarDays
              size={62}
              strokeWidth={1.1}
            />
          </div>

        </div>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3">

        <div>
          <h2 className="text-base font-bold text-slate-900">
            Vue d'ensemble
          </h2>

          {data && (
            <p className="mt-1 text-xs text-slate-400">
              Dernière actualisation :
              {' '}
              {formatDateTime(data.checkedAt)}
            </p>
          )}
        </div>

        <Button
          variant="secondary"
          onClick={refresh}
          loading={isLoading}
          className="min-h-10 px-4 py-2"
        >
          {!isLoading && (
            <RefreshCw size={15} />
          )}

          Actualiser
        </Button>

      </div>

      {isLoading && !data && (
        <LoadingState
          message="Chargement de votre tableau de bord..."
        />
      )}

      {error && (
        <ErrorState
          message={error}
          onRetry={refresh}
        />
      )}

      {data && !error && (
        <>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <StatCard
              title="Salles actives"
              value={data.stats.totalRooms}
              description="Espaces de réunion actifs"
              icon={DoorOpen}
              color="indigo"
            />

            <StatCard
              title="Salles disponibles"
              value={data.stats.availableRooms}
              description={
                `Jusqu'à ${formatTime(
                  data.availabilityEnd,
                )}`
              }
              icon={CheckCircle2}
              color="emerald"
            />

            <StatCard
              title="Mes réservations"
              value={data.stats.totalReservations}
              description="Historique personnel complet"
              icon={CalendarCheck}
              color="blue"
            />

            <StatCard
              title="À venir"
              value={data.stats.upcomingReservations}
              description="Réservations futures confirmées"
              icon={Clock}
              color="amber"
            />

          </div>

          <div className="grid items-start gap-6 xl:grid-cols-[1.4fr_1fr]">

            <RoomPreview
              rooms={data.availableRooms}
            />

            <UpcomingReservations
              reservations={
                data.upcomingReservations
              }
              rooms={data.rooms}
            />

          </div>

        </>
      )}

      <footer className="pb-2 pt-3 text-center text-xs text-slate-400">
        RoomBooking · Votre espace de réunion
      </footer>

    </div>
  )
}
