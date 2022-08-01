import {
  HTMLAttributes,
  MouseEvent,
  ReactNode,
  useCallback,
  useState,
} from 'react'
import { IconType } from 'react-icons/lib'
import styled, { DefaultTheme, css } from 'styled-components'
import { SpaceProps, space } from 'styled-system'

type Variant = 'primary' | 'secondary'

type ButtonProps = Omit<HTMLAttributes<HTMLButtonElement>, 'onClick'> &
  SpaceProps & {
    children?: ReactNode
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void | Promise<void>
    loadingText?: boolean
    variant?: Variant
  }

const variants = (theme: DefaultTheme) => ({
  primary: css`
    color: ${theme.colors.surfaceText};
    background: ${theme.colors.surfaceBase};

    &:hover {
      background: ${theme.colors.surfaceBgSubtle};
    }
  `,
  secondary: css`
    color: ${theme.colors.surfaceText};
    background: ${theme.colors.surfaceBgActive};

    &:hover {
      background: ${theme.colors.surfaceBgHover};
    }
  `,
})

const StyledButton = styled.button<ButtonProps>`
  ${space}

  ${({ theme, variant }) => variant && variants(theme)[variant ?? '']}

  display: block;
  border: none;
  padding: 1rem 1.3rem;
  border-radius: ${({ theme }) => theme.borderRadius};
  font-family: inherit;
  font-weight: 600;
  text-transform: uppercase;
  font-size: smaller;
  transition-property: background color;
  transition-duration: 0.1s;
  transition-timing-function: ease-in-out;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`

export default function Button({
  children,
  onClick,
  loadingText = false,
  ...props
}: ButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = useCallback(
    async (e: MouseEvent<HTMLButtonElement>) => {
      if (onClick) {
        setIsLoading(true)
        await onClick(e)

        setIsLoading(false)
      }
    },
    [onClick]
  )

  return (
    <StyledButton
      variant="secondary"
      {...props}
      onClick={handleClick}
      disabled={isLoading}
    >
      {isLoading && loadingText === true ? 'Loading...' : children}
    </StyledButton>
  )
}

// eslint-disable-next-line react/display-name
Button.Primary = (props: Omit<ButtonProps, 'variant'>) => {
  return <Button variant="primary" {...props} />
}

Button.Primary.displayName = 'Button.Primary'

type IconButtonProps = ButtonProps & {
  icon: IconType
}

export const IconButton = ({ icon, children, ...props }: IconButtonProps) => {
  const Icon = icon

  return (
    <Button {...props}>
      <Icon />
      <span>{children}</span>
    </Button>
  )
}
