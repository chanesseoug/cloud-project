
import api from './client'

import type {
  Reservation,
  ReservationCreate,
  ReservationFilters,
} from '../types/reservation'

export const reservationsApi = {
  async list(
    filters: ReservationFilters = {},
    signal?: AbortSignal,
  ): Promise<Reservation[]> {
    const response = await api.get<Reservation[]>(
      '/reservations',
      {
        params: filters,
        signal,
      },
    )

    return response.data
  },

  async listAll(
    filters: ReservationFilters = {},
    signal?: AbortSignal,
  ): Promise<Reservation[]> {
    const reservations: Reservation[] = []
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

      reservations.push(...page)

      if (page.length < limit) {
        break
      }

      offset += page.length
    }

    return reservations
  },

  async getById(
    reservationId: number,
    signal?: AbortSignal,
  ): Promise<Reservation> {
    const response = await api.get<Reservation>(
      `/reservations/${reservationId}`,
      { signal },
    )

    return response.data
  },

  async create(
    payload: ReservationCreate,
  ): Promise<Reservation> {
    const response = await api.post<Reservation>(
      '/reservations',
      payload,
    )

    return response.data
  },

  async cancel(
    reservationId: number,
  ): Promise<Reservation> {
    const response = await api.patch<Reservation>(
      `/reservations/${reservationId}/cancel`,
    )

    return response.data
  },
}
