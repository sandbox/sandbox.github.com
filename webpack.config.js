var path = require("path");

module.exports = {
  context: __dirname + "/src",
  entry: {
    "react-in-jekyll": "./react-in-jekyll.js",
    "react-histogram": "./react-histogram.js"
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
    "d3": "d3",
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
