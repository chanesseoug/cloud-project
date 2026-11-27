
import type { LucideIcon } from 'lucide-react'

import clsx from 'clsx'

interface StatCardProps {
  title: string
  value: number
  description: string
  icon: LucideIcon

  color?:
    | 'indigo'
    | 'emerald'
    | 'blue'
    | 'amber'
}

const colors = {
  indigo:
    'bg-indigo-50 text-indigo-600',

  emerald:
    'bg-emerald-50 text-emerald-600',

  blue:
    'bg-blue-50 text-blue-600',

  amber:
    'bg-amber-50 text-amber-600',
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  color = 'indigo',
}: StatCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">

      <div className="flex items-center justify-between">

        <div
          className={clsx(
            'flex h-12 w-12 items-center justify-center rounded-xl',
            colors[color],
          )}
        >
          <Icon
            size={23}
            strokeWidth={1.8}
            aria-hidden="true"
          />
        </div>

      </div>

      <p className="mt-5 text-sm font-medium text-slate-500">
        {title}
      </p>

      <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
        {value}
      </p>

      <p className="mt-2 text-xs leading-relaxed text-slate-400">
        {description}
      </p>

    </article>
  )
}
