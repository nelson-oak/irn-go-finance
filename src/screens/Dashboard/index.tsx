import React, { useState, useEffect, useCallback } from 'react'
import { ActivityIndicator } from 'react-native'
import { useTheme } from 'styled-components'
import { useFocusEffect } from '@react-navigation/core'
import AsyncStorage from '@react-native-async-storage/async-storage'

import {
  Container,
  LoadContainer,
  Header,
  UserWrapper,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  LogoutButton,
  Icon,
  HighlightCards,
  Transactions,
  Title,
  TransactionsList,
} from './styles'
import { HighlightCard } from '../../components/HighlightCard'
import { ITransactionCardData, TransactionCard } from '../../components/TransactionCard'
import { useAuth } from '../../hooks/auth'

export interface ITransactionListData extends ITransactionCardData {
  id: string
}

interface IHighLightDataProps {
  total: string
  lastTransaction: string
}

interface IHighlightData {
  income: IHighLightDataProps
  outcome: IHighLightDataProps
  balance: IHighLightDataProps
}

export function Dashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [transactions, setTransactions] = useState<ITransactionListData[]>([])
  const [highlighData, setHighlightData] = useState<IHighlightData>({} as IHighlightData)

  const { user, signOut } = useAuth()

  const theme = useTheme()

  function getLastTransactionDate(collection: ITransactionListData[], type: 'up' | 'down') {
    const lastTransaction = Math.max.apply(
      Math,
      collection
        .filter(item => item.transactionType === type)
        .map(item => new Date(item.date).getTime())
    )

    try {
      const formattedLastTransaction = `${
        Intl
          .DateTimeFormat('pt-BR', {
            day: '2-digit',
          })
          .format(new Date(lastTransaction))
      } de ${
        Intl
          .DateTimeFormat('pt-BR', {
            month: 'long',
          })
          .format(new Date(lastTransaction))
      }`
      
      return formattedLastTransaction
    } catch {
      return 0
    }
  }

  async function loadTransactions() {
    const dataKey = `@gofinances:transactions?user=${user.id}`

    const data = await AsyncStorage.getItem(dataKey)
    const transactionsData = data ? JSON.parse(data) : []

    let incomeTotal = 0;
    let outcomeTotal = 0;

    const formattedTransactions: ITransactionListData[] = transactionsData.map((transaction: ITransactionListData) => {
      if (transaction.transactionType === 'up') {
        incomeTotal += Number(transaction.amount)
      } else {
        outcomeTotal += Number(transaction.amount)
      }

      const amount = Number(transaction.amount)
        .toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        })
      
      const date = Intl
        .DateTimeFormat('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit'
        })
        .format(new Date(transaction.date))
      
      return {
        id: transaction.id,
        name: transaction.name,
        amount,
        transactionType: transaction.transactionType,
        category: transaction.category,
        date,
        timestamp: new Date(transaction.date).getTime()
      }
    })

    setTransactions(formattedTransactions)

    const lastIncomeTransaction = getLastTransactionDate(transactionsData, 'up')
    const lastOutcomeTransaction = getLastTransactionDate(transactionsData, 'down')
    const totalInterval = lastOutcomeTransaction === 0
      ? 'Não há transações'
      : `01 a ${lastOutcomeTransaction}`

    const total = incomeTotal - outcomeTotal
    
    setHighlightData({
      income: {
        total: incomeTotal
          .toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }),
        lastTransaction: lastIncomeTransaction === 0
          ? 'Não há transações'
          : `Última entrada dia ${lastIncomeTransaction}`
      },
      outcome: {
        total: outcomeTotal
          .toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }),
        lastTransaction: lastOutcomeTransaction === 0
          ? 'Não há transações'
          : `Última saída dia ${lastOutcomeTransaction}`
      },
      balance: {
        total: total
          .toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }),
        lastTransaction: totalInterval
      }
    })
    
    setIsLoading(false)
  }

  useEffect(() => {
    loadTransactions()
  }, [])

  useFocusEffect(useCallback(() => {
    loadTransactions()
  }, [transactions]))

  return (
    <Container>
      {
        isLoading
          ? <LoadContainer>
            <ActivityIndicator color={theme.colors.primary} size="large" />
          </LoadContainer>
          : <>
            <Header>
              <UserWrapper>
                <UserInfo>
                  <Photo source={{ uri: user.photo }} />
                  <User>
                    <UserGreeting>Olá,</UserGreeting>
                    <UserName>{user.name}</UserName>
                  </User>
                </UserInfo>

                <LogoutButton onPress={signOut}>
                  <Icon name="power" />
                </LogoutButton>
              </UserWrapper>
            </Header>

            <HighlightCards>
              <HighlightCard
                type="up"
                title="Entradas"
                amount={highlighData.income.total}
                lastTransaction={highlighData.income.lastTransaction}
              />
              <HighlightCard
                type="down"
                title="Saídas"
                amount={highlighData.outcome.total}
                lastTransaction={highlighData.outcome.lastTransaction}
              />
              <HighlightCard
                type="total"
                title="Total"
                amount={highlighData.balance.total}
                lastTransaction={highlighData.balance.lastTransaction}
              />
            </HighlightCards>

            <Transactions>
              <Title>Listagem</Title>

              <TransactionsList
                data={transactions}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <TransactionCard data={item}/>}
              />
            </Transactions>
          </>
      }
    </Container>
  )
}

