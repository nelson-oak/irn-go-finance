import React,  { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { HistoryCard } from '../../components/HistoryCard'

import {
  Container,
  Header,
  Title,
  Content,
} from './styles'
import { categories } from '../../utils/categories'

interface ITransactionData {
  transactionType: 'up' | 'down'
  name: string
  amount: string
  category: string
  date: string
}

interface ICategoriesTotal {
  key: string
  name: string
  color: string
  total: string
}

export function Resume() {
  const [categoriesTotal, setCategoriesTotal] = useState<ICategoriesTotal[]>([])

  async function loadData() {
    const dataKey = '@gofinances:transactions'

    const data = await AsyncStorage.getItem(dataKey)
    const transactions: ITransactionData[] = data ? JSON.parse(data) : []

    const outcome = transactions
      .filter(transaction => transaction.transactionType === 'down')

    const newCategoriesTotal: ICategoriesTotal[] = []

    categories.forEach(category => {
      let categorySum = 0


      outcome.forEach(transaction => {
        if (transaction.category === category.key) {
          categorySum += Number(transaction.amount)
        }
      })

      if (categorySum > 0) {
        newCategoriesTotal.push({
          key: category.key,
          name: category.name,
          color: category.color,
          total: categorySum
            .toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            })
        })
      }
    })

    setCategoriesTotal(newCategoriesTotal)
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <Container>
      <Header>
        <Title>Resumo por categoria</Title>
      </Header>

      <Content>
        {
          categoriesTotal.map(category => (
            <HistoryCard
              key={category.key}
              title={category.name}
              amount={category.total}
              color={category.color}
            />
          ))
        }
      </Content>
    </Container>
  )
}