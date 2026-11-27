
import {
  Users,
  Monitor,
  ArrowRight,
  CheckCircle2,
  Presentation,
} from 'lucide-react'

import type { Room } from '../../types/room'

import { Button } from '../ui/Button'

interface RoomCardProps {
  room: Room
  availabilityChecked: boolean
  onSelect: (room: Room) => void
}

export function RoomCard({
  room,
  availabilityChecked,
  onSelect,
}: RoomCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">

      <div className="relative flex h-40 items-center justify-center overflow-hidden bg-gradient-to-br from-brand-50 via-indigo-100 to-blue-100">

        <div
          aria-hidden="true"
          className="absolute -right-10 -top-16 h-40 w-40 rounded-full border border-white/60 bg-white/25"
        />

        <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl border border-white/80 bg-white/65 text-brand-500 shadow-sm backdrop-blur-md">
          <Presentation
            size={50}
            strokeWidth={1.3}
            aria-hidden="true"
          />
        </div>

        {availabilityChecked && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm">
            <CheckCircle2 size={13} />
            Créneau disponible
          </span>
        )}

      </div>

      <div className="flex flex-1 flex-col p-5">

        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          {room.name}
        </h2>

        <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
          <Users size={17} />
          Jusqu'à {room.capacity} personnes
        </p>

        <p className="mt-4 line-clamp-2 min-h-10 text-sm leading-relaxed text-slate-500">
          {room.description ||
            'Un espace de réunion adapté à vos besoins.'}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">

          {room.equipment
            .slice(0, 4)
            .map((equipment, index) => (
              <span
                key={`${equipment}-${index}`}
                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs text-slate-600"
              >
                <Monitor size={12} />
                {equipment}
              </span>
            ))}

          {room.equipment.length > 4 && (
            <span className="rounded-lg bg-brand-50 px-2.5 py-1.5 text-xs text-brand-600">
              +{room.equipment.length - 4}
            </span>
          )}

          {room.equipment.length === 0 && (
            <span className="text-xs text-slate-400">
              Aucun équipement renseigné
            </span>
          )}

        </div>

        <div className="mt-auto pt-6">

          <Button
            onClick={() => onSelect(room)}
            className="w-full"
          >
            Voir et réserver
            <ArrowRight size={17} />
          </Button>

        </div>

      </div>

    </article>
  )
}