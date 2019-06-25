module.exports = {
  entry: ['themes/barba/source/js/main.js'],
  module: {
    loaders: [
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
};
