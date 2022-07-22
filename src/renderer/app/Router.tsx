import { RouteObject, useRoutes } from 'react-router-dom'
import Layout from '~/components/Layout'
import { Game, Overview } from '~/pages'

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Overview /> },
      { path: '/replay', element: <Game /> },
      // { path: '/settings', element: <Settings /> },
    ],
  },
]

export default function Router(): JSX.Element | null {
  const router = useRoutes(routes)

  return router
}
