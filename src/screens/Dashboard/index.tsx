import React from 'react'

import {
  Container,
  Header,
  UserWrapper,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  Icon
} from './styles'
import styled from 'styled-components'
import { RFValue } from 'react-native-responsive-fontsize'

export function Dashboard() {
  return (
    <Container>
      <Header>
        <UserWrapper>
          <UserInfo>
            <Photo source={{ uri: 'https://avatars.githubusercontent.com/u/41764946?s=60&v=4'}} />
            <User>
              <UserGreeting>Olá,</UserGreeting>
              <UserName>Nelson</UserName>
            </User>
          </UserInfo>

          <Icon name="power" />
        </UserWrapper>
      </Header>
    </Container>
  )
}

