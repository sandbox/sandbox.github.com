function brushSignal(group, name, event, direction, scale, min, max) {
  return [
    {
      "name": `${name}Start`,
      "init": -1,
      "streams": [{
        "type": `@${group}:mousedown, @${group}:touchstart`,
        "expr": `${event}(scope)`,
        "scale": {"scope": "scope", "name": scale, "invert": true}
      }]
    },
    {
      "name": `${name}End`,
      "init": -1,
      "streams": [{
        "type": `@${group}:mousedown, @${group}:touchstart, [@${group}:mousedown, window:mouseup] > window:mousemove, [@${group}:touchstart, window:touchend] > window:touchmove`,
        "expr": `clamp(${event}(scope), 0, scope.${direction})`,
        "scale": {"scope": "scope", "name": scale, "invert": true}
      }]
    },
    {"name": `min${name}`, "expr": `max(min(${name}Start, ${name}End), ${min})`},
    {"name": `max${name}`, "expr": `min(max(${name}Start, ${name}End), ${max})`}
  ]
}

function brushPredicate(name, arg) {
  return [
    {
      "name": `${name}Equal`,
      "type": "==",
      "operands": [{"signal": `${name}Start`}, {"signal": `${name}End`}]
    },
    {
      "name": `${name}Range`,
      "type": "in",
      "item": {"arg": arg},
      "range": [{"signal": `${name}Start`}, {"signal": `${name}End`}]
    },
    {
      "name": `${name}Brush`,
      "type": "or",
      "operands": [{"predicate": `${name}Equal`}, {"predicate": `${name}Range`}]
    }
  ]
}

var ShotChartInteractionSignals = [
  {
    "name": "scope",
    "init": {"width": 0},
    "streams": [
      {"type": "mousedown, touchstart", "expr": "eventGroup()"}
    ]
  }].concat(
    brushSignal('distGroup', 'dist', 'eventX', 'width', 'x', 0, 50)
  ).concat(
    brushSignal('timepassedGroup', 'timepassed', 'eventX', 'width', 'x', 0, 64)
  ).concat(
    brushSignal('xLocGroup', 'xLoc', 'eventX', 'width', 'x', -250, 250)
  ).concat(
    brushSignal('yLocGroup', 'yLoc', 'eventY', 'height', 'y', -47.5, 500)
  ).concat(
    brushSignal('shotChart', 'chartX', 'eventX', 'width', 'x', -250, 250)
  ).concat(
    brushSignal('shotChart', 'chartY', 'eventY', 'height', 'y', -47.5, 500))

var ShotChartInteractionPredicates = brushPredicate('dist', 'x').concat(
  brushPredicate('timepassed', 'x')
).concat(
  brushPredicate('xLoc', 'x')
).concat(
  brushPredicate('yLoc', 'y')
).concat(
  brushPredicate('chartX', 'x')
).concat(
  brushPredicate('chartY', 'y')
).concat(
  [
    {
      "name": "chartEqual",
      "type": "&&",
      "operands": [{"predicate": "chartXEqual"}, {"predicate": "chartYEqual"}]
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
  ])

var ShotChartInteractionFilters = {
  "brush": "(minchartX == maxchartX || (datum.LOC_X >= minchartX && datum.LOC_X <= maxchartX)) && (minchartY == maxchartY || (datum.LOC_Y >= minchartY && datum.LOC_Y <= maxchartY))"
}

function shotFilter(...variable_signals) {
  return variable_signals.map((variable_signal) => {
    var [variable, signal] = variable_signal
    return `(min${signal} == max${signal} || (datum.${variable} >= min${signal} && datum.${variable} <= max${signal}))`
  }).join(" && ")
}

function crossFilter(crosses) {
  return function(currentFilter) {
    return shotFilter.apply(null, crosses.filter((value) => value[0] !== currentFilter))
  }
}

var filterExclude = crossFilter([
  ['LOC_X', 'xLoc'], ['LOC_Y', 'yLoc'], ['hoopdistance', 'dist'], ['timepassed', 'timepassed']
])

export {ShotChartInteractionSignals, ShotChartInteractionPredicates, ShotChartInteractionFilters, filterExclude}
