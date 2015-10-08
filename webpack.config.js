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
    filename: '[name].min.js'
  },
  module: {
    loaders: [
      {
        test: /\.coffee$/,
        loaders: [ 'coffee-loader', 'cjsx-loader' ],
        include: path.join(__dirname, 'src')
      },
      {
        test: /\.js$/,
        loaders: ['babel-loader?stage=1'],
        include: path.join(__dirname, 'src')
      },
      { test: /\.css$/, loader: "style-loader!css-loader" },
      { test: /\.scss$/, loader: "style!css!sass" }
    ]
  },
  externals: {
    "vega": "vg",
    "d3": "d3",
    "datalib": "dl",
    "react": "React",
    "react-dom": "ReactDOM",
    "lodash": "_"
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({minimize: true})
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
