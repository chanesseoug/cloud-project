
import { Link } from 'react-router-dom'

import {
  DoorOpen,
  Users,
  ArrowRight,
  Monitor,
} from 'lucide-react'

import type { Room } from '../../types/room'

import { EmptyState } from '../ui/EmptyState'

interface RoomPreviewProps {
  rooms: Room[]
}

export function RoomPreview({
  rooms,
}: RoomPreviewProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">

      <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-5 sm:px-6">

        <div>
          <h2 className="text-base font-bold text-slate-900">
            Salles disponibles
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            Pour les 30 prochaines minutes
          </p>
        </div>

        <Link
          to="/rooms"
          className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-800"
        >
          Voir tout
          <ArrowRight size={14} />
        </Link>

      </div>

      {rooms.length === 0 ? (
        <EmptyState
          icon={DoorOpen}
          title="Aucune salle disponible"
          description="Consultez le catalogue pour rechercher un autre créneau."
          action={
            <Link
              to="/rooms"
              className="text-sm font-semibold text-brand-600 hover:text-brand-800"
            >
              Voir le catalogue
            </Link>
          }
        />
      ) : (
        <div className="divide-y divide-slate-100">

          {rooms.slice(0, 4).map((room) => (
            <article
              key={room.id}
              className="flex flex-wrap items-center gap-4 px-5 py-4 transition hover:bg-slate-50 sm:flex-nowrap sm:px-6"
            >

              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-indigo-100 text-brand-500">
                <Monitor size={27} strokeWidth={1.5} />
              </div>

              <div className="min-w-0 flex-1">

                <h3 className="truncate text-sm font-semibold text-slate-900">
                  {room.name}
                </h3>

                <p className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500">
                  <Users size={14} />

                  {room.capacity} personnes
                </p>

                {room.equipment.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">

                    {room.equipment
                      .slice(0, 2)
                      .map((equipment, index) => (
                        <span
                          key={`${equipment}-${index}`}
                          className="rounded-md bg-slate-100 px-2 py-1 text-[10px] text-slate-500"
                        >
                          {equipment}
                        </span>
                      ))}

                  </div>
                )}

              </div>

              <Link
                to={`/rooms?roomId=${room.id}`}
                className="rounded-lg bg-brand-50 px-3.5 py-2.5 text-xs font-semibold text-brand-700 transition hover:bg-brand-100"
              >
                Voir la salle
              </Link>

            </article>
          ))}

        </div>
      )}

    </section>
  )
}
