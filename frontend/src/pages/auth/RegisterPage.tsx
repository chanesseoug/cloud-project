
import { useState } from 'react'

import type { FormEvent } from 'react'

import {
  Link,
  Navigate,
  useNavigate,
} from 'react-router-dom'

import {
  UserRound,
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

interface FormErrors {
  full_name?: string
  email?: string
  password?: string
  confirmation?: string
}

export default function RegisterPage() {
  const {
    register,
    isAuthenticated,
    isLoading,
  } = useAuth()

  const navigate = useNavigate()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')

  const [errors, setErrors] =
    useState<FormErrors>({})

  const [error, setError] = useState('')

  const [submitting, setSubmitting] =
    useState(false)

  const passwordChecks = [
    password.length >= 12,
    /[a-z]/.test(password) && /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^a-zA-Z0-9]/.test(password),
  ]

  const strength = passwordChecks.filter(
    Boolean,
  ).length

  const strengthLabels = [
    '',
    'Faible',
    'Moyen',
    'Bon',
    'Robuste',
  ]

  const strengthColors = [
    'bg-slate-200',
    'bg-red-500',
    'bg-amber-500',
    'bg-brand-500',
    'bg-emerald-500',
  ]

  function validateForm(): boolean {
    const nextErrors: FormErrors = {}

    if (fullName.trim().length < 2) {
      nextErrors.full_name =
        'Veuillez saisir votre nom complet.'
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      email.trim(),
    )) {
      nextErrors.email =
        'Veuillez saisir une adresse e-mail valide.'
    }

    if (password.length < 12) {
      nextErrors.password =
        'Le mot de passe doit contenir au moins 12 caractères.'
    }

    if (password !== confirmation) {
      nextErrors.confirmation =
        'Les mots de passe ne correspondent pas.'
    }

    setErrors(nextErrors)

    return Object.keys(nextErrors).length === 0
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    if (submitting) return

    setError('')

    if (!validateForm()) {
      return
    }

    setSubmitting(true)

    try {
      await register({
        full_name: fullName.trim(),
        email: email.trim(),
        password,
      })

      navigate('/login', {
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
          Commencez dès maintenant
        </span>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Créer votre compte
        </h1>

        <p className="mt-3 text-sm text-slate-500">
          Rejoignez votre nouvel espace de travail.
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
        noValidate
        className="space-y-5"
      >

        <Input
          label="Nom complet"
          placeholder="Votre nom et prénom"
          autoComplete="name"
          icon={<UserRound size={18} />}
          value={fullName}
          error={errors.full_name}
          onChange={(event) =>
            setFullName(event.target.value)
          }
          required
        />

        <Input
          label="Adresse e-mail"
          type="email"
          placeholder="vous@entreprise.fr"
          autoComplete="email"
          icon={<Mail size={18} />}
          value={email}
          error={errors.email}
          onChange={(event) =>
            setEmail(event.target.value)
          }
          required
        />

        <div>

          <Input
            label="Mot de passe"
            type="password"
            placeholder="12 caractères minimum"
            autoComplete="new-password"
            icon={<LockKeyhole size={18} />}
            value={password}
            error={errors.password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            required
          />

          {password && (
            <div className="mt-3">

              <div className="flex gap-1.5">

                {[1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={`h-1.5 flex-1 rounded-full transition-colors ${
                      level <= strength
                        ? strengthColors[strength]
                        : 'bg-slate-200'
                    }`}
                  />
                ))}

              </div>

              <p className="mt-2 text-xs text-slate-500">
                Robustesse indicative :{' '}
                <strong>
                  {strengthLabels[strength] || 'Très faible'}
                </strong>
              </p>

            </div>
          )}

          <p className="mt-2 text-xs text-slate-400">
            Utilisez au moins 12 caractères. Un mélange
            de lettres, chiffres et symboles est conseillé.
          </p>

        </div>

        <Input
          label="Confirmer le mot de passe"
          type="password"
          placeholder="Répétez votre mot de passe"
          autoComplete="new-password"
          icon={<LockKeyhole size={18} />}
          value={confirmation}
          error={errors.confirmation}
          onChange={(event) =>
            setConfirmation(event.target.value)
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
            ? 'Création en cours...'
            : 'Créer mon compte'}

          {!submitting && (
            <ArrowRight size={17} />
          )}
        </Button>

      </form>

      <div className="mt-8 border-t border-slate-100 pt-6 text-center text-sm text-slate-500">
        Vous avez déjà un compte ?{' '}

        <Link
          to="/login"
          className="font-semibold text-brand-600 hover:text-brand-800"
        >
          Se connecter
        </Link>
      </div>

    </AuthLayout>
  )
}
