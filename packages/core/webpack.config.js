const isProd = process.env.NODE_ENV === 'production';
const webpackBase = require('../../webpack.config.js');

module.exports = {
  ...webpackBase,
  entry: './src/index.js',
  output: {
    filename: isProd ? 'barba.min.js' : 'barba.js',
    library: 'barba',
    libraryExport: 'default',
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  module: {
    rules: [
      {
        test: /\.(js|mjs)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            // Used for `async`/`await`
            plugins: ['@babel/plugin-transform-runtime'],
          },
        },
      },
    ],
  },
};
