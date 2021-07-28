import React from 'react'
import { render } from '@testing-library/react-native'

import { Profile } from '../../screens/Profile'

test("check if show correctly input name's placeholder", () => {
  const { getByPlaceholderText } = render(<Profile />)

  const inputName = getByPlaceholderText('Nome')

  expect(inputName).toBeTruthy()
})