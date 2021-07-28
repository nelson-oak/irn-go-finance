import { RFValue } from 'react-native-responsive-fontsize'
import styled, { css } from 'styled-components/native'

interface IContainerProps {
  active: boolean
}

export const Container = styled.TextInput<IContainerProps>`
  width: 100%;
  padding: 16px 18px;
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: ${RFValue(14)}px;
  color: ${({ theme }) => theme.colors.title};
  background-color: ${({ theme }) => theme.colors.shape};
  border-radius: 5px;
  margin-bottom: 8px;

  ${({ active, theme }) => active && css`
    border: 3px solid ${theme.colors.attention}
  `}
`