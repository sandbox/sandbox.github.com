var ShotChartInteractionSignals = [
  {
    "name": "scope",
    "init": {"width": 0},
    "streams": [
      {"type": "mousedown, touchstart", "expr": "eventGroup()"}
    ]
  },

  // distance histogram signal
  {
    "name": "distStart",
    "init": -1,
    "streams": [{
      "type": "@distGroup:mousedown, @distGroup:touchstart",
      "expr": "eventX(scope)",
      "scale": {"scope": "scope", "name": "x", "invert": true}
    }]
  },
  {
    "name": "distEnd",
    "init": -1,
    "streams": [{
      "type": "@distGroup:mousedown, @distGroup:touchstart, [@distGroup:mousedown, window:mouseup] > window:mousemove, [@distGroup:touchstart, window:touchend] > window:touchmove",
      "expr": "clamp(eventX(scope), 0, scope.width)",
      "scale": {"scope": "scope", "name": "x", "invert": true}
    }]
  },
  {"name": "minDist", "expr": "max(min(distStart, distEnd), 0)"},
  {"name": "maxDist", "expr": "min(max(distStart, distEnd), 50)"},

  // x histogram signal
  {
    "name": "xLocStart",
    "init": -1,
    "streams": [{
      "type": "@xLocGroup:mousedown, @xLocGroup:touchstart",
      "expr": "eventX(scope)",
      "scale": {"scope": "scope", "name": "x", "invert": true}
    }]
  },
  {
    "name": "xLocEnd",
    "init": -1,
    "streams": [{
      "type": "@xLocGroup:mousedown, @xLocGroup:touchstart, [@xLocGroup:mousedown, window:mouseup] > window:mousemove, [@xLocGroup:touchstart, window:touchend] > window:touchmove",
      "expr": "clamp(eventX(scope), 0, scope.width)",
      "scale": {"scope": "scope", "name": "x", "invert": true}
    }]
  },
  {"name": "minXLoc", "expr": "max(min(xLocStart, xLocEnd), -250)"},
  {"name": "maxXLoc", "expr": "min(max(xLocStart, xLocEnd), 250)"},

  // y histogram signal
  {
    "name": "yLocStart",
    "init": -1,
    "streams": [{
      "type": "@yLocGroup:mousedown, @yLocGroup:touchstart",
      "expr": "eventY(scope)",
      "scale": {"scope": "scope", "name": "y", "invert": true}
    }]
  },
  {
    "name": "yLocEnd",
    "init": -1,
    "streams": [{
      "type": "@yLocGroup:mousedown, @yLocGroup:touchstart, [@yLocGroup:mousedown, window:mouseup] > window:mousemove, [@yLocGroup:touchstart, window:touchend] > window:touchmove",
      "expr": "clamp(eventY(scope), 0, scope.height)",
      "scale": {"scope": "scope", "name": "y", "invert": true}
    }]
  },
  {"name": "minYLoc", "expr": "max(min(yLocStart, yLocEnd), -47.5)"},
  {"name": "maxYLoc", "expr": "min(max(yLocStart, yLocEnd), 500)"},

  // shot chart body signal
  {
    "name": "chartStartX",
    "init": -1,
    "streams": [{
      "type": "@shotChart:mousedown, @shotChart:touchstart",
      "expr": "clamp(eventX(scope), 0, scope.width)",
      "scale": {"scope": "scope", "name": "x", "invert": true}
    }]
  },
  {
    "name": "chartEndX",
    "init": -1,
    "streams": [{
      "type": "@shotChart:mousedown, @shotChart:touchstart, [@shotChart:mousedown, window:mouseup] > window:mousemove, [@shotChart:touchstart, window:touchend] > window:touchmove",
      "expr": "clamp(eventX(scope), 0, scope.width)",
      "scale": {"scope": "scope", "name": "x", "invert": true}
    }]
  },
  {
    "name": "chartStartY",
    "init": -1,
    "streams": [{
      "type": "@shotChart:mousedown, @shotChart:touchstart",
      "expr": "clamp(eventY(scope), 0, scope.height)",
      "scale": {"scope": "scope", "name": "y", "invert": true}
    }]
  },
  {
    "name": "chartEndY",
    "init": -1,
    "streams": [{
      "type": "@shotChart:mousedown, @shotChart:touchstart, [@shotChart:mousedown, window:mouseup] > window:mousemove, [@shotChart:touchstart, window:touchend] > window:touchmove",
      "expr": "clamp(eventY(scope), 0, scope.height)",
      "scale": {"scope": "scope", "name": "y", "invert": true}
    }]
  },
  {"name": "minXChart", "expr": "max(min(chartStartX, chartEndX), -250)"},
  {"name": "maxXChart", "expr": "min(max(chartStartX, chartEndX), 250)"},
  {"name": "minYChart", "expr": "max(min(chartStartY, chartEndY), -47.5)"},
  {"name": "maxYChart", "expr": "min(max(chartStartY, chartEndY), 500)"}
]

var ShotChartInteractionPredicates = [
  {
    "name": "distEqual",
    "type": "==",
    "operands": [{"signal": "distStart"}, {"signal": "distEnd"}]
  },
  {
    "name": "distRange",
    "type": "in",
    "item": {"arg": "x"},
    "range": [{"signal": "distStart"}, {"signal": "distEnd"}]
  },
  {
    "name": "distBrush",
    "type": "or",
    "operands": [{"predicate": "distEqual"}, {"predicate": "distRange"}]
  },

  {
    "name": "xLocEqual",
    "type": "==",
    "operands": [{"signal": "xLocStart"}, {"signal": "xLocEnd"}]
  },
  {
    "name": "xLocRange",
    "type": "in",
    "item": {"arg": "x"},
    "range": [{"signal": "xLocStart"}, {"signal": "xLocEnd"}]
  },
  {
    "name": "xLocBrush",
    "type": "or",
    "operands": [{"predicate": "xLocEqual"}, {"predicate": "xLocRange"}]
  },

  {
    "name": "yLocEqual",
    "type": "==",
    "operands": [{"signal": "yLocStart"}, {"signal": "yLocEnd"}]
  },
  {
    "name": "yLocRange",
    "type": "in",
    "item": {"arg": "y"},
    "range": [{"signal": "yLocStart"}, {"signal": "yLocEnd"}]
  },
  {
    "name": "yLocBrush",
    "type": "or",
    "operands": [{"predicate": "yLocEqual"}, {"predicate": "yLocRange"}]
  },

  // chart brushing in two directions
  {
    "name": "chartEqualX",
    "type": "==",
    "operands": [{"signal": "chartStartX"}, {"signal": "chartEndX"}]
  },
  {
    "name": "chartEqualY",
    "type": "==",
    "operands": [{"signal": "chartStartY"}, {"signal": "chartEndY"}]
  },
  {
    "name": "chartEqual",
    "type": "&&",
    "operands": [{"predicate": "chartEqualX"}, {"predicate": "chartEqualY"}]
  },
  {
    "name": "chartXRange",
    "type": "in",
    "item": {"arg": "x"},
    "range": [{"signal": "chartStartX"}, {"signal": "chartEndX"}]
  },
  {
    "name": "chartYRange",
    "type": "in",
    "item": {"arg": "y"},
    "range": [{"signal": "chartStartY"}, {"signal": "chartEndY"}]
  },
  {
    "name": "chartInRange",
    "type": "&&",
    "operands": [
      {"predicate": "chartXRange"},
      {"predicate": "chartYRange"}
    ]
  },
  {
    "name": "chartBrush",
    "type": "or",
    "operands": [{"predicate": "chartEqual"}, {"predicate": "chartInRange"}]
  }
]

var ShotChartInteractionFilters = {
  "distance": "(minDist == maxDist || (datum.hoopdistance >= minDist && datum.hoopdistance <= maxDist))",
  "LOC_X":    "(minXLoc == maxXLoc || (datum.LOC_X >= minXLoc && datum.LOC_X <= maxXLoc))",
  "LOC_Y":    "(minYLoc == maxYLoc || (datum.LOC_Y >= minYLoc && datum.LOC_Y <= maxYLoc))",
  "brush":    "(minXChart == maxXChart || (datum.LOC_X >= minXChart && datum.LOC_X <= maxXChart)) && (minYChart == maxYChart || (datum.LOC_Y >= minYChart && datum.LOC_Y <= maxYChart))",
}

export {ShotChartInteractionSignals, ShotChartInteractionPredicates, ShotChartInteractionFilters}
