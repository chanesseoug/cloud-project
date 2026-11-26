
import { describe, expect, it } from 'vitest'

import {
  decodeToken,
  getToken,
  getTokenExpiration,
  isTokenExpired,
  removeToken,
  setToken,
} from '../utils/token'

import { makeToken } from './helpers/fixtures'

describe('JWT token utilities', () => {
  it('stores the access token', () => {
    const token = makeToken()

    setToken(token)

    expect(
      sessionStorage.getItem(
        'roombooking_access_token',
      ),
    ).toBe(token)
  })

  it('retrieves the stored token', () => {
    const token = makeToken()

    setToken(token)

    expect(getToken()).toBe(token)
  })

  it('removes the stored token', () => {
    setToken(makeToken())

    removeToken()

    expect(getToken()).toBeNull()
  })

  it('decodes a valid JWT payload', () => {
    const token = makeToken(1800, 42)

    const payload = decodeToken(token)

    expect(payload).not.toBeNull()
    expect(payload?.sub).toBe('42')
    expect(payload?.type).toBe('access')
  })

  it('rejects a malformed token', () => {
    expect(
      decodeToken('invalid-test-token'),
    ).toBeNull()

    expect(
      decodeToken('a.b.c'),
    ).toBeNull()

    expect(
      isTokenExpired('invalid-test-token'),
    ).toBe(true)
  })

  it('detects an expired token', () => {
    const token = makeToken(-60)

    expect(
      isTokenExpired(token),
    ).toBe(true)
  })

  it('accepts a non-expired token', () => {
    const token = makeToken(1800)

    expect(
      isTokenExpired(token),
    ).toBe(false)
  })

  it('returns the token expiration timestamp', () => {
    const token = makeToken(1800)

    const payload = decodeToken(token)

    expect(
      getTokenExpiration(token),
    ).toBe(payload!.exp * 1000)

    expect(
      getTokenExpiration('invalid-token'),
    ).toBeNull()
  })
})
