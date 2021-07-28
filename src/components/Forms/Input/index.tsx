import React from 'react'
import { TextInputProps } from 'react-native'


import {
  Container
} from './styles'

interface IInputProps extends TextInputProps {
  active?: boolean
}

export function Input({
  active = false,
  ...rest
}: IInputProps) {
  return (
    <Container
      active={active}
      {...rest}
    />
  )
}