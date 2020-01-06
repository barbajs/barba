const devPath = '/website.v2/'

export default [
  {
    path: `(${devPath}|/)features/:type`,
    name: 'feature',
  },
  {
    path: `(${devPath}|/)/docs/:section/:subsection`,
    name: 'doc',
  },
  {
    path: `(${devPath}|/):page`,
    name: 'page',
  },
  {
    path: `(${devPath}|/)`,
    name: 'home',
  },
]
