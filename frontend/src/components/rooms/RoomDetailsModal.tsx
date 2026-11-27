
import { useState } from 'react'

import {
  Users,
  Monitor,
  Presentation,
  CalendarPlus,
} from 'lucide-react'

import type { Room } from '../../types/room'

import type {
  Reservation,
} from '../../types/reservation'

import type {
  BookingSlot,
} from '../../utils/booking'

import { Modal } from '../ui/Modal'

import {
  BookingForm,
} from '../reservations/BookingForm'

import {
  BookingSuccess,
} from '../reservations/BookingSuccess'

interface RoomDetailsModalProps {
  room: Room
  initialSlot?: BookingSlot

  onClose: () => void

  onBooked: (
    reservation: Reservation,
  ) => void

  onConflict: () => void
}

export function RoomDetailsModal({
  room,
  initialSlot,
  onClose,
  onBooked,
  onConflict,
}: RoomDetailsModalProps) {
  const [busy, setBusy] = useState(false)

  const [reservation, setReservation] =
    useState<Reservation | null>(null)

  function handleSuccess(
    newReservation: Reservation,
  ) {
    setReservation(newReservation)
    setBusy(false)
    onBooked(newReservation)
  }

  return (
    <Modal
      title={
        reservation
          ? 'Confirmation de réservation'
          : `Salle ${room.name}`
      }
      busy={busy}
      onClose={onClose}
    >

      {reservation ? (
        <BookingSuccess
          room={room}
          reservation={reservation}
          onClose={onClose}
        />
      ) : (
        <div className="space-y-6">

          <div className="relative flex h-36 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-brand-50 to-indigo-100">

            <div className="flex h-24 w-24 items-center justify-center rounded-3xl border border-white bg-white/60 text-brand-500">

              <Presentation
                size={52}
                strokeWidth={1.3}
              />

            </div>

          </div>

          <div>

            <h3 className="text-2xl font-bold text-slate-900">
              {room.name}
            </h3>

            <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
              <Users size={18} />
              Capacité maximale :
              {' '}
              {room.capacity} personnes
            </p>

            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              {room.description ||
                'Aucune description renseignée.'}
            </p>

          </div>

          <section>

            <h4 className="text-sm font-semibold text-slate-900">
              Équipements disponibles
            </h4>

            <div className="mt-3 flex flex-wrap gap-2">

              {room.equipment.map(
                (equipment, index) => (
                  <span
                    key={`${equipment}-${index}`}
                    className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-xs text-slate-600"
                  >
                    <Monitor size={14} />
                    {equipment}
                  </span>
                ),
              )}

              {room.equipment.length === 0 && (
                <p className="text-sm text-slate-400">
                  Aucun équipement renseigné.
                </p>
              )}

            </div>

          </section>

          <div className="border-t border-slate-200 pt-6">

            <div className="mb-5 flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <CalendarPlus size={21} />
              </div>

              <div>
                <h3 className="font-bold text-slate-900">
                  Réserver cette salle
                </h3>

                <p className="mt-1 text-xs text-slate-400">
                  Choisissez le créneau de votre réunion.
                </p>
              </div>

            </div>

            {room.is_active ? (
              <BookingForm
                room={room}
                initialSlot={initialSlot}
                onSuccess={handleSuccess}
                onBusyChange={setBusy}
                onConflict={onConflict}
              />
            ) : (
              <p
                role="alert"
                className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800"
              >
                Cette salle est actuellement inactive
                et ne peut pas être réservée.
              </p>
            )}

          </div>

        </div>
      )}

    </Modal>
  )
}
