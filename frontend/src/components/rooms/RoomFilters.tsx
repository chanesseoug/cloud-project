
import type { FormEvent } from 'react'

import {
  Search,
  Users,
  Monitor,
  SlidersHorizontal,
  RotateCcw,
  CalendarDays,
} from 'lucide-react'

import { Button } from '../ui/Button'
import { Input } from '../ui/Input'

import type {
  RoomSearchValues,
} from '../../utils/booking'

interface RoomFiltersProps {
  values: RoomSearchValues
  equipmentOptions: string[]
  isLoading: boolean
  error: string | null

  onChange: (
    values: RoomSearchValues,
  ) => void

  onSearch: () => void
  onReset: () => void
}

const selectClassName =
  'min-h-12 w-full rounded-xl border ' +
  'border-slate-200 bg-white px-4 py-3 ' +
  'text-sm text-slate-700 outline-none ' +
  'focus:border-brand-500 focus:ring-4 ' +
  'focus:ring-brand-100'

export function RoomFilters({
  values,
  equipmentOptions,
  isLoading,
  error,
  onChange,
  onSearch,
  onReset,
}: RoomFiltersProps) {
  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()
    onSearch()
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
    >

      <div className="flex items-center justify-between gap-3">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <SlidersHorizontal size={19} />
          </div>

          <div>
            <h2 className="font-semibold text-slate-900">
              Affiner votre recherche
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Trouvez la salle qui vous correspond.
            </p>
          </div>

        </div>

        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-brand-600"
        >
          <RotateCcw size={15} />
          Réinitialiser
        </button>

      </div>

      <div className="grid gap-4 md:grid-cols-3">

        <Input
          label="Rechercher une salle"
          placeholder="Nom, description..."
          icon={<Search size={17} />}
          value={values.search}
          onChange={(event) =>
            onChange({
              ...values,
              search: event.target.value,
            })
          }
        />

        <div className="space-y-2">

          <label
            htmlFor="room-min-capacity"
            className="flex items-center gap-2 text-sm font-medium text-slate-700"
          >
            <Users size={15} />
            Capacité minimale
          </label>

          <select
            id="room-min-capacity"
            value={values.minCapacity}
            className={selectClassName}
            onChange={(event) =>
              onChange({
                ...values,
                minCapacity: event.target.value,
              })
            }
          >
            <option value="">
              Toutes les capacités
            </option>

            {[2, 4, 6, 8, 10, 12, 20, 30, 40]
              .map((capacity) => (
                <option
                  key={capacity}
                  value={capacity}
                >
                  {capacity} personnes ou plus
                </option>
              ))}
          </select>

        </div>

        <div className="space-y-2">

          <label
            htmlFor="room-equipment"
            className="flex items-center gap-2 text-sm font-medium text-slate-700"
          >
            <Monitor size={15} />
            Équipement
          </label>

          <select
            id="room-equipment"
            value={values.equipment}
            className={selectClassName}
            onChange={(event) =>
              onChange({
                ...values,
                equipment: event.target.value,
              })
            }
          >
            <option value="">
              Tous les équipements
            </option>

            {equipmentOptions.map((equipment) => (
              <option
                key={equipment}
                value={equipment}
              >
                {equipment}
              </option>
            ))}

          </select>

        </div>

      </div>

      <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">

        <label className="flex cursor-pointer items-start gap-3">

          <input
            type="checkbox"
            checked={values.onlyAvailable}
            className="mt-1 h-4 w-4 accent-brand-600"
            onChange={(event) =>
              onChange({
                ...values,
                onlyAvailable:
                  event.target.checked,
              })
            }
          />

          <span>
            <span className="block text-sm font-semibold text-slate-700">
              Uniquement les salles disponibles
            </span>

            <span className="mt-1 block text-xs text-slate-500">
              Filtrer les salles selon un créneau précis.
            </span>
          </span>

        </label>

        {values.onlyAvailable && (
          <div className="mt-5 grid gap-4 sm:grid-cols-2">

            <Input
              label="Début du créneau"
              type="datetime-local"
              icon={<CalendarDays size={16} />}
              value={values.start}
              onChange={(event) =>
                onChange({
                  ...values,
                  start: event.target.value,
                })
              }
              required
            />

            <Input
              label="Fin du créneau"
              type="datetime-local"
              icon={<CalendarDays size={16} />}
              value={values.end}
              onChange={(event) =>
                onChange({
                  ...values,
                  end: event.target.value,
                })
              }
              required
            />

          </div>
        )}

      </div>

      {error && (
        <p
          role="alert"
          className="rounded-xl bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      <div className="flex justify-end">

        <Button
          type="submit"
          loading={isLoading}
          className="w-full sm:w-auto"
        >
          {!isLoading && <Search size={17} />}
          Rechercher
        </Button>

      </div>

    </form>
  )
}
