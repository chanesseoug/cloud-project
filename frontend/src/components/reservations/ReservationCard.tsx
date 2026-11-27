import {
  CalendarDays,
  Clock,
  DoorOpen,
  ArrowRight,
  XCircle,
} from 'lucide-react'

import type {
  Reservation,
} from '../../types/reservation'

import {
  getReservationPhase,
  canCancelReservation,
  getReservationDuration,
} from '../../utils/reservations'

import {
  formatDateTime,
} from '../../utils/format'

import {
  formatDuration,
} from '../../utils/booking'

import {
  ReservationStatus,
} from './ReservationStatus'

import { Button } from '../ui/Button'

interface ReservationCardProps {
  reservation: Reservation
  roomName: string
  now: Date

  onDetails: (
    reservation: Reservation,
  ) => void

  onCancel: (
    reservation: Reservation,
  ) => void
}

export function ReservationCard({
  reservation,
  roomName,
  now,
  onDetails,
  onCancel,
}: ReservationCardProps) {
  const phase = getReservationPhase(
    reservation,
    now,
  )

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6">

      <div className="flex flex-wrap items-start justify-between gap-4">

        <div className="flex min-w-0 items-center gap-4">

          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <DoorOpen size={27} />
          </div>

          <div className="min-w-0">
            <h2 className="break-words text-lg font-bold text-slate-900">
              {roomName}
            </h2>

            <p className="mt-1 break-words text-sm text-slate-500">
              {reservation.purpose ||
                'Réservation de salle'}
            </p>
          </div>

        </div>

        <ReservationStatus phase={phase} />

      </div>

      <div className="mt-5 grid gap-3 rounded-xl bg-slate-50 p-4 lg:grid-cols-3">

        <div className="flex items-start gap-2">
          <CalendarDays
            size={17}
            className="shrink-0 text-brand-600"
          />

          <div>
            <p className="text-xs text-slate-500">
              Début
            </p>

            <p className="mt-1 text-sm font-medium text-slate-800">
              {formatDateTime(
                reservation.start_time,
              )}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <CalendarDays
            size={17}
            className="shrink-0 text-brand-600"
          />

          <div>
            <p className="text-xs text-slate-500">
              Fin
            </p>

            <p className="mt-1 text-sm font-medium text-slate-800">
              {formatDateTime(
                reservation.end_time,
              )}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Clock
            size={17}
            className="shrink-0 text-brand-600"
          />

          <div>
            <p className="text-xs text-slate-500">
              Durée
            </p>

            <p className="mt-1 text-sm font-medium text-slate-800">
              {formatDuration(
                getReservationDuration(
                  reservation,
                ),
              )}
            </p>
          </div>
        </div>

      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">

        <span className="text-xs text-slate-400">
          Référence #{reservation.id}
        </span>

        <div className="flex flex-wrap gap-2">

          {canCancelReservation(
            reservation,
            now,
          ) && (
            <Button
              variant="danger"
              onClick={() =>
                onCancel(reservation)
              }
            >
              <XCircle size={16} />
              Annuler
            </Button>
          )}

          <Button
            variant="secondary"
            onClick={() =>
              onDetails(reservation)
            }
          >
            Détails
            <ArrowRight size={16} />
          </Button>

        </div>

      </div>

    </article>
  )
}