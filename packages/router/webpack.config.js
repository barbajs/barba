const isProd = process.env.NODE_ENV === 'production';
const webpackBase = require('../../webpack.config.js');

module.exports = {
  ...webpackBase,
  entry: './src/index.js',
  output: {
    filename: isProd ? 'barba-router.min.js' : 'barba-router.js',
    library: 'Barba router',
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
};
