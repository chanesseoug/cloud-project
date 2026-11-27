
import { Link } from 'react-router-dom'

import {
  Construction,
  ArrowLeft,
} from 'lucide-react'

interface PlaceholderPageProps {
  title: string
  description: string
}

export default function PlaceholderPage({
  title,
  description,
}: PlaceholderPageProps) {
  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          {title}
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          {description}
        </p>
      </div>

      <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">

        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-brand-50 text-brand-600">
          <Construction
            size={37}
            strokeWidth={1.5}
          />
        </div>

        <h2 className="mt-6 text-xl font-bold text-slate-900">
          Fonctionnalité en développement
        </h2>

        <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-500">
          Cette section sera disponible
          lors des prochaines étapes
          de développement de RoomBooking.
        </p>

        <Link
          to="/dashboard"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          <ArrowLeft size={17} />
          Retour au tableau de bord
        </Link>

      </div>

    </div>
  )
}
