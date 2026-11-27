
import { useState } from 'react'

import {
  DoorOpen,
  Plus,
  Search,
  Pencil,
  Power,
  Users,
} from 'lucide-react'

import type { Room } from '../../types/room'

import type {
  Reservation,
} from '../../types/reservation'

import type {
  RoomStatusFilter,
} from '../../types/admin'

import {
  filterAdminRooms,
} from '../../utils/admin'

import {
  getReservationPhase,
} from '../../utils/reservations'

import { RoomFormModal } from './RoomFormModal'
import { RoomStatusModal } from './RoomStatusModal'

import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { EmptyState } from '../ui/EmptyState'

interface AdminRoomsProps {
  rooms: Room[]
  reservations: Reservation[]
  now: Date
  onChanged: () => void
}

export function AdminRooms({
  rooms,
  reservations,
  now,
  onChanged,
}: AdminRoomsProps) {
  const [search, setSearch] = useState('')

  const [status, setStatus] =
    useState<RoomStatusFilter>('all')

  const [creating, setCreating] =
    useState(false)

  const [editing, setEditing] =
    useState<Room | null>(null)

  const [changingStatus, setChangingStatus] =
    useState<Room | null>(null)

  const filteredRooms = filterAdminRooms(
    rooms,
    search,
    status,
  )

  function handleSaved() {
    setCreating(false)
    setEditing(null)
    setChangingStatus(null)
    onChanged()
  }

  function countFutureReservations(
    roomId: number,
  ): number {
    return reservations.filter(
      (reservation) => {
        if (
          reservation.room_id !== roomId
        ) {
          return false
        }

        const phase =
          getReservationPhase(
            reservation,
            now,
          )

        return (
          phase === 'upcoming' ||
          phase === 'ongoing'
        )
      },
    ).length
  }

  return (
    <section className="space-y-5">

      <div className="flex flex-wrap items-center justify-between gap-4">

        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Gestion des salles
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Créez et configurez les espaces de réunion.
          </p>
        </div>

        <Button
          onClick={() => setCreating(true)}
        >
          <Plus size={18} />
          Ajouter une salle
        </Button>

      </div>

      <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:grid-cols-2">

        <Input
          label="Rechercher une salle"
          icon={<Search size={17} />}
          placeholder="Nom, description, équipement..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
        />

        <div className="space-y-2">

          <label
            htmlFor="admin-room-status"
            className="block text-sm font-medium text-slate-700"
          >
            Statut de la salle
          </label>

          <select
            id="admin-room-status"
            value={status}
            onChange={(event) =>
              setStatus(
                event.target.value as RoomStatusFilter,
              )
            }
            className="min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700"
          >
            <option value="all">
              Toutes les salles
            </option>

            <option value="active">
              Salles actives
            </option>

            <option value="inactive">
              Salles inactives
            </option>
          </select>

        </div>

      </div>

      <p className="text-sm font-medium text-slate-500">
        {filteredRooms.length} salle(s)
        {' sur '}
        {rooms.length}
      </p>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        {filteredRooms.length === 0 ? (
          <EmptyState
            icon={DoorOpen}
            title="Aucune salle trouvée"
            description="Modifiez vos filtres ou créez une nouvelle salle."
            action={
              <Button
                variant="secondary"
                onClick={() => {
                  setSearch('')
                  setStatus('all')
                }}
              >
                Réinitialiser les filtres
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full min-w-[850px] text-left text-sm">

              <thead className="bg-slate-50 text-xs font-semibold text-slate-500">

                <tr>
                  <th scope="col" className="px-5 py-4">
                    Salle
                  </th>

                  <th scope="col" className="px-5 py-4">
                    Capacité
                  </th>

                  <th scope="col" className="px-5 py-4">
                    Équipements
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

                {filteredRooms.map((room) => (
                  <tr
                    key={room.id}
                    className="hover:bg-slate-50/70"
                  >

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                          <DoorOpen size={19} />
                        </div>

                        <div className="max-w-48">

                          <p className="font-semibold text-slate-900">
                            {room.name}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            Référence #{room.id}
                          </p>

                        </div>

                      </div>

                    </td>

                    <td className="px-5 py-4 text-slate-600">

                      <span className="flex items-center gap-2">
                        <Users size={15} />
                        {room.capacity}
                      </span>

                    </td>

                    <td className="max-w-64 px-5 py-4">

                      <div className="flex flex-wrap gap-1.5">

                        {room.equipment
                          .slice(0, 3)
                          .map((item, index) => (
                            <span
                              key={`${item}-${index}`}
                              className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600"
                            >
                              {item}
                            </span>
                          ))}

                        {room.equipment.length > 3 && (
                          <span className="text-xs text-slate-400">
                            +{room.equipment.length - 3}
                          </span>
                        )}

                        {room.equipment.length === 0 && (
                          <span className="text-xs text-slate-400">
                            Aucun
                          </span>
                        )}

                      </div>

                    </td>

                    <td className="px-5 py-4">

                      <span
                        className={
                          room.is_active
                            ? 'rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700'
                            : 'rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700'
                        }
                      >
                        {room.is_active
                          ? 'Active'
                          : 'Inactive'}
                      </span>

                    </td>

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-2">

                        <button
                          type="button"
                          aria-label={`Modifier ${room.name}`}
                          title="Modifier la salle"
                          onClick={() =>
                            setEditing(room)
                          }
                          className="rounded-lg bg-brand-50 p-2.5 text-brand-600 hover:bg-brand-100"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          type="button"
                          aria-label={
                            `${room.is_active
                              ? 'Désactiver'
                              : 'Réactiver'} ${room.name}`
                          }
                          title={
                            room.is_active
                              ? 'Désactiver la salle'
                              : 'Réactiver la salle'
                          }
                          onClick={() =>
                            setChangingStatus(room)
                          }
                          className={
                            room.is_active
                              ? 'rounded-lg bg-red-50 p-2.5 text-red-600 hover:bg-red-100'
                              : 'rounded-lg bg-emerald-50 p-2.5 text-emerald-600 hover:bg-emerald-100'
                          }
                        >
                          <Power size={17} />
                        </button>

                      </div>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>

      {creating && (
        <RoomFormModal
          onClose={() => setCreating(false)}
          onSaved={handleSaved}
        />
      )}

      {editing && (
        <RoomFormModal
          key={editing.id}
          room={editing}
          onClose={() => setEditing(null)}
          onSaved={handleSaved}
        />
      )}

      {changingStatus && (
        <RoomStatusModal
          key={changingStatus.id}
          room={changingStatus}
          futureReservations={
            countFutureReservations(
              changingStatus.id,
            )
          }
          onClose={() =>
            setChangingStatus(null)
          }
          onChanged={handleSaved}
        />
      )}

    </section>
  )
}
