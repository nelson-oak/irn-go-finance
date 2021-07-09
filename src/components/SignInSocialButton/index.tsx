import React from 'react'
import { RectButtonProps } from 'react-native-gesture-handler'
import { SvgProps } from 'react-native-svg'

import {
  Container,
  ImageContainer,
  Text,
} from './styles'

interface ISignInSocialButtonProps extends RectButtonProps {
  title: string
  svg: React.FC<SvgProps>
}

export function SignInSocialButton({
  title,
  svg: Svg
}: ISignInSocialButtonProps) {
  return (
    <Container>
      <ImageContainer>
        <Svg />
      </ImageContainer>

      <Text>
        {title}
      </Text>
    </Container>
  )
}