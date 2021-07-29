import React, { useState } from 'react'
import {
  Keyboard,
  Modal,
  TouchableWithoutFeedback,
  Alert
} from "react-native";
import { useForm } from 'react-hook-form';
import { useNavigation } from '@react-navigation/core';
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid'

import { InputForm } from '../../components/Forms/InputForm'
import { Button } from '../../components/Forms/Button'
import { TransactionTypeButton } from '../../components/Forms/TransactionTypeButton'
import { CategorySelectButton } from '../../components/Forms/CategorySelectButton'

import { useAuth } from '../../hooks/auth';
import { CategorySelect } from '../CategorySelect';

import {
  Container,
  Header,
  Title,
  Form,
  Fields,
  TransactionsTypes
} from './styles'

interface IFormData {
  name: string
  amount: string
}

const validationSchema = Yup.object().shape({
  name: Yup
    .string()
    .required('Nome é obrigatório'),
  amount: Yup
    .number()
    .typeError('Informe um valor numérico')
    .positive('Valor não pode ser negativo')
    .required('Valor é obrigatório'),
})

export function Register() {
  const [category, setCategory] = useState({
    key: 'category',
    name: 'Categoria',
  })
  const [transactionType, setTransactionType] = useState('')
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  
  const { user } = useAuth()

  const navigation = useNavigation()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema)
  })

  function handleSelectTransactionType(type: 'up' | 'down') {
    setTransactionType(type)
  }

  function handleOpenSelectCategoryModal() {
    setIsCategoryModalOpen(true)
  }

  function handleCloseSelectCategoryModal() {
    setIsCategoryModalOpen(false)
  }

  async function handleRegister({ name, amount }: IFormData) {
    if (!transactionType) {
      return Alert.alert('Selecione o tipo da transação')
    }

    if (category.key === 'category') {
      return Alert.alert('Selecione a categoria')
    }
    
    const transaction = {
      id: String(uuid.v4()),
      name,
      amount,
      transactionType,
      category: category.key,
      date: new Date()
    }

    try {
      const dataKey = `@gofinances:transactions?user=${user.id}`

      const data = await AsyncStorage.getItem(dataKey)
      const currentTransactions = data ? JSON.parse(data) : []

      const newTransactions = [
        ...currentTransactions,
        transaction
      ]
      
      await AsyncStorage.setItem(dataKey, JSON.stringify(newTransactions))

      setCategory({
        key: 'category',
        name: 'Categoria',
      })
      setTransactionType('')

      reset()

      navigation.navigate('Listagem')
    } catch (error) {
      console.log(error)
      Alert.alert('Não foi possível cadastrar')
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
              autoCapitalize="sentences"
              autoCorrect={false}
              error={errors.name && errors.name.message}
            />
            
            <InputForm
              name="amount"
              control={control}
              placeholder="Preço"
              keyboardType="numeric"
              error={errors.amount && errors.amount.message}
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
              testID="button-category-select"
              title={category.name}
              onPress={handleOpenSelectCategoryModal}
            />
          </Fields>

          <Button
            title="Enviar"
            onPress={handleSubmit(handleRegister)}
          />
        </Form>

        <Modal testID="modal-category" visible={isCategoryModalOpen}>
          <CategorySelect
            category={category}
            setCategory={setCategory}
            closeSelectCategory={handleCloseSelectCategoryModal}
          />
        </Modal>
      </Container>
    </TouchableWithoutFeedback>
  )
}