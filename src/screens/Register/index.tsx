import React from 'react'
import { Modal } from "react-native";
import { useForm } from 'react-hook-form';

import { InputForm } from '../../components/Forms/InputForm'
import { Button } from '../../components/Forms/Button'
import { TransactionTypeButton } from '../../components/Forms/TransactionTypeButton'
import { CategorySelectButton } from '../../components/Forms/CategorySelectButton'

import { CategorySelect } from '../CategorySelect';

import {
  Container,
  Header,
  Title,
  Form,
  Fields,
  TransactionsTypes
} from './styles'
import { useState } from 'react'

interface IFormData {
  name: string
  amount: string
}

export function Register() {
  const [category, setCategory] = useState({
    key: 'category',
    name: 'Categoria',
  })
  const [transactionType, setTransactionType] = useState('')
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)

  const {
    control,
    handleSubmit,
  } = useForm()

  function handleSelectTransactionType(type: 'up' | 'down') {
    setTransactionType(type)
  }

  function handleOpenSelectCategoryModal() {
    setIsCategoryModalOpen(true)
  }

  function handleCloseSelectCategoryModal() {
    setIsCategoryModalOpen(false)
  }

  function handleRegister({ name, amount }: IFormData) {
    const data = {
      name,
      amount,
      transactionType,
      category: category.key
    }

    console.log(data)
  }

  return (
    <Container>
      <Header>
        <Title>Cadastro</Title>
      </Header>

      <Form>
        <Fields>
          <InputForm
            name="name"
            control={control}
            placeholder="Nome"
          />
          
          <InputForm
            name="amount"
            control={control}
            placeholder="Preço"
          />

          <TransactionsTypes>
            <TransactionTypeButton
              type="up"
              title="Entrada"
              isActive={transactionType === 'up'}
              onPress={() => handleSelectTransactionType('up')}
            />

            <TransactionTypeButton
              type="down"
              title="Saída"
              isActive={transactionType === 'down'}
              onPress={() => handleSelectTransactionType('down')}
            />
          </TransactionsTypes>
          
          <CategorySelectButton
            title={category.name}
            onPress={handleOpenSelectCategoryModal}
          />
        </Fields>

        <Button
          title="Enviar"
          onPress={handleSubmit(handleRegister)}
        />
      </Form>

      <Modal visible={isCategoryModalOpen}>
        <CategorySelect
          category={category}
          setCategory={setCategory}
          closeSelectCategory={handleCloseSelectCategoryModal}
        />
      </Modal>
    </Container>
  )
}