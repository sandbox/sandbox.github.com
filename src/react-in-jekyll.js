import React from 'react';

class HelloWorld extends React.Component {
  render() {
    return <div>
      <p>This is a post generated using react and ES6.</p>
      <p>Webpack builds the source with grunt automatically and then jekyll serves it.</p>
      <p>It requires both grunt and jekyll serve processes to run.</p>
    </div>;
  }
}

React.render(<HelloWorld />, document.getElementById("react-body"));
