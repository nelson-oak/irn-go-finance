import React from 'react'
import { render } from '@testing-library/react-native'

import { Input } from '.'

describe('Input Component', () => {
  it('should be able to render border when active', () => {
    const { getByTestId } = render(
      <Input
        testID="input-email"
        placeholder="E-mail"
        keyboardType="email-address"
        autoCorrect={false}
        active
      />
    )

    const inputComponent = getByTestId('input-email')

    expect(inputComponent.props.style[0].borderColor).toEqual('red')
    expect(inputComponent.props.style[0].borderWidth).toBe(3)
  })
})