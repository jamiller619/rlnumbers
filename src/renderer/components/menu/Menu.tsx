import Color from 'color'
import { HTMLAttributes } from 'react'
import { VscHome, VscRocket, VscSettingsGear } from 'react-icons/vsc'
import { Link, LinkProps, useMatch, useResolvedPath } from 'react-router-dom'
import styled from 'styled-components'
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

const Nav = styled.div`
  display: flex;
  flex-direction: inherit;

  > * {
    margin-bottom: 0.75rem;
  }
`

const StyledNavLink = styled(Link)<{ $active: boolean }>`
  color: ${({ theme, $active }) =>
    $active ? theme.colors.accent : theme.colors.primary500};
  cursor: ${({ $active }) => ($active ? 'default' : 'pointer')};
  border-radius: 0.75rem;
  border: 2px solid
    ${({ theme, $active }) => ($active ? theme.colors.accent : 'transparent')};
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition-property: background border;
  transition-duration: 200ms;
  transition-timing-function: ease-in-out;

  &:hover {
    color: ${({ theme, $active }) => !$active && theme.colors.primary};
    background: ${({ theme, $active }) =>
      !$active && Color(theme.colors.primary).alpha(0.05).rgb().string()};
  }

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
      <Nav>
        <NavLink to="/">
          <VscHome />
        </NavLink>
        <NavLink to="/match">
          <VscRocket />
        </NavLink>
      </Nav>
      <SettingsLink to="/settings">
        <VscSettingsGear />
      </SettingsLink>
    </Container>
  )
}
