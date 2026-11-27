
import type { Room, RoomCreate } from '../types/room'
import type { User } from '../types/auth'
import type {
  Reservation,
} from '../types/reservation'

import type {
  RoomStatusFilter,
  UserRoleFilter,
  UserStatusFilter,
} from '../types/admin'

export interface RoomFormValues {
  name: string
  description: string
  capacity: string
  equipment: string
}

export function createRoomFormValues(
  room?: Room,
): RoomFormValues {
  return {
    name: room?.name || '',
    description: room?.description || '',
    capacity: room
      ? String(room.capacity)
      : '6',
    equipment:
      room?.equipment.join(', ') || '',
  }
}

export function normalizeEquipment(
  value: string,
): string[] {
  return [
    ...new Set(
      value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  ]
}

export function buildRoomPayload(
  values: RoomFormValues,
): RoomCreate {
  const name = values.name.trim()

  if (!name) {
    throw new Error(
      'Le nom de la salle est obligatoire.',
    )
  }

  const capacity = Number(values.capacity)

  if (
    !values.capacity.trim() ||
    !Number.isSafeInteger(capacity) ||
    capacity < 1
  ) {
    throw new Error(
      'La capacité doit être un entier positif.',
    )
  }

  return {
    name,
    description:
      values.description.trim() || null,
    capacity,
    equipment:
      normalizeEquipment(values.equipment),
  }
}

export function filterAdminRooms(
  rooms: Room[],
  search = '',
  status: RoomStatusFilter = 'all',
): Room[] {
  const query = search.trim().toLowerCase()

  return rooms
    .filter((room) => {
      if (
        status === 'active' &&
        !room.is_active
      ) {
        return false
      }

      if (
        status === 'inactive' &&
        room.is_active
      ) {
        return false
      }

      return [
        room.name,
        room.description || '',
        ...room.equipment,
      ].some((value) =>
        value.toLowerCase().includes(query),
      )
    })
    .sort((a, b) =>
      a.name.localeCompare(b.name, 'fr'),
    )
}

export function filterAdminUsers(
  users: User[],
  search = '',
  role: UserRoleFilter = 'all',
  status: UserStatusFilter = 'all',
): User[] {
  const query = search.trim().toLowerCase()

  return users
    .filter((user) => {
      if (
        role !== 'all' &&
        user.role !== role
      ) {
        return false
      }

      if (
        status === 'active' &&
        !user.is_active
      ) {
        return false
      }

      if (
        status === 'inactive' &&
        user.is_active
      ) {
        return false
      }

      return [
        user.full_name,
        user.email,
        String(user.id),
      ].some((value) =>
        value.toLowerCase().includes(query),
      )
    })
    .sort((a, b) =>
      a.full_name.localeCompare(
        b.full_name,
        'fr',
      ),
    )
}

export function getAdminUserName(
  userId: number,
  users: User[],
): string {
  return (
    users.find(
      (user) => user.id === userId,
    )?.full_name ||
    `Utilisateur #${userId}`
  )
}

export function getUserReservationCount(
  userId: number,
  reservations: Reservation[],
): number {
  return reservations.filter(
    (reservation) =>
      reservation.user_id === userId,
  ).length
}
