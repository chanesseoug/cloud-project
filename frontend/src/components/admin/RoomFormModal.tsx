
import {
  useRef,
  useState,
} from 'react'

import type {
  FormEvent,
} from 'react'

import axios from 'axios'
import toast from 'react-hot-toast'

import {
  DoorOpen,
  Users,
  Monitor,
  Save,
} from 'lucide-react'

import type { Room } from '../../types/room'

import { roomsApi } from '../../api/rooms'
import { getApiError } from '../../api/client'

import {
  createRoomFormValues,
  buildRoomPayload,
  normalizeEquipment,
} from '../../utils/admin'

import { Modal } from '../ui/Modal'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'

interface RoomFormModalProps {
  room?: Room
  onClose: () => void
  onSaved: (room: Room) => void
}

export function RoomFormModal({
  room,
  onClose,
  onSaved,
}: RoomFormModalProps) {
  const [values, setValues] =
    useState(
      () => createRoomFormValues(room),
    )

  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const inFlight = useRef(false)

  const equipment =
    normalizeEquipment(values.equipment)

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    if (inFlight.current) return

    let payload

    try {
      payload = buildRoomPayload(values)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Le formulaire est invalide.',
      )

      return
    }

    inFlight.current = true
    setBusy(true)
    setError('')

    try {
      const savedRoom = room
        ? await roomsApi.update(
            room.id,
            payload,
          )
        : await roomsApi.create(payload)

      toast.success(
        room
          ? 'Salle modifiée avec succès.'
          : 'Salle créée avec succès.',
      )

      onSaved(savedRoom)
    } catch (err) {
      if (
        axios.isAxiosError(err) &&
        err.response?.status === 409
      ) {
        setError(
          'Une salle avec ce nom existe déjà ou cette modification crée un conflit.',
        )
      } else if (
        axios.isAxiosError(err) &&
        (
          !err.response ||
          err.response.status >= 500
        )
      ) {
        setError(
          "La confirmation de l'opération n'a pas pu être vérifiée. Fermez puis actualisez le catalogue avant de réessayer.",
        )
      } else {
        setError(getApiError(err))
      }
    } finally {
      inFlight.current = false
      setBusy(false)
    }
  }

  return (
    <Modal
      title={
        room
          ? `Modifier ${room.name}`
          : 'Ajouter une salle'
      }
      onClose={onClose}
      busy={busy}
    >

      <form
        onSubmit={handleSubmit}
        noValidate
        className="space-y-5"
      >

        <div className="grid gap-4 sm:grid-cols-2">

          <Input
            label="Nom de la salle"
            icon={<DoorOpen size={17} />}
            placeholder="Exemple : Phoenix"
            value={values.name}
            disabled={busy}
            onChange={(event) =>
              setValues({
                ...values,
                name: event.target.value,
              })
            }
            required
          />

          <Input
            label="Capacité maximale"
            type="number"
            min={1}
            step={1}
            icon={<Users size={17} />}
            value={values.capacity}
            disabled={busy}
            onChange={(event) =>
              setValues({
                ...values,
                capacity: event.target.value,
              })
            }
            required
          />

        </div>

        <div className="space-y-2">

          <label
            htmlFor="admin-room-description"
            className="block text-sm font-medium text-slate-700"
          >
            Description
          </label>

          <textarea
            id="admin-room-description"
            rows={4}
            value={values.description}
            disabled={busy}
            placeholder="Présentez cette salle de réunion..."
            onChange={(event) =>
              setValues({
                ...values,
                description: event.target.value,
              })
            }
            className="w-full resize-y rounded-xl border border-slate-200 p-4 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
          />

        </div>

        <div className="space-y-3">

          <Input
            label="Équipements"
            icon={<Monitor size={17} />}
            placeholder="Écran, Wi-Fi, Tableau blanc"
            value={values.equipment}
            disabled={busy}
            onChange={(event) =>
              setValues({
                ...values,
                equipment: event.target.value,
              })
            }
          />

          <p className="text-xs text-slate-500">
            Séparez les équipements par des virgules.
          </p>

          <div className="flex flex-wrap gap-2">

            {equipment.map((item) => (
              <span
                key={item}
                className="rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-medium text-brand-700"
              >
                {item}
              </span>
            ))}

          </div>

        </div>

        {room && (
          <p className="rounded-xl bg-slate-50 p-4 text-xs leading-relaxed text-slate-500">
            La modification des informations de la salle
            ne change pas automatiquement les créneaux
            des réservations existantes.
          </p>
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
            type="button"
            variant="secondary"
            disabled={busy}
            onClick={onClose}
          >
            Annuler
          </Button>

          <Button
            type="submit"
            loading={busy}
          >
            {!busy && <Save size={17} />}

            {room
              ? 'Enregistrer les modifications'
              : 'Créer la salle'}
          </Button>

        </div>

      </form>

    </Modal>
  )
}
