
import { NavLink } from 'react-router-dom'

import {
  DoorOpen,
  LayoutDashboard,
  CalendarDays,
  CalendarCheck,
  UserRound,
  ShieldCheck,
  LogOut,
  X,
  ChevronRight,
} from 'lucide-react'

import clsx from 'clsx'

import { useAuth } from '../../hooks/useAuth'
import { getInitials } from '../../utils/format'

interface SidebarProps {
  onClose: () => void
}

const navigation = [
  {
    label: 'Tableau de bord',
    path: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Salles de réunion',
    path: '/rooms',
    icon: DoorOpen,
  },
  {
    label: 'Calendrier',
    path: '/calendar',
    icon: CalendarDays,
  },
  {
    label: 'Mes réservations',
    path: '/reservations',
    icon: CalendarCheck,
  },
  {
    label: 'Mon profil',
    path: '/profile',
    icon: UserRound,
  },
]

export function Sidebar({
  onClose,
}: SidebarProps) {
  const {
    user,
    isAdmin,
    logout,
  } = useAuth()

  return (
    <aside className="flex h-full w-72 flex-col bg-slate-950 text-white">

      <div className="flex h-20 shrink-0 items-center justify-between border-b border-white/5 px-6">

        <NavLink
          to="/dashboard"
          onClick={onClose}
          className="flex items-center gap-3"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600 text-white shadow-lg shadow-brand-900/40">
            <DoorOpen size={25} />
          </div>

          <span className="text-xl font-bold tracking-tight">
            RoomBooking
            <span className="text-brand-400">.</span>
          </span>
        </NavLink>

        <button
          type="button"
          aria-label="Fermer le menu"
          onClick={onClose}
          className="rounded-lg p-2 text-slate-400 hover:bg-white/10 lg:hidden"
        >
          <X size={21} />
        </button>

      </div>

      <div className="flex-1 overflow-y-auto px-4 py-8">

        <p className="mb-4 px-3 text-[10px] font-semibold tracking-widest text-slate-500">
          ESPACE DE TRAVAIL
        </p>

        <nav
          aria-label="Navigation principale"
          className="space-y-1.5"
        >

          {navigation.map((item) => {
            const Icon = item.icon

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  clsx(
                    'group flex min-h-12 items-center gap-3 rounded-xl px-3.5 py-3',
                    'text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-brand-600 text-white shadow-lg shadow-brand-950/30'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white',
                  )
                }
              >
                <Icon size={19} />

                <span className="flex-1">
                  {item.label}
                </span>

                <ChevronRight
                  size={15}
                  className="opacity-0 transition-opacity group-hover:opacity-100"
                />
              </NavLink>
            )
          })}

        </nav>

        {isAdmin && (
          <div className="mt-10">

            <p className="mb-4 px-3 text-[10px] font-semibold tracking-widest text-slate-500">
              ADMINISTRATION
            </p>

            <NavLink
              to="/admin"
              onClick={onClose}
              className={({ isActive }) =>
                clsx(
                  'flex min-h-12 items-center gap-3 rounded-xl px-3.5 py-3',
                  'text-sm font-medium transition-colors',

                  isActive
                    ? 'bg-brand-600 text-white'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white',
                )
              }
            >
              <ShieldCheck size={19} />
              Administration
            </NavLink>

          </div>
        )}

      </div>

      <div className="shrink-0 border-t border-white/10 p-4">

        <NavLink
          to="/profile"
          onClick={onClose}
          className="flex items-center gap-3 rounded-xl p-3 transition hover:bg-white/5"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-600/20 text-sm font-bold text-brand-300">
            {getInitials(
              user?.full_name || 'RoomBooking',
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">
              {user?.full_name}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              {isAdmin
                ? 'Administrateur'
                : 'Utilisateur'}
            </p>
          </div>
        </NavLink>

        <button
          type="button"
          onClick={logout}
          className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut size={18} />
          Déconnexion
        </button>

      </div>

    </aside>
  )
}
