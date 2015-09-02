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
	
	var _d3 = __webpack_require__(2);
	
	var _d32 = _interopRequireDefault(_d3);
	
	var _vega = __webpack_require__(10);
	
	var _vega2 = _interopRequireDefault(_vega);
	
	var _componentsBasketball = __webpack_require__(8);
	
	_d32['default'].json("https://gist.githubusercontent.com/sandbox/7f6065c867a5f355207e/raw/5c74a5dcd7b257faa985f28c932a684ed4cea065/james-harden-shotchartdetail.json", function (error, json) {
	  if (error) return console.warn(error);
	  var headers = json.resultSets[0].headers;
	  var data = json.resultSets[0].rowSet.map(function (d) {
	    var row = headers.reduce(function (memo, header, i) {
	      memo[header] = d[i];
	      return memo;
	    }, {});
	    row.__id = row.GAME_ID + '_' + row.GAME_EVENT_ID;
	    return row;
	  });
	  _vega2['default'].parse.spec(_componentsBasketball.ShotChartSpec, function (chart) {
	    var view = chart({ el: "#shot-chart" });
	    view.data('table').insert(data);
	    view.update({ duration: 1000, ease: "linear" });
	  });
	});

/***/ },
/* 1 */,
/* 2 */
/***/ function(module, exports) {

	module.exports = d3;

/***/ },
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _arc = __webpack_require__(9);
	
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
	    "values": [{ "x": 0, "y": -47.5 + 470, "radius": 60, "startAngle": Math.PI / 2, "endAngle": 3 / 2 * Math.PI }, { "x": 0, "y": -47.5 + 470, "radius": 20, "startAngle": Math.PI / 2, "endAngle": 3 / 2 * Math.PI }, { "x": 0, "y": 0, "radius": 40, "startAngle": -Math.PI / 2, "endAngle": Math.PI / 2 }, { "x": 0, "y": 0, "radius": 237.5, "startAngle": -68 / 180 * Math.PI, "endAngle": 68 / 180 * Math.PI }, { "x": 0, "y": 0, "radius": 7.5, "startAngle": 0, "endAngle": 2 * Math.PI }, { "x": 0, "y": 142.5, "radius": 60, "startAngle": -Math.PI / 2, "endAngle": Math.PI / 2 }, { "strokeDash": [5, 14], "x": 0, "y": 142.5, "radius": 60, "startAngle": -Math.PI / 2, "endAngle": -3 / 2 * Math.PI }] }, { "name": "courtLines",
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
	        "size": { "scale": "width", "value": 70 }
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
	        "strokeDash": { "field": "strokeDash" },
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
	        "fill": { "value": null },
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
/* 9 */
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
/* 10 */
/***/ function(module, exports) {

	module.exports = vg;

/***/ }
/******/ ]);
//# sourceMappingURL=nba-shot-chart-vega.js.map