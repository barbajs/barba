require('dotenv').config()
const webpack = require('webpack')
const Cryptr = require('cryptr')
const cryptr = new Cryptr('barba.js')

console.info('NODE_ENV', process.env.NODE_ENV)

module.exports = {
  mode:
    process.env.NODE_ENV === 'production'
      ? process.env.NODE_ENV
      : 'development',
  entry: ['../themes/barba/source/_js/main.js'],
  output: {
    filename: 'js/main.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              babelrc: false,
              presets: [
                [
                  '@babel/preset-env',
                  {
                    debug: false,
                    modules: false,
                    targets: {
                      browsers: [
                        'last 2 Chrome versions',
                        'not Chrome < 60',
                        'last 2 Safari versions',
                        'not Safari < 10.1',
                        'last 2 iOS versions',
                        'not iOS < 10.3',
                        'last 2 Firefox versions',
                        'not Firefox < 54',
                        'last 2 Edge versions',
                        'not Edge < 15',
                      ],
                    },
                    useBuiltIns: false,
                  },
                ],
              ],
              plugins: ['@babel/plugin-proposal-class-properties'],
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        FIREBASE_UID: JSON.stringify(cryptr.encrypt(process.env.FIREBASE_UID)),
      },
    }),
  ],
}
