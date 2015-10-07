import React from 'react'
import ReactDOM from 'react-dom'
import d3 from 'd3'
import classNames from 'classnames'
import animateMark from './components/mark'
import Axis from './components/axis'
import {easingTypes} from 'react-tween-state'
import {CourtBounds, BasketBall} from './components/basketball'

function logData(d) {
  console.log('yes', d)
}

function renderShotChart(rows, header) {
  var element = document.getElementById("shot-chart")
  var margin = {top: 30, right: 179, bottom: 30, left: 179}

  var width = 600
  var height = 660

  var values = rows.map((row) => [row[17], row[18]])
  var xscale = d3.scale.linear().domain([250, -250]).range([0, width])
  var yscale = d3.scale.linear().domain([-47.5, 500]).range([height, 0])

  var xballr = Math.abs(xscale(3.85) - xscale(0))
  var yballr = Math.abs(yscale(0) - yscale(3.85))

  let TransitionBall = animateMark(BasketBall, [
    { prop: 'cx', duration: 1000, easing: easingTypes.linear, start: xscale(0)},
    { prop: 'cy', duration: 1000, easing: easingTypes.linear, start: yscale(0)}
  ])

  var points = rows.map(function (d, i) {
    var [x, y] = [d[17], d[18]]
    return <TransitionBall key={`${d[1]}_${d[2]}`}
    className={classNames("dot", {"made": d[10] === "Made Shot"})}
    cx={xscale(x)} cy={yscale(y)}
    rx={xballr} ry={yballr}
    onMouseOver={logData.bind(null, d)}/>
  })

  ReactDOM.render(
      <svg width={width + margin.left + margin.right} height={height + margin.top + margin.bottom}>
      <g transform={`translate(${margin.left}, ${margin.top})`}>
      {points}
      <CourtBounds xscale={xscale} yscale={yscale} width={width} height={height}/>
      </g>
      </svg>, element)
}

d3.json(
  "https://gist.githubusercontent.com/sandbox/7f6065c867a5f355207e/raw/5c74a5dcd7b257faa985f28c932a684ed4cea065/james-harden-shotchartdetail.json",
  function(error, json) {
    if (error) return console.warn(error)
    renderShotChart(json.resultSets[0].rowSet, json.resultSets[0].headers)
  })
