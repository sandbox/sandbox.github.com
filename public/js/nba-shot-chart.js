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
	
	var _react = __webpack_require__(5);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _d3 = __webpack_require__(1);
	
	var _d32 = _interopRequireDefault(_d3);
	
	var _classnames = __webpack_require__(6);
	
	var _classnames2 = _interopRequireDefault(_classnames);
	
	var _componentsMark = __webpack_require__(7);
	
	var _componentsMark2 = _interopRequireDefault(_componentsMark);
	
	var _componentsAxis = __webpack_require__(9);
	
	var _componentsAxis2 = _interopRequireDefault(_componentsAxis);
	
	var _reactTweenState = __webpack_require__(8);
	
	var _componentsBasketball = __webpack_require__(3);
	
	function logData(d) {
	  console.log('yes', d);
	}
	
	function renderShotChart(rows, header) {
	  var element = document.getElementById("shot-chart");
	  var margin = { top: 30, right: 100, bottom: 30, left: 100 };
	
	  var width = element.offsetWidth - margin.left - margin.right;
	  var height = width - margin.top - margin.bottom;
	
	  var values = rows.map(function (row) {
	    return [row[17], row[18]];
	  });
	  var xscale = _d32['default'].scale.linear().domain([250, -250]).range([0, width]);
	  var yscale = _d32['default'].scale.linear().domain([-47.5, 450]).range([height, 0]);
	
	  var xballr = Math.abs(xscale(3.85) - xscale(0));
	  var yballr = Math.abs(yscale(0) - yscale(3.85));
	
	  var TransitionBall = (0, _componentsMark2['default'])(_componentsBasketball.BasketBall, [{ prop: 'cx', duration: 2000, easing: _reactTweenState.easingTypes.linear, start: xscale(0) }, { prop: 'cy', duration: 2000, easing: _reactTweenState.easingTypes.linear, start: yscale(0) }]);
	
	  var points = rows.map(function (d, i) {
	    var x = d[17];
	    var y = d[18];
	
	    return _react2['default'].createElement(TransitionBall, { key: d[1] + '_' + d[2],
	      className: (0, _classnames2['default'])("dot", { "made": d[10] === "Made Shot" }),
	      cx: xscale(x), cy: yscale(y),
	      rx: xballr, ry: yballr,
	      onMouseOver: logData.bind(null, d) });
	  });
	
	  _react2['default'].render(_react2['default'].createElement(
	    'svg',
	    { width: width + margin.left + margin.right, height: height + margin.top + margin.bottom },
	    _react2['default'].createElement(
	      'g',
	      { transform: 'translate(' + margin.left + ', ' + margin.top + ')' },
	      points,
	      _react2['default'].createElement(_componentsBasketball.CourtBounds, { xscale: xscale, yscale: yscale, width: width, height: height })
	    )
	  ), element);
	}
	
	_d32['default'].json("https://gist.githubusercontent.com/sandbox/7f6065c867a5f355207e/raw/5c74a5dcd7b257faa985f28c932a684ed4cea065/james-harden-shotchartdetail.json", function (error, json) {
	  if (error) return console.warn(error);
	  renderShotChart(json.resultSets[0].rowSet, json.resultSets[0].headers);
	});

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = d3;

