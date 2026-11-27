
import {
  useEffect,
  useState,
} from 'react'

import { useSearchParams } from 'react-router-dom'

import {
  DoorOpen,
  RefreshCw,
  SearchX,
  CalendarDays,
} from 'lucide-react'

import { roomsApi } from '../api/rooms'
import { getApiError } from '../api/client'

import { useRooms } from '../hooks/useRooms'

import type {
  Room,
  RoomFilters as ApiRoomFilters,
} from '../types/room'

import {
  createDefaultFilters,
  buildRoomFilters,
} from '../utils/booking'

import type {
  RoomSearchValues,
  BookingSlot,
} from '../utils/booking'

import {
  formatDateTime,
} from '../utils/format'

import {
  RoomFilters,
} from '../components/rooms/RoomFilters'

import {
  RoomCard,
} from '../components/rooms/RoomCard'

import {
  RoomDetailsModal,
} from '../components/rooms/RoomDetailsModal'

import {
  LoadingState,
} from '../components/ui/LoadingState'

import {
  EmptyState,
} from '../components/ui/EmptyState'

import {
  ErrorState,
} from '../components/ui/ErrorState'

import { Button } from '../components/ui/Button'

interface SelectedRoomState {
  id: number
  room: Room | null
  error: string | null
}

export default function RoomsPage() {
  const [searchParams, setSearchParams] =
    useSearchParams()

const [initialSearch] = useState(() => {
  const defaults = createDefaultFilters()

  const start = searchParams.get('start')
  const end = searchParams.get('end')

  if (!start || !end) {
    return {
      values: defaults,
      filters: {} as ApiRoomFilters,
      slot: undefined as BookingSlot | undefined,
    }
  }

  const candidate: RoomSearchValues = {
    ...defaults,
    onlyAvailable: true,
    start,
    end,
  }

  try {
    return {
      values: candidate,

      filters: buildRoomFilters(candidate),

      slot: {
        start,
        end,
      } as BookingSlot,
    }
  } catch {
    return {
      values: defaults,
      filters: {} as ApiRoomFilters,
      slot: undefined as BookingSlot | undefined,
    }
  }
})

const [values, setValues] =
  useState<RoomSearchValues>(
    initialSearch.values,
  )

const [appliedFilters, setAppliedFilters] =
  useState<ApiRoomFilters>(
    initialSearch.filters,
  )

const [appliedSlot, setAppliedSlot] =
  useState<BookingSlot | undefined>(
    initialSearch.slot,
  )

  const [filterError, setFilterError] =
    useState<string | null>(null)

  const [selectedRoom, setSelectedRoom] =
    useState<SelectedRoomState | null>(null)

  const [detailRevision, setDetailRevision] =
    useState(0)

  const {
    rooms,
    equipmentOptions,
    isLoading,
    error,
    refresh,
  } = useRooms(appliedFilters)

  const rawRoomId = searchParams.get('roomId')

  const numericRoomId =
    rawRoomId === null
      ? null
      : Number(rawRoomId)

  const roomId =
    numericRoomId !== null &&
    Number.isSafeInteger(numericRoomId) &&
    numericRoomId > 0
      ? numericRoomId
      : null

  const currentDetail =
    selectedRoom?.id === roomId
      ? selectedRoom
      : null

  useEffect(() => {
    if (roomId === null) {
      return
    }

    const controller = new AbortController()

    async function loadSelectedRoom() {
      try {
        const room =
          await roomsApi.getById(
            roomId!,
            controller.signal,
          )

        if (!controller.signal.aborted) {
          setSelectedRoom({
            id: roomId!,
            room,
            error: null,
          })
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setSelectedRoom({
            id: roomId!,
            room: null,
            error: getApiError(err),
          })
        }
      }
    }

    void loadSelectedRoom()

    return () => {
      controller.abort()
    }
  }, [roomId, detailRevision])

  function handleSearch() {
    try {
      const filters = buildRoomFilters(values)

      setFilterError(null)
      setAppliedFilters(filters)

      setAppliedSlot(
        values.onlyAvailable
          ? {
              start: values.start,
              end: values.end,
            }
          : undefined,
      )
    } catch (err) {
      setFilterError(
        err instanceof Error
          ? err.message
          : 'Les filtres sont invalides.',
      )
    }
  }

  function handleReset() {
  setValues(createDefaultFilters())
  setAppliedFilters({})
  setAppliedSlot(undefined)
  setFilterError(null)

  setSearchParams(
    (previous) => {
      const next = new URLSearchParams(previous)

      next.delete('start')
      next.delete('end')

      return next
    },
    { replace: true },
  )
}

  function handleRefresh() {
    if (appliedSlot) {
      try {
        const validatedFilters =
          buildRoomFilters({
            search: appliedFilters.search || '',

            minCapacity:
              appliedFilters.min_capacity
                ?.toString() || '',

            equipment:
              appliedFilters.equipment || '',

            onlyAvailable: true,
            ...appliedSlot,
          })

        setAppliedFilters(validatedFilters)
        setFilterError(null)
      } catch (err) {
        setFilterError(
          err instanceof Error
            ? err.message
            : 'Le créneau doit être actualisé.',
        )
      }

      return
    }

    refresh()
  }

  function openRoom(room: Room) {
    setSelectedRoom({
      id: room.id,
      room,
      error: null,
    })

    setSearchParams((previous) => {
      const next = new URLSearchParams(previous)

      next.set(
        'roomId',
        String(room.id),
      )

      return next
    })
  }

  function closeRoom() {
    setSelectedRoom(null)

    setSearchParams(
      (previous) => {
        const next =
          new URLSearchParams(previous)

        next.delete('roomId')

        return next
      },
      { replace: true },
    )
  }

  function retryRoomDetails() {
    setSelectedRoom(null)
    setDetailRevision(
      (value) => value + 1,
    )
  }

  const availabilityChecked =
    Boolean(
      appliedFilters.start_time &&
      appliedFilters.end_time,
    )

  return (
    <div className="space-y-7">

      <section className="relative overflow-hidden rounded-2xl bg-slate-950 p-7 text-white sm:p-9">

        <div
          aria-hidden="true"
          className="absolute -right-20 -top-28 h-80 w-80 rounded-full bg-brand-600/30 blur-3xl"
        />

        <div className="relative z-10 flex items-center justify-between gap-5">

          <div>

            <span className="text-xs font-semibold uppercase tracking-widest text-brand-300">
              Catalogue des espaces
            </span>

            <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-4xl">
              Trouvez votre espace idéal.
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-400">
              Des espaces adaptés à toutes vos réunions.
              Recherchez, comparez et réservez une salle
              en quelques clics.
            </p>

          </div>

          <div className="hidden h-24 w-24 shrink-0 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-brand-300 sm:flex">
            <DoorOpen
              size={51}
              strokeWidth={1.3}
            />
          </div>

        </div>

      </section>

      <RoomFilters
        values={values}
        equipmentOptions={equipmentOptions}
        isLoading={isLoading}
        error={filterError}
        onChange={setValues}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      <section>

        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">

          <div>

            <h2 className="text-lg font-bold text-slate-900">
              {isLoading
                ? 'Recherche des salles...'
                : error
                  ? 'Catalogue des salles'
                  : `${rooms.length} salle${rooms.length !== 1 ? 's' : ''} de réunion`}
            </h2>

            {availabilityChecked &&
              appliedSlot && (
                <p className="mt-2 flex items-center gap-2 text-xs text-slate-500">

                  <CalendarDays size={15} />

                  {formatDateTime(
                    appliedSlot.start,
                  )}

                  {' — '}

                  {formatDateTime(
                    appliedSlot.end,
                  )}

                </p>
              )}

          </div>

          <Button
            variant="secondary"
            onClick={handleRefresh}
            loading={isLoading}
            className="min-h-10 px-4 py-2"
          >
            {!isLoading && (
              <RefreshCw size={16} />
            )}

            Actualiser
          </Button>

        </div>

        {isLoading ? (
          <LoadingState
            message="Recherche des espaces disponibles..."
          />
        ) : error ? (
          <ErrorState
            message={error}
            onRetry={handleRefresh}
          />
        ) : rooms.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white">

            <EmptyState
              icon={SearchX}
              title="Aucune salle trouvée"
              description="Modifiez vos filtres ou choisissez un autre créneau."
              action={
                <Button
                  variant="secondary"
                  onClick={handleReset}
                >
                  Réinitialiser les filtres
                </Button>
              }
            />

          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">

            {rooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                availabilityChecked={
                  availabilityChecked
                }
                onSelect={openRoom}
              />
            ))}

          </div>
        )}

      </section>

      {rawRoomId !== null &&
        roomId === null && (
          <div role="alert">
            <p className="text-sm text-red-600">
              Identifiant de salle invalide.
            </p>

            <Button
              variant="secondary"
              className="mt-3"
              onClick={closeRoom}
            >
              Fermer
            </Button>
          </div>
        )}

      {roomId !== null &&
        !currentDetail && (
          <div className="space-y-3">

            <LoadingState
              message="Chargement de la salle..."
            />

            <Button
              variant="secondary"
              onClick={closeRoom}
            >
              Annuler l'ouverture
            </Button>

          </div>
        )}

      {currentDetail?.error && (
        <div className="space-y-3">

          <ErrorState
            message={currentDetail.error}
            onRetry={retryRoomDetails}
          />

          <Button
            variant="secondary"
            onClick={closeRoom}
          >
            Fermer
          </Button>

        </div>
      )}

      {currentDetail?.room && (
        <RoomDetailsModal
          key={currentDetail.room.id}
          room={currentDetail.room}
          initialSlot={appliedSlot}
          onClose={closeRoom}
          onBooked={() => refresh()}
          onConflict={refresh}
        />
      )}

    </div>
  )
}
