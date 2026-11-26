
import { Link } from 'react-router-dom'

import {
  DoorOpen,
  LogOut,
  ShieldCheck,
  UserRound,
  Mail,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react'

import { useAuth } from '../hooks/useAuth'
import { Button } from '../components/ui/Button'

export default function DashboardPage() {
  const { user, isAdmin, logout } = useAuth()

  if (!user) {
    return null
  }

  return (
    <main className="min-h-screen bg-slate-50">

      <header className="border-b border-slate-200 bg-white">

        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-5">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600 text-white">
              <DoorOpen size={24} />
            </div>

            <span className="font-bold tracking-tight text-slate-900 sm:text-xl">
              RoomBooking
              <span className="text-brand-600">.</span>
            </span>

          </div>

          <Button
            variant="secondary"
            onClick={logout}
          >
            <LogOut size={17} />

            <span className="hidden sm:inline">
              Déconnexion
            </span>
          </Button>

        </div>

      </header>

      <div className="mx-auto max-w-6xl px-5 py-10 sm:py-16">

        <div className="rounded-3xl bg-slate-950 p-8 text-white sm:p-12">

          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs text-brand-300">
            <CheckCircle2 size={14} />
            Session authentifiée
          </span>

          <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
            Bienvenue, {user.full_name} !
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-400">
            Votre espace de réservation est prêt.
            Vous êtes connecté de manière sécurisée
            à RoomBooking.
          </p>

        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <UserRound
              size={24}
              className="text-brand-600"
            />

            <p className="mt-4 text-sm text-slate-500">
              Nom complet
            </p>

            <p className="mt-1 break-words font-semibold text-slate-900">
              {user.full_name}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <Mail
              size={24}
              className="text-brand-600"
            />

            <p className="mt-4 text-sm text-slate-500">
              Adresse e-mail
            </p>

            <p className="mt-1 break-all font-semibold text-slate-900">
              {user.email}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <ShieldCheck
              size={24}
              className="text-brand-600"
            />

            <p className="mt-4 text-sm text-slate-500">
              Niveau d'accès
            </p>

            <p className="mt-1 font-semibold text-slate-900">
              {isAdmin
                ? 'Administrateur'
                : 'Utilisateur'}
            </p>
          </div>

        </div>

        {isAdmin && (
          <Link
            to="/admin"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            Accéder à l'administration
            <ArrowRight size={17} />
          </Link>
        )}

        <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-800">

          <div className="flex items-center gap-3">
            <ShieldCheck size={23} />

            <strong>
              Authentification opérationnelle
            </strong>
          </div>

          <p className="mt-2 text-sm">
            Votre profil provient directement de
            l'API FastAPI et de PostgreSQL.
          </p>

        </div>

      </div>
    </main>
  )
}
