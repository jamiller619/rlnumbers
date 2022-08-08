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

export type Variant = 'primary' | 'secondary'

type ButtonProps = Omit<HTMLAttributes<HTMLButtonElement>, 'onClick'> &
  SpaceProps & {
    children?: ReactNode
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void | Promise<void>
    loadingText?: boolean
    variant?: Variant
  }

const variants = (theme: DefaultTheme) => ({
  primary: css`
    color: ${theme.colors.surface.text};
    background: ${theme.colors.surface.bgActive};

    &:hover {
      background: ${theme.colors.surface.bgHover};
    }
  `,
  secondary: css`
    color: ${theme.colors.surface.text};
    background: ${theme.colors.surface.bgHover};

    &:hover {
      background: ${theme.colors.surface.bgActive};
    }
  `,
})

const StyledButton = styled.button<ButtonProps>`
  ${space}

  ${({ theme, variant }) => variant && variants(theme)[variant ?? '']}
  display: block;
  padding: ${({ theme }) => theme.space.medium};
  border: none;
  border-radius: ${({ theme }) => theme.radii.small}px;
  font-family: inherit;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-size: 0.87rem;
  transition-property: background, color;
  transition-duration: 0.15s;
  transition-timing-function: ease-in-out;
  cursor: pointer;

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

Button.Primary = function ButtonPrimary(props: Omit<ButtonProps, 'variant'>) {
  return <Button variant="primary" {...props} />
}

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
