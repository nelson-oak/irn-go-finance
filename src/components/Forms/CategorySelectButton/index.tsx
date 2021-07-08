import React from "react";
import { RectButtonProps } from "react-native-gesture-handler";

import {
  Container,
  Category,
  Icon,
} from './styles'

interface ICategorySelectButtonProps extends RectButtonProps {
  title: string
}

export function CategorySelectButton({
  title,
  ...rest
}: ICategorySelectButtonProps) {
  return (
    <Container
      activeOpacity={0.7}
      {...rest}
    >
      <Category>{title}</Category>
      <Icon name="chevron-down" />
    </Container>
  )
}