
import { Link } from 'react-router-dom'

import {
  CalendarDays,
  ArrowRight,
  Clock,
} from 'lucide-react'

import type { Room } from '../../types/room'
import type {
  Reservation,
} from '../../types/reservation'

import { formatTime } from '../../utils/format'

import { EmptyState } from '../ui/EmptyState'

interface UpcomingReservationsProps {
  reservations: Reservation[]
  rooms: Room[]
}

export function UpcomingReservations({
  reservations,
  rooms,
}: UpcomingReservationsProps) {
  const roomNames = new Map(
    rooms.map((room) => [
      room.id,
      room.name,
    ]),
  )

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">

      <div className="border-b border-slate-100 px-5 py-5 sm:px-6">

        <h2 className="text-base font-bold text-slate-900">
          Prochaines réservations
        </h2>

        <p className="mt-1 text-xs text-slate-400">
          Vos prochaines réunions
        </p>

      </div>

      {reservations.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="Aucune réservation à venir"
          description="Vos prochaines réservations apparaîtront ici."
          action={
            <Link
              to="/rooms"
              className="text-sm font-semibold text-brand-600 hover:text-brand-800"
            >
              Rechercher une salle
            </Link>
          }
        />
      ) : (
        <div className="divide-y divide-slate-100">

          {reservations
            .slice(0, 4)
            .map((reservation) => {
              const start = new Date(
                reservation.start_time,
              )

              const month =
                new Intl.DateTimeFormat(
                  'fr-FR',
                  { month: 'short' },
                ).format(start)

              return (
                <article
                  key={reservation.id}
                  className="flex items-center gap-3 px-5 py-5 sm:px-6"
                >

                  <div className="flex h-15 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-brand-50">

                    <span className="text-xl font-bold leading-none text-brand-700">
                      {start.getDate()}
                    </span>

                    <span className="mt-1 text-[10px] font-semibold uppercase text-brand-500">
                      {month}
                    </span>

                  </div>

                  <div className="min-w-0 flex-1">

                    <h3 className="truncate text-sm font-semibold text-slate-900">
                      {reservation.purpose ||
                        'Réservation de salle'}
                    </h3>

                    <p className="mt-1 truncate text-xs text-slate-500">
                      {roomNames.get(
                        reservation.room_id,
                      ) ||
                        `Salle #${reservation.room_id}`}
                    </p>

                    <p className="mt-1.5 flex flex-wrap items-center gap-1 text-xs text-slate-400">
                      <Clock size={12} />

                      {formatTime(
                        reservation.start_time,
                      )}

                      {' – '}

                      {formatTime(
                        reservation.end_time,
                      )}
                    </p>

                  </div>

                  <span
                    title="Réservation confirmée"
                    className="h-2 w-2 shrink-0 rounded-full bg-emerald-500"
                  />

                </article>
              )
            })}

        </div>
      )}

      <div className="border-t border-slate-100 px-6 py-4">
        <Link
          to="/reservations"
          className="flex items-center justify-center gap-2 text-xs font-semibold text-brand-600 hover:text-brand-800"
        >
          Voir mes réservations
          <ArrowRight size={15} />
        </Link>
      </div>

    </section>
  )
}
