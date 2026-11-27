
import {
  useCallback,
  useEffect,
  useState,
} from 'react'

import { roomsApi } from '../api/rooms.ts'
import { reservationsApi } from '../api/reservations.ts'

import { getApiError } from '../api/client'

import {
  AVAILABILITY_DURATION_MINUTES,
  buildDashboardData,
} from '../utils/dashboard'

import type {
  DashboardData,
} from '../utils/dashboard'

interface DashboardState {
  data: DashboardData | null
  error: string | null
  isLoading: boolean
}

export function useDashboard() {
  const [revision, setRevision] = useState(0)

  const [state, setState] =
    useState<DashboardState>({
      data: null,
      error: null,
      isLoading: true,
    })

  const refresh = useCallback(() => {
    setState((previous) => ({
      ...previous,
      error: null,
      isLoading: true,
    }))

    setRevision((value) => value + 1)
  }, [])

  useEffect(() => {
    const controller = new AbortController()

    async function loadDashboard() {
      try {
        const now = new Date()

        const availabilityEnd = new Date(
          now.getTime() +
          AVAILABILITY_DURATION_MINUTES *
            60_000,
        )

        const [
          rooms,
          availableRooms,
          reservations,
        ] = await Promise.all([
          roomsApi.listAll(
            {},
            controller.signal,
          ),

          roomsApi.listAll(
            {
              start_time: now.toISOString(),

              end_time:
                availabilityEnd.toISOString(),
            },
            controller.signal,
          ),

          reservationsApi.listAll(
            {},
            controller.signal,
          ),
        ])

        if (controller.signal.aborted) {
          return
        }

        const data = buildDashboardData(
          rooms,
          availableRooms,
          reservations,
          now,
          availabilityEnd,
        )

        setState({
          data,
          error: null,
          isLoading: false,
        })
      } catch (error) {
        if (controller.signal.aborted) {
          return
        }

        setState((previous) => ({
          ...previous,

          error: getApiError(error),

          isLoading: false,
        }))
      }
    }

    void loadDashboard()

    return () => {
      controller.abort()
    }
  }, [revision])

  return {
    ...state,
    refresh,
  }
}
