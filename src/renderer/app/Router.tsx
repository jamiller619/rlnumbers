import { RouteObject, useRoutes } from 'react-router-dom'
import Main from '~/app/Main'
import { Settings } from '~/features/settings'
import { Match, Overview } from '~/pages'

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Main />,
    children: [
      { index: true, element: <Overview /> },
      { path: '/match', element: <Match /> },
      { path: '/settings', element: <Settings /> },
    ],
  },
]

export default function Router(): JSX.Element | null {
  const router = useRoutes(routes)

  return router
}
