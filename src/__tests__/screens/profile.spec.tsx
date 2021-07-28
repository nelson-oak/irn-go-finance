import React from 'react'
import { render } from '@testing-library/react-native'

import { Profile } from '../../screens/Profile'


describe('Profile Screen', () => {
  it("should be able to show input name's placeholder correctly", () => {
    const { getByPlaceholderText } = render(<Profile />)
    
    const inputName = getByPlaceholderText('Nome')
    
    expect(inputName).toBeTruthy()
  })
  
  it('should be able to load user data', () => {
    const { getByTestId } = render(<Profile />)
    
    const inputName = getByTestId('input-name')
    const inputSurName = getByTestId('input-surname')
    
    expect(inputName.props.value).toBeTruthy()
    expect(inputSurName.props.value).toBeTruthy()
  })
  
  it('should be able to render the title correctly', () => {
    const { getByTestId } = render(<Profile />)
    
    const textTitle = getByTestId('text-title')
    
    expect(textTitle.props.children).toContain('Perfil')
  })
})