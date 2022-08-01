import { BrowserRouter } from 'react-router-dom'
import Router from '~/app/Router'
import StyleProvider from '~/style/StyleProvider'

export default function App(): JSX.Element {
  return (
    <StyleProvider>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </StyleProvider>
  )
}
