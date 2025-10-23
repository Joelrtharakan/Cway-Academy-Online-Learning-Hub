import { render, screen } from '@testing-library/react'
import { expect, test } from '@jest/globals'
import Home from '../pages/Home'

test('renders home page with hero section', () => {
  render(<Home />)

  const heading = screen.getByRole('heading', {
    name: /transform your future with cway academy/i,
  })
  expect(heading).toBeInTheDocument()

  const exploreButton = screen.getByRole('button', { name: /explore courses/i })
  expect(exploreButton).toBeInTheDocument()

  const signUpButton = screen.getByRole('button', { name: /sign up/i })
  expect(signUpButton).toBeInTheDocument()
})