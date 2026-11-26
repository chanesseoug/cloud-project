
import { AxiosError, AxiosHeaders } from 'axios'

import {
  render,
  screen,
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

import RegisterPage from '../pages/auth/RegisterPage'

import {
  mockRegistration,
  mockUser,
} from './helpers/fixtures'

const register = vi.fn()

function renderRegistration() {
  return render(
    <MemoryRouter initialEntries={['/register']}>
      <AuthContext.Provider
        value={{
          user: null,
          isAuthenticated: false,
          isAdmin: false,
          isLoading: false,
          login: vi.fn(),
          register,
          logout: vi.fn(),
        }}
      >
        <Routes>
          <Route
            path="/register"
            element={<RegisterPage />}
          />

          <Route
            path="/login"
            element={<h1>Login test</h1>}
          />
        </Routes>
      </AuthContext.Provider>
    </MemoryRouter>,
  )
}

async function fillRegistrationForm(
  options: {
    name?: string
    email?: string
    password?: string
    confirmation?: string
  } = {},
) {
  const user = userEvent.setup()

  const password =
    options.password ??
    mockRegistration.password

  const values = [
    {
      label: 'Nom complet',
      value:
        options.name ??
        mockRegistration.full_name,
    },
    {
      label: 'Adresse e-mail',
      value:
        options.email ??
        mockRegistration.email,
    },
    {
      label: 'Mot de passe',
      value: password,
    },
    {
      label: 'Confirmer le mot de passe',
      value:
        options.confirmation ??
        password,
    },
  ]

  for (const field of values) {
    if (field.value) {
      await user.type(
        screen.getByLabelText(field.label, {
          exact: true,
        }),
        field.value,
      )
    }
  }

  await user.click(
    screen.getByRole('button', {
      name: 'Créer mon compte',
    }),
  )
}

beforeEach(() => {
  register.mockReset()
})

describe('RegisterPage', () => {
  it('creates a valid user and redirects to login', async () => {
    register.mockResolvedValue(mockUser)

    renderRegistration()

    await fillRegistrationForm()

    expect(register).toHaveBeenCalledWith(
      mockRegistration,
    )

    expect(
      await screen.findByText('Login test'),
    ).toBeInTheDocument()
  })

  it('rejects an empty full name', async () => {
    renderRegistration()

    await fillRegistrationForm({
      name: '',
    })

    expect(
      screen.getByText(
        'Veuillez saisir votre nom complet.',
      ),
    ).toBeInTheDocument()

    expect(register).not.toHaveBeenCalled()
  })

  it('rejects an invalid email address', async () => {
    renderRegistration()

    await fillRegistrationForm({
      email: 'invalid-email',
    })

    expect(
      screen.getByText(
        'Veuillez saisir une adresse e-mail valide.',
      ),
    ).toBeInTheDocument()

    expect(register).not.toHaveBeenCalled()
  })

  it('rejects a password shorter than 12 characters', async () => {
    renderRegistration()

    await fillRegistrationForm({
      password: 'Short123!',
    })

    expect(
      screen.getByText(
        'Le mot de passe doit contenir au moins 12 caractères.',
      ),
    ).toBeInTheDocument()

    expect(register).not.toHaveBeenCalled()
  })

  it('rejects a different password confirmation', async () => {
    renderRegistration()

    await fillRegistrationForm({
      confirmation: 'DifferentPassword@2026',
    })

    expect(
      screen.getByText(
        'Les mots de passe ne correspondent pas.',
      ),
    ).toBeInTheDocument()

    expect(register).not.toHaveBeenCalled()
  })

  it('displays the API error for a duplicate email', async () => {
    const config = {
      headers: new AxiosHeaders(),
    }

    register.mockRejectedValue(
      new AxiosError(
        'Conflict',
        'ERR_BAD_REQUEST',
        config,
        undefined,
        {
          status: 409,
          statusText: 'Conflict',
          data: {
            detail: 'Email already registered',
          },
          headers: new AxiosHeaders(),
          config,
        },
      ),
    )

    renderRegistration()

    await fillRegistrationForm()

    expect(
      await screen.findByRole('alert'),
    ).toHaveTextContent(
      'Email already registered',
    )
  })
})
