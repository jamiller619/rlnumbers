import { HTMLAttributes } from 'react'
import styled from 'styled-components'
import {
  ColorProps,
  LayoutProps,
  SpaceProps,
  color,
  layout,
  space,
} from 'styled-system'

export type BoxProps = SpaceProps &
  ColorProps &
  LayoutProps &
  HTMLAttributes<HTMLDivElement>

const Box = styled.div<BoxProps>`
  ${space}
  ${color}
  ${layout}
  box-sizing: border-box;
  min-width: 0;
`

export default Box
