module.exports = {
  context: __dirname + "/src",
  entry: "./index",
  output: {
    path: __dirname + "/dist",
    filename: "barba.js",
    library: "Barba",
    publicPath: 'http://localhost:8080/dist',
    libraryTarget: "umd",
    umdNamedDefine: true
  },
  devtool: 'source-map'
}
