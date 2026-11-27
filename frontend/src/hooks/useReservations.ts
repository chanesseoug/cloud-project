import {
  useCallback,
  useEffect,
  useState,
} from 'react'

import {
  reservationsApi,
} from '../api/reservations'

import { roomsApi } from '../api/rooms'
import { getApiError } from '../api/client'

import type {
  Reservation,
} from '../types/reservation'

import type { Room } from '../types/room'

interface ReservationsState {
  reservations: Reservation[]
  rooms: Room[]
  isLoading: boolean
  error: string | null
}

export function useReservations() {
  const [revision, setRevision] = useState(0)

  const [now, setNow] = useState(
    () => new Date(),
  )

  const [state, setState] =
    useState<ReservationsState>({
      reservations: [],
      rooms: [],
      isLoading: true,
      error: null,
    })

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date())
    }, 30_000)

    return () => {
      window.clearInterval(timer)
    }
  }, [])

  const refresh = useCallback(() => {
    setRevision((value) => value + 1)
  }, [])

  const updateReservation = useCallback(
    (updated: Reservation) => {
      setState((previous) => ({
        ...previous,

        reservations:
          previous.reservations.map(
            (reservation) =>
              reservation.id === updated.id
                ? updated
                : reservation,
          ),
      }))
    },
    [],
  )

  useEffect(() => {
    const controller = new AbortController()

    async function loadReservations() {
      setState((previous) => ({
        ...previous,
        isLoading: true,
        error: null,
      }))

      try {
        const [reservations, rooms] =
          await Promise.all([
            reservationsApi.listAll(
              {},
              controller.signal,
            ),

            roomsApi.listAll(
              {},
              controller.signal,
            ),
          ])

        if (controller.signal.aborted) {
          return
        }

        setNow(new Date())

        setState({
          reservations,
          rooms,
          isLoading: false,
          error: null,
        })
      } catch (error) {
        if (controller.signal.aborted) {
          return
        }

        setState((previous) => ({
          ...previous,
          isLoading: false,
          error: getApiError(error),
        }))
      }
    }

    void loadReservations()

    return () => controller.abort()
  }, [revision])

  return {
    ...state,
    now,
    refresh,
    updateReservation,
  }
}