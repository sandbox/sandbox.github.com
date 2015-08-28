var path = require("path");

module.exports = {
  context: __dirname + "/src",
  entry: {
    "react-in-jekyll": "./react-in-jekyll.js"
  },
  output: {
    path: path.join(__dirname, "public", "js"),
    filename: '[name].js'
  },
  module: {
    loaders: [
      { test: /\.coffee$/, loader: 'coffee-loader' },
      { test: /\.js$/, loader: 'babel-loader' }
    ]
  },
  externals: {
    "react": "React"
  },
  plugins: [],
  resolve: {
    extensions: ['', '.js', '.json', '.coffee']
  },
  resolveLoader: {
    modulesDirectories: [
      'node_modules'
    ]
  }
}
