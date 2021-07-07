import React from 'react'
import { Input } from '../../components/Forms/Input'
import { Button } from '../../components/Forms/Button'
import { TransactionTypeButton } from '../../components/Forms/TransactionTypeButton'

import {
  Container,
  Header,
  Title,
  Form,
  Fields,
  TransactionsTypes
} from './styles'
import { useState } from 'react'

export function Register() {
  const [transactionType, setTransactionType] = useState('')

  function handleSelectTransactionType(type: 'up' | 'down') {
    setTransactionType(type)
  }

  return (
    <Container>
      <Header>
        <Title>Cadastro</Title>
      </Header>

      <Form>
        <Fields>
          <Input placeholder="Nome" />
          
          <Input placeholder="Preço" />

          <TransactionsTypes>
            <TransactionTypeButton
              type="up"
              title="income"
              isActive={transactionType === 'up'}
              onPress={() => handleSelectTransactionType('up')}
            />

            <TransactionTypeButton
              type="down"
              title="outcome"
              isActive={transactionType === 'down'}
              onPress={() => handleSelectTransactionType('down')}
            />
          </TransactionsTypes>
        </Fields>

        <Button title="enviar" />
      </Form>
    </Container>
  )
}