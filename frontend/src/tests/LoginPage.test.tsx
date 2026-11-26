
import { AxiosError, AxiosHeaders } from 'axios'

import {
  render,
  screen,
  waitFor,
} from '@testing-library/react'

import userEvent from '@testing-library/user-event'

import {
  MemoryRouter,
  Route,
  Routes,
} from 'react-router-dom'

import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

import {
  AuthContext,
} from '../context/auth-context'

import type {
  AuthContextValue,
} from '../context/auth-context'

import LoginPage from '../pages/auth/LoginPage'

import {
  mockCredentials,
  mockUser,
} from './helpers/fixtures'

const login = vi.fn()
const register = vi.fn()
const logout = vi.fn()

function renderLogin(
  overrides: Partial<AuthContextValue> = {},
) {
  const value: AuthContextValue = {
    user: null,
    isAuthenticated: false,
    isAdmin: false,
    isLoading: false,
    login,
    register,
    logout,
    ...overrides,
  }

  return render(
    <MemoryRouter initialEntries={['/login']}>
      <AuthContext.Provider value={value}>
        <Routes>
          <Route
            path="/login"
            element={<LoginPage />}
          />

          <Route
            path="/dashboard"
            element={<h1>Dashboard test</h1>}
          />

          <Route
            path="/register"
            element={<h1>Registration test</h1>}
          />
        </Routes>
      </AuthContext.Provider>
    </MemoryRouter>,
  )
}

async function fillLoginForm(
  password = mockCredentials.password,
) {
  const user = userEvent.setup()

  await user.type(
    screen.getByLabelText('Adresse e-mail'),
    mockCredentials.email,
  )

  await user.type(
    screen.getByLabelText('Mot de passe', {
      exact: true,
    }),
    password,
  )

  return user
}

beforeEach(() => {
  login.mockReset()
  register.mockReset()
  logout.mockReset()
})

describe('LoginPage', () => {
  it('renders the login form', () => {
    renderLogin()

    expect(
      screen.getByRole('heading', {
        name: 'Bon retour !',
      }),
    ).toBeInTheDocument()

    expect(
      screen.getByLabelText('Adresse e-mail'),
    ).toBeInTheDocument()

    expect(
      screen.getByLabelText('Mot de passe', {
        exact: true,
      }),
    ).toBeInTheDocument()
  })

  it('redirects to the dashboard after a valid login', async () => {
    login.mockResolvedValue(mockUser)

    renderLogin()

    const user = await fillLoginForm()

    await user.click(
      screen.getByRole('button', {
        name: 'Se connecter',
      }),
    )

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith(
        mockCredentials,
      )
    })

    expect(
      await screen.findByText('Dashboard test'),
    ).toBeInTheDocument()
  })

  it('displays an error after invalid credentials', async () => {
    const config = {
      headers: new AxiosHeaders(),
    }

    login.mockRejectedValue(
      new AxiosError(
        'Unauthorized',
        'ERR_BAD_REQUEST',
        config,
        undefined,
        {
          status: 401,
          statusText: 'Unauthorized',
          data: {
            detail: 'Invalid credentials',
          },
          headers: new AxiosHeaders(),
          config,
        },
      ),
    )

    renderLogin()

    const user = await fillLoginForm(
      'WrongPassword!',
    )

    await user.click(
      screen.getByRole('button', {
        name: 'Se connecter',
      }),
    )

    expect(
      await screen.findByRole('alert'),
    ).toHaveTextContent(
      'Identifiants incorrects ou session expirée.',
    )
  })

  it('redirects an already authenticated user', async () => {
    renderLogin({
      user: mockUser,
      isAuthenticated: true,
    })

    expect(
      await screen.findByText('Dashboard test'),
    ).toBeInTheDocument()
  })

  it('navigates to the registration page', async () => {
    renderLogin()

    const user = userEvent.setup()

    await user.click(
      screen.getByRole('link', {
        name: 'Créer un compte',
      }),
    )

    expect(
      await screen.findByText(
        'Registration test',
      ),
    ).toBeInTheDocument()
  })
})
