
import {
  useCallback,
  useEffect,
  useState,
} from 'react'

import { roomsApi } from '../api/rooms'
import { getApiError } from '../api/client'

import type {
  Room,
  RoomFilters,
} from '../types/room'

interface RoomsState {
  rooms: Room[]
  allRooms: Room[]
  isLoading: boolean
  error: string | null
}

export function useRooms(
  filters: RoomFilters,
) {
  const [revision, setRevision] = useState(0)

  const [state, setState] =
    useState<RoomsState>({
      rooms: [],
      allRooms: [],
      isLoading: true,
      error: null,
    })

  const refresh = useCallback(() => {
    setRevision((value) => value + 1)
  }, [])

  useEffect(() => {
    const controller = new AbortController()

    async function loadRooms() {
      setState((previous) => ({
        ...previous,
        isLoading: true,
        error: null,
      }))

      try {
        const hasFilters =
          Object.keys(filters).length > 0

        const allRoomsPromise =
          roomsApi.listAll(
            {},
            controller.signal,
          )

        const filteredRoomsPromise =
          hasFilters
            ? roomsApi.listAll(
                filters,
                controller.signal,
              )
            : allRoomsPromise

        const [allRooms, filteredRooms] =
          await Promise.all([
            allRoomsPromise,
            filteredRoomsPromise,
          ])

        if (controller.signal.aborted) {
          return
        }

        setState({
          allRooms: allRooms.filter(
            (room) => room.is_active,
          ),

          rooms: filteredRooms.filter(
            (room) => room.is_active,
          ),

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

    void loadRooms()

    return () => {
      controller.abort()
    }
  }, [filters, revision])

  const equipmentOptions = [
    ...new Set(
      state.allRooms.flatMap(
        (room) => room.equipment,
      ),
    ),
  ].sort((a, b) => a.localeCompare(b, 'fr'))

  return {
    ...state,
    equipmentOptions,
    refresh,
  }
}
