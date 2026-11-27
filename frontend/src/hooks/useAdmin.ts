
import {
  useCallback,
  useEffect,
  useState,
} from 'react'

import { adminApi } from '../api/admin'
import { roomsApi } from '../api/rooms'

import {
  reservationsApi,
} from '../api/reservations'

import {
  getApiError,
} from '../api/client'

import type {
  AdminStats,
} from '../types/admin'

import type { Room } from '../types/room'
import type { User } from '../types/auth'

import type {
  Reservation,
} from '../types/reservation'

interface AdminState {
  stats: AdminStats | null
  rooms: Room[]
  users: User[]
  reservations: Reservation[]
  isLoading: boolean
  error: string | null
}

export function useAdmin() {
  const [revision, setRevision] =
    useState(0)

  const [now, setNow] = useState(
    () => new Date(),
  )

  const [state, setState] =
    useState<AdminState>({
      stats: null,
      rooms: [],
      users: [],
      reservations: [],
      isLoading: true,
      error: null,
    })

  const refresh = useCallback(() => {
    setState((previous) => ({
      ...previous,
      isLoading: true,
      error: null,
    }))

    setRevision((value) => value + 1)
  }, [])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date())
    }, 30_000)

    return () => {
      window.clearInterval(timer)
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()

    async function loadAdmin() {
      try {
        const [
          stats,
          rooms,
          users,
          reservations,
        ] = await Promise.all([
          adminApi.getStats(
            controller.signal,
          ),

          roomsApi.listAll(
            { include_inactive: true },
            controller.signal,
          ),

          adminApi.listUsers(
            controller.signal,
          ),

          reservationsApi.listAll(
            { all_users: true },
            controller.signal,
          ),
        ])

        if (controller.signal.aborted) {
          return
        }

        setNow(new Date())

        setState({
          stats,
          rooms,
          users,
          reservations,
          isLoading: false,
          error: null,
        })
      } catch (error) {
        if (controller.signal.aborted) {
          return
        }

        controller.abort()

        setState((previous) => ({
          ...previous,
          isLoading: false,
          error: getApiError(error),
        }))
      }
    }

    void loadAdmin()

    return () => {
      controller.abort()
    }
  }, [revision])

  return {
    ...state,
    now,
    refresh,
  }
}
