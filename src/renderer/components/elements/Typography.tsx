import { HTMLAttributes } from 'react'
import styled, { DefaultTheme, StyledComponent, css } from 'styled-components'
import { SpaceProps, space } from 'styled-system'

type TextProps = HTMLAttributes<HTMLSpanElement> &
  SpaceProps & {
    size?: 'small' | 'medium' | 'large'
  }

const StyledText = styled.span<TextProps>`
  ${space}
  font-size: ${({ size }) =>
    size === 'small' ? '0.8rem' : size === 'large' ? '1.5rem' : '1rem'};
`

export const Text = (props: TextProps) => <StyledText {...props} />

const Small = (props: TextProps) => <Text {...props} size="small" />
const Large = (props: TextProps) => <Text {...props} size="large" />
const Muted = (props: TextProps) => <Text {...props} />

Text.Small = Small
Text.Large = Large
Text.Muted = Muted

export const Copy = styled(StyledText).attrs({
  as: 'p',
})`
  line-height: 1.8;
  max-width: 28em;
`

export const TextBlock = (props: TextProps) => (
  <StyledText as="div" {...props} />
)

export const Label = styled(StyledText)`
  display: block;
`

type SC<T extends keyof JSX.IntrinsicElements | React.ComponentType<unknown>> =
  StyledComponent<T, DefaultTheme, Record<string, unknown>, never>

const heading = css`
  display: block;
  line-height: 1.3;
  font-weight: lighter;
`

export const Heading = styled.h1`
  ${heading}
  font-size: 2rem;
` as SC<'h1'> & {
  Sub: SC<'h2'>
}

Heading.Sub = styled.h2`
  ${heading}
  font-size: 1.5rem;
`
Heading.Sub.displayName = 'Heading.Sub'
