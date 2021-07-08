import styled, { css } from 'styled-components/native'
import { Feather } from '@expo/vector-icons'
import { RFValue } from 'react-native-responsive-fontsize'
import { RectButton } from 'react-native-gesture-handler'

interface IIConProps {
  type: 'up' | 'down'
}

interface IContainerProps {
  type: 'up' | 'down'
  isActive: boolean
}

export const Container = styled.View<IContainerProps>`
  width: 48%;
  border: ${({ isActive }) => isActive ? 0 : 1.5}px solid ${({ theme }) => theme.colors.text};
  border-radius: 5px;
  
  ${({ type, isActive }) => isActive && type === 'up'
    && css`background-color: ${({ theme }) => theme.colors.success_light};`}

  ${({ type, isActive }) => isActive && type === 'down'
    && css`background-color: ${({ theme }) => theme.colors.attention_light};`}
`

export const Button = styled(RectButton)`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 16px;
`

export const Icon = styled(Feather)<IIConProps>`
  font-size: ${RFValue(24)}px;
  margin-right: 12px;
  color: ${({ theme, type }) => type === 'up' ? theme.colors.success : theme.colors.attention};
`

export const Title = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: ${RFValue(14)}px;
`