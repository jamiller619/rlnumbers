import { ReactNode } from 'react'
import { Box, BoxProps, Label } from '~/elements'

type ControlProps = BoxProps & {
  label?: string
  children?: ReactNode
}

export default function Control({ children, label, ...props }: ControlProps) {
  return (
    <Box mb={4} {...props}>
      <Label mb={3}>{label}</Label>
      {children}
    </Box>
  )
}
