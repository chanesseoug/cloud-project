import {
  useRef,
  useState,
} from 'react'

import axios from 'axios'
import toast from 'react-hot-toast'

import {
  AlertTriangle,
  CalendarDays,
  Clock,
  DoorOpen,
  Hash,
  XCircle,
} from 'lucide-react'

import type {
  Reservation,
} from '../../types/reservation'

import {
  reservationsApi,
} from '../../api/reservations'

import {
  getApiError,
} from '../../api/client'

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

import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'

interface ReservationDetailsModalProps {
  reservation: Reservation
  roomName: string
  now: Date
  initialConfirm?: boolean
  onClose: () => void

  onCancelled: (
    reservation: Reservation,
  ) => void
}

export function ReservationDetailsModal({
  reservation,
  roomName,
  now,
  initialConfirm = false,
  onClose,
  onCancelled,
}: ReservationDetailsModalProps) {
  const [current, setCurrent] =
    useState(reservation)

  const [confirming, setConfirming] =
    useState(initialConfirm)

  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const inFlight = useRef(false)

  const phase = getReservationPhase(
    current,
    now,
  )

  const cancellable =
    canCancelReservation(current, now)

  async function handleCancel() {
    if (inFlight.current) return

    if (!canCancelReservation(current)) {
      setError(
        'Cette réservation ne peut plus être annulée.',
      )

      return
    }

    inFlight.current = true
    setBusy(true)
    setError('')

    try {
      const updated =
        await reservationsApi.cancel(
          current.id,
        )

      setCurrent(updated)
      setConfirming(false)

      onCancelled(updated)

      toast.success(
        'Réservation annulée avec succès.',
      )
    } catch (err) {
      if (
        axios.isAxiosError(err) &&
        err.response?.status === 409
      ) {
        setError(
          'Cette réservation a déjà commencé ou ne peut plus être annulée.',
        )
      } else {
        setError(getApiError(err))
      }
    } finally {
      inFlight.current = false
      setBusy(false)
    }
  }

  const details = [
    {
      label: 'Référence',
      value: `#${current.id}`,
      icon: Hash,
    },
    {
      label: 'Salle',
      value: roomName,
      icon: DoorOpen,
    },
    {
      label: 'Début',
      value: formatDateTime(
        current.start_time,
      ),
      icon: CalendarDays,
    },
    {
      label: 'Fin',
      value: formatDateTime(
        current.end_time,
      ),
      icon: CalendarDays,
    },
    {
      label: 'Durée',
      value: formatDuration(
        getReservationDuration(current),
      ),
      icon: Clock,
    },
  ]

  return (
    <Modal
      title="Détails de la réservation"
      onClose={onClose}
      busy={busy}
    >

      <div className="space-y-6">

        <div className="flex flex-wrap items-center justify-between gap-3">

          <h3 className="text-xl font-bold text-slate-900">
            {current.purpose ||
              'Réservation de salle'}
          </h3>

          <ReservationStatus
            phase={phase}
          />

        </div>

        <dl className="divide-y divide-slate-100 rounded-xl border border-slate-200">

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

                <dd className="text-sm font-semibold text-slate-800">
                  {detail.value}
                </dd>

              </div>
            )
          })}

        </dl>

        {error && (
          <p
            role="alert"
            className="rounded-xl bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </p>
        )}

        {confirming && cancellable && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5">

            <div className="flex items-start gap-3">

              <AlertTriangle
                size={23}
                className="shrink-0 text-red-600"
              />

              <div>
                <h4 className="font-semibold text-red-800">
                  Confirmer l'annulation ?
                </h4>

                <p className="mt-2 text-sm leading-relaxed text-red-700">
                  Le créneau sera libéré pour les autres utilisateurs.
                  Cette action ne peut pas être annulée.
                </p>
              </div>

            </div>

            <div className="mt-5 flex flex-wrap gap-3">

              <Button
                variant="secondary"
                disabled={busy}
                onClick={() =>
                  setConfirming(false)
                }
              >
                Conserver la réservation
              </Button>

              <Button
                variant="danger"
                loading={busy}
                onClick={() =>
                  void handleCancel()
                }
              >
                Confirmer l'annulation
              </Button>

            </div>

          </div>
        )}

        {!confirming && cancellable && (
          <Button
            variant="danger"
            className="w-full"
            onClick={() =>
              setConfirming(true)
            }
          >
            <XCircle size={17} />
            Annuler cette réservation
          </Button>
        )}

        {!cancellable && (
          <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
            {phase === 'cancelled'
              ? 'Cette réservation a été annulée.'
              : 'Une réservation commencée ou terminée ne peut plus être annulée.'}
          </p>
        )}

        <Button
          variant="secondary"
          className="w-full"
          disabled={busy}
          onClick={onClose}
        >
          Fermer
        </Button>

      </div>

    </Modal>
  )
}