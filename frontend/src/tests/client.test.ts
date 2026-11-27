
import { AxiosError, AxiosHeaders } from 'axios'

import type {
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'

import {
  afterEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

import api, {
  AUTH_EXPIRED_EVENT,
  getApiError,
} from '../api/client'

import {
  getToken,
  setToken,
} from '../utils/token'

import { makeToken } from './helpers/fixtures'

const originalAdapter = api.defaults.adapter

function makeResponse(
  config: InternalAxiosRequestConfig,
  status = 200,
  data: unknown = {},
): AxiosResponse {
  return {
    data,
    status,
    statusText: String(status),
    headers: new AxiosHeaders(),
    config,
  }
}

function makeHttpError(
  config: InternalAxiosRequestConfig,
  status: number,
  detail: string,
): AxiosError {
  return new AxiosError(
    detail,
    'ERR_BAD_REQUEST',
    config,
    undefined,
    makeResponse(config, status, { detail }),
  )
}

afterEach(() => {
  api.defaults.adapter = originalAdapter
})

describe('Axios API client', () => {
  it('uses the relative API base URL', () => {
    expect(api.defaults.baseURL).toBe('/api/v1')
    expect(api.defaults.timeout).toBe(15000)
  })

  it('attaches the Bearer token automatically', async () => {
    const token = makeToken()

    setToken(token)

    const adapter = vi.fn(
      async (config: InternalAxiosRequestConfig) => {
        expect(
          config.headers.get('Authorization'),
        ).toBe(`Bearer ${token}`)

        return makeResponse(config)
      },
    )

    api.defaults.adapter = adapter

    await api.get('/auth/me')

    expect(adapter).toHaveBeenCalledOnce()
  })

  it('does not send Authorization without a token', async () => {
    api.defaults.adapter = async (config) => {
      expect(
        config.headers.get('Authorization'),
      ).toBeUndefined()

      return makeResponse(config)
    }

    await api.get('/auth/me')
  })

  it('removes an expired token before a request', async () => {
    setToken(makeToken(-60))

    const handler = vi.fn()

    window.addEventListener(
      AUTH_EXPIRED_EVENT,
      handler,
    )

    try {
      api.defaults.adapter = async (config) => {
        expect(
          config.headers.get('Authorization'),
        ).toBeUndefined()

        return makeResponse(config)
      }

      await api.get('/auth/me')

      expect(getToken()).toBeNull()
      expect(handler).toHaveBeenCalledOnce()
    } finally {
      window.removeEventListener(
        AUTH_EXPIRED_EVENT,
        handler,
      )
    }
  })

  it('clears the session after an authenticated 401', async () => {
    setToken(makeToken())

    const handler = vi.fn()

    window.addEventListener(
      AUTH_EXPIRED_EVENT,
      handler,
    )

    try {
      api.defaults.adapter = async (config) => {
        throw makeHttpError(
          config,
          401,
          'Invalid token',
        )
      }

      await expect(
        api.get('/auth/me'),
      ).rejects.toThrow()

      expect(getToken()).toBeNull()
      expect(handler).toHaveBeenCalledOnce()
    } finally {
      window.removeEventListener(
        AUTH_EXPIRED_EVENT,
        handler,
      )
    }
  })

  it('preserves the session after a 403 response', async () => {
    const token = makeToken()

    setToken(token)

    api.defaults.adapter = async (config) => {
      throw makeHttpError(
        config,
        403,
        'Forbidden',
      )
    }

    await expect(
      api.get('/admin/stats'),
    ).rejects.toThrow()

    expect(getToken()).toBe(token)
  })

  it('returns a readable message for network failures', () => {
    const error = new AxiosError(
      'Network Error',
      'ERR_NETWORK',
    )

    expect(
      getApiError(error),
    ).toContain(
      'Impossible de contacter le serveur',
    )
  })
})
