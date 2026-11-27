
import type { ReactNode } from 'react'

import {
  act,
  renderHook,
  waitFor,
} from '@testing-library/react'

import {
  describe,
  expect,
  it,
  vi,
} from 'vitest'

import { authApi } from '../api/auth'

import {
  AUTH_EXPIRED_EVENT,
} from '../api/client'

import {
  AuthProvider,
} from '../context/AuthContext'

import { useAuth } from '../hooks/useAuth'

import {
  getToken,
  setToken,
} from '../utils/token'

import {
  makeToken,
  mockAdmin,
  mockCredentials,
  mockRegistration,
  mockUser,
} from './helpers/fixtures'

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

function Wrapper({
  children,
}: {
  children: ReactNode
}) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
}

async function renderAuth() {
  const hook = renderHook(
    () => useAuth(),
    {
      wrapper: Wrapper,
    },
  )

  await waitFor(() => {
    expect(
      hook.result.current.isLoading,
    ).toBe(false)
  })

  return hook
}

describe('AuthProvider', () => {
  it('starts unauthenticated without a stored token', async () => {
    const spy = vi.spyOn(authApi, 'me')

    const { result } = await renderAuth()

    expect(result.current.user).toBeNull()

    expect(
      result.current.isAuthenticated,
    ).toBe(false)

    expect(spy).not.toHaveBeenCalled()
  })

  it('restores a valid stored session', async () => {
    const token = makeToken()

    setToken(token)

    vi.spyOn(
      authApi,
      'me',
    ).mockResolvedValue(mockUser)

    const { result } = await renderAuth()

    expect(result.current.user).toEqual(
      mockUser,
    )

    expect(
      result.current.isAuthenticated,
    ).toBe(true)
  })

  it('removes an expired stored token', async () => {
    setToken(makeToken(-60))

    const spy = vi.spyOn(authApi, 'me')

    const { result } = await renderAuth()

    expect(getToken()).toBeNull()

    expect(
      result.current.isAuthenticated,
    ).toBe(false)

    expect(spy).not.toHaveBeenCalled()
  })

  it('authenticates a user after a successful login', async () => {
    const token = makeToken()

    vi.spyOn(
      authApi,
      'login',
    ).mockResolvedValue({
      access_token: token,
      token_type: 'bearer',
    })

    vi.spyOn(
      authApi,
      'me',
    ).mockResolvedValue(mockUser)

    const { result } = await renderAuth()

    await act(async () => {
      await result.current.login(
        mockCredentials,
      )
    })

    expect(getToken()).toBe(token)

    expect(result.current.user).toEqual(
      mockUser,
    )

    expect(
      result.current.isAuthenticated,
    ).toBe(true)

    expect(
      result.current.isAdmin,
    ).toBe(false)
  })

  it('recognizes the administrator role', async () => {
    setToken(makeToken(1800, 2))

    vi.spyOn(
      authApi,
      'me',
    ).mockResolvedValue(mockAdmin)

    const { result } = await renderAuth()

    expect(
      result.current.isAuthenticated,
    ).toBe(true)

    expect(
      result.current.isAdmin,
    ).toBe(true)
  })

  it('registers a user without starting a session', async () => {
    const spy = vi.spyOn(
      authApi,
      'register',
    ).mockResolvedValue(mockUser)

    const { result } = await renderAuth()

    await act(async () => {
      await result.current.register(
        mockRegistration,
      )
    })

    expect(spy).toHaveBeenCalledWith(
      mockRegistration,
    )

    expect(getToken()).toBeNull()

    expect(
      result.current.isAuthenticated,
    ).toBe(false)
  })

  it('clears the user and token on logout', async () => {
    setToken(makeToken())

    vi.spyOn(
      authApi,
      'me',
    ).mockResolvedValue(mockUser)

    const { result } = await renderAuth()

    act(() => {
      result.current.logout()
    })

    expect(getToken()).toBeNull()
    expect(result.current.user).toBeNull()

    expect(
      result.current.isAuthenticated,
    ).toBe(false)
  })

  it('automatically logs out when the JWT expires', async () => {
    setToken(makeToken())

    vi.spyOn(
      authApi,
      'me',
    ).mockResolvedValue(mockUser)

    const { result } = await renderAuth()

    act(() => {
      window.dispatchEvent(
        new Event(AUTH_EXPIRED_EVENT),
      )
    })

    expect(getToken()).toBeNull()
    expect(result.current.user).toBeNull()

    expect(
      result.current.isAuthenticated,
    ).toBe(false)
  })
})
