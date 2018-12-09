const isProd = process.env.NODE_ENV === 'production';
const webpackBase = require('../../webpack.config.js');

module.exports = {
  ...webpackBase,
  entry: './src/index.js',
  output: {
    filename: isProd ? 'barba.min.js' : 'barba.js',
    library: 'Barba core',
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
};
