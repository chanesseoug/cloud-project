
import {
  render,
  screen,
} from '@testing-library/react'

import userEvent from '@testing-library/user-event'

import {
  describe,
  expect,
  it,
} from 'vitest'

import { Input } from '../components/ui/Input'

describe('Input component', () => {
  it('associates the label with its input', () => {
    render(
      <Input
        label="Adresse e-mail"
        type="email"
      />,
    )

    const input = screen.getByLabelText(
      'Adresse e-mail',
    )

    expect(input).toHaveAttribute(
      'type',
      'email',
    )
  })

  it('displays accessible validation errors', () => {
    render(
      <Input
        label="Adresse e-mail"
        error="Adresse invalide"
      />,
    )

    const input = screen.getByLabelText(
      'Adresse e-mail',
    )

    const error = screen.getByText(
      'Adresse invalide',
    )

    expect(input).toHaveAttribute(
      'aria-invalid',
      'true',
    )

    expect(input).toHaveAttribute(
      'aria-describedby',
      error.id,
    )
  })

  it('toggles password visibility', async () => {
    const user = userEvent.setup()

    render(
      <Input
        label="Mot de passe"
        type="password"
      />,
    )

    const input = screen.getByLabelText(
      'Mot de passe',
      { exact: true },
    )

    expect(input).toHaveAttribute(
      'type',
      'password',
    )

    await user.click(
      screen.getByRole('button', {
        name: 'Afficher le mot de passe',
      }),
    )

    expect(input).toHaveAttribute(
      'type',
      'text',
    )

    await user.click(
      screen.getByRole('button', {
        name: 'Masquer le mot de passe',
      }),
    )

    expect(input).toHaveAttribute(
      'type',
      'password',
    )
  })
})
