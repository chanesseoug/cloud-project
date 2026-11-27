
import { useState } from 'react'

import {
  Users,
  Search,
  ShieldCheck,
  UserRound,
} from 'lucide-react'

import type { User } from '../../types/auth'

import type {
  Reservation,
} from '../../types/reservation'

import type {
  UserRoleFilter,
  UserStatusFilter,
} from '../../types/admin'

import {
  filterAdminUsers,
  getUserReservationCount,
} from '../../utils/admin'

import {
  formatDate,
  getInitials,
} from '../../utils/format'

import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { EmptyState } from '../ui/EmptyState'

interface AdminUsersProps {
  users: User[]
  reservations: Reservation[]
}

const selectClassName =
  'min-h-12 w-full rounded-xl border ' +
  'border-slate-200 bg-white px-4 py-3 ' +
  'text-sm text-slate-700'

export function AdminUsers({
  users,
  reservations,
}: AdminUsersProps) {
  const [search, setSearch] = useState('')

  const [role, setRole] =
    useState<UserRoleFilter>('all')

  const [status, setStatus] =
    useState<UserStatusFilter>('all')

  const filteredUsers = filterAdminUsers(
    users,
    search,
    role,
    status,
  )

  return (
    <section className="space-y-5">

      <div>
        <h2 className="text-xl font-bold text-slate-900">
          Utilisateurs
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Consultez les comptes et leurs informations.
        </p>
      </div>

      <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 md:grid-cols-3">

        <Input
          label="Rechercher un utilisateur"
          icon={<Search size={17} />}
          placeholder="Nom, e-mail ou identifiant..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
        />

        <div className="space-y-2">

          <label
            htmlFor="admin-user-role"
            className="block text-sm font-medium text-slate-700"
          >
            Rôle
          </label>

          <select
            id="admin-user-role"
            value={role}
            className={selectClassName}
            onChange={(event) =>
              setRole(
                event.target.value as UserRoleFilter,
              )
            }
          >
            <option value="all">
              Tous les rôles
            </option>

            <option value="user">
              Utilisateurs
            </option>

            <option value="admin">
              Administrateurs
            </option>
          </select>

        </div>

        <div className="space-y-2">

          <label
            htmlFor="admin-user-status"
            className="block text-sm font-medium text-slate-700"
          >
            Statut du compte
          </label>

          <select
            id="admin-user-status"
            value={status}
            className={selectClassName}
            onChange={(event) =>
              setStatus(
                event.target.value as UserStatusFilter,
              )
            }
          >
            <option value="all">
              Tous les comptes
            </option>

            <option value="active">
              Actifs
            </option>

            <option value="inactive">
              Inactifs
            </option>
          </select>

        </div>

      </div>

      <p className="text-sm font-medium text-slate-500">
        {filteredUsers.length} utilisateur(s)
        {' sur '}
        {users.length}
      </p>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        {filteredUsers.length === 0 ? (
          <EmptyState
            icon={Users}
            title="Aucun utilisateur trouvé"
            description="Modifiez vos critères de recherche."
            action={
              <Button
                variant="secondary"
                onClick={() => {
                  setSearch('')
                  setRole('all')
                  setStatus('all')
                }}
              >
                Réinitialiser les filtres
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full min-w-[850px] text-left text-sm">

              <thead className="bg-slate-50 text-xs font-semibold text-slate-500">

                <tr>
                  <th scope="col" className="px-5 py-4">
                    Utilisateur
                  </th>

                  <th scope="col" className="px-5 py-4">
                    Rôle
                  </th>

                  <th scope="col" className="px-5 py-4">
                    Statut
                  </th>

                  <th scope="col" className="px-5 py-4">
                    Inscription
                  </th>

                  <th scope="col" className="px-5 py-4">
                    Réservations
                  </th>
                </tr>

              </thead>

              <tbody className="divide-y divide-slate-100">

                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-slate-50/70"
                  >

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-sm font-bold text-brand-700">
                          {getInitials(
                            user.full_name,
                          )}
                        </div>

                        <div>

                          <p className="font-semibold text-slate-900">
                            {user.full_name}
                          </p>

                          <p className="mt-1 break-all text-xs text-slate-500">
                            {user.email}
                          </p>

                          <p className="mt-1 text-[10px] text-slate-400">
                            #{user.id}
                          </p>

                        </div>

                      </div>

                    </td>

                    <td className="px-5 py-4">

                      {user.role === 'admin' ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700">
                          <ShieldCheck size={14} />
                          Administrateur
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
                          <UserRound size={14} />
                          Utilisateur
                        </span>
                      )}

                    </td>

                    <td className="px-5 py-4">

                      <span
                        className={
                          user.is_active
                            ? 'rounded-full bg-emerald-50 px-3 py-1.5 text-xs text-emerald-700'
                            : 'rounded-full bg-red-50 px-3 py-1.5 text-xs text-red-700'
                        }
                      >
                        {user.is_active
                          ? 'Actif'
                          : 'Inactif'}
                      </span>

                    </td>

                    <td className="px-5 py-4 text-slate-500">
                      {formatDate(
                        user.created_at,
                      )}
                    </td>

                    <td className="px-5 py-4 font-semibold text-slate-700">
                      {getUserReservationCount(
                        user.id,
                        reservations,
                      )}
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>

      <p className="text-xs leading-relaxed text-slate-400">
        Cet espace permet la consultation des comptes.
        Les opérations sensibles sur les identifiants
        et les rôles ne sont pas disponibles ici.
      </p>

    </section>
  )
}
