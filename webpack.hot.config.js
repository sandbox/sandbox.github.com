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
    filename: '[name].hot.js',
    publicPath: 'http://localhost:8080/'
  },
  module: {
    loaders: [
      { test: /\.coffee$/,
        loaders: ['react-hot', 'coffee-loader', 'cjsx-loader'],
        include: path.join(__dirname, 'src')
      },
      {
        test: /\.js$/,
        loaders: ['react-hot', 'babel-loader'],
        include: path.join(__dirname, 'src')
      }
    ]
  },
  externals: {
    "vega": "vg",
    "d3": "d3",
    "datalib": "dl"
  },
  devServer: {
    publicPath: 'http://localhost:8080/',
    contentBase: "./src",
    hot: true,
    inline: true,
    devtool: 'eval',
    headers: { 'Access-Control-Allow-Origin': '*' }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
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
