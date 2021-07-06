import React from 'react'

import {
  Container,
  Header,
  Title,
  Icon,
  Footer,
  Amount,
  LastTransaction,
} from './styles'

export function HighlightCard() {
  return (
    <Container>
      <Header>
        <Title>Entrada</Title>
        <Icon name="arrow-up-circle" />
      </Header>
      
      <Footer>
        <Amount>R$ 17.400,00</Amount>
        <LastTransaction>Uĺtima entrada dia 30 de fevereiro</LastTransaction>
      </Footer>
    </Container>
  )
}