import React from 'react'
import ReactDOM from 'react-dom'
import d3 from 'd3'
import animateMark from './components/mark'
import Axis from './components/axis'
import {easingTypes} from 'react-tween-state'

var element = document.getElementById("scatterplot")
var margin = {top: 30, right: 100, bottom: 30, left: 100}
var width = element.offsetWidth - margin.left - margin.right
var height = 550 - margin.top - margin.bottom

let normalDistribution = d3.random.normal(0, 1)
var values = d3.range(1000).map(() => [normalDistribution(), normalDistribution()])
var xscale = d3.scale.linear().domain([-3, 3]).range([0, width])
var yscale = d3.scale.linear().domain([-3, 3]).range([height, 0])

class Circle extends React.Component {
  render() {
    return <circle {...this.props}></circle>
  }
}

let TransitionCircle = animateMark(Circle, [
  { prop: 'cx', duration: 2000, easing: easingTypes.linear, start: xscale(0)},
  { prop: 'cy', duration: 2000, easing: easingTypes.linear, start: yscale(0)}
])

var points = values.map(function (d, i) {
  var [x, y] = d
  return <TransitionCircle key={i} className="dot" cx={xscale(x)} cy={yscale(y)} r={3} />
})

ReactDOM.render(
    <svg width={width + margin.left + margin.right} height={height + margin.top + margin.bottom}>
    <g transform={`translate(${margin.left}, ${margin.top})`}>
    {points}
    <Axis scale={xscale} orient="bottom" x={0} y={height/2} tickValues={[-3, -2.5, -2, -1.5, -1, -0.5, 0.5, 1, 1.5, 2, 2.5, 3]}/>
    <Axis scale={yscale} orient="left" x={width/2} y={0} tickValues={[-3, -2.5, -2, -1.5, -1, -0.5, 0.5, 1, 1.5, 2, 2.5, 3]}/>
    </g>
    </svg>, element)
