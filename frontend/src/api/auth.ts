
import api from './client'

import type {
  LoginCredentials,
  RegisterCredentials,
  TokenResponse,
  User,
} from '../types/auth'

export const authApi = {
  async login(
    credentials: LoginCredentials,
  ): Promise<TokenResponse> {
    const formData = new URLSearchParams()

    formData.append('username', credentials.email)
    formData.append('password', credentials.password)

    const response = await api.post<TokenResponse>(
      '/auth/login',
      formData,
      {
        headers: {
          'Content-Type':
            'application/x-www-form-urlencoded',
        },
      },
    )

    return response.data
  },

  async register(
    credentials: RegisterCredentials,
  ): Promise<User> {
    const response = await api.post<User>(
      '/auth/register',
      credentials,
    )

    return response.data
  },

  async me(): Promise<User> {
    const response = await api.get<User>(
      '/auth/me',
    )

    return response.data
  },
}
