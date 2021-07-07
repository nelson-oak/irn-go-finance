import React from "react";
import { TouchableOpacityProps } from "react-native";
import { reset } from "yargs";

import {
  Container,
  Category,
  Icon,
} from './styles'

interface ICategorySelectButtonProps extends TouchableOpacityProps {
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