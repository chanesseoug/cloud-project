
import { Link } from 'react-router-dom'

import {
  CheckCircle2,
  CalendarDays,
  Clock,
  DoorOpen,
  Hash,
  ArrowRight,
} from 'lucide-react'

import type { Room } from '../../types/room'

import type {
  Reservation,
} from '../../types/reservation'

import {
  formatDateTime,
} from '../../utils/format'

import {
  formatDuration,
} from '../../utils/booking'

import { Button } from '../ui/Button'

interface BookingSuccessProps {
  room: Room
  reservation: Reservation
  onClose: () => void
}

export function BookingSuccess({
  room,
  reservation,
  onClose,
}: BookingSuccessProps) {
  const duration = Math.round(
    (
      new Date(reservation.end_time).getTime() -
      new Date(reservation.start_time).getTime()
    ) / 60_000,
  )

  const details = [
    {
      label: 'Référence',
      value: `#${reservation.id}`,
      icon: Hash,
    },
    {
      label: 'Salle réservée',
      value: room.name,
      icon: DoorOpen,
    },
    {
      label: 'Début',
      value: formatDateTime(
        reservation.start_time,
      ),
      icon: CalendarDays,
    },
    {
      label: 'Fin',
      value: formatDateTime(
        reservation.end_time,
      ),
      icon: CalendarDays,
    },
    {
      label: 'Durée',
      value: formatDuration(duration),
      icon: Clock,
    },
  ]

  return (
    <section className="space-y-6">

      <div className="text-center">

        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2
            size={42}
            strokeWidth={1.7}
          />
        </div>

        <h3 className="mt-5 text-2xl font-bold text-slate-900">
          Réservation confirmée !
        </h3>

        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          Votre salle a été réservée avec succès.
          Retrouvez le récapitulatif ci-dessous.
        </p>

      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200">

        <dl className="divide-y divide-slate-100">

          {details.map((detail) => {
            const Icon = detail.icon

            return (
              <div
                key={detail.label}
                className="flex flex-wrap items-center justify-between gap-3 p-4"
              >

                <dt className="flex items-center gap-2 text-sm text-slate-500">
                  <Icon
                    size={17}
                    className="text-brand-600"
                  />
                  {detail.label}
                </dt>

                <dd className="text-sm font-semibold text-slate-900">
                  {detail.value}
                </dd>

              </div>
            )
          })}

        </dl>

      </div>

      {reservation.purpose && (
        <div className="rounded-xl bg-slate-50 p-4">

          <p className="text-xs text-slate-500">
            Motif de la réservation
          </p>

          <p className="mt-2 break-words text-sm font-medium text-slate-700">
            {reservation.purpose}
          </p>

        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">

        <Button
          variant="secondary"
          onClick={onClose}
        >
          Continuer
        </Button>

        <Link
          to="/reservations"
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          Voir mes réservations
          <ArrowRight size={16} />
        </Link>

      </div>

    </section>
  )
}