/***/ },
/* 2 */,
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _arc = __webpack_require__(4);
	
	var CourtBounds = (function (_React$Component) {
	  _inherits(CourtBounds, _React$Component);
	
	  function CourtBounds() {
	    _classCallCheck(this, CourtBounds);
	
	    _get(Object.getPrototypeOf(CourtBounds.prototype), "constructor", this).apply(this, arguments);
	  }
	
	  _createClass(CourtBounds, [{
	    key: "render",
	    value: function render() {
	      var hoopcenterx = this.props.xscale(0);
	      var hoopcentery = this.props.yscale(0);
	
	      var xstart = this.props.xscale(250);
	      var xend = this.props.xscale(-250);
	      var ystart = this.props.yscale(422.5);
	      var yend = this.props.yscale(-47.5);
	      var courtheight = yend - ystart;
	      var courtwidth = Math.abs(xend - xstart);
	      var threeradiusx = Math.abs(this.props.xscale(237.5) - hoopcenterx);
	      var threeradiusy = hoopcentery - this.props.yscale(237.5);
	      var threearc = (0, _arc.describeArc)(hoopcenterx, hoopcentery, threeradiusx, threeradiusy, -158, -22);
	      var centerarc = (0, _arc.describeArc)(hoopcenterx, ystart, Math.abs(this.props.xscale(60) - hoopcenterx), hoopcentery - this.props.yscale(60), 0, 180);
	      var innercenterarc = (0, _arc.describeArc)(hoopcenterx, ystart, Math.abs(this.props.xscale(20) - hoopcenterx), hoopcentery - this.props.yscale(20), 0, 180);
	      var freethrowwidth = Math.abs(this.props.xscale(160) - this.props.xscale(0));
	      var freethrowheight = Math.abs(this.props.yscale(-47.5 + 190) - yend);
	      var freethrowarcR = Math.abs(this.props.xscale(60) - hoopcenterx);
	      var freethrowinnerarc = (0, _arc.describeArc)(hoopcenterx, this.props.yscale(-47.5 + 190), freethrowarcR, hoopcentery - this.props.yscale(60), 0, 180);
	      var freethrowouterarc = (0, _arc.describeArc)(hoopcenterx, this.props.yscale(-47.5 + 190), freethrowarcR, hoopcentery - this.props.yscale(60), -180, 0);
	      var restrictedArc = (0, _arc.describeArc)(hoopcenterx, hoopcentery, Math.abs(this.props.xscale(40) - hoopcenterx), hoopcentery - this.props.yscale(40), -180, 0);
	
	      return React.createElement(
	        "g",
	        null,
	        React.createElement("ellipse", { stroke: "#000", fill: "none", cx: this.props.xscale(0), cy: this.props.yscale(0), rx: Math.abs(this.props.xscale(7.5) - this.props.xscale(0)), ry: this.props.yscale(0) - this.props.yscale(7.5) }),
	        React.createElement("line", { strokeWidth: 2, stroke: "#000", x1: this.props.xscale(-30), x2: this.props.xscale(30), y1: this.props.yscale(-7.5), y2: this.props.yscale(-7.5) }),
	        React.createElement("rect", { fill: "none", stroke: "#000", x: xstart, y: ystart, width: courtwidth, height: courtheight }),
	        React.createElement("path", { d: centerarc, fill: "none", stroke: "#000" }),
	        React.createElement("path", { d: innercenterarc, fill: "none", stroke: "#000" }),
	        React.createElement("rect", { fill: "none", stroke: "#000", x: this.props.xscale(80), y: this.props.yscale(-47.5 + 190), width: freethrowwidth, height: freethrowheight }),
	        React.createElement("rect", { fill: "none", stroke: "#000", x: this.props.xscale(60), y: this.props.yscale(-47.5 + 190), width: Math.abs(this.props.xscale(120) - this.props.xscale(0)), height: freethrowheight }),
	        React.createElement("path", { d: freethrowouterarc, fill: "none", stroke: "#000" }),
	        React.createElement("path", { d: freethrowinnerarc, fill: "none", stroke: "#000", strokeDasharray: "5,5" }),
	        React.createElement("path", { d: restrictedArc, fill: "none", stroke: "#000" }),
	        React.createElement("path", { d: threearc, fill: "none", stroke: "#000" }),
	        React.createElement("line", { stroke: "#000", x1: this.props.xscale(-220), y1: yend, x2: this.props.xscale(-220), y2: this.props.yscale(90) }),
	        React.createElement("line", { stroke: "#000", x1: this.props.xscale(220), y1: yend, x2: this.props.xscale(220), y2: this.props.yscale(90) })
	      );
	    }
	  }]);
	
	  return CourtBounds;
	})(React.Component);
	
	var BasketBall = (function (_React$Component2) {
	  _inherits(BasketBall, _React$Component2);
	
	  function BasketBall() {
	    _classCallCheck(this, BasketBall);
	
	    _get(Object.getPrototypeOf(BasketBall.prototype), "constructor", this).apply(this, arguments);
	  }
	
	  _createClass(BasketBall, [{
	    key: "render",
	    value: function render() {
	      return React.createElement("ellipse", this.props);
	    }
	  }]);
	
	  return BasketBall;
	})(React.Component);
	
	var ShotChartSpec = {
	  "width": 600,
	  "height": 1.1 * 600,
	  "padding": { "top": 30, "left": 179, "bottom": 30, "right": 179 },
	  "data": [{ "name": "table" }, { "name": "courtBounds", "values": [{ "x": -250, "x2": -250 + 500, "y": -47.5, "y2": -47.5 + 470 }] }, { "name": "arcs",
	    "values": [{ "style": "solid", "x": 0, "y": -47.5 + 470, "radius": 60, "startAngle": Math.PI / 2, "endAngle": 3 / 2 * Math.PI }, { "style": "solid", "x": 0, "y": -47.5 + 470, "radius": 20, "startAngle": Math.PI / 2, "endAngle": 3 / 2 * Math.PI }, { "style": "solid", "x": 0, "y": 0, "radius": 40, "startAngle": -Math.PI / 2, "endAngle": Math.PI / 2 }, { "style": "solid", "x": 0, "y": 0, "radius": 237.5, "startAngle": -68 / 180 * Math.PI, "endAngle": 68 / 180 * Math.PI }, { "style": "solid", "x": 0, "y": 0, "radius": 7.5, "startAngle": 0, "endAngle": 2 * Math.PI }, { "style": "solid", "x": 0, "y": 142.5, "radius": 60, "startAngle": -Math.PI / 2, "endAngle": Math.PI / 2 }, { "style": "dashed", "x": 0, "y": 142.5, "radius": 60, "startAngle": -Math.PI / 2, "endAngle": -3 / 2 * Math.PI }] }, { "name": "courtLines",
	    "values": [{ "x": 22, "y": -7.5, "x2": -22, "y2": -8.5 }, { "x": 60, "y": 150 - 7.5, "x2": -60, "y2": -47.5 }, { "x": 80, "y": 150 - 7.5, "x2": -80, "y2": -47.5 }, { "x": -220, "y": 90, "x2": -220.2, "y2": -47.5 }, { "x": 220.2, "y": 90, "x2": 220, "y2": -47.5 }] }],
	  "scales": [{
	    "name": "width",
	    "type": "linear",
	    "range": "width",
	    "domain": [0, 500]
	  }, {
	    "name": "height",
	    "type": "linear",
	    "range": "height",
	    "domain": [0, 550]
	  }, {
	    "name": "x",
	    "type": "linear",
	    "range": "width",
	    "domain": [-250, 250],
	    "reverse": true
	  }, {
	    "name": "y",
	    "type": "linear",
	    "range": "height",
	    "domain": [-50, 500]
	  }, {
	    "name": "makeOpacity",
	    "type": "linear",
	    "domain": [0, 1],
	    "range": [0.4, 0.8]
	  }, {
	    "name": "makeColor",
	    "type": "ordinal",
	    "domain": ["Missed Shot", "Made Shot"],
	    "range": ["#EA4929", "#9FBC91"]
	  }, {
	    "name": "arcStyle",
	    "type": "ordinal",
	    "domain": ["solid", "dashed"],
	    "range": ["solid", "10,10"]
	  }],
	  "legends": [{
	    "fill": "makeColor"
	  }],
	  "marks": [{
	    "type": "symbol",
	    "from": { "data": "table" },
	    "key": "__id",
	    "properties": {
	      "enter": {
	        "shape": "circle",
	        "x": { "scale": "x", "value": 0 },
	        "y": { "scale": "y", "value": 0 },
	        "fillOpacity": { "scale": "makeOpacity", "field": "SHOT_MADE_FLAG" },
	        "fill": { "scale": "makeColor", "field": "EVENT_TYPE" },
	        "size": { "scale": "width", "value": 100 }
	      },
	      "update": {
	        "x": { "scale": "x", "field": "LOC_X" },
	        "y": { "scale": "y", "field": "LOC_Y" }
	      },
	      "exit": {
	        "x": { "scale": "x", "value": 0 },
	        "y": { "scale": "y", "value": 0 }
	      }
	    }
	  }, {
	    "type": "arc",
	    "from": { "data": "arcs" },
	    "properties": {
	      "enter": {
	        "stroke": { "value": "#000000" },
	        "strokeDash": { "scale": "arcStyle", "field": "style" },
	        "x": { "scale": "x", "field": "x" },
	        "y": { "scale": "y", "field": "y" },
	        "outerRadius": { "scale": "width", "field": "radius" },
	        "innerRadius": { "scale": "width", "field": "radius" },
	        "startAngle": { "field": "startAngle" },
	        "endAngle": { "field": "endAngle" }
	      }
	    }
	  }, {
	    "type": "rect",
	    "from": { "data": "courtLines" },
	    "properties": {
	      "enter": {
	        "fill": { "value": "none" },
	        "stroke": { "value": "#000000" },
	        "strokeWidth": { "value": 1 },
	        "x": { "scale": "x", "field": "x" },
	        "y": { "scale": "y", "field": "y" },
	        "x2": { "scale": "x", "field": "x2" },
	        "y2": { "scale": "y", "field": "y2" }
	      }
	    }
	  }, {
	    "type": "rect",
	    "from": { "data": "courtBounds" },
	    "properties": {
	      "enter": {
	        "stroke": { "value": "#000000" },
	        "x": { "scale": "x", "field": "x" },
	        "y": { "scale": "y", "field": "y" },
	        "x2": { "scale": "x", "field": "x2" },
	        "y2": { "scale": "y", "field": "y2" }
	      }
	    }
	  }]
	};
	
	exports.CourtBounds = CourtBounds;
	exports.BasketBall = BasketBall;
	exports.ShotChartSpec = ShotChartSpec;
	/* hoop */ /* court boundary */ /* center arc */ /* free throw area */ /* restricted area arc */ /* three point arc */

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	function polarToCartesian(centerX, centerY, radiusX, radiusY, angleInDegrees) {
	  var angleInRadians = angleInDegrees * Math.PI / 180.0;
	
	  return {
	    x: centerX + radiusX * Math.cos(angleInRadians),
	    y: centerY + radiusY * Math.sin(angleInRadians)
	  };
	}
	
	function describeArc(x, y, radiusX, radiusY, startAngle, endAngle) {
	  var start = polarToCartesian(x, y, radiusX, radiusY, endAngle);
	  var end = polarToCartesian(x, y, radiusX, radiusY, startAngle);
	  var arcSweep = endAngle - startAngle <= 180 ? "0" : "1";
	  return ["M", start.x, start.y, "A", radiusX, radiusY, 0, arcSweep, 0, end.x, end.y].join(" ");
	}
	
	exports.describeArc = describeArc;

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = React;

