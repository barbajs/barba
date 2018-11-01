console.info('babel.config.js:root');
module.exports = function config(api) {
  api.cache(() => 'barba');

  const presets = ['@babel/preset-env'];
  const plugins = [];

  return {
    presets,
    plugins,
    babelrcRoots: [
      // Keep the root as a root
      '.',
      // Also consider monorepo packages 'root' and load their .babelrc files.
      './packages/*',
    ],
  };
};
