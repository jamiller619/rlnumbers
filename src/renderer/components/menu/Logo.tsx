import { HTMLAttributes } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  /* fill: currentColor; */
  font-size: 50px;
  text-align: center;
  font-weight: bold;
`

export default function Logo(
  props: HTMLAttributes<HTMLDivElement>
): JSX.Element {
  return (
    <Container {...props}>#</Container>
    // <svg
    //   xmlns="http://www.w3.org/2000/svg"
    //   {...props}
    //   x="0px"
    //   y="0px"
    //   viewBox="0 0 256 256"
    // >
    //   <path d="M118.42,115.73h24.06l-4.91,24.54h-24.06L118.42,115.73z M218,79.24v97.51c0,22.78-18.47,41.24-41.24,41.24 H79.24C56.47,218,38,199.53,38,176.76V79.24C38,56.47,56.47,38,79.24,38h97.51C199.53,38,218,56.47,218,79.24z M189.35,91.19h-16.93 l4.42-22.13l-24.06-4.81l-5.39,26.94h-24.05l4.42-22.13l-24.06-4.81l-5.39,26.94H66.65v24.54H93.4l-4.91,24.54H66.65v24.54h16.93 l-4.43,22.13l24.06,4.81l5.4-26.94h24.05l-4.43,22.13l24.06,4.81l5.4-26.94h31.65v-24.54h-26.76l4.91-24.54h21.85V91.19z" />
    // </svg>
  )
}
