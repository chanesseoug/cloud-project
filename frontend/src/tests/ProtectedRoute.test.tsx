
import {
  render,
  screen,
} from '@testing-library/react'

import {
  MemoryRouter,
  Route,
  Routes,
} from 'react-router-dom'

import {
  describe,
  expect,
  it,
  vi,
} from 'vitest'

import {
  ProtectedRoute,
} from '../components/ProtectedRoute'

import {
  AuthContext,
} from '../context/auth-context'

import type {
  AuthContextValue,
} from '../context/auth-context'

import { mockUser } from './helpers/fixtures'

function renderProtectedRoute(
  overrides: Partial<AuthContextValue> = {},
) {
  return render(
    <MemoryRouter initialEntries={['/dashboard']}>
      <AuthContext.Provider
        value={{
          user: null,
          isAuthenticated: false,
          isAdmin: false,
          isLoading: false,
          login: vi.fn(),
          register: vi.fn(),
          logout: vi.fn(),
          ...overrides,
        }}
      >
        <Routes>
          <Route
            path="/login"
            element={<h1>Login test</h1>}
          />

          <Route element={<ProtectedRoute />}>
            <Route
              path="/dashboard"
              element={<h1>Protected dashboard</h1>}
            />
          </Route>
        </Routes>
      </AuthContext.Provider>
    </MemoryRouter>,
  )
}

describe('ProtectedRoute', () => {
  it('redirects unauthenticated users to login', async () => {
    renderProtectedRoute()

    expect(
      await screen.findByText('Login test'),
    ).toBeInTheDocument()

    expect(
      screen.queryByText(
        'Protected dashboard',
      ),
    ).not.toBeInTheDocument()
  })

  it('allows authenticated users', () => {
    renderProtectedRoute({
      user: mockUser,
      isAuthenticated: true,
    })

    expect(
      screen.getByText(
        'Protected dashboard',
      ),
    ).toBeInTheDocument()
  })

  it('waits while authentication is loading', () => {
    renderProtectedRoute({
      isLoading: true,
    })

    expect(
      screen.getByRole('status'),
    ).toHaveTextContent(
      'Vérification de votre session',
    )

    expect(
      screen.queryByText('Login test'),
    ).not.toBeInTheDocument()

    expect(
      screen.queryByText(
        'Protected dashboard',
      ),
    ).not.toBeInTheDocument()
  })
})
