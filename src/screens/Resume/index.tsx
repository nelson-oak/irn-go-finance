import React,  { useCallback, useEffect, useState } from 'react'
import { useTheme } from 'styled-components'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { VictoryPie } from 'victory-native'

import { HistoryCard } from '../../components/HistoryCard'

import {
  Container,
  Header,
  Title,
  MonthSelect,
  MonthSelectButton,
  MonthSelectIcon,
  Month,
  ChartContainer,
} from './styles'
import { categories } from '../../utils/categories'
import { string } from 'yup/lib/locale'
import { RFValue } from 'react-native-responsive-fontsize'
import { useFocusEffect } from '@react-navigation/native'
import { FlatList } from 'react-native'

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
  total: number
  formattedTotal: string
  percentage: string
}

export function Resume() {
  const [categoriesTotal, setCategoriesTotal] = useState<ICategoriesTotal[]>([])

  const theme = useTheme()

  async function loadData() {
    const dataKey = '@gofinances:transactions'

    const data = await AsyncStorage.getItem(dataKey)
    const transactions: ITransactionData[] = data ? JSON.parse(data) : []

    const outcome = transactions
      .filter(transaction => transaction.transactionType === 'down')

    const outcomeTotal = outcome
      .reduce((accumulator, transaction) => {
        return accumulator + Number(transaction.amount)
      }, 0)

    const newCategoriesTotal: ICategoriesTotal[] = []

    categories.forEach(category => {
      let categorySum = 0

      outcome.forEach(transaction => {
        if (transaction.category === category.key) {
          categorySum += Number(transaction.amount)
        }
      })

      const formattedCategorySum = categorySum
        .toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        })
      const percentage = ((categorySum / outcomeTotal) * 100).toFixed(0)

      if (categorySum > 0) {
        newCategoriesTotal.push({
          key: category.key,
          name: category.name,
          color: category.color,
          formattedTotal: formattedCategorySum,
          total: categorySum,
          percentage: `${percentage}%`,
        })
      }
    })

    setCategoriesTotal(newCategoriesTotal)
  }

  useEffect(() => {
    loadData()
  }, [])

  useFocusEffect(useCallback(() => {
    loadData()
  }, []))

  return (
    <Container>
      <Header>
        <Title>Resumo por categoria</Title>
      </Header>

      <MonthSelect>
        <MonthSelectButton>
          <MonthSelectIcon name="chevron-left" />
        </MonthSelectButton>

        <Month>Agosto</Month>
        
        <MonthSelectButton>
          <MonthSelectIcon name="chevron-right" />
        </MonthSelectButton>
      </MonthSelect>

      <ChartContainer>
        <VictoryPie
          data={categoriesTotal}
          colorScale={categoriesTotal.map(category => category.color)}
          style={{
            labels: {
              fontFamily: theme.fonts.bold,
              fontWeight: 'bold',
              fill: theme.colors.shape,
              fontSize: RFValue(14)
            }
          }}
          labelRadius={80}
          x="percentage"
          y="total"
        />
      </ChartContainer>
        

      <FlatList
        data={categoriesTotal}
        style={{ flex: 1, width: '100%', paddingHorizontal: 24 }}
        keyExtractor={item => item.key}
        renderItem={({ item }) => (
          <HistoryCard
            title={item.name}
            amount={item.formattedTotal}
            color={item.color}
          />
        )}
      />
    </Container>
  )
}