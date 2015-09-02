var path = require('path');
var grunt = require('grunt');
var webpack = require('webpack');

var entries = grunt.file.expand({cwd: path.resolve('src')}, "*").reduce(
  function(map, page) {
    if (page.match(/.js$/)) {
      map[page.slice(0, page.length - 3)] = "./" + page;
    }
    return map;
  }, {});

module.exports = {
  context: __dirname + "/src",
  entry: entries,
  output: {
    path: path.join(__dirname, "public", "js"),
    filename: '[name].js'
  },
  module: {
    loaders: [
      { test: /\.coffee$/, loader: 'coffee-loader' },
      {
        test: /\.js$/,
        loaders: ['babel-loader'],
        include: path.join(__dirname, 'src')
      }
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
