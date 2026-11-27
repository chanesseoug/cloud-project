
import api from './client'

import type {
  Room,
  RoomFilters,
} from '../types/room'

export const roomsApi = {
  async list(
    filters: RoomFilters = {},
    signal?: AbortSignal,
  ): Promise<Room[]> {
    const response = await api.get<Room[]>(
      '/rooms',
      {
        params: filters,
        signal,
      },
    )

    return response.data
  },

  async listAll(
    filters: RoomFilters = {},
    signal?: AbortSignal,
  ): Promise<Room[]> {
    const rooms: Room[] = []
    const limit = 50
    let offset = 0

    while (true) {
      const page = await this.list(
        {
          ...filters,
          offset,
          limit,
        },
        signal,
      )

      rooms.push(...page)

      if (page.length < limit) {
        break
      }

      offset += page.length
    }

    return rooms
  },

  async getById(
    roomId: number,
    signal?: AbortSignal,
  ): Promise<Room> {
    const response = await api.get<Room>(
      `/rooms/${roomId}`,
      { signal },
    )

    return response.data
  },
}
