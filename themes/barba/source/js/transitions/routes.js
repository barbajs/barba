export default [
  {
    path: '/features/:type',
    name: 'feature',
  },
  {
    path: '/docs/:section/:subsection',
    name: 'doc',
  },
  {
    path: '/:page',
    name: 'page',
  },
  {
    path: '/',
    name: 'home',
  },
];
