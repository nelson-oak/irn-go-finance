import React from 'react'

import {
  Container,
  Title,
  Amount,
  Footer,
  Category,
  Icon,
  CategoryName,
  Date,
} from './styles'

interface ICategory {
  name: string
  icon: string
}

interface IData {
  title: string
  amount: string
  category: ICategory
  date: string
}

interface ITransactionCardProps {
  data: IData
}

export function TransactionCard({ data }: ITransactionCardProps) {
  return (
    <Container>
      <Title>{data.title}</Title>

      <Amount>{data.amount}</Amount>

      <Footer>
        <Category>
          <Icon name={data.category.icon} />
          <CategoryName>{data.category.name}</CategoryName>
        </Category>

        <Date>{data.date}</Date>
      </Footer>
    </Container>
  )
}