import { RouteObject, useRoutes } from 'react-router-dom'
import Layout from '~/components/Layout'
import { Home, Match, Settings } from '~/pages'

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: '/match', element: <Match /> },
      { path: '/settings', element: <Settings /> },
    ],
  },
]

export default function Router(): JSX.Element | null {
  const router = useRoutes(routes)

  return router
}
