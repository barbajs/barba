const { hostname } = window.location
const root = hostname === 'barba.js.org' ? '/preview/v2/' : '/'

export const getRoutes = () => [
  {
    path: `${root}features/:type`,
    name: 'feature',
  },
  {
    path: `${root}docs/:section/:subsection`,
    name: 'docs',
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
