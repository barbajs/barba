export const getRoutes = () => [
  {
    path: '/features/:type',
    name: 'feature',
  },
  {
    path: '/docs/:section/:subsection',
    name: 'docs',
  },
  {
    path: '/:page',
    name: 'page',
  },
  {
    path: '/',
    name: 'home',
  },
]
