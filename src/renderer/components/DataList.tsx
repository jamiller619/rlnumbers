import { HTMLAttributes } from 'react'
import { VscTrash } from 'react-icons/vsc'
import styled from 'styled-components'
import { SpaceProps, space } from 'styled-system'
import { IconButton, Label, Text } from './elements'

export type DataObject = {
  [key: string | number]: unknown
  text: string
}

type DatalistProps<T extends DataObject> = HTMLAttributes<HTMLUListElement> &
  SpaceProps & {
    data: T[]
    onDelete: (item: T) => void
  }

const ListItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${({ theme }) => theme.colors.surfaceBgSubtle};
  border-bottom: 1px solid ${({ theme }) => theme.colors.surfaceBorder};

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceBgHover};
  }

  &:active {
    background: ${({ theme }) => theme.colors.surfaceBgActive};
  }

  > * {
    padding: 1rem;
  }

  button {
    border: none;
    display: flex;
    border-radius: 0;
    background: none;
    border-left: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  }

  ${Label} {
    color: ${({ theme }) => theme.colors.surfaceText};
    font-size: small;
  }
`

const List = styled.ul`
  ${space}
  display: block;
  list-style: none;
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-bottom: 0;
  border-radius: ${({ theme }) => theme.borderRadius};

  ${ListItem}:first-child {
    border-top-left-radius: inherit;
    border-top-right-radius: inherit;
  }

  ${ListItem}:last-child {
    border-bottom-left-radius: inherit;
    border-bottom-right-radius: inherit;
  }
`

export default function Datalist<T extends DataObject>({
  data,
  onDelete,
  ...props
}: DatalistProps<T>) {
  return (
    <List {...props}>
      {data.map((item, i) => {
        return (
          <ListItem key={item.text + i}>
            <Label>{item.text}</Label>
            <IconButton icon={VscTrash} onClick={() => onDelete(item)} />
          </ListItem>
        )
      })}
    </List>
  )
}
