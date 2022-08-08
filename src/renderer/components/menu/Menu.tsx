import { HTMLAttributes } from 'react'
import { VscHome, VscRocket, VscSettingsGear } from 'react-icons/vsc'
import { Link, LinkProps, useMatch, useResolvedPath } from 'react-router-dom'
import styled, { DefaultTheme, css } from 'styled-components'
import Logo from './Logo'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const StyledLogo = styled(Logo)`
  height: 64px;
  margin: 1rem 1rem 3rem;
  width: 64px;
`

const Navigation = styled.div`
  display: flex;
  flex-direction: inherit;

  > * {
    margin-bottom: 0.75rem;
  }
`

const StyledNavLink = styled(Link)<{ $active: boolean }>`
  border-width: 2px;
  border-style: solid;
  color: ${({ theme }) => theme.colors.primary.base};
  cursor: pointer;
  border-color: transparent;
  border-radius: 0.75rem;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition-property: background border;
  transition-duration: 200ms;
  transition-timing-function: ease-in-out;

  ${({ $active }) =>
    $active
      ? css`
          color: ${({ theme }) => theme.colors.accent.solid};
          cursor: unset;
          border-color: ${({ theme }) => theme.colors.accent.solid};
        `
      : css`
          &:hover {
            color: ${({ theme }) => theme.colors.surface.text};
            background: ${({ theme }) => theme.colors.surface.bgHover};
          }
        `}

  svg {
    fill: currentColor;
    width: 1.6rem;
    height: 1.6rem;
  }
`

const NavLink = ({ children, to, ...props }: LinkProps) => {
  const resolved = useResolvedPath(to)
  const match = useMatch({ path: resolved.pathname, end: true })

  return (
    <StyledNavLink $active={match != null} to={to} {...props}>
      {children}
    </StyledNavLink>
  )
}

const SettingsLink = styled(NavLink)`
  margin-bottom: 1rem;
`

export default function Menu(props: HTMLAttributes<HTMLElement>): JSX.Element {
  return (
    <Container {...props}>
      <StyledLogo />
      <Navigation>
        <NavLink to="/">
          <VscHome />
        </NavLink>
        <NavLink to="/match">
          <VscRocket />
        </NavLink>
      </Navigation>
      <SettingsLink to="/settings">
        <VscSettingsGear />
      </SettingsLink>
    </Container>
  )
}
