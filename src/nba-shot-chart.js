import React from 'react'
import d3 from 'd3'
import animateMark from './components/mark'
import Axis from './components/axis'
import {easingTypes} from 'react-tween-state'

function logData(d) {
  console.log('yes', d)
}

class CourtBounds extends React.Component {
  render() {
    return <g>
      <rect stroke="#000" x={this.props.xscale(-250)} y={this.props.yscale(-47.5)} width={this.props.xscale(500)} height={this.props.yscale(470)} />
      </g>
  }
}

function renderShotChart(rows, header) {
  var element = document.getElementById("shot-chart")
  var margin = {top: 30, right: 100, bottom: 30, left: 100}
  var width = element.offsetWidth - margin.left - margin.right
  var height = width - margin.top - margin.bottom

  var values = rows.map((row) => [row[17], row[18]])
  var xscale = d3.scale.linear().domain([
    d3.min(rows, (d) => d[17]),
    d3.max(rows, (d) => d[17])
  ]).range([0, width])
  var yscale = d3.scale.linear().domain([
    d3.min(rows, (d) => d[18]),
    d3.max(rows, (d) => d[18])
  ]).range([height, 0])

  class Circle extends React.Component {
    render() {
      return <circle {...this.props}></circle>
    }
  }

  let TransitionCircle = animateMark(Circle, [
    { prop: 'cx', duration: 2000, easing: easingTypes.linear},
    { prop: 'cy', duration: 2000, easing: easingTypes.linear}
  ])

  var points = rows.map(function (d, i) {
    var [x, y] = [d[17], d[18]]
    return <TransitionCircle className="dot" cx={xscale(x)} cy={yscale(y)} r={3} onMouseOver={logData.bind(null, d)}/>
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
