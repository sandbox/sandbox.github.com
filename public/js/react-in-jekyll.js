/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _componentsHello = __webpack_require__(12);
	
	var _componentsHello2 = _interopRequireDefault(_componentsHello);
	
	_react2['default'].render(_react2['default'].createElement(_componentsHello2['default'], null), document.getElementById("react-body"));

/***/ },

/***/ 1:
/***/ function(module, exports) {

	module.exports = React;

/***/ },

/***/ 12:
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var HelloWorld = (function (_React$Component) {
	  _inherits(HelloWorld, _React$Component);
	
	  function HelloWorld() {
	    _classCallCheck(this, HelloWorld);
	
	    _get(Object.getPrototypeOf(HelloWorld.prototype), "constructor", this).apply(this, arguments);
	  }
	
	  _createClass(HelloWorld, [{
	    key: "render",
	    value: function render() {
	      return React.createElement(
	        "div",
	        null,
	        React.createElement(
	          "p",
	          null,
	          "This is a post mostly generated using react and ES6."
	        ),
	        React.createElement(
	          "p",
	          null,
	          "Webpack builds the source automatically on file changes and then jekyll serves it. I start these processes using: ",
	          React.createElement(
	            "code",
	            null,
	            "foreman start --formation=\"webpack_watch=1,webpack_server=1,jekyll=1\""
	          ),
	          ". For convenience, I bound this to ",
	          React.createElement(
	            "code",
	            null,
	            "npm start"
	          ),
	          " in the ",
	          React.createElement(
	            "code",
	            null,
	            "package.json"
	          ),
	          "."
	        ),
	        React.createElement(
	          "p",
	          null,
	          "To speed up testing while updating react classes, I set up react-hot-reload."
	        ),
	        React.createElement(
	          "p",
	          null,
	          "This allows real-time updates to the react classes, without a reload!"
	        ),
	        React.createElement(
	          "p",
	          null,
	          "Things I had to do to get this work:"
	        ),
	        React.createElement(
	          "ul",
	          null,
	          React.createElement(
	            "li",
	            null,
	            "Added ",
	            React.createElement(
	              "code",
	              null,
	              "react-hot"
	            ),
	            " to the js loaders:"
	          ),
	          React.createElement(
	            "li",
	            null,
	            "Change ",
	            React.createElement(
	              "code",
	              null,
	              "output.publicPath"
	            ),
	            " to my webpack-dev-server host and port:"
	          ),
	          React.createElement(
	            "li",
	            null,
	            "Add plugins: ",
	            React.createElement(
	              "code",
	              null,
	              "webpack.HotModuleReplacementPlugin"
	            ),
	            " and ",
	            React.createElement(
	              "code",
	              null,
	              "webpack.NoErrorsPlugin"
	            )
	          ),
	          React.createElement(
	            "li",
	            null,
	            "Set up webpack config ",
	            React.createElement(
	              "code",
	              null,
	              "devServer"
	            ),
	            " for serving, particularly adding headers for ",
	            React.createElement(
	              "code",
	              null,
	              "'Access-Control-Allow-Origin': '*'"
	            )
	          ),
	          React.createElement(
	            "li",
	            null,
	            "Remove react from webpack externals and load it as a node module"
	          ),
	          React.createElement(
	            "li",
	            null,
	            "Add flag to javascript include to switch between serving from ",
	            React.createElement(
	              "code",
	              null,
	              "webpack-dev-server"
	            ),
	            " during development to the final build location"
	          ),
	          React.createElement(
	            "li",
	            null,
	            "Serve the javascript files from the webpack-dev-server ",
	            React.createElement(
	              "code",
	              null,
	              "publicPath"
	            )
	          ),
	          React.createElement(
	            "li",
	            null,
	            "Then run ",
	            React.createElement(
	              "code",
	              null,
	              "webpack-dev-server --config webpack.hot.config.js"
	            )
	          )
	        )
	      );
	    }
	  }]);
	
	  return HelloWorld;
	})(React.Component);
	
	exports["default"] = HelloWorld;
	module.exports = exports["default"];

/***/ }

/******/ });
//# sourceMappingURL=react-in-jekyll.js.map