import { HTMLAttributes, ReactNode } from 'react'
import styled from 'styled-components'

type PageProps = Omit<HTMLAttributes<HTMLDivElement>, 'title'> & {
  children: ReactNode | ReactNode[]
  title: string
}

const Title = styled.h1`
  margin: 2rem 0 1rem 2rem;
  font-size: 24px;
`

const Content = styled.div`
  margin: 2rem;
`

export default function Page({
  children,
  title,
  ...props
}: PageProps): JSX.Element {
  return (
    <div {...props}>
      <Title>{title}</Title>
      <Content>{children}</Content>
    </div>
  )
}
