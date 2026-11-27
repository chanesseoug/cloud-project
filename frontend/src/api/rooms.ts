
import api from './client'

import type {
  Room,
  RoomFilters,
  RoomCreate,
  RoomUpdate,
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

  async create(
    payload: RoomCreate,
  ): Promise<Room> {
    const response = await api.post<Room>(
      '/rooms',
      payload,
    )

    return response.data
  },

  async update(
    roomId: number,
    payload: RoomUpdate,
  ): Promise<Room> {
    const response = await api.patch<Room>(
      `/rooms/${roomId}`,
      payload,
    )

    return response.data
  },

  async deactivate(
    roomId: number,
  ): Promise<void> {
    await api.delete(`/rooms/${roomId}`)
  },

  async reactivate(
    roomId: number,
  ): Promise<Room> {
    return this.update(roomId, {
      is_active: true,
    })
  },
}
