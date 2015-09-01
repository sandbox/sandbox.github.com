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
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _d3 = __webpack_require__(2);
	
	var _d32 = _interopRequireDefault(_d3);
	
	var _componentsAxis = __webpack_require__(6);
	
	var _componentsAxis2 = _interopRequireDefault(_componentsAxis);
	
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
	
	_react2['default'].render(_react2['default'].createElement(
	  'svg',
	  { width: width + margin.left + margin.right, height: height + margin.top + margin.bottom },
	  _react2['default'].createElement(
	    'g',
	    { transform: 'translate(' + margin.left + ', ' + margin.top + ')' },
	    bars,
	    _react2['default'].createElement(_componentsAxis2['default'], { scale: xscale, orient: 'bottom', x: 0, y: height }),
	    _react2['default'].createElement(_componentsAxis2['default'], { scale: yscale, orient: 'left', x: 0, y: 0 })
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

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/*!
	  Copyright (c) 2015 Jed Watson.
	  Licensed under the MIT License (MIT), see
	  http://jedwatson.github.io/classnames
	*/
	
	'use strict';
	
	(function () {
		'use strict';
	
		function classNames() {
	
			var classes = '';
	
			for (var i = 0; i < arguments.length; i++) {
				var arg = arguments[i];
				if (!arg) continue;
	
				var argType = typeof arg;
	
				if ('string' === argType || 'number' === argType) {
					classes += ' ' + arg;
				} else if (Array.isArray(arg)) {
					classes += ' ' + classNames.apply(null, arg);
				} else if ('object' === argType) {
					for (var key in arg) {
						if (arg.hasOwnProperty(key) && arg[key]) {
							classes += ' ' + key;
						}
					}
				}
			}
	
			return classes.substr(1);
		}
	
		if (typeof module !== 'undefined' && module.exports) {
			module.exports = classNames;
		} else if (true) {
			// AMD. Register as an anonymous module.
			!(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
				return classNames;
			}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		} else {
			window.classNames = classNames;
		}
	})();

/***/ },
/* 4 */,
/* 5 */,
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _classnames = __webpack_require__(3);
	
	var _classnames2 = _interopRequireDefault(_classnames);
	
	var _d3_scale = __webpack_require__(7);
	
	var Axis = (function (_React$Component) {
	  _inherits(Axis, _React$Component);
	
	  function Axis() {
	    _classCallCheck(this, Axis);
	
	    _get(Object.getPrototypeOf(Axis.prototype), 'constructor', this).apply(this, arguments);
	  }
	
	  _createClass(Axis, [{
	    key: 'render',
	    value: function render() {
	      var orient = this.props.orient,
	          scale = this.props.scale,
	          innerTickSize = this.props.innerTickSize,
	          outerTickSize = this.props.outerTickSize,
	          tickArguments = this.props.tickArguments,
	          tickValues = this.props.tickValues != null ? this.props.tickValues : scale.ticks ? scale.ticks.apply(scale, tickArguments) : scale.domain(),
	          tickFormat = this.props.tickFormat != null ? this.props.tickFormat : scale.tickFormat ? scale.tickFormat.apply(scale, tickArguments) : function (x) {
	        return x;
	      },
	          tickSpacing = Math.max(this.props.innerTickSize, 0) + this.props.tickPadding,
	          range = (0, _d3_scale.d3_scaleRange)(scale),
	          sign = orient === "top" || orient === "left" ? -1 : 1;
	
	      var tickDirection = orient === 'bottom' || orient === 'top' ? {
	        x: 0, x2: 0, y: sign * tickSpacing, y2: sign * innerTickSize
	      } : {
	        x: sign * tickSpacing, x2: sign * innerTickSize, y: 0, y: 0
	      };
	
	      var tickTextProps = orient === 'bottom' || orient === 'top' ? {
	        x: 0,
	        y: sign * tickSpacing,
	        dy: sign < 0 ? "0em" : ".71em",
	        textAnchor: "middle"
	      } : {
	        x: sign * tickSpacing,
	        y: 0,
	        dy: ".32em",
	        textAnchor: sign < 0 ? "end" : "start"
	      };
	
	      var axisClass = {
	        axis: true,
	        x: orient === 'top' || orient === 'bottom',
	        y: orient === 'left' || orient === 'right'
	      };
	
	      var guide = orient === 'bottom' || orient === 'top' ? _react2['default'].createElement('path', { className: 'domain', d: 'M' + range[0] + ',' + sign * outerTickSize + 'V0H' + range[1] + 'V' + sign * outerTickSize }) : _react2['default'].createElement('path', { className: 'domain', d: 'M' + sign * outerTickSize + ',' + range[0] + 'H0V' + range[1] + 'H' + sign * outerTickSize });
	
	      var tickMarks = tickValues.map(function (tick, i) {
	        return _react2['default'].createElement(
	          'g',
	          { key: i, className: 'tick', transform: orient === 'top' || orient === 'bottom' ? 'translate(' + scale(tick) + ',0)' : 'translate(0, ' + scale(tick) + ')' },
	          _react2['default'].createElement('line', tickDirection),
	          _react2['default'].createElement(
	            'text',
	            _extends({ y: '9' }, tickTextProps),
	            tick
	          )
	        );
	      });
	
	      return _react2['default'].createElement(
	        'g',
	        { className: (0, _classnames2['default'])(axisClass), transform: 'translate(' + this.props.x + ',' + this.props.y + ')' },
	        tickMarks,
	        guide
	      );
	    }
	  }]);
	
	  return Axis;
	})(_react2['default'].Component);
	
	Axis.defaultProps = {
	  orient: "bottom",
	  innerTickSize: 6,
	  outerTickSize: 6,
	  tickPadding: 3,
	  tickArguments: [10],
	  tickValues: null,
	  tickFormat: null
	};
	
	exports['default'] = Axis;
	module.exports = exports['default'];

/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	function d3_scaleExtent(domain) {
	  var start = domain[0],
	      stop = domain[domain.length - 1];
	  return start < stop ? [start, stop] : [stop, start];
	}
	
	function d3_scaleRange(scale) {
	  return scale.rangeExtent ? scale.rangeExtent() : d3_scaleExtent(scale.range());
	}
	
	exports.d3_scaleExtent = d3_scaleExtent;
	exports.d3_scaleRange = d3_scaleRange;

/***/ }
/******/ ]);
//# sourceMappingURL=react-histogram.js.map