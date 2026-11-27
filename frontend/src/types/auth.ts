
export type UserRole = 'user' | 'admin'

export interface User {
  id: number
  full_name: string
  email: string
  role: UserRole
  is_active: boolean
  created_at: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  full_name: string
  email: string
  password: string
}

export interface TokenResponse {
  access_token: string
  token_type: string
}

export interface JwtPayload {
  sub: string
  exp: number
  iat?: number
  iss?: string
  aud?: string
  type?: string
}
