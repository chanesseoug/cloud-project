
import type { RoomFilters } from '../types/room'

export interface BookingSlot {
  start: string
  end: string
}

export interface RoomSearchValues {
  search: string
  minCapacity: string
  equipment: string
  onlyAvailable: boolean
  start: string
  end: string
}

export function toLocalDateTimeInput(
  date: Date,
): string {
  const pad = (value: number) =>
    String(value).padStart(2, '0')

  return (
    `${date.getFullYear()}-` +
    `${pad(date.getMonth() + 1)}-` +
    `${pad(date.getDate())}T` +
    `${pad(date.getHours())}:` +
    `${pad(date.getMinutes())}`
  )
}

export function createDefaultSlot(
  now = new Date(),
): BookingSlot {
  const interval = 30 * 60_000

  const start = new Date(
    (Math.floor(now.getTime() / interval) + 1) *
      interval,
  )

  const end = new Date(
    start.getTime() + 60 * 60_000,
  )

  return {
    start: toLocalDateTimeInput(start),
    end: toLocalDateTimeInput(end),
  }
}

export function createDefaultFilters(
  now = new Date(),
): RoomSearchValues {
  return {
    search: '',
    minCapacity: '',
    equipment: '',
    onlyAvailable: false,
    ...createDefaultSlot(now),
  }
}

export function validateBookingSlot(
  slot: BookingSlot,
  now = new Date(),
): string | null {
  if (!slot.start || !slot.end) {
    return 'Veuillez renseigner les deux horaires.'
  }

  const start = new Date(slot.start)
  const end = new Date(slot.end)

  if (
    !Number.isFinite(start.getTime()) ||
    !Number.isFinite(end.getTime())
  ) {
    return 'Les dates saisies sont invalides.'
  }

  if (
    toLocalDateTimeInput(start) !== slot.start ||
    toLocalDateTimeInput(end) !== slot.end
  ) {
    return 'Ce créneau local est invalide.'
  }

  if (start.getTime() <= now.getTime()) {
    return 'La réservation doit commencer dans le futur.'
  }

  if (end.getTime() <= start.getTime()) {
    return "L'heure de fin doit être postérieure à l'heure de début."
  }

  return null
}

export function getSlotDurationMinutes(
  slot: BookingSlot,
): number {
  const start = new Date(slot.start).getTime()
  const end = new Date(slot.end).getTime()

  if (
    !Number.isFinite(start) ||
    !Number.isFinite(end)
  ) {
    return 0
  }

  return Math.max(
    0,
    Math.round((end - start) / 60_000),
  )
}

export function formatDuration(
  minutes: number,
): string {
  const hours = Math.floor(minutes / 60)
  const remaining = minutes % 60

  if (hours === 0) {
    return `${remaining} min`
  }

  if (remaining === 0) {
    return `${hours} h`
  }

  return `${hours} h ${remaining} min`
}

export function buildRoomFilters(
  values: RoomSearchValues,
  now = new Date(),
): RoomFilters {
  const filters: RoomFilters = {}

  const search = values.search.trim()
  const equipment = values.equipment.trim()

  if (search) {
    filters.search = search
  }

  if (equipment) {
    filters.equipment = equipment
  }

  if (values.minCapacity) {
    const capacity = Number(values.minCapacity)

    if (
      !Number.isInteger(capacity) ||
      capacity < 1
    ) {
      throw new Error(
        'La capacité minimale doit être un entier positif.',
      )
    }

    filters.min_capacity = capacity
  }

  if (values.onlyAvailable) {
    const error = validateBookingSlot(
      values,
      now,
    )

    if (error) {
      throw new Error(error)
    }

    filters.start_time =
      new Date(values.start).toISOString()

    filters.end_time =
      new Date(values.end).toISOString()
  }

  return filters
}
