import React from 'react'
import d3 from 'd3'
import animateMark from './components/mark'
import Axis from './components/axis'
import {easingTypes} from 'react-tween-state'
import {CourtBounds, BasketBall} from './components/basketball'

function logData(d) {
  console.log('yes', d)
}

function renderShotChart(rows, header) {
  var element = document.getElementById("shot-chart")
  var margin = {top: 30, right: 100, bottom: 30, left: 100}

  var width = element.offsetWidth - margin.left - margin.right
  var height = width - margin.top - margin.bottom

  var values = rows.map((row) => [row[17], row[18]])
  var xscale = d3.scale.linear().domain([-250, 250]).range([0, width])
  var yscale = d3.scale.linear().domain([-47.5, 450]).range([height, 0])

  var xballr = xscale(3.85) - xscale(0)
  var yballr = yscale(0) - yscale(3.85)

  let TransitionBall = animateMark(BasketBall, [
    { prop: 'cx', duration: 2000, easing: easingTypes.linear, start: xscale(0)},
    { prop: 'cy', duration: 2000, easing: easingTypes.linear, start: yscale(0)}
  ])

  var points = rows.map(function (d, i) {
    var [x, y] = [d[17], d[18]]
    return <TransitionBall key={i} className="dot" cx={xscale(x)} cy={yscale(y)} rx={xballr} ry={yballr} onMouseOver={logData.bind(null, d)}/>
  })

  React.render(
      <svg width={width + margin.left + margin.right} height={height + margin.top + margin.bottom}>
      <g transform={`translate(${margin.left}, ${margin.top})`}>
      {points}
      <CourtBounds xscale={xscale} yscale={yscale} width={width} height={height}/>
      </g>
      </svg>, element)
}

d3.json(
  "/public/data/james-harden-shotchartdetail.json",
  function(error, json) {
    if (error) return console.warn(error)
    renderShotChart(json.resultSets[0].rowSet, json.resultSets[0].headers)
  })
