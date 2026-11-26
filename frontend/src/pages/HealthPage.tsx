
import { useEffect, useState } from 'react'
import {
  DoorOpen,
  Server,
  Database,
  CheckCircle2,
  XCircle,
  Loader2,
  RefreshCw,
  Layers,
  ShieldCheck,
} from 'lucide-react'

type ConnectionStatus = 'loading' | 'online' | 'offline'

interface HealthResponse {
  status: string
  database: string
}

function App() {
  const [apiStatus, setApiStatus] =
    useState<ConnectionStatus>('loading')

  const [databaseStatus, setDatabaseStatus] =
    useState<ConnectionStatus>('loading')

  const [checkId, setCheckId] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    async function checkHealth() {
      try {
        const response = await fetch('/health/live', {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error('API unavailable')
        }

        setApiStatus('online')
      } catch {
        if (controller.signal.aborted) return

        setApiStatus('offline')
        setDatabaseStatus('offline')
        return
      }

      try {
        const response = await fetch('/health/ready', {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error('Database unavailable')
        }

        const data: HealthResponse = await response.json()

        setDatabaseStatus(
          data.database === 'connected'
            ? 'online'
            : 'offline'
        )
      } catch {
        if (controller.signal.aborted) return

        setDatabaseStatus('offline')
      }
    }

    void checkHealth()

    return () => controller.abort()
  }, [checkId])

  function refreshHealth() {
    setApiStatus('loading')
    setDatabaseStatus('loading')
    setCheckId((previous) => previous + 1)
  }

  const allOnline =
    apiStatus === 'online' &&
    databaseStatus === 'online'

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5 py-12">
      <div className="w-full max-w-2xl">

        <div className="mb-8 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-brand-600 text-white shadow-xl shadow-brand-200">
            <DoorOpen size={40} strokeWidth={1.7} />
          </div>

          <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600">
            <Layers size={14} />
            PROJET CLOUD-NATIVE
          </span>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            RoomBooking<span className="text-brand-600">.</span>
          </h1>

          <p className="mt-3 text-slate-500">
            Votre espace de réservation de salles.
          </p>
        </div>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                État des services
              </h2>

              <p className="text-sm text-slate-500">
                Diagnostic de l'environnement local
              </p>
            </div>

            <button
              type="button"
              onClick={refreshHealth}
              aria-label="Actualiser les services"
              className="rounded-xl border border-slate-200 p-3 text-slate-500 transition hover:bg-brand-50 hover:text-brand-600"
            >
              <RefreshCw size={18} />
            </button>
          </div>

          <div className="space-y-3">

            <ServiceCard
              name="Front-end React"
              description="React, TypeScript et Vite"
              status="online"
              icon={<Layers size={22} />}
            />

            <ServiceCard
              name="API FastAPI"
              description="Serveur REST Python"
              status={apiStatus}
              icon={<Server size={22} />}
            />

            <ServiceCard
              name="PostgreSQL"
              description="Base de données relationnelle"
              status={databaseStatus}
              icon={<Database size={22} />}
            />

          </div>

          {allOnline && (
            <div
              role="status"
              className="mt-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700"
            >
              <ShieldCheck size={24} />

              <div>
                <p className="font-semibold">
                  Tous les services sont opérationnels
                </p>

                <p className="mt-1 text-xs">
                  La communication front-end / back-end
                  est fonctionnelle.
                </p>
              </div>
            </div>
          )}
        </section>

        <footer className="mt-8 text-center text-xs text-slate-400">
          RoomBooking · Projet BC3 · Version de développement
        </footer>
      </div>
    </main>
  )
}

interface ServiceCardProps {
  name: string
  description: string
  status: ConnectionStatus
  icon: React.ReactNode
}

function ServiceCard({
  name,
  description,
  status,
  icon,
}: ServiceCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="font-semibold text-slate-800">
          {name}
        </p>

        <p className="text-xs text-slate-500">
          {description}
        </p>
      </div>

      {status === 'loading' && (
        <Loader2
          aria-label="Chargement"
          className="animate-spin text-slate-400"
          size={22}
        />
      )}

      {status === 'online' && (
        <div className="flex items-center gap-2 text-sm font-medium text-emerald-600">
          <CheckCircle2 size={19} />
          <span className="hidden sm:inline">
            En ligne
          </span>
        </div>
      )}

      {status === 'offline' && (
        <div className="flex items-center gap-2 text-sm font-medium text-red-500">
          <XCircle size={19} />
          <span className="hidden sm:inline">
            Hors ligne
          </span>
        </div>
      )}
    </div>
  )
}

export default App
