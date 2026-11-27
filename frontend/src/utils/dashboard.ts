
import type { Room } from '../types/room'
import type {
  Reservation,
} from '../types/reservation'

export const AVAILABILITY_DURATION_MINUTES = 30

export interface DashboardData {
  rooms: Room[]
  availableRooms: Room[]
  reservations: Reservation[]
  upcomingReservations: Reservation[]

  stats: {
    totalRooms: number
    availableRooms: number
    totalReservations: number
    upcomingReservations: number
  }

  checkedAt: string
  availabilityEnd: string
}

export function buildDashboardData(
  rooms: Room[],
  availableRooms: Room[],
  reservations: Reservation[],
  now: Date,
  availabilityEnd: Date,
): DashboardData {
  const activeRooms = rooms.filter(
    (room) => room.is_active,
  )

  const activeAvailableRooms =
    availableRooms.filter(
      (room) => room.is_active,
    )

  const upcomingReservations = reservations
    .filter(
      (reservation) =>
        reservation.status === 'confirmed' &&
        new Date(
          reservation.start_time,
        ).getTime() >= now.getTime(),
    )
    .sort(
      (a, b) =>
        new Date(a.start_time).getTime() -
        new Date(b.start_time).getTime(),
    )

  return {
    rooms: activeRooms,

    availableRooms: activeAvailableRooms,

    reservations,

    upcomingReservations,

    stats: {
      totalRooms: activeRooms.length,

      availableRooms:
        activeAvailableRooms.length,

      totalReservations:
        reservations.length,

      upcomingReservations:
        upcomingReservations.length,
    },

    checkedAt: now.toISOString(),

    availabilityEnd:
      availabilityEnd.toISOString(),
  }
}
