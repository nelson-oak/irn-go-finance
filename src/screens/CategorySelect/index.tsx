import React from "react";
import { FlatList } from "react-native";
import { categories } from "../../utils/categories";

import { Button } from "../../components/Forms/Button";

import {
  Container,
  Header,
  Title,
  Category,
  Icon,
  Name,
  Separator,
  Footer,
} from './styles'

interface ICategory {
  key: string
  name: string
}

interface ICategorySelectProps {
  category: string
  setCategory: (category: ICategory) => void
  closeSelectCategory: () => void
}

export function CategorySelect({
  category,
  setCategory,
  closeSelectCategory
}: ICategorySelectProps) {
  return (
    <Container>
      <Header>
        <Title>Categoria</Title>
      </Header>

      <FlatList
        data={categories}
        style={{ flex: 1, width: '100%'}}
        keyExtractor={item => item.key}
        renderItem={({ item }) => (
          <Category>
            <Icon name={item.icon} />
            <Name>{item.name}</Name>
          </Category>
        )}
        ItemSeparatorComponent={() => <Separator />}
      />

      <Footer>
        <Button title="Selecionar" />
      </Footer>
    </Container>
  )
}