
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
  AdminRoute,
} from '../components/AdminRoute'

import {
  ProtectedRoute,
} from '../components/ProtectedRoute'

import {
  AuthContext,
} from '../context/auth-context'

import {
  mockAdmin,
  mockUser,
} from './helpers/fixtures'

function renderAdminRoute(isAdmin: boolean) {
  return render(
    <MemoryRouter initialEntries={['/admin']}>
      <AuthContext.Provider
        value={{
          user: isAdmin
            ? mockAdmin
            : mockUser,

          isAuthenticated: true,
          isAdmin,
          isLoading: false,
          login: vi.fn(),
          register: vi.fn(),
          logout: vi.fn(),
        }}
      >
        <Routes>
          <Route element={<ProtectedRoute />}>

            <Route
              path="/dashboard"
              element={<h1>User dashboard</h1>}
            />

            <Route element={<AdminRoute />}>
              <Route
                path="/admin"
                element={<h1>Admin dashboard</h1>}
              />
            </Route>

          </Route>
        </Routes>
      </AuthContext.Provider>
    </MemoryRouter>,
  )
}

describe('AdminRoute', () => {
  it('denies access to a regular user', async () => {
    renderAdminRoute(false)

    expect(
      await screen.findByText(
        'User dashboard',
      ),
    ).toBeInTheDocument()

    expect(
      screen.queryByText(
        'Admin dashboard',
      ),
    ).not.toBeInTheDocument()
  })

  it('allows access to an administrator', () => {
    renderAdminRoute(true)

    expect(
      screen.getByText(
        'Admin dashboard',
      ),
    ).toBeInTheDocument()
  })
})
