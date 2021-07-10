import React,  { useCallback, useState } from 'react'
import { useTheme } from 'styled-components'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { VictoryPie } from 'victory-native'
import { addMonths, subMonths, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { HistoryCard } from '../../components/HistoryCard'

import {
  Container,
  LoadContainer,
  Header,
  Title,
  MonthSelect,
  MonthSelectButton,
  MonthSelectIcon,
  Month,
  ChartContainer,
} from './styles'
import { categories } from '../../utils/categories'
import { RFValue } from 'react-native-responsive-fontsize'
import { useFocusEffect } from '@react-navigation/native'
import { ActivityIndicator, FlatList } from 'react-native'
import { useAuth } from '../../hooks/auth'

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
  const [isLoading, setIsLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [categoriesTotal, setCategoriesTotal] = useState<ICategoriesTotal[]>([])

  const { user } = useAuth()

  const theme = useTheme()

  function handleDateChange(action: 'prev' | 'next') {
    if (action === 'prev') {
      setSelectedDate(subMonths(selectedDate, 1));    } else {
      setSelectedDate(addMonths(selectedDate, 1));
    }
  }

  async function loadData() {
    setIsLoading(true)

    const dataKey = `@gofinances:transactions?user=${user.id}`

    const data = await AsyncStorage.getItem(dataKey)
    const transactions: ITransactionData[] = data ? JSON.parse(data) : []

    const outcome = transactions
      .filter(transaction => {
        return transaction.transactionType === 'down'
          && new Date(transaction.date).getMonth() === selectedDate.getMonth()
          && new Date(transaction.date).getFullYear() === selectedDate.getFullYear()
      })

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
    setIsLoading(false)
  }

  useFocusEffect(useCallback(() => {
    loadData()
  }, [selectedDate]))

  return (
    <Container>
      <Header>
        <Title>Resumo por categoria</Title>
      </Header>

      {
        isLoading
          ? <LoadContainer>
            <ActivityIndicator color={theme.colors.primary} size="large" />
          </LoadContainer>
          : <>
              <MonthSelect>
                <MonthSelectButton onPress={() => handleDateChange('prev')}>
                  <MonthSelectIcon name="chevron-left" />
                </MonthSelectButton>

                <Month>
                  {format(selectedDate, 'MMMM, yyyy', { locale: ptBR })}
                </Month>
                
                <MonthSelectButton onPress={() => handleDateChange('next')}>
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
                    },
                  }}
                  height={RFValue(300)}
                  labelRadius={RFValue(70)}
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
            </>
      }
    </Container>
  )
}