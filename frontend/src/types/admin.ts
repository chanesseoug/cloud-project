
export interface AdminStats {
  total_users: number
  total_rooms: number
  active_rooms: number
  total_reservations: number
  confirmed_reservations: number
  cancelled_reservations: number
}

export type AdminTab =
  | 'overview'
  | 'rooms'
  | 'users'
  | 'reservations'

export type RoomStatusFilter =
  | 'all'
  | 'active'
  | 'inactive'

export type UserRoleFilter =
  | 'all'
  | 'user'
  | 'admin'

export type UserStatusFilter =
  | 'all'
  | 'active'
  | 'inactive'
