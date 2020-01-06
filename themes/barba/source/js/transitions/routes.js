const { hostname } = window.location
const root = hostname === 'barbajs.github.io' ? '/website.v2/' : '/'

export const getRoutes = () => [
  {
    path: `${root}features/:type`,
    name: 'feature',
  },
  {
    path: `${root}docs/:section/:subsection`,
    name: 'doc',
  },
  {
    path: `${root}:page`,
    name: 'page',
  },
  {
    path: `${root}`,
    name: 'home',
  },
]
