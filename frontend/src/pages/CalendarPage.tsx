import { useState } from 'react'

import {
  Link,
  useNavigate,
} from 'react-router-dom'

import {
  CalendarDays,
  Plus,
  RefreshCw,
} from 'lucide-react'

import toast from 'react-hot-toast'

import {
  useReservations,
} from '../hooks/useReservations'

import {
  BookingCalendar,
} from '../components/calendar/BookingCalendar'

import {
  ReservationDetailsModal,
} from '../components/reservations/ReservationDetailsModal'

import {
  getRoomName,
} from '../utils/reservations'

import {
  toLocalDateTimeInput,
} from '../utils/booking'

import type {
  Reservation,
} from '../types/reservation'

import { Button } from '../components/ui/Button'

import {
  LoadingState,
} from '../components/ui/LoadingState'

import {
  ErrorState,
} from '../components/ui/ErrorState'

const legend = [
  {
    label: 'À venir',
    color: 'bg-indigo-500',
  },
  {
    label: 'En cours',
    color: 'bg-blue-500',
  },
  {
    label: 'Terminée',
    color: 'bg-slate-400',
  },
  {
    label: 'Annulée',
    color: 'bg-red-500',
  },
]

export default function CalendarPage() {
  const navigate = useNavigate()

  const {
    reservations,
    rooms,
    now,
    isLoading,
    error,
    refresh,
    updateReservation,
  } = useReservations()

  const [showCancelled, setShowCancelled] =
    useState(false)

  const [selected, setSelected] =
    useState<Reservation | null>(null)

  function handleDateClick(date: Date) {
    const start = new Date(date)

    // Une cellule de la vue mensuelle
    // correspond généralement à minuit.
    if (
      start.getHours() === 0 &&
      start.getMinutes() === 0
    ) {
      start.setHours(9, 0, 0, 0)
    }

    if (start.getTime() <= Date.now()) {
      toast.error(
        'Veuillez sélectionner un créneau futur.',
      )

      return
    }

    const end = new Date(
      start.getTime() + 60 * 60_000,
    )

    const params = new URLSearchParams({
      start: toLocalDateTimeInput(start),
      end: toLocalDateTimeInput(end),
    })

    navigate(`/rooms?${params.toString()}`)
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
            Calendrier
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Visualisez et organisez vos réunions.
          </p>
        </div>

        <Link
          to="/rooms"
          className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-700"
        >
          <Plus size={18} />
          Réserver une salle
        </Link>

      </div>

      <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

        <div className="flex flex-wrap gap-4">

          {legend.map((item) => (
            <span
              key={item.label}
              className="flex items-center gap-2 text-xs font-medium text-slate-600"
            >
              <span
                aria-hidden="true"
                className={`h-3 w-3 rounded-full ${item.color}`}
              />

              {item.label}
            </span>
          ))}

        </div>

        <div className="flex flex-wrap items-center gap-4">

          <label className="flex items-center gap-2 text-sm text-slate-600">

            <input
              type="checkbox"
              className="h-4 w-4 accent-brand-600"
              checked={showCancelled}
              onChange={(event) =>
                setShowCancelled(
                  event.target.checked,
                )
              }
            />

            Afficher les annulations

          </label>

          <Button
            variant="secondary"
            loading={isLoading}
            onClick={refresh}
          >
            {!isLoading && (
              <RefreshCw size={16} />
            )}
            Actualiser
          </Button>

        </div>

      </section>

      {isLoading ? (
        <LoadingState
          message="Chargement de votre calendrier..."
        />
      ) : error ? (
        <ErrorState
          message={error}
          onRetry={refresh}
        />
      ) : (
        <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-6">

          <BookingCalendar
            reservations={reservations}
            rooms={rooms}
            now={now}
            showCancelled={showCancelled}
            onReservationClick={setSelected}
            onDateClick={handleDateClick}
          />

        </section>
      )}

      <div className="flex items-start gap-3 rounded-xl bg-brand-50 p-4 text-sm text-brand-700">

        <CalendarDays
          size={19}
          className="shrink-0"
        />

        <p>
          Cliquez sur une réservation pour consulter ses détails,
          ou sur un créneau futur pour rechercher une salle.
          Ce calendrier représente uniquement vos réservations personnelles.
        </p>

      </div>

      {selected && (
        <ReservationDetailsModal
          key={selected.id}
          reservation={selected}
          roomName={getRoomName(
            selected.room_id,
            rooms,
          )}
          now={now}
          onClose={() => setSelected(null)}
          onCancelled={handleCancelled}
        />
      )}

    </div>
  )
}