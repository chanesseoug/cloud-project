
import { useState } from 'react'

import {
  ShieldCheck,
  LayoutDashboard,
  DoorOpen,
  Users,
  CalendarCheck,
  RefreshCw,
} from 'lucide-react'

import clsx from 'clsx'

import type {
  AdminTab,
} from '../../types/admin'

import {
  useAdmin,
} from '../../hooks/useAdmin'

import {
  AdminOverview,
} from '../../components/admin/AdminOverview'

import {
  AdminRooms,
} from '../../components/admin/AdminRooms'

import {
  AdminUsers,
} from '../../components/admin/AdminUsers'

import {
  AdminReservations,
} from '../../components/admin/AdminReservations'

import {
  LoadingState,
} from '../../components/ui/LoadingState'

import {
  ErrorState,
} from '../../components/ui/ErrorState'

import {
  Button,
} from '../../components/ui/Button'

const tabs = [
  {
    value: 'overview',
    label: "Vue d'ensemble",
    icon: LayoutDashboard,
  },
  {
    value: 'rooms',
    label: 'Gestion des salles',
    icon: DoorOpen,
  },
  {
    value: 'users',
    label: 'Utilisateurs',
    icon: Users,
  },
  {
    value: 'reservations',
    label: 'Réservations',
    icon: CalendarCheck,
  },
] as const

export default function AdminPage() {
  const [tab, setTab] =
    useState<AdminTab>('overview')

  const {
    stats,
    rooms,
    users,
    reservations,
    now,
    isLoading,
    error,
    refresh,
  } = useAdmin()

  return (
    <div className="space-y-7">

      <section className="relative overflow-hidden rounded-2xl bg-slate-950 p-7 text-white sm:p-9">

        <div
          aria-hidden="true"
          className="absolute -right-20 -top-32 h-96 w-96 rounded-full bg-brand-600/30 blur-3xl"
        />

        <div className="relative z-10 flex items-center justify-between gap-6">

          <div>

            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-brand-300">
              <ShieldCheck size={14} />
              Espace administrateur
            </span>

            <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Centre d'administration
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-400">
              Supervisez votre plateforme RoomBooking,
              gérez vos espaces et consultez
              les réservations de vos utilisateurs.
            </p>

          </div>

          <div
            aria-hidden="true"
            className="hidden h-24 w-24 shrink-0 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-brand-300 sm:flex"
          >
            <ShieldCheck
              size={51}
              strokeWidth={1.3}
            />
          </div>

        </div>

      </section>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">

        <nav
          aria-label="Navigation administrative"
          className="flex flex-wrap gap-1.5"
        >

          {tabs.map((item) => {
            const Icon = item.icon

            return (
              <button
                key={item.value}
                type="button"
                aria-pressed={tab === item.value}
                onClick={() =>
                  setTab(item.value)
                }
                className={clsx(
                  'inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition',

                  tab === item.value
                    ? 'bg-brand-600 text-white'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900',
                )}
              >
                <Icon size={17} />

                {item.label}
              </button>
            )
          })}

        </nav>

        <Button
          variant="secondary"
          loading={isLoading}
          onClick={refresh}
        >
          {!isLoading && (
            <RefreshCw size={17} />
          )}

          Actualiser
        </Button>

      </div>

      {isLoading ? (
        <LoadingState
          message="Chargement des données administrateur..."
        />
      ) : error ? (
        <ErrorState
          message={error}
          onRetry={refresh}
        />
      ) : stats ? (
        <>

          {tab === 'overview' && (
            <AdminOverview stats={stats} />
          )}

          {tab === 'rooms' && (
            <AdminRooms
              rooms={rooms}
              reservations={reservations}
              now={now}
              onChanged={refresh}
            />
          )}

          {tab === 'users' && (
            <AdminUsers
              users={users}
              reservations={reservations}
            />
          )}

          {tab === 'reservations' && (
            <AdminReservations
              reservations={reservations}
              rooms={rooms}
              users={users}
              now={now}
              onChanged={refresh}
            />
          )}

        </>
      ) : null}

      <footer className="pb-2 text-center text-xs text-slate-400">
        RoomBooking · Administration de la plateforme
      </footer>

    </div>
  )
}
