import React, { useState } from 'react'

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

export interface ITransactionListData extends ITransactionCardData {
  id: string
}

export function Dashboard() {
  const [transactions, setTransactions] = useState<ITransactionListData[]>([])

  async function loadTransactions() {
    const dataKey = '@gofinances:transactions'

    const data = await AsyncStorage.getItem(dataKey)
    const transactionsData = data ? JSON.parse(data) : []

    const formattedTransactions: ITransactionListData[] = transactionsData.map((transaction: ITransactionListData) => {
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

    setTransactions(formattedTransactions)
    console.log(transactions)
  }

  useEffect(() => {
    loadTransactions()
  }, [])

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
          amount="R$ 17.400,00"
          lastTransaction="Última entrada dia 13 de abril"
        />
        <HighlightCard
          type="down"
          title="Saídas"
          amount="R$ 1.259,00"
          lastTransaction="Última saída dia 03 de abril"
        />
        <HighlightCard
          type="total"
          title="Total"
          amount="R$ 16.141,00"
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

