
import { useState } from 'react'

import type { FormEvent } from 'react'

import {
  Link,
  Navigate,
  useNavigate,
} from 'react-router-dom'

import {
  Mail,
  LockKeyhole,
  ArrowRight,
  AlertCircle,
} from 'lucide-react'

import { AuthLayout } from '../../components/layout/AuthLayout'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'

import { useAuth } from '../../hooks/useAuth'
import { getApiError } from '../../api/client'

export default function LoginPage() {
  const { login, isAuthenticated, isLoading } =
    useAuth()

  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [submitting, setSubmitting] =
    useState(false)

  const [error, setError] = useState('')

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    if (submitting) return

    setError('')

    if (!email.trim() || !password) {
      setError(
        'Veuillez renseigner tous les champs.',
      )

      return
    }

    setSubmitting(true)

    try {
      await login({
        email: email.trim(),
        password,
      })

      navigate('/dashboard', {
        replace: true,
      })
    } catch (err) {
      setError(getApiError(err))
    } finally {
      setSubmitting(false)
    }
  }

  if (!isLoading && isAuthenticated) {
    return (
      <Navigate to="/dashboard" replace />
    )
  }

  return (
    <AuthLayout>

      <div className="mb-8">

        <span className="text-sm font-semibold text-brand-600">
          Votre espace personnel
        </span>

        <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
          Bon retour !
        </h1>

        <p className="mt-3 text-sm leading-relaxed text-slate-500">
          Connectez-vous pour accéder à vos salles
          et gérer vos réservations.
        </p>

      </div>

      {error && (
        <div
          role="alert"
          className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <AlertCircle
            size={18}
            className="mt-0.5 shrink-0"
          />

          <p>{error}</p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >

        <Input
          label="Adresse e-mail"
          type="email"
          placeholder="vous@entreprise.fr"
          autoComplete="email"
          icon={<Mail size={18} />}
          value={email}
          onChange={(event) =>
            setEmail(event.target.value)
          }
          required
        />

        <Input
          label="Mot de passe"
          type="password"
          placeholder="Votre mot de passe"
          autoComplete="current-password"
          icon={<LockKeyhole size={18} />}
          value={password}
          onChange={(event) =>
            setPassword(event.target.value)
          }
          required
        />

        <Button
          type="submit"
          loading={submitting}
          disabled={isLoading}
          className="mt-2 w-full"
        >
          {submitting
            ? 'Connexion en cours...'
            : 'Se connecter'}

          {!submitting && (
            <ArrowRight size={17} />
          )}
        </Button>

      </form>

      <div className="mt-8 border-t border-slate-100 pt-6 text-center text-sm text-slate-500">
        Pas encore de compte ?{' '}

        <Link
          to="/register"
          className="font-semibold text-brand-600 transition hover:text-brand-800"
        >
          Créer un compte
        </Link>
      </div>

    </AuthLayout>
  )
}
