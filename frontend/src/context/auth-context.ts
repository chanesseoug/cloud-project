
import { createContext } from 'react'

import type {
  LoginCredentials,
  RegisterCredentials,
  User,
} from '../types/auth'

export interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  isAdmin: boolean
  isLoading: boolean

  login: (
    credentials: LoginCredentials,
  ) => Promise<User>

  register: (
    credentials: RegisterCredentials,
  ) => Promise<User>

  logout: () => void
}

export const AuthContext =
  createContext<AuthContextValue | undefined>(
    undefined,
  )
