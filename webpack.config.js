var path = require('path');
var grunt = require('grunt');
var webpack = require('webpack');

module.exports = {
  context: __dirname + "/src",
  entry: grunt.file.expand({cwd: path.resolve('src')}, "*").reduce(
    function(map, page) {
      if (page.match(/.js$/)) {
        map[page] = "./" + page;
      }
      return map;
    }, {}),
  output: {
    path: path.join(__dirname, "public", "js"),
    filename: '[name]'
  },
  module: {
    loaders: [
      { test: /\.coffee$/, loader: 'coffee-loader' },
      { test: /\.js$/, loaders: ['babel-loader'] }
    ]
  },
  externals: {
    "vega": "vg",
    "d3": "d3",
    "react": "React"
  },
  plugins: [
    // new webpack.optimize.UglifyJsPlugin({minimize: true})
  ],
  resolve: {
    extensions: ['', '.js', '.json', '.coffee']
  },
  resolveLoader: {
    modulesDirectories: [
      'node_modules'
    ]
  }
}
