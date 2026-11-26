
import type { User } from '../../types/auth'

export const mockUser: User = {
  id: 1,
  full_name: 'RoomBooking Test User',
  email: 'user@example.com',
  role: 'user',
  is_active: true,
  created_at: '2026-11-25T10:00:00Z',
}

export const mockAdmin: User = {
  id: 2,
  full_name: 'RoomBooking Test Admin',
  email: 'admin@example.com',
  role: 'admin',
  is_active: true,
  created_at: '2026-11-25T10:00:00Z',
}

function encodeBase64Url(value: object): string {
  return btoa(JSON.stringify(value))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

export function makeToken(
  expiresInSeconds = 1800,
  userId = 1,
): string {
  const header = encodeBase64Url({
    alg: 'HS256',
    typ: 'JWT',
  })

  const payload = encodeBase64Url({
    sub: String(userId),
    iat: Math.floor(Date.now() / 1000),
    exp:
      Math.floor(Date.now() / 1000) +
      expiresInSeconds,
    iss: 'roombooking',
    aud: 'roombooking-api',
    type: 'access',
  })

  return `${header}.${payload}.test-signature`
}

export const mockCredentials = {
  email: 'user@example.com',
  password: 'TestPassword@2026!',
}

export const mockRegistration = {
  full_name: 'RoomBooking Test User',
  email: 'user@example.com',
  password: 'TestPassword@2026!',
}
