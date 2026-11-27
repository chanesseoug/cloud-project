
export type ReservationStatus =
  | 'confirmed'
  | 'cancelled'

export interface Reservation {
  id: number
  user_id: number
  room_id: number
  start_time: string
  end_time: string
  purpose: string | null
  status: ReservationStatus
  created_at: string
}

export interface ReservationCreate {
  room_id: number
  start_time: string
  end_time: string
  purpose?: string
}

export interface ReservationFilters {
  booking_status?: ReservationStatus
  all_users?: boolean
  offset?: number
  limit?: number
}
