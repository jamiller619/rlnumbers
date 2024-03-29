import { HTMLAttributes } from 'react'
import { VscTrash } from 'react-icons/vsc'
import styled from 'styled-components'
import { SpaceProps, space } from 'styled-system'
import { IconButton, Label } from '../elements'

export type DataListItem = {
  [key: string | number]: unknown
  text: string
  deletable?: boolean
}

type DatalistProps<T extends DataListItem> = HTMLAttributes<HTMLUListElement> &
  SpaceProps & {
    data: T[]
    onDelete: (item: T) => void
  }

const ListItem = styled.li.attrs({
  p: 1,
})`
  ${space}

  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${({ theme }) => theme.colors.surface.bgSubtle};
  border-bottom: 1px solid ${({ theme }) => theme.colors.surface.line};

  &:hover {
    background: ${({ theme }) => theme.colors.surface.bgHover};
  }

  &:active {
    background: ${({ theme }) => theme.colors.surface.bgActive};
  }

  > * {
    padding: 1rem;
  }

  button {
    border: none;
    display: flex;
    border-radius: 0;
    background: none;
    border-left: 1px solid ${({ theme }) => theme.colors.surface.line};
  }

  ${Label} {
    color: ${({ theme }) => theme.colors.surface.text};
    font-size: small;
  }
`

const List = styled.ul`
  ${space}
  display: block;
  list-style: none;
  border: 1px solid ${({ theme }) => theme.colors.surface.line};
  border-bottom: 0;
  border-radius: ${({ theme }) => theme.radii.medium};

  ${ListItem}:first-child {
    border-top-left-radius: inherit;
    border-top-right-radius: inherit;
  }

  ${ListItem}:last-child {
    border-bottom-left-radius: inherit;
    border-bottom-right-radius: inherit;
  }
`

export default function Datalist<T extends DataListItem>({
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
            {item.deletable === false ? null : (
              <IconButton icon={VscTrash} onClick={() => onDelete(item)} />
            )}
          </ListItem>
        )
      })}
    </List>
  )
}
