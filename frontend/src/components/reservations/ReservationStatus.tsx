import clsx from 'clsx'

import {
  Clock,
  PlayCircle,
  CheckCircle2,
  XCircle,
} from 'lucide-react'

import type {
  ReservationPhase,
} from '../../utils/reservations'

interface ReservationStatusProps {
  phase: ReservationPhase
}

const statuses = {
  upcoming: {
    label: 'À venir',
    icon: Clock,
    color: 'bg-emerald-50 text-emerald-700',
  },

  ongoing: {
    label: 'En cours',
    icon: PlayCircle,
    color: 'bg-blue-50 text-blue-700',
  },

  completed: {
    label: 'Terminée',
    icon: CheckCircle2,
    color: 'bg-slate-100 text-slate-600',
  },

  cancelled: {
    label: 'Annulée',
    icon: XCircle,
    color: 'bg-red-50 text-red-700',
  },
}

export function ReservationStatus({
  phase,
}: ReservationStatusProps) {
  const status = statuses[phase]
  const Icon = status.icon

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold',
        status.color,
      )}
    >
      <Icon size={13} aria-hidden="true" />
      {status.label}
    </span>
  )
}