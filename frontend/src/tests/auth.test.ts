
import {
  describe,
  expect,
  it,
  vi,
} from 'vitest'

import api from '../api/client'
import { authApi } from '../api/auth'

import {
  makeToken,
  mockCredentials,
  mockRegistration,
  mockUser,
} from './helpers/fixtures'

describe('Authentication API service', () => {
  it('sends login credentials as URL-encoded data', async () => {
    const token = makeToken()

    const spy = vi.spyOn(
      api,
      'post',
    ).mockResolvedValue({
      data: {
        access_token: token,
        token_type: 'bearer',
      },
    })

    const response = await authApi.login(
      mockCredentials,
    )

    expect(spy).toHaveBeenCalledOnce()

    const [url, body, config] =
      spy.mock.calls[0]

    expect(url).toBe('/auth/login')

    expect(body).toBeInstanceOf(
      URLSearchParams,
    )

    const form = body as URLSearchParams

    expect(form.get('username')).toBe(
      mockCredentials.email,
    )

    expect(form.get('password')).toBe(
      mockCredentials.password,
    )

    expect(config?.headers).toMatchObject({
      'Content-Type':
        'application/x-www-form-urlencoded',
    })

    expect(response.access_token).toBe(token)
  })

  it('sends registration data without an admin role', async () => {
    const spy = vi.spyOn(
      api,
      'post',
    ).mockResolvedValue({
      data: mockUser,
    })

    const response = await authApi.register(
      mockRegistration,
    )

    expect(spy).toHaveBeenCalledWith(
      '/auth/register',
      mockRegistration,
    )

    expect(
      spy.mock.calls[0][1],
    ).not.toHaveProperty('role')

    expect(response).toEqual(mockUser)
  })

  it('retrieves the authenticated user profile', async () => {
    const spy = vi.spyOn(
      api,
      'get',
    ).mockResolvedValue({
      data: mockUser,
    })

    const response = await authApi.me()

    expect(spy).toHaveBeenCalledWith(
      '/auth/me',
    )

    expect(response).toEqual(mockUser)
  })
})
