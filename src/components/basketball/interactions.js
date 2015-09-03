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
  {"name": "maxDist", "expr": "min(max(distStart, distEnd), 50)"}
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
  }
]

export {ShotChartInteractionSignals, ShotChartInteractionPredicates}
