
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

import type { ReactNode } from 'react'

import toast from 'react-hot-toast'

import { authApi } from '../api/auth'
import { AUTH_EXPIRED_EVENT } from '../api/client'

import type {
  LoginCredentials,
  RegisterCredentials,
  User,
} from '../types/auth'

import {
  getToken,
  setToken,
  removeToken,
  isTokenExpired,
  getTokenExpiration,
} from '../utils/token'

import { AuthContext } from './auth-context'

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)

  const [isLoading, setIsLoading] = useState(true)

  const [token, setCurrentToken] = useState<string | null>(
    () => getToken(),
  )

  const clearSession = useCallback(() => {
    removeToken()
    setCurrentToken(null)
    setUser(null)
  }, [])

  const logout = useCallback(() => {
    clearSession()

    toast.success('Vous êtes déconnecté.')
  }, [clearSession])

  useEffect(() => {
    function handleExpiredSession() {
      clearSession()

      toast.error(
        'Votre session a expiré. Reconnectez-vous.',
        { id: 'auth-expired' },
      )
    }

    window.addEventListener(
      AUTH_EXPIRED_EVENT,
      handleExpiredSession,
    )

    return () => {
      window.removeEventListener(
        AUTH_EXPIRED_EVENT,
        handleExpiredSession,
      )
    }
  }, [clearSession])

  useEffect(() => {
    let cancelled = false

    async function initializeAuth() {
      const storedToken = getToken()

      try {
        if (
          !storedToken ||
          isTokenExpired(storedToken)
        ) {
          if (!cancelled) {
            clearSession()
          }

          return
        }

        const currentUser = await authApi.me()

        if (
          !cancelled &&
          getToken() === storedToken
        ) {
          setUser(currentUser)
          setCurrentToken(storedToken)
        }
      } catch {
        if (!cancelled) {
          clearSession()
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    void initializeAuth()

    return () => {
      cancelled = true
    }
  }, [clearSession])

  useEffect(() => {
    if (!token) {
      return
    }

    const expiration = getTokenExpiration(token)

    if (!expiration) {
      window.dispatchEvent(
        new Event(AUTH_EXPIRED_EVENT),
      )

      return
    }

    const remainingTime = Math.max(
      expiration - Date.now(),
      0,
    )

    const timeout = window.setTimeout(() => {
      if (getToken() === token) {
        window.dispatchEvent(
          new Event(AUTH_EXPIRED_EVENT),
        )
      }
    }, remainingTime)

    return () => window.clearTimeout(timeout)
  }, [token])

  const login = useCallback(
    async (
      credentials: LoginCredentials,
    ): Promise<User> => {
      const response = await authApi.login(credentials)

      if (isTokenExpired(response.access_token)) {
        throw new Error('Invalid access token')
      }

      setToken(response.access_token)

      try {
        const currentUser = await authApi.me()

        if (getToken() !== response.access_token) {
          throw new Error('Session no longer available')
        }

        setCurrentToken(response.access_token)
        setUser(currentUser)

        toast.success(
          `Bienvenue, ${currentUser.full_name} !`,
        )

        return currentUser
      } catch (error) {
        clearSession()
        throw error
      }
    },
    [clearSession],
  )

  const register = useCallback(
    async (
      credentials: RegisterCredentials,
    ): Promise<User> => {
      const newUser =
        await authApi.register(credentials)

      toast.success(
        'Votre compte a été créé avec succès.',
      )

      return newUser
    },
    [],
  )

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: user !== null,
      isAdmin: user?.role === 'admin',
      isLoading,
      login,
      register,
      logout,
    }),
    [
      user,
      isLoading,
      login,
      register,
      logout,
    ],
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
