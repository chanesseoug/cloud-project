
import {
  Link,
  useLocation,
} from 'react-router-dom'

import {
  Menu,
  CalendarDays,
  ChevronDown,
} from 'lucide-react'

import { useAuth } from '../../hooks/useAuth'

import {
  formatDay,
  getInitials,
} from '../../utils/format'

interface HeaderProps {
  onOpenMenu: () => void
  currentDate: Date
}

const pageTitles: Record<string, string> = {
  '/dashboard': 'Tableau de bord',
  '/rooms': 'Salles de réunion',
  '/calendar': 'Calendrier',
  '/reservations': 'Mes réservations',
  '/profile': 'Mon profil',
  '/admin': 'Administration',
}

export function Header({
  onOpenMenu,
  currentDate,
}: HeaderProps) {
  const location = useLocation()
  const { user } = useAuth()

  const title =
    pageTitles[location.pathname] ||
    'RoomBooking'

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between gap-4 border-b border-slate-200 bg-white/95 px-5 backdrop-blur-md sm:px-8">

      <div className="flex min-w-0 items-center gap-4">

        <button
          type="button"
          aria-label="Ouvrir le menu"
          onClick={onOpenMenu}
          className="rounded-xl border border-slate-200 p-2.5 text-slate-600 transition hover:bg-slate-100 lg:hidden"
        >
          <Menu size={21} />
        </button>

        <div className="min-w-0">

          <p className="hidden text-[10px] font-semibold uppercase tracking-widest text-slate-400 sm:block">
            Espace de travail
          </p>

          <p className="truncate text-sm font-semibold text-slate-900 sm:mt-1">
            {title}
          </p>

        </div>
      </div>

      <div className="flex shrink-0 items-center gap-5">

        <div className="hidden items-center gap-2 text-xs capitalize text-slate-500 xl:flex">
          <CalendarDays size={16} />

          {formatDay(currentDate)}
        </div>

        <Link
          to="/profile"
          aria-label="Accéder à mon profil"
          className="flex items-center gap-3 rounded-xl p-1.5 transition hover:bg-slate-50"
        >

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-sm font-bold text-brand-700">
            {getInitials(
              user?.full_name || 'RoomBooking',
            )}
          </div>

          <div className="hidden max-w-36 sm:block">

            <p className="truncate text-xs font-semibold text-slate-800">
              {user?.full_name}
            </p>

            <p className="mt-0.5 text-[11px] text-slate-500">
              {user?.role === 'admin'
                ? 'Administrateur'
                : 'Mon compte'}
            </p>

          </div>

          <ChevronDown
            size={15}
            className="hidden text-slate-400 sm:block"
          />

        </Link>

      </div>

    </header>
  )
}
