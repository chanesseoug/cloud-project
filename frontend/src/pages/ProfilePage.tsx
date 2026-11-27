
import {
  UserRound,
  Mail,
  ShieldCheck,
  CalendarDays,
  CheckCircle2,
  LogOut,
} from 'lucide-react'

import { useAuth } from '../hooks/useAuth'

import {
  getInitials,
  formatDate,
} from '../utils/format'

import { Button } from '../components/ui/Button'

export default function ProfilePage() {
  const {
    user,
    isAdmin,
    logout,
  } = useAuth()

  if (!user) {
    return null
  }

  const fields = [
    {
      label: 'Nom complet',
      value: user.full_name,
      icon: UserRound,
    },
    {
      label: 'Adresse e-mail',
      value: user.email,
      icon: Mail,
    },
    {
      label: 'Rôle',
      value: isAdmin
        ? 'Administrateur'
        : 'Utilisateur',
      icon: ShieldCheck,
    },
    {
      label: "Date d'inscription",
      value: formatDate(user.created_at),
      icon: CalendarDays,
    },
  ]

  return (
    <div className="mx-auto max-w-4xl space-y-6">

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Mon profil
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Retrouvez les informations
          de votre compte RoomBooking.
        </p>
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="h-28 bg-gradient-to-r from-slate-950 via-brand-900 to-brand-600" />

        <div className="px-6 pb-7 sm:px-8">

          <div className="-mt-10 flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-white bg-brand-100 text-2xl font-bold text-brand-700 shadow-sm">
            {getInitials(user.full_name)}
          </div>

          <h2 className="mt-4 break-words text-xl font-bold text-slate-900">
            {user.full_name}
          </h2>

          <p className="mt-1 break-all text-sm text-slate-500">
            {user.email}
          </p>

          <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
            <CheckCircle2 size={14} />

            {user.is_active
              ? 'Compte actif'
              : 'Compte inactif'}
          </span>

        </div>

      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

        <h2 className="text-lg font-bold text-slate-900">
          Informations personnelles
        </h2>

        <dl className="mt-6 grid gap-5 sm:grid-cols-2">

          {fields.map((field) => {
            const Icon = field.icon

            return (
              <div
                key={field.label}
                className="flex items-start gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4"
              >

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-brand-600 shadow-sm">
                  <Icon size={18} />
                </div>

                <div className="min-w-0">

                  <dt className="text-xs text-slate-500">
                    {field.label}
                  </dt>

                  <dd className="mt-1 break-words text-sm font-semibold text-slate-800">
                    {field.value}
                  </dd>

                </div>

              </div>
            )
          })}

        </dl>

      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

        <h2 className="text-lg font-bold text-slate-900">
          Sécurité et session
        </h2>

        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          Votre session est protégée par
          un token JWT à durée de validité limitée.
          Vous pouvez vous déconnecter à tout moment.
        </p>

        <Button
          variant="danger"
          className="mt-5"
          onClick={logout}
        >
          <LogOut size={17} />
          Se déconnecter
        </Button>

      </section>

    </div>
  )
}
