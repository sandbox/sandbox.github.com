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
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _d3 = __webpack_require__(2);
	
	var _d32 = _interopRequireDefault(_d3);
	
	var element = document.getElementById("react-histogram");
	var margin = { top: 10, right: 30, bottom: 30, left: 30 };
	var width = element.offsetWidth - margin.left - margin.right;
	var height = 550 - margin.top - margin.bottom;
	var values = _d32['default'].range(1000).map(_d32['default'].random.bates(10));
	var formatCount = _d32['default'].format(",.0f");
	var xscale = _d32['default'].scale.linear().domain([0, 1]).range([0, width]);
	var data = _d32['default'].layout.histogram().bins(xscale.ticks(20))(values);
	var yscale = _d32['default'].scale.linear().domain([0, _d32['default'].max(data, function (d) {
	  return d.y;
	})]).range([height, 0]);
	
	var bars = data.map(function (d, i) {
	  return _react2['default'].createElement(
	    'g',
	    { key: i, x: '0', y: '0', className: 'bar', transform: 'translate(' + xscale(d.x) + ', ' + yscale(d.y) + ')' },
	    _react2['default'].createElement('rect', { width: xscale(d.dx) - 1, height: height - yscale(d.y) }),
	    _react2['default'].createElement(
	      'text',
	      { dy: '.75em', y: 2, x: xscale(d.dx) / 2, textAnchor: 'middle' },
	      formatCount(d.y)
	    )
	  );
	});
	
	var Axis = (function (_React$Component) {
	  _inherits(Axis, _React$Component);
	
	  function Axis() {
	    _classCallCheck(this, Axis);
	
	    _get(Object.getPrototypeOf(Axis.prototype), 'constructor', this).apply(this, arguments);
	  }
	
	  _createClass(Axis, [{
	    key: 'render',
	    value: function render() {
	      var _this = this;
	
	      var range = this.props.scale.range();
	      var guide = _react2['default'].createElement('path', { className: 'domain', d: 'M' + range[0] + ',6V0H' + range[1] + 'V6' });
	
	      var tickValues = this.props.scale.ticks.apply(this.props.scale, [10]);
	      var ticks = tickValues.map(function (tick) {
	        return _react2['default'].createElement(
	          'g',
	          { className: 'tick', transform: 'translate(' + _this.props.scale(tick) + ',0)' },
	          _react2['default'].createElement('line', { x: 0, y: 0, x2: 0, y2: 6 }),
	          _react2['default'].createElement(
	            'text',
	            { y: '9', dy: '.71em', textAnchor: 'middle' },
	            tick
	          )
	        );
	      });
	      return _react2['default'].createElement(
	        'g',
	        { className: 'x axis', transform: 'translate(0,' + this.props.y + ')' },
	        ticks,
	        guide
	      );
	    }
	  }]);
	
	  return Axis;
	})(_react2['default'].Component);
	
	_react2['default'].render(_react2['default'].createElement(
	  'svg',
	  { width: width + margin.left + margin.right, height: height + margin.top + margin.bottom },
	  _react2['default'].createElement(
	    'g',
	    { transform: 'translate(' + margin.left + ', ' + margin.top + ')' },
	    bars,
	    _react2['default'].createElement(Axis, { scale: xscale, orient: 'bottom', y: height })
	  )
	), element);

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = React;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = d3;

/***/ }
/******/ ]);
//# sourceMappingURL=react-histogram.js.map