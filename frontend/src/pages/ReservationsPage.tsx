import { useState } from 'react'

import { Link } from 'react-router-dom'

import {
  CalendarCheck,
  CalendarDays,
  Clock,
  CheckCircle2,
  XCircle,
  PlayCircle,
  Search,
  RefreshCw,
  Plus,
} from 'lucide-react'

import clsx from 'clsx'

import {
  useReservations,
} from '../hooks/useReservations'

import type {
  Reservation,
} from '../types/reservation'

import {
  filterReservations,
  getReservationSummary,
  getRoomName,
} from '../utils/reservations'

import type {
  ReservationViewFilter,
} from '../utils/reservations'

import {
  ReservationCard,
} from '../components/reservations/ReservationCard'

import {
  ReservationDetailsModal,
} from '../components/reservations/ReservationDetailsModal'

import {
  StatCard,
} from '../components/dashboard/StatCard'

import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'

import {
  LoadingState,
} from '../components/ui/LoadingState'

import {
  ErrorState,
} from '../components/ui/ErrorState'

import {
  EmptyState,
} from '../components/ui/EmptyState'

const filters: {
  value: ReservationViewFilter
  label: string
}[] = [
  { value: 'all', label: 'Toutes' },
  { value: 'upcoming', label: 'À venir' },
  { value: 'ongoing', label: 'En cours' },
  { value: 'completed', label: 'Terminées' },
  { value: 'cancelled', label: 'Annulées' },
]

export default function ReservationsPage() {
  const {
    reservations,
    rooms,
    now,
    isLoading,
    error,
    refresh,
    updateReservation,
  } = useReservations()

  const [filter, setFilter] =
    useState<ReservationViewFilter>('all')

  const [search, setSearch] = useState('')

  const [selected, setSelected] =
    useState<Reservation | null>(null)

  const [initialConfirm, setInitialConfirm] =
    useState(false)

  const summary = getReservationSummary(
    reservations,
    now,
  )

  const filteredReservations =
    filterReservations(
      reservations,
      rooms,
      filter,
      search,
      now,
    )

  function openReservation(
    reservation: Reservation,
    confirm = false,
  ) {
    setInitialConfirm(confirm)
    setSelected(reservation)
  }

  function handleCancelled(
    updated: Reservation,
  ) {
    updateReservation(updated)
    setSelected(updated)
  }

  return (
    <div className="space-y-7">

      <div className="flex flex-wrap items-center justify-between gap-5">

        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Mes réservations
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Consultez et gérez vos réunions.
          </p>
        </div>

        <Link
          to="/rooms"
          className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-700"
        >
          <Plus size={18} />
          Nouvelle réservation
        </Link>

      </div>

      {isLoading ? (
        <LoadingState
          message="Chargement de vos réservations..."
        />
      ) : error ? (
        <ErrorState
          message={error}
          onRetry={refresh}
        />
      ) : (
        <>

          <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-5">

            <StatCard
              title="Total"
              value={summary.total}
              description="Toutes les réservations"
              icon={CalendarCheck}
              color="indigo"
            />

            <StatCard
              title="À venir"
              value={summary.upcoming}
              description="Réunions futures"
              icon={Clock}
              color="emerald"
            />

            <StatCard
              title="En cours"
              value={summary.ongoing}
              description="Réunions actuelles"
              icon={PlayCircle}
              color="blue"
            />

            <StatCard
              title="Terminées"
              value={summary.completed}
              description="Réunions passées"
              icon={CheckCircle2}
              color="blue"
            />

            <StatCard
              title="Annulées"
              value={summary.cancelled}
              description="Historique des annulations"
              icon={XCircle}
              color="amber"
            />

          </div>

          <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex flex-wrap items-end justify-between gap-4">

              <div className="w-full max-w-md">

                <Input
                  label="Rechercher une réservation"
                  icon={<Search size={17} />}
                  placeholder="Salle, motif ou référence..."
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                />

              </div>

              <Button
                variant="secondary"
                onClick={refresh}
              >
                <RefreshCw size={17} />
                Actualiser
              </Button>

            </div>

            <div
              aria-label="Filtres des réservations"
              className="flex flex-wrap gap-2"
            >

              {filters.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  aria-pressed={
                    filter === item.value
                  }
                  onClick={() =>
                    setFilter(item.value)
                  }
                  className={clsx(
                    'rounded-lg px-4 py-2.5 text-sm font-medium transition',

                    filter === item.value
                      ? 'bg-brand-600 text-white'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100',
                  )}
                >
                  {item.label}
                </button>
              ))}

            </div>

          </section>

          <div className="flex items-center justify-between">

            <h2 className="font-semibold text-slate-800">
              {filteredReservations.length}
              {' '}
              réservation
              {filteredReservations.length !== 1
                ? 's'
                : ''}
            </h2>

            <Link
              to="/calendar"
              className="flex items-center gap-2 text-sm font-semibold text-brand-600"
            >
              <CalendarDays size={16} />
              Voir le calendrier
            </Link>

          </div>

          {filteredReservations.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white">

              <EmptyState
                icon={CalendarDays}
                title="Aucune réservation trouvée"
                description="Modifiez vos filtres ou réservez une nouvelle salle."
                action={
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setFilter('all')
                      setSearch('')
                    }}
                  >
                    Réinitialiser les filtres
                  </Button>
                }
              />

            </div>
          ) : (
            <div className="grid gap-4">

              {filteredReservations.map(
                (reservation) => (
                  <ReservationCard
                    key={reservation.id}
                    reservation={reservation}
                    roomName={getRoomName(
                      reservation.room_id,
                      rooms,
                    )}
                    now={now}
                    onDetails={(item) =>
                      openReservation(item)
                    }
                    onCancel={(item) =>
                      openReservation(item, true)
                    }
                  />
                ),
              )}

            </div>
          )}

        </>
      )}

      {selected && (
        <ReservationDetailsModal
          key={selected.id}
          reservation={selected}
          roomName={getRoomName(
            selected.room_id,
            rooms,
          )}
          now={now}
          initialConfirm={initialConfirm}
          onClose={() => setSelected(null)}
          onCancelled={handleCancelled}
        />
      )}

    </div>
  )
}