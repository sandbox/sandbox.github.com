import React from 'react'

export default class HelloWorld extends React.Component {
  render() {
    return <div>
      <p>This is a post mostly generated using react and ES6.</p>
      <p>Webpack builds the source automatically on file changes and then jekyll serves it.
        I start these processes using: <code>foreman start --formation="webpack_watch=1,webpack_server=1,jekyll=1"</code>.
        For convenience, I bound this to <code>npm start</code> in the <code>package.json</code>.
      </p>
      <p>To speed up testing while updating react classes, I set up react-hot-reload.</p>
      <p>This allows real-time updates to the react classes, without a reload!</p>
      <p>Things I had to do to get this work:</p>
      <ul>
      <li>Added <code>react-hot</code> to the js loaders:</li>
      <li>Change <code>output.publicPath</code> to my webpack-dev-server host and port:</li>
      <li>Add plugins: <code>webpack.HotModuleReplacementPlugin</code> and <code>webpack.NoErrorsPlugin</code></li>
      <li>Set up webpack config <code>devServer</code> for serving, particularly adding headers for <code>'Access-Control-Allow-Origin': '*'</code></li>
      <li>Remove react from webpack externals and load it as a node module</li>
      <li>Add flag to javascript include to switch between serving from <code>webpack-dev-server</code> during development to the final build location</li>
      <li>Serve the javascript files from the webpack-dev-server <code>publicPath</code></li>
      <li>Then run <code>webpack-dev-server --config webpack.hot.config.js</code></li>
      </ul>
    </div>
  }
}
