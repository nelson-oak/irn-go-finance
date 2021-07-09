import React from 'react'
import { categories } from '../../utils/categories'

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

export interface ITransactionCardData {
  transactionType: 'up' | 'down'
  name: string
  amount: string
  category: string
  date: string
}

interface ITransactionCardProps {
  data: ITransactionCardData
}

export function TransactionCard({ data }: ITransactionCardProps) {
  const [category] = categories.filter(categoryItem => categoryItem.key === data.category)

  return (
    <Container>
      <Title>{data.name}</Title>

      <Amount type={data.transactionType}>
        { data.transactionType === 'down' && '- '}
        {data.amount}
      </Amount>

      <Footer>
        <Category>
          <Icon name={category.icon} />
          <CategoryName>{category.name}</CategoryName>
        </Category>

        <Date>{data.date}</Date>
      </Footer>
    </Container>
  )
}