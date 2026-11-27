
import {
  useEffect,
  useRef,
  useState,
} from 'react'

import type { FormEvent } from 'react'

import axios from 'axios'

import {
  CalendarDays,
  Clock,
  Search,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'

import { roomsApi } from '../../api/rooms'
import {
  reservationsApi,
} from '../../api/reservations'

import { getApiError } from '../../api/client'

import type { Room } from '../../types/room'

import type {
  Reservation,
} from '../../types/reservation'

import {
  createDefaultSlot,
  formatDuration,
  getSlotDurationMinutes,
  validateBookingSlot,
} from '../../utils/booking'

import type {
  BookingSlot,
} from '../../utils/booking'

import { Input } from '../ui/Input'
import { Button } from '../ui/Button'

interface BookingFormProps {
  room: Room
  initialSlot?: BookingSlot

  onSuccess: (
    reservation: Reservation,
  ) => void

  onBusyChange: (busy: boolean) => void
  onConflict: () => void
}

type Availability =
  | 'unchecked'
  | 'available'
  | 'unavailable'

export function BookingForm({
  room,
  initialSlot,
  onSuccess,
  onBusyChange,
  onConflict,
}: BookingFormProps) {
  const [slot, setSlot] =
    useState<BookingSlot>(
      () => initialSlot || createDefaultSlot(),
    )

  const [purpose, setPurpose] = useState('')

  const [availability, setAvailability] =
    useState<Availability>('unchecked')

  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const requestInFlight = useRef(false)
  const mounted = useRef(false)

  const controllerRef =
    useRef<AbortController | null>(null)

  useEffect(() => {
    mounted.current = true

    return () => {
      mounted.current = false
      controllerRef.current?.abort()
    }
  }, [])

  const duration =
    getSlotDurationMinutes(slot)

  function updateSlot(
    nextSlot: BookingSlot,
  ) {
    setSlot(nextSlot)
    setAvailability('unchecked')
    setError('')
  }

  function beginRequest(): boolean {
    if (requestInFlight.current) {
      return false
    }

    requestInFlight.current = true

    setBusy(true)
    onBusyChange(true)

    return true
  }

  function finishRequest() {
    requestInFlight.current = false

    if (mounted.current) {
      setBusy(false)
      onBusyChange(false)
    }
  }

  async function checkAvailability() {
    const validationError =
      validateBookingSlot(slot)

    if (validationError) {
      setError(validationError)
      setAvailability('unchecked')
      return
    }

    if (!beginRequest()) return

    setError('')
    setAvailability('unchecked')

    const controller = new AbortController()

    controllerRef.current = controller

    try {
      const availableRooms =
        await roomsApi.listAll(
          {
            start_time:
              new Date(slot.start).toISOString(),

            end_time:
              new Date(slot.end).toISOString(),
          },
          controller.signal,
        )

      if (!mounted.current) return

      const isAvailable =
        availableRooms.some(
          (availableRoom) =>
            availableRoom.id === room.id &&
            availableRoom.is_active,
        )

      setAvailability(
        isAvailable
          ? 'available'
          : 'unavailable',
      )
    } catch (err) {
      if (
        mounted.current &&
        !controller.signal.aborted
      ) {
        setError(getApiError(err))
      }
    } finally {
      controllerRef.current = null
      finishRequest()
    }
  }

  async function submitBooking(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    const validationError =
      validateBookingSlot(slot)

    if (validationError) {
      setError(validationError)
      setAvailability('unchecked')
      return
    }

    if (availability !== 'available') {
      setError(
        'Veuillez vérifier la disponibilité avant de confirmer.',
      )
      return
    }

    if (!beginRequest()) return

    setError('')

    try {
      const reservation =
        await reservationsApi.create({
          room_id: room.id,

          start_time:
            new Date(slot.start).toISOString(),

          end_time:
            new Date(slot.end).toISOString(),

          ...(purpose.trim()
            ? { purpose: purpose.trim() }
            : {}),
        })

      if (mounted.current) {
        onSuccess(reservation)
      }
    } catch (err) {
      if (!mounted.current) return

      if (
        axios.isAxiosError(err) &&
        err.response?.status === 409
      ) {
        setAvailability('unavailable')

        setError(
          'Ce créneau ne peut plus être réservé. ' +
          'La salle est peut-être déjà occupée ou inactive. ' +
          'Veuillez choisir un autre créneau.',
        )

        onConflict()
      } else {
        setAvailability('unchecked')

        if (
          axios.isAxiosError(err) &&
          (
            !err.response ||
            err.response.status >= 500
          )
        ) {
          setError(
            "La confirmation n'a pas pu être vérifiée. " +
            'Consultez votre tableau de bord avant de réessayer.',
          )
        } else {
          setError(getApiError(err))
        }
      }
    } finally {
      finishRequest()
    }
  }

  return (
    <form
      onSubmit={submitBooking}
      noValidate
      className="space-y-5"
    >

      <div className="grid gap-4 sm:grid-cols-2">

        <Input
          label="Début de réservation"
          type="datetime-local"
          icon={<CalendarDays size={16} />}
          value={slot.start}
          disabled={busy}
          onChange={(event) =>
            updateSlot({
              ...slot,
              start: event.target.value,
            })
          }
          required
        />

        <Input
          label="Fin de réservation"
          type="datetime-local"
          icon={<CalendarDays size={16} />}
          value={slot.end}
          disabled={busy}
          onChange={(event) =>
            updateSlot({
              ...slot,
              end: event.target.value,
            })
          }
          required
        />

      </div>

      <div className="space-y-2">

        <label
          htmlFor="booking-purpose"
          className="block text-sm font-medium text-slate-700"
        >
          Motif de la réservation
          <span className="ml-1 font-normal text-slate-400">
            (facultatif)
          </span>
        </label>

        <textarea
          id="booking-purpose"
          rows={3}
          value={purpose}
          disabled={busy}
          onChange={(event) =>
            setPurpose(event.target.value)
          }
          placeholder="Exemple : réunion de suivi du projet"
          className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
        />

      </div>

      <div className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-4">

        <span className="flex items-center gap-2 text-sm text-slate-500">
          <Clock size={17} />
          Durée totale
        </span>

        <strong className="text-sm text-slate-900">
          {formatDuration(duration)}
        </strong>

      </div>

      {availability === 'available' && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
        >
          <CheckCircle2
            size={19}
            className="shrink-0"
          />

          <div>
            <p className="font-semibold">
              Salle disponible pour ce créneau
            </p>

            <p className="mt-1 text-xs">
              La disponibilité sera vérifiée à nouveau
              lors de la confirmation.
            </p>
          </div>
        </div>
      )}

      {availability === 'unavailable' && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800"
        >
          <AlertCircle
            size={19}
            className="shrink-0"
          />

          <p>
            Salle indisponible sur ce créneau.
            Veuillez modifier les horaires.
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

      <div className="grid gap-3">

        <Button
          variant="secondary"
          onClick={() => void checkAvailability()}
          loading={busy}
        >
          {!busy && <Search size={17} />}
          Vérifier la disponibilité
        </Button>

        <Button
          type="submit"
          disabled={
            availability !== 'available' || busy
          }
        >
          <CheckCircle2 size={18} />
          Confirmer ma réservation
        </Button>

      </div>

      <p className="text-center text-xs leading-relaxed text-slate-400">
        Votre réservation sera confirmée uniquement
        après validation par le serveur.
      </p>

    </form>
  )
}
