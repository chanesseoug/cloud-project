
export interface Room {
  id: number
  name: string
  description: string | null
  capacity: number
  equipment: string[]
  photo_object_key: string | null
  is_active: boolean
  created_at: string
}

export interface RoomFilters {
  min_capacity?: number
  equipment?: string
  search?: string
  start_time?: string
  end_time?: string
  include_inactive?: boolean
  offset?: number
  limit?: number
}
