
import {
  Users,
  DoorOpen,
  CheckCircle2,
  CalendarDays,
  CalendarCheck,
  XCircle,
} from 'lucide-react'

import type {
  AdminStats,
} from '../../types/admin'

import {
  StatCard,
} from '../dashboard/StatCard'

interface AdminOverviewProps {
  stats: AdminStats
}

export function AdminOverview({
  stats,
}: AdminOverviewProps) {
  const inactiveRooms =
    stats.total_rooms - stats.active_rooms

  const activeRate =
    stats.total_rooms > 0
      ? Math.round(
          stats.active_rooms /
            stats.total_rooms * 100,
        )
      : 0

  const cancellationRate =
    stats.total_reservations > 0
      ? Math.round(
          stats.cancelled_reservations /
            stats.total_reservations * 100,
        )
      : 0

  return (
    <div className="space-y-6">

      <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">

        <StatCard
          title="Utilisateurs"
          value={stats.total_users}
          description="Comptes enregistrés"
          icon={Users}
          color="indigo"
        />

        <StatCard
          title="Salles enregistrées"
          value={stats.total_rooms}
          description="Actives et inactives"
          icon={DoorOpen}
          color="blue"
        />

        <StatCard
          title="Salles actives"
          value={stats.active_rooms}
          description="Espaces ouverts à la réservation"
          icon={CheckCircle2}
          color="emerald"
        />

        <StatCard
          title="Réservations"
          value={stats.total_reservations}
          description="Historique global"
          icon={CalendarDays}
          color="indigo"
        />

        <StatCard
          title="Confirmées"
          value={stats.confirmed_reservations}
          description="Statut confirmé, toutes périodes"
          icon={CalendarCheck}
          color="emerald"
        />

        <StatCard
          title="Annulées"
          value={stats.cancelled_reservations}
          description="Historique des annulations"
          icon={XCircle}
          color="amber"
        />

      </div>

      <div className="grid gap-5 lg:grid-cols-2">

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="font-bold text-slate-900">
            État du parc de salles
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Répartition des salles actives et inactives.
          </p>

          <div className="mt-6 flex items-end justify-between">

            <span className="text-4xl font-bold text-slate-900">
              {activeRate} %
            </span>

            <span className="text-sm text-slate-500">
              Salles actives
            </span>

          </div>

          <div
            role="progressbar"
            aria-label="Pourcentage de salles actives"
            aria-valuenow={activeRate}
            aria-valuemin={0}
            aria-valuemax={100}
            className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100"
          >
            <div
              className="h-full rounded-full bg-emerald-500"
              style={{
                width: `${activeRate}%`,
              }}
            />
          </div>

          <div className="mt-5 flex flex-wrap gap-5 text-sm text-slate-600">

            <span>
              {stats.active_rooms} actives
            </span>

            <span>
              {inactiveRooms} inactives
            </span>

          </div>

        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="font-bold text-slate-900">
            Taux historique d'annulation
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Part des réservations annulées dans l'historique.
          </p>

          <div className="mt-6 flex items-end justify-between">

            <span className="text-4xl font-bold text-slate-900">
              {cancellationRate} %
            </span>

            <span className="text-sm text-slate-500">
              Réservations annulées
            </span>

          </div>

          <div
            role="progressbar"
            aria-label="Taux historique d'annulation"
            aria-valuenow={cancellationRate}
            aria-valuemin={0}
            aria-valuemax={100}
            className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100"
          >
            <div
              className="h-full rounded-full bg-amber-500"
              style={{
                width: `${cancellationRate}%`,
              }}
            />
          </div>

          <div className="mt-5 flex flex-wrap gap-5 text-sm text-slate-600">

            <span>
              {stats.confirmed_reservations} confirmées
            </span>

            <span>
              {stats.cancelled_reservations} annulées
            </span>

          </div>

        </section>

      </div>

    </div>
  )
}
