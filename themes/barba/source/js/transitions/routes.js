export default [
  {
    path: '/',
    name: 'home',
  },
  {
    path: '/features/:type',
    name: 'feature',
  },
  {
    path: '/:page',
    name: 'page',
  },
  {
    path: '/docs/:section/:subsection',
    name: 'doc',
  }
];
