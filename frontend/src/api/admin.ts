
import api from './client'

import type { AdminStats } from '../types/admin'
import type { User } from '../types/auth'

export const adminApi = {
  async getStats(
    signal?: AbortSignal,
  ): Promise<AdminStats> {
    const response = await api.get<AdminStats>(
      '/admin/stats',
      { signal },
    )

    return response.data
  },

  async listUsers(
    signal?: AbortSignal,
  ): Promise<User[]> {
    const response = await api.get<User[]>(
      '/admin/users',
      { signal },
    )

    return response.data
  },
}
