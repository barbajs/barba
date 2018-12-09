const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const isProd = process.env.NODE_ENV === 'production';

const config = {
  mode: isProd ? 'production' : 'development',
  optimization: {
    minimize: isProd,
  },
  resolve: {
    mainFields: ['module', 'browser', 'main'],
  },
  module: {
    rules: [
      {
        test: /\.(js|mjs)$/,
        // DEV
        // exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          // options: {
          //   plugins: [
          //     '@babel/plugin-proposal-class-properties',
          //     '@babel/plugin-proposal-object-rest-spread',
          //   ],
          // },
        },
      },
    ],
  },
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      reportFilename: '../report.html',
    }),
  ],
};

// DEV
// if (isProd) {
//   config.module.rules
//     .find(rule => rule.use.loader === 'babel-loader')
//     .use.options.plugins.push('transform-remove-console');
// }

module.exports = config;
