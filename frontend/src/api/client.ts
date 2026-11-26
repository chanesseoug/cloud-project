
import axios from 'axios'

import {
  getToken,
  isTokenExpired,
  removeToken,
} from '../utils/token'

export const AUTH_EXPIRED_EVENT =
  'roombooking:auth-expired'

const api = axios.create({
  baseURL: '/api/v1',
  timeout: 15000,

  headers: {
    Accept: 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = getToken()

  if (token) {
    if (isTokenExpired(token)) {
      removeToken()

      window.dispatchEvent(
        new Event(AUTH_EXPIRED_EVENT),
      )
    } else {
      config.headers.Authorization = `Bearer ${token}`
    }
  }

  return config
})

api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (axios.isAxiosError(error)) {
      const currentToken = getToken()

      const sentToken =
        error.config?.headers?.get('Authorization')

      if (
        error.response?.status === 401 &&
        currentToken &&
        sentToken === `Bearer ${currentToken}`
      ) {
        removeToken()

        window.dispatchEvent(
          new Event(AUTH_EXPIRED_EVENT),
        )
      }
    }

    return Promise.reject(error)
  },
)

export function getApiError(
  error: unknown,
): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    const detail = error.response?.data?.detail

    if (!error.response) {
      return (
        'Impossible de contacter le serveur. ' +
        'Vérifiez votre connexion et réessayez.'
      )
    }

    if (status === 401) {
      return 'Identifiants incorrects ou session expirée.'
    }

    if (status === 403) {
      return "Vous n'avez pas les permissions nécessaires."
    }

    if (status === 404) {
      return 'La ressource demandée est introuvable.'
    }

    if (status === 409) {
      return typeof detail === 'string'
        ? detail
        : 'Un conflit empêche cette opération.'
    }

    if (status === 422) {
      return 'Veuillez vérifier les informations saisies.'
    }

    if (status && status >= 500) {
      return 'Une erreur serveur est survenue. Réessayez.'
    }

    if (typeof detail === 'string') {
      return detail
    }
  }

  return 'Une erreur inattendue est survenue.'
}

export default api
