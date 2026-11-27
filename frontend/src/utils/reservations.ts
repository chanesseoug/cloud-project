import type {
  Reservation,
} from '../types/reservation'

import type { Room } from '../types/room'

export type ReservationPhase =
  | 'upcoming'
  | 'ongoing'
  | 'completed'
  | 'cancelled'

export type ReservationViewFilter =
  | 'all'
  | ReservationPhase

export interface ReservationSummary {
  total: number
  upcoming: number
  ongoing: number
  completed: number
  cancelled: number
}

export function getReservationPhase(
  reservation: Reservation,
  now = new Date(),
): ReservationPhase {
  if (reservation.status === 'cancelled') {
    return 'cancelled'
  }

  const currentTime = now.getTime()

  const start = new Date(
    reservation.start_time,
  ).getTime()

  const end = new Date(
    reservation.end_time,
  ).getTime()

  if (currentTime < start) {
    return 'upcoming'
  }

  if (currentTime < end) {
    return 'ongoing'
  }

  return 'completed'
}

export function canCancelReservation(
  reservation: Reservation,
  now = new Date(),
): boolean {
  return (
    getReservationPhase(
      reservation,
      now,
    ) === 'upcoming'
  )
}

export function getReservationSummary(
  reservations: Reservation[],
  now = new Date(),
): ReservationSummary {
  const summary: ReservationSummary = {
    total: reservations.length,
    upcoming: 0,
    ongoing: 0,
    completed: 0,
    cancelled: 0,
  }

  for (const reservation of reservations) {
    const phase = getReservationPhase(
      reservation,
      now,
    )

    summary[phase] += 1
  }

  return summary
}

export function getRoomName(
  roomId: number,
  rooms: Room[],
): string {
  return (
    rooms.find(
      (room) => room.id === roomId,
    )?.name ||
    `Salle #${roomId}`
  )
}

export function filterReservations(
  reservations: Reservation[],
  rooms: Room[],
  filter: ReservationViewFilter,
  search = '',
  now = new Date(),
): Reservation[] {
  const query = search.trim().toLowerCase()

  return reservations
    .filter((reservation) => {
      if (
        filter !== 'all' &&
        getReservationPhase(
          reservation,
          now,
        ) !== filter
      ) {
        return false
      }

      if (!query) {
        return true
      }

      const roomName = getRoomName(
        reservation.room_id,
        rooms,
      )

      return [
        roomName,
        reservation.purpose || '',
        String(reservation.id),
      ].some((value) =>
        value.toLowerCase().includes(query),
      )
    })
    .sort((a, b) => {
      if (filter === 'upcoming') {
        return (
          new Date(a.start_time).getTime() -
          new Date(b.start_time).getTime()
        )
      }

      return (
        new Date(b.start_time).getTime() -
        new Date(a.start_time).getTime()
      )
    })
}

export function getReservationDuration(
  reservation: Reservation,
): number {
  return Math.max(
    0,
    Math.round(
      (
        new Date(
          reservation.end_time,
        ).getTime() -
        new Date(
          reservation.start_time,
        ).getTime()
      ) / 60_000,
    ),
  )
}