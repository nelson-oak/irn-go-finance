import React, { useState } from 'react'

import { useFocusEffect } from '@react-navigation/core'

import {
  Container,
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
import { useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useCallback } from 'react'
import { string } from 'yargs'

export interface ITransactionListData extends ITransactionCardData {
  id: string
}

interface IHighLightDataProps {
  total: string
}

interface IHighlightData {
  income: IHighLightDataProps
  outcome: IHighLightDataProps
  balance: IHighLightDataProps
}

export function Dashboard() {
  const [transactions, setTransactions] = useState<ITransactionListData[]>([])
  const [highlighData, setHighlightData] = useState<IHighlightData>({} as IHighlightData)

  async function loadTransactions() {
    const dataKey = '@gofinances:transactions'

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
        date
      }
    })

    const total = incomeTotal - outcomeTotal
    
    setHighlightData({
      income: {
        total: incomeTotal
          .toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }),
      },
      outcome: {
        total: outcomeTotal
          .toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }),
      },
      balance: {
        total: total
          .toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }),
      }
    })
    setTransactions(formattedTransactions)
    console.log(transactions)
  }

  useEffect(() => {
    loadTransactions()
  }, [])

  useFocusEffect(useCallback(() => {
    loadTransactions()
  }, []))

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

          <LogoutButton onPress={() => {}}>
            <Icon name="power" />
          </LogoutButton>
        </UserWrapper>
      </Header>

      <HighlightCards>
        <HighlightCard
          type="up"
          title="Entradas"
          amount={highlighData.income.total}
          lastTransaction="Última entrada dia 13 de abril"
        />
        <HighlightCard
          type="down"
          title="Saídas"
          amount={highlighData.outcome.total}
          lastTransaction="Última saída dia 03 de abril"
        />
        <HighlightCard
          type="total"
          title="Total"
          amount={highlighData.balance.total}
          lastTransaction="01 à 16 de abril"
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
    </Container>
  )
}

