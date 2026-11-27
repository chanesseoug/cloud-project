
import { useState } from 'react'

import {
  CalendarCheck,
  Search,
  Eye,
  XCircle,
} from 'lucide-react'

import type { Room } from '../../types/room'
import type { User } from '../../types/auth'

import type {
  Reservation,
} from '../../types/reservation'

import {
  getAdminUserName,
} from '../../utils/admin'

import {
  filterReservations,
  getReservationPhase,
  getRoomName,
  canCancelReservation,
} from '../../utils/reservations'

import type {
  ReservationViewFilter,
} from '../../utils/reservations'

import {
  formatDateTime,
} from '../../utils/format'

import {
  ReservationStatus,
} from '../reservations/ReservationStatus'

import {
  ReservationDetailsModal,
} from '../reservations/ReservationDetailsModal'

import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { EmptyState } from '../ui/EmptyState'

interface AdminReservationsProps {
  reservations: Reservation[]
  rooms: Room[]
  users: User[]
  now: Date
  onChanged: () => void
}

const selectClassName =
  'min-h-12 w-full rounded-xl border ' +
  'border-slate-200 bg-white px-4 py-3 ' +
  'text-sm text-slate-700'

export function AdminReservations({
  reservations,
  rooms,
  users,
  now,
  onChanged,
}: AdminReservationsProps) {
  const [search, setSearch] = useState('')

  const [status, setStatus] =
    useState<ReservationViewFilter>('all')

  const [roomId, setRoomId] =
    useState('all')

  const [selected, setSelected] =
    useState<Reservation | null>(null)

  const [initialConfirm, setInitialConfirm] =
    useState(false)

  const query = search.trim().toLowerCase()

  const filtered = filterReservations(
    reservations,
    rooms,
    status,
    '',
    now,
  ).filter((reservation) => {
    if (
      roomId !== 'all' &&
      String(reservation.room_id) !== roomId
    ) {
      return false
    }

    const owner = users.find(
      (user) =>
        user.id === reservation.user_id,
    )

    return [
      getRoomName(
        reservation.room_id,
        rooms,
      ),

      getAdminUserName(
        reservation.user_id,
        users,
      ),

      owner?.email || '',
      reservation.purpose || '',
      String(reservation.id),

    ].some((value) =>
      value.toLowerCase().includes(query),
    )
  })

  function openReservation(
    reservation: Reservation,
    confirm = false,
  ) {
    setInitialConfirm(confirm)
    setSelected(reservation)
  }

  function handleCancelled() {
    setSelected(null)
    onChanged()
  }

  return (
    <section className="space-y-5">

      <div>
        <h2 className="text-xl font-bold text-slate-900">
          Réservations globales
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Supervisez les réservations de l'ensemble des utilisateurs.
        </p>
      </div>

      <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 md:grid-cols-3">

        <Input
          label="Rechercher une réservation"
          icon={<Search size={17} />}
          placeholder="Salle, utilisateur, motif..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
        />

        <div className="space-y-2">

          <label
            htmlFor="admin-reservation-status"
            className="block text-sm font-medium text-slate-700"
          >
            Statut
          </label>

          <select
            id="admin-reservation-status"
            value={status}
            className={selectClassName}
            onChange={(event) =>
              setStatus(
                event.target.value as ReservationViewFilter,
              )
            }
          >
            <option value="all">
              Toutes les réservations
            </option>

            <option value="upcoming">
              À venir
            </option>

            <option value="ongoing">
              En cours
            </option>

            <option value="completed">
              Terminées
            </option>

            <option value="cancelled">
              Annulées
            </option>
          </select>

        </div>

        <div className="space-y-2">

          <label
            htmlFor="admin-reservation-room"
            className="block text-sm font-medium text-slate-700"
          >
            Salle
          </label>

          <select
            id="admin-reservation-room"
            value={roomId}
            className={selectClassName}
            onChange={(event) =>
              setRoomId(event.target.value)
            }
          >
            <option value="all">
              Toutes les salles
            </option>

            {rooms.map((room) => (
              <option
                key={room.id}
                value={room.id}
              >
                {room.name}
              </option>
            ))}

          </select>

        </div>

      </div>

      <p className="text-sm font-medium text-slate-500">
        {filtered.length} réservation(s)
        {' sur '}
        {reservations.length}
      </p>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        {filtered.length === 0 ? (
          <EmptyState
            icon={CalendarCheck}
            title="Aucune réservation trouvée"
            description="Modifiez les filtres de supervision."
            action={
              <Button
                variant="secondary"
                onClick={() => {
                  setSearch('')
                  setStatus('all')
                  setRoomId('all')
                }}
              >
                Réinitialiser les filtres
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full min-w-[1000px] text-left text-sm">

              <thead className="bg-slate-50 text-xs font-semibold text-slate-500">

                <tr>
                  <th scope="col" className="px-5 py-4">
                    Réservation
                  </th>

                  <th scope="col" className="px-5 py-4">
                    Utilisateur
                  </th>

                  <th scope="col" className="px-5 py-4">
                    Créneau
                  </th>

                  <th scope="col" className="px-5 py-4">
                    Statut
                  </th>

                  <th scope="col" className="px-5 py-4">
                    Actions
                  </th>
                </tr>

              </thead>

              <tbody className="divide-y divide-slate-100">

                {filtered.map((reservation) => (
                  <tr
                    key={reservation.id}
                    className="hover:bg-slate-50/70"
                  >

                    <td className="max-w-56 px-5 py-4">

                      <p className="font-semibold text-slate-900">
                        {getRoomName(
                          reservation.room_id,
                          rooms,
                        )}
                      </p>

                      <p className="mt-1 truncate text-xs text-slate-500">
                        {reservation.purpose ||
                          'Sans motif'}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        #{reservation.id}
                      </p>

                    </td>

                    <td className="px-5 py-4">

                      <p className="font-medium text-slate-800">
                        {getAdminUserName(
                          reservation.user_id,
                          users,
                        )}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Utilisateur #{reservation.user_id}
                      </p>

                    </td>

                    <td className="px-5 py-4 text-xs leading-relaxed text-slate-500">

                      <p>
                        {formatDateTime(
                          reservation.start_time,
                        )}
                      </p>

                      <p className="mt-1">
                        au
                        {' '}
                        {formatDateTime(
                          reservation.end_time,
                        )}
                      </p>

                    </td>

                    <td className="px-5 py-4">

                      <ReservationStatus
                        phase={
                          getReservationPhase(
                            reservation,
                            now,
                          )
                        }
                      />

                    </td>

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-2">

                        <button
                          type="button"
                          aria-label={`Détails de la réservation ${reservation.id}`}
                          onClick={() =>
                            openReservation(
                              reservation,
                            )
                          }
                          className="rounded-lg bg-brand-50 p-2.5 text-brand-600 hover:bg-brand-100"
                        >
                          <Eye size={17} />
                        </button>

                        {canCancelReservation(
                          reservation,
                          now,
                        ) && (
                          <button
                            type="button"
                            aria-label={`Annuler la réservation ${reservation.id}`}
                            onClick={() =>
                              openReservation(
                                reservation,
                                true,
                              )
                            }
                            className="rounded-lg bg-red-50 p-2.5 text-red-600 hover:bg-red-100"
                          >
                            <XCircle size={17} />
                          </button>
                        )}

                      </div>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

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
          initialConfirm={initialConfirm}
          onClose={() => setSelected(null)}
          onCancelled={handleCancelled}
        />
      )}

    </section>
  )
}
