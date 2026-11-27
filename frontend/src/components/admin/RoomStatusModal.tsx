
import {
  useRef,
  useState,
} from 'react'

import toast from 'react-hot-toast'

import {
  AlertTriangle,
  CheckCircle2,
  Power,
} from 'lucide-react'

import type { Room } from '../../types/room'

import {
  roomsApi,
} from '../../api/rooms'

import {
  getApiError,
} from '../../api/client'

import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'

interface RoomStatusModalProps {
  room: Room
  futureReservations: number
  onClose: () => void
  onChanged: () => void
}

export function RoomStatusModal({
  room,
  futureReservations,
  onClose,
  onChanged,
}: RoomStatusModalProps) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const inFlight = useRef(false)

  const deactivating = room.is_active

  async function handleConfirm() {
    if (inFlight.current) return

    inFlight.current = true
    setBusy(true)
    setError('')

    try {
      if (deactivating) {
        await roomsApi.deactivate(room.id)
      } else {
        await roomsApi.reactivate(room.id)
      }

      toast.success(
        deactivating
          ? 'Salle désactivée avec succès.'
          : 'Salle réactivée avec succès.',
      )

      onChanged()
    } catch (err) {
      setError(getApiError(err))
    } finally {
      inFlight.current = false
      setBusy(false)
    }
  }

  return (
    <Modal
      title={
        deactivating
          ? 'Désactiver une salle'
          : 'Réactiver une salle'
      }
      onClose={onClose}
      busy={busy}
    >

      <div className="space-y-5">

        <div className="flex items-start gap-4">

          <div
            className={
              deactivating
                ? 'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600'
                : 'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600'
            }
          >
            {deactivating
              ? <AlertTriangle size={25} />
              : <CheckCircle2 size={25} />}
          </div>

          <div>

            <h3 className="text-lg font-bold text-slate-900">
              {room.name}
            </h3>

            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              {deactivating
                ? 'Cette salle ne sera plus proposée aux utilisateurs pour de nouvelles réservations. Son historique restera conservé.'
                : 'Cette salle sera de nouveau proposée dans le catalogue et pourra être réservée selon ses disponibilités.'}
            </p>

          </div>

        </div>

        {deactivating &&
          futureReservations > 0 && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">

              <p className="font-semibold">
                Attention : {futureReservations}
                {' '}
                réservation(s) future(s)
                ou en cours.
              </p>

              <p className="mt-2 leading-relaxed">
                La désactivation ne doit pas être
                assimilée à une annulation de ces
                réservations. Vérifiez-les dans
                l'onglet Réservations.
              </p>

            </div>
          )}

        {error && (
          <p
            role="alert"
            className="rounded-xl bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </p>
        )}

        <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-5">

          <Button
            variant="secondary"
            disabled={busy}
            onClick={onClose}
          >
            Retour
          </Button>

          <Button
            variant={
              deactivating
                ? 'danger'
                : 'primary'
            }
            loading={busy}
            onClick={() =>
              void handleConfirm()
            }
          >
            {!busy && <Power size={17} />}

            {deactivating
              ? 'Confirmer la désactivation'
              : 'Confirmer la réactivation'}
          </Button>

        </div>

      </div>

    </Modal>
  )
}
