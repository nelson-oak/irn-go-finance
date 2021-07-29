import React from 'react'
import { mocked } from 'ts-jest/utils'
import { render, fireEvent, waitFor } from '@testing-library/react-native'
import { ThemeProvider } from 'styled-components/native'
import { useNavigation } from '@react-navigation/core';

import theme from '../../global/styles/theme'
import { Register } from '.'

const Providers: React.FC = ({ children }) => (
  <ThemeProvider theme={theme}>
    { children }
  </ThemeProvider>
)

jest.mock('@react-navigation/core')

describe('RegisterScreen', () => {
  it('should be able to open category modal when click on category button', () => {
    const navigationMocked = mocked(useNavigation as any)
    navigationMocked.mockReturnValueOnce({
      navigate: () => {}
    })

    
    const { getByTestId } = render(
      <Register />,
      {
        wrapper: Providers
      }
    )
    
    const categoryModal = getByTestId('modal-category')
    const categorySelectButton = getByTestId('button-category-select')

    fireEvent.press(categorySelectButton)

    expect(categoryModal.props.visible).toBeTruthy()
  })
})