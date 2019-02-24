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