/***/ },
/* 6 */
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
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _reactTweenState = __webpack_require__(8);
	
	function animateMark(Component, transitionAttributes) {
	  var VisualMark = React.createClass({
	    displayName: 'VisualMark',
	
	    mixins: [_reactTweenState.Mixin],
	    getInitialState: function getInitialState() {
	      var state = {};
	      transitionAttributes.forEach(function (transition) {
	        return state[transition.prop] = transition.start == null ? 0 : transition.start;
	      });
	      return state;
	    },
	    componentDidMount: function componentDidMount() {
	      var _this = this;
	
	      transitionAttributes.forEach(function (transition) {
	        return _this.tweenState(transition.prop, {
	          easing: transition.ease,
	          duration: transition.duration,
	          endValue: _this.props[transition.prop]
	        });
	      });
	    },
	    render: function render() {
	      var _this2 = this;
	
	      var props = {};
	      transitionAttributes.forEach(function (transition) {
	        return props[transition.prop] = _this2.getTweeningValue(transition.prop);
	      });
	      return React.createElement(Component, _extends({}, this.props, props));
	    }
	  });
	
	  return VisualMark;
	}
	
	exports['default'] = animateMark;
	module.exports = exports['default'];

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	(function webpackUniversalModuleDefinition(root, factory) {
		if (true) module.exports = factory();else if (typeof define === 'function' && define.amd) define(factory);else if (typeof exports === 'object') exports["tweenState"] = factory();else root["tweenState"] = factory();
	})(undefined, function () {
		return (/******/(function (modules) {
				// webpackBootstrap
				/******/ // The module cache
				/******/var installedModules = {};
				/******/
				/******/ // The require function
				/******/function __webpack_require__(moduleId) {
					/******/
					/******/ // Check if module is in cache
					/******/if (installedModules[moduleId])
						/******/return installedModules[moduleId].exports;
					/******/
					/******/ // Create a new module (and put it into the cache)
					/******/var module = installedModules[moduleId] = {
						/******/exports: {},
						/******/id: moduleId,
						/******/loaded: false
						/******/ };
					/******/
					/******/ // Execute the module function
					/******/modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
					/******/
					/******/ // Flag the module as loaded
					/******/module.loaded = true;
					/******/
					/******/ // Return the exports of the module
					/******/return module.exports;
					/******/
				}
				/******/
				/******/
				/******/ // expose the modules object (__webpack_modules__)
				/******/__webpack_require__.m = modules;
				/******/
				/******/ // expose the module cache
				/******/__webpack_require__.c = installedModules;
				/******/
				/******/ // __webpack_public_path__
				/******/__webpack_require__.p = "";
				/******/
				/******/ // Load entry module and return exports
				/******/return __webpack_require__(0);
				/******/
			})(
			/************************************************************************/
			/******/{
	
				/***/0:
				/*!*****************!*\
	     !*** multi lib ***!
	     \*****************/
				function _(module, exports, __webpack_require__) {
	
					module.exports = __webpack_require__( /*! ./index.js */160);
	
					/***/
				},
	
				/***/160:
				/*!******************!*\
	     !*** ./index.js ***!
	     \******************/
				function _(module, exports, __webpack_require__) {
	
					'use strict';
	
					Object.defineProperty(exports, '__esModule', {
						value: true
					});
	
					function _interopRequireDefault(obj) {
						return obj && obj.__esModule ? obj : { 'default': obj };
					}
	
					var _tweenFunctions = __webpack_require__( /*! tween-functions */161);
	
					var _tweenFunctions2 = _interopRequireDefault(_tweenFunctions);
	
					// additive is the new iOS 8 default. In most cases it simulates a physics-
					// looking overshoot behavior (especially with easeInOut. You can test that in
					// the example
					var DEFAULT_STACK_BEHAVIOR = 'ADDITIVE';
					var DEFAULT_EASING = _tweenFunctions.easeInOutQuad;
					var DEFAULT_DURATION = 300;
					var DEFAULT_DELAY = 0;
	
					var stackBehavior = {
						ADDITIVE: 'ADDITIVE',
						DESTRUCTIVE: 'DESTRUCTIVE'
					};
					var Mixin = {
						getInitialState: function getInitialState() {
							return {
								tweenQueue: []
							};
						},
	
						tweenState: function tweenState(path, _ref) {
							var _this = this;
	
							var easing = _ref.easing;
							var duration = _ref.duration;
							var delay = _ref.delay;
							var beginValue = _ref.beginValue;
							var endValue = _ref.endValue;
							var onEnd = _ref.onEnd;
							var configSB = _ref.stackBehavior;
	
							this.setState(function (state) {
								var cursor = state;
								var stateName = undefined;
								// see comment below on pash hash
								var pathHash = undefined;
								if (typeof path === 'string') {
									stateName = path;
									pathHash = path;
								} else {
									for (var i = 0; i < path.length - 1; i++) {
										cursor = cursor[path[i]];
									}
									stateName = path[path.length - 1];
									pathHash = path.join('|');
								}
								// see the reasoning for these defaults at the top of file
								var newConfig = {
									easing: easing || DEFAULT_EASING,
									duration: duration == null ? DEFAULT_DURATION : duration,
									delay: delay == null ? DEFAULT_DELAY : delay,
									beginValue: beginValue == null ? cursor[stateName] : beginValue,
									endValue: endValue,
									onEnd: onEnd,
									stackBehavior: configSB || DEFAULT_STACK_BEHAVIOR
								};
	
								var newTweenQueue = state.tweenQueue;
								if (newConfig.stackBehavior === stackBehavior.DESTRUCTIVE) {
									newTweenQueue = state.tweenQueue.filter(function (item) {
										return item.pathHash !== pathHash;
									});
								}
	
								// we store path hash, so that during value retrieval we can use hash
								// comparison to find the path. See the kind of shitty thing you have to
								// do when you don't have value comparison for collections?
								newTweenQueue.push({
									pathHash: pathHash,
									config: newConfig,
									initTime: Date.now() + newConfig.delay
								});
	
								// sorry for mutating. For perf reasons we don't want to deep clone.
								// guys, can we please all start using persistent collections so that
								// we can stop worrying about nonesense like this
								cursor[stateName] = newConfig.endValue;
								if (newTweenQueue.length === 1) {
									_this.startRaf();
								}
	
								// this will also include the above mutated update
								return { tweenQueue: newTweenQueue };
							});
						},
	
						getTweeningValue: function getTweeningValue(path) {
							var state = this.state;
	
							var tweeningValue = undefined;
							var pathHash = undefined;
							if (typeof path === 'string') {
								tweeningValue = state[path];
								pathHash = path;
							} else {
								tweeningValue = state;
								for (var i = 0; i < path.length; i++) {
									tweeningValue = tweeningValue[path[i]];
								}
								pathHash = path.join('|');
							}
							var now = Date.now();
	
							for (var i = 0; i < state.tweenQueue.length; i++) {
								var item = state.tweenQueue[i];
								if (item.pathHash !== pathHash) {
									continue;
								}
	
								var progressTime = now - item.initTime > item.config.duration ? item.config.duration : Math.max(0, now - item.initTime);
								// `now - item.initTime` can be negative if initTime is scheduled in the
								// future by a delay. In this case we take 0
	
								var contrib = -item.config.endValue + item.config.easing(progressTime, item.config.beginValue, item.config.endValue, item.config.duration);
								tweeningValue += contrib;
							}
	
							return tweeningValue;
						},
	
						_rafCb: function _rafCb() {
							var state = this.state;
							if (state.tweenQueue.length === 0) {
								return;
							}
	
							var now = Date.now();
							var newTweenQueue = [];
	
							for (var i = 0; i < state.tweenQueue.length; i++) {
								var item = state.tweenQueue[i];
								if (now - item.initTime < item.config.duration) {
									newTweenQueue.push(item);
								} else {
									item.config.onEnd && item.config.onEnd();
								}
							}
	
							// onEnd might trigger a parent callback that removes this component
							if (!this.isMounted()) {
								return;
							}
	
							this.setState({
								tweenQueue: newTweenQueue
							});
	
							requestAnimationFrame(this._rafCb);
						},
	
						startRaf: function startRaf() {
							requestAnimationFrame(this._rafCb);
						}
					};
	
					exports['default'] = {
						Mixin: Mixin,
						easingTypes: _tweenFunctions2['default'],
						stackBehavior: stackBehavior
					};
					module.exports = exports['default'];
	
					// TODO: some funcs accept a 5th param
	
					/***/
				},
	
				/***/161:
				/*!************************************!*\
	     !*** ./~/tween-functions/index.js ***!
	     \************************************/
				function _(module, exports) {
	
					'use strict';
	
					// t: current time, b: beginning value, _c: final value, d: total duration
					var tweenFunctions = {
						linear: function linear(t, b, _c, d) {
							var c = _c - b;
							return c * t / d + b;
						},
						easeInQuad: function easeInQuad(t, b, _c, d) {
							var c = _c - b;
							return c * (t /= d) * t + b;
						},
						easeOutQuad: function easeOutQuad(t, b, _c, d) {
							var c = _c - b;
							return -c * (t /= d) * (t - 2) + b;
						},
						easeInOutQuad: function easeInOutQuad(t, b, _c, d) {
							var c = _c - b;
							if ((t /= d / 2) < 1) {
								return c / 2 * t * t + b;
							} else {
								return -c / 2 * (--t * (t - 2) - 1) + b;
							}
						},
						easeInCubic: function easeInCubic(t, b, _c, d) {
							var c = _c - b;
							return c * (t /= d) * t * t + b;
						},
						easeOutCubic: function easeOutCubic(t, b, _c, d) {
							var c = _c - b;
							return c * ((t = t / d - 1) * t * t + 1) + b;
						},
						easeInOutCubic: function easeInOutCubic(t, b, _c, d) {
							var c = _c - b;
							if ((t /= d / 2) < 1) {
								return c / 2 * t * t * t + b;
							} else {
								return c / 2 * ((t -= 2) * t * t + 2) + b;
							}
						},
						easeInQuart: function easeInQuart(t, b, _c, d) {
							var c = _c - b;
							return c * (t /= d) * t * t * t + b;
						},
						easeOutQuart: function easeOutQuart(t, b, _c, d) {
							var c = _c - b;
							return -c * ((t = t / d - 1) * t * t * t - 1) + b;
						},
						easeInOutQuart: function easeInOutQuart(t, b, _c, d) {
							var c = _c - b;
							if ((t /= d / 2) < 1) {
								return c / 2 * t * t * t * t + b;
							} else {
								return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
							}
						},
						easeInQuint: function easeInQuint(t, b, _c, d) {
							var c = _c - b;
							return c * (t /= d) * t * t * t * t + b;
						},
						easeOutQuint: function easeOutQuint(t, b, _c, d) {
							var c = _c - b;
							return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
						},
						easeInOutQuint: function easeInOutQuint(t, b, _c, d) {
							var c = _c - b;
							if ((t /= d / 2) < 1) {
								return c / 2 * t * t * t * t * t + b;
							} else {
								return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
							}
						},
						easeInSine: function easeInSine(t, b, _c, d) {
							var c = _c - b;
							return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
						},
						easeOutSine: function easeOutSine(t, b, _c, d) {
							var c = _c - b;
							return c * Math.sin(t / d * (Math.PI / 2)) + b;
						},
						easeInOutSine: function easeInOutSine(t, b, _c, d) {
							var c = _c - b;
							return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
						},
						easeInExpo: function easeInExpo(t, b, _c, d) {
							var c = _c - b;
							var _ref;
							return (_ref = t === 0) !== null ? _ref : {
								b: c * Math.pow(2, 10 * (t / d - 1)) + b
							};
						},
						easeOutExpo: function easeOutExpo(t, b, _c, d) {
							var c = _c - b;
							var _ref;
							return (_ref = t === d) !== null ? _ref : b + {
								c: c * (-Math.pow(2, -10 * t / d) + 1) + b
							};
						},
						easeInOutExpo: function easeInOutExpo(t, b, _c, d) {
							var c = _c - b;
							if (t === 0) {
								b;
							}
							if (t === d) {
								b + c;
							}
							if ((t /= d / 2) < 1) {
								return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
							} else {
								return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
							}
						},
						easeInCirc: function easeInCirc(t, b, _c, d) {
							var c = _c - b;
							return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
						},
						easeOutCirc: function easeOutCirc(t, b, _c, d) {
							var c = _c - b;
							return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
						},
						easeInOutCirc: function easeInOutCirc(t, b, _c, d) {
							var c = _c - b;
							if ((t /= d / 2) < 1) {
								return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
							} else {
								return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
							}
						},
						easeInElastic: function easeInElastic(t, b, _c, d) {
							var c = _c - b;
							var a, p, s;
							s = 1.70158;
							p = 0;
							a = c;
							if (t === 0) {
								b;
							} else if ((t /= d) === 1) {
								b + c;
							}
							if (!p) {
								p = d * 0.3;
							}
							if (a < Math.abs(c)) {
								a = c;
								s = p / 4;
							} else {
								s = p / (2 * Math.PI) * Math.asin(c / a);
							}
							return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
						},
						easeOutElastic: function easeOutElastic(t, b, _c, d) {
							var c = _c - b;
							var a, p, s;
							s = 1.70158;
							p = 0;
							a = c;
							if (t === 0) {
								b;
							} else if ((t /= d) === 1) {
								b + c;
							}
							if (!p) {
								p = d * 0.3;
							}
							if (a < Math.abs(c)) {
								a = c;
								s = p / 4;
							} else {
								s = p / (2 * Math.PI) * Math.asin(c / a);
							}
							return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
						},
						easeInOutElastic: function easeInOutElastic(t, b, _c, d) {
							var c = _c - b;
							var a, p, s;
							s = 1.70158;
							p = 0;
							a = c;
							if (t === 0) {
								b;
							} else if ((t /= d / 2) === 2) {
								b + c;
							}
							if (!p) {
								p = d * (0.3 * 1.5);
							}
							if (a < Math.abs(c)) {
								a = c;
								s = p / 4;
							} else {
								s = p / (2 * Math.PI) * Math.asin(c / a);
							}
							if (t < 1) {
								return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
							} else {
								return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * 0.5 + c + b;
							}
						},
						easeInBack: function easeInBack(t, b, _c, d, s) {
							var c = _c - b;
							if (s === void 0) {
								s = 1.70158;
							}
							return c * (t /= d) * t * ((s + 1) * t - s) + b;
						},
						easeOutBack: function easeOutBack(t, b, _c, d, s) {
							var c = _c - b;
							if (s === void 0) {
								s = 1.70158;
							}
							return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
						},
						easeInOutBack: function easeInOutBack(t, b, _c, d, s) {
							var c = _c - b;
							if (s === void 0) {
								s = 1.70158;
							}
							if ((t /= d / 2) < 1) {
								return c / 2 * (t * t * (((s *= 1.525) + 1) * t - s)) + b;
							} else {
								return c / 2 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b;
							}
						},
						easeInBounce: function easeInBounce(t, b, _c, d) {
							var c = _c - b;
							var v;
							v = tweenFunctions.easeOutBounce(d - t, 0, c, d);
							return c - v + b;
						},
						easeOutBounce: function easeOutBounce(t, b, _c, d) {
							var c = _c - b;
							if ((t /= d) < 1 / 2.75) {
								return c * (7.5625 * t * t) + b;
							} else if (t < 2 / 2.75) {
								return c * (7.5625 * (t -= 1.5 / 2.75) * t + 0.75) + b;
							} else if (t < 2.5 / 2.75) {
								return c * (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375) + b;
							} else {
								return c * (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375) + b;
							}
						},
						easeInOutBounce: function easeInOutBounce(t, b, _c, d) {
							var c = _c - b;
							var v;
							if (t < d / 2) {
								v = tweenFunctions.easeInBounce(t * 2, 0, c, d);
								return v * 0.5 + b;
							} else {
								v = tweenFunctions.easeOutBounce(t * 2 - d, 0, c, d);
								return v * 0.5 + c * 0.5 + b;
							}
						}
					};
	
					module.exports = tweenFunctions;
	
					/***/
				}
	
				/******/ })
		);
	});
	;
	//# sourceMappingURL=index.js.map
	/***/ /***/ /***/

/***/ },
/* 9 */
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
	
	var _react = __webpack_require__(5);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _classnames = __webpack_require__(6);
	
	var _classnames2 = _interopRequireDefault(_classnames);
	
	var _d3_scale = __webpack_require__(10);
	
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
/* 10 */
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
//# sourceMappingURL=nba-shot-chart.js.map