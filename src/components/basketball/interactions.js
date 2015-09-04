var ShotChartInteractionSignals = [
  {
    "name": "scope",
    "init": {"width": 0},
    "streams": [
      {"type": "mousedown", "expr": "eventGroup()"}
    ]
  },
  {
    "name": "distStart",
    "init": -1,
    "streams": [{
      "type": "@distGroup:mousedown",
      "expr": "eventX(scope)",
      "scale": {"scope": "scope", "name": "x", "invert": true}
    }]
  },
  {
    "name": "distEnd",
    "init": -1,
    "streams": [{
      "type": "@distGroup:mousedown, [@distGroup:mousedown, window:mouseup] > window:mousemove",
      "expr": "clamp(eventX(scope), 0, scope.width)",
      "scale": {"scope": "scope", "name": "x", "invert": true}
    }]
  },
  {"name": "minDist", "expr": "max(min(distStart, distEnd), 0)"},
  {"name": "maxDist", "expr": "min(max(distStart, distEnd), 50)"},

  {
    "name": "xLocStart",
    "init": -1,
    "streams": [{
      "type": "@xLocGroup:mousedown",
      "expr": "eventX(scope)",
      "scale": {"scope": "scope", "name": "x", "invert": true}
    }]
  },
  {
    "name": "xLocEnd",
    "init": -1,
    "streams": [{
      "type": "@xLocGroup:mousedown, [@xLocGroup:mousedown, window:mouseup] > window:mousemove",
      "expr": "clamp(eventX(scope), 0, scope.width)",
      "scale": {"scope": "scope", "name": "x", "invert": true}
    }]
  },
  {"name": "minXLoc", "expr": "max(min(xLocStart, xLocEnd), -250)"},
  {"name": "maxXLoc", "expr": "min(max(xLocStart, xLocEnd), 250)"},

  {
    "name": "yLocStart",
    "init": -1,
    "streams": [{
      "type": "@yLocGroup:mousedown",
      "expr": "eventY(scope)",
      "scale": {"scope": "scope", "name": "y", "invert": true}
    }]
  },
  {
    "name": "yLocEnd",
    "init": -1,
    "streams": [{
      "type": "@yLocGroup:mousedown, [@yLocGroup:mousedown, window:mouseup] > window:mousemove",
      "expr": "clamp(eventY(scope), 0, scope.height)",
      "scale": {"scope": "scope", "name": "y", "invert": true}
    }]
  },
  {"name": "minYLoc", "expr": "max(min(yLocStart, yLocEnd), -50)"},
  {"name": "maxYLoc", "expr": "min(max(yLocStart, yLocEnd), 500)"}
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
  }
]

var ShotChartInteractionFilters = {
  "distance": "(minDist == maxDist || (datum.hoopdistance >= minDist && datum.hoopdistance <= maxDist))",
  "LOC_X":    "(minXLoc == maxXLoc || (datum.LOC_X >= minXLoc && datum.LOC_X <= maxXLoc))",
  "LOC_Y":    "(minYLoc == maxYLoc || (datum.LOC_Y >= minYLoc && datum.LOC_Y <= maxYLoc))"
}

export {ShotChartInteractionSignals, ShotChartInteractionPredicates, ShotChartInteractionFilters}
