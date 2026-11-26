
import type { JwtPayload } from '../types/auth'

const TOKEN_KEY = 'roombooking_access_token'

export function getToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
  sessionStorage.setItem(TOKEN_KEY, token)
}

export function removeToken(): void {
  sessionStorage.removeItem(TOKEN_KEY)
}

export function decodeToken(
  token: string,
): JwtPayload | null {
  try {
    const parts = token.split('.')

    if (parts.length !== 3) {
      return null
    }

    const base64 = parts[1]
      .replace(/-/g, '+')
      .replace(/_/g, '/')

    const padded = base64.padEnd(
      Math.ceil(base64.length / 4) * 4,
      '=',
    )

    const decoded = JSON.parse(atob(padded))

    if (
      typeof decoded.exp !== 'number' ||
      !Number.isFinite(decoded.exp) ||
      typeof decoded.sub !== 'string'
    ) {
      return null
    }

    return decoded as JwtPayload
  } catch {
    return null
  }
}

export function isTokenExpired(
  token: string,
): boolean {
  const payload = decodeToken(token)

  if (!payload) {
    return true
  }

  return payload.exp * 1000 <= Date.now()
}

export function getTokenExpiration(
  token: string,
): number | null {
  const payload = decodeToken(token)

  return payload ? payload.exp * 1000 : null
}
