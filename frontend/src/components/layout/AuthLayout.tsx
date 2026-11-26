
import type { ReactNode } from 'react'

import {
  DoorOpen,
  CalendarDays,
  ShieldCheck,
  Users,
  ArrowRight,
} from 'lucide-react'

interface AuthLayoutProps {
  children: ReactNode
}

const features = [
  {
    icon: CalendarDays,
    title: 'Réservation simplifiée',
    description:
      'Trouvez et réservez une salle en quelques clics.',
  },
  {
    icon: Users,
    title: 'Disponibilité actualisée',
    description:
      'Consultez les salles disponibles selon vos besoins.',
  },
  {
    icon: ShieldCheck,
    title: 'Un espace sécurisé',
    description:
      'Vos accès et réservations sont protégés.',
  },
]

export function AuthLayout({
  children,
}: AuthLayoutProps) {
  return (
    <main className="min-h-screen bg-white lg:grid lg:grid-cols-2">

      <aside className="relative hidden min-h-screen overflow-hidden bg-slate-950 p-12 text-white lg:flex lg:flex-col lg:justify-between xl:p-16">

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-brand-600/25 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl"
        />

        <div className="relative z-10 flex items-center gap-3">

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 shadow-lg shadow-brand-900">
            <DoorOpen size={27} />
          </div>

          <span className="text-xl font-bold tracking-tight">
            RoomBooking
            <span className="text-brand-400">.</span>
          </span>

        </div>

        <div className="relative z-10 my-14">

          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-brand-300">
            <span className="h-2 w-2 rounded-full bg-brand-400" />
            Votre espace de travail
            <ArrowRight size={13} />
          </div>

          <h1 className="text-4xl font-bold leading-tight tracking-tight xl:text-6xl">
            Le bon espace.
            <br />
            <span className="text-brand-300">
              Au bon moment.
            </span>
          </h1>

          <p className="mt-6 max-w-md text-base leading-relaxed text-slate-400">
            Organisez vos réunions et retrouvez
            tous vos espaces de travail dans une
            plateforme simple et intuitive.
          </p>

          <div className="mt-12 space-y-6">

            {features.map((feature) => {
              const Icon = feature.icon

              return (
                <div
                  key={feature.title}
                  className="flex items-start gap-4"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-brand-300">
                    <Icon size={20} />
                  </div>

                  <div>
                    <h2 className="text-sm font-semibold">
                      {feature.title}
                    </h2>

                    <p className="mt-1 text-sm text-slate-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
              )
            })}

          </div>
        </div>

        <footer className="relative z-10 border-t border-white/10 pt-6 text-xs text-slate-500">
          RoomBooking — Plateforme cloud-native
        </footer>

      </aside>

      <section className="flex min-h-screen items-center justify-center px-6 py-12 sm:px-12">

        <div className="w-full max-w-md">

          <div className="mb-10 flex items-center gap-3 lg:hidden">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600 text-white">
              <DoorOpen size={24} />
            </div>

            <span className="text-xl font-bold tracking-tight text-slate-900">
              RoomBooking
              <span className="text-brand-600">.</span>
            </span>

          </div>

          {children}

          <p className="mt-12 text-center text-xs text-slate-400">
            RoomBooking © {new Date().getFullYear()}
            {' '}· Projet cloud-native BC3
          </p>

        </div>
      </section>
    </main>
  )
}
