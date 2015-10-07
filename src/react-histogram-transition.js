import React from 'react'
import ReactDOM from 'react-dom'
import d3 from 'd3'
import animateMark from './components/mark'
import Rect from './components/rect'
import Axis from './components/axis'
import {easingTypes} from 'react-tween-state'

var element = document.getElementById("react-transition")
var margin = {top: 10, right: 30, bottom: 30, left: 30}
var width = element.offsetWidth - margin.left - margin.right
var height = 550 - margin.top - margin.bottom
var values = d3.range(1000).map(d3.random.bates(10))
var formatCount = d3.format(",.0f")
var xscale = d3.scale.linear().domain([0, 1]).range([0, width])
var data = d3.layout.histogram().bins(xscale.ticks(20))(values)
var yscale = d3.scale.linear().domain([0, d3.max(data, (d) => d.y)]).range([height, 0])

let TransitionRect = animateMark(Rect, [
  {prop: 'width', duration: 300, easing: easingTypes.easeInOutQuad},
  {prop: 'height', duration: 600, easing: easingTypes.linear}
])

class RectGroup extends React.Component {
  render() {
    return <g {...this.props} transform={`translate(${this.props.x}, ${this.props.y})`}></g>
  }
}
let TransitionGroup = animateMark(RectGroup, [
  { prop: 'y', duration: 900, easing: easingTypes.linear, start: height }
])

var bars = data.map(
  (d, i) =>
    <TransitionGroup key={i} className="bar" x={xscale(d.x)} y={yscale(d.y)}>
    <TransitionRect width={xscale(d.dx) - 1} height={height - yscale(d.y)} />
    <text dy=".75em" y={2} x={xscale(d.dx) / 2} textAnchor="middle">{formatCount(d.y)}</text>
    </TransitionGroup>)

ReactDOM.render(
    <svg width={width + margin.left + margin.right} height={height + margin.top + margin.bottom}>
    <g transform={`translate(${margin.left}, ${margin.top})`}>
    {bars}
    <Axis scale={xscale} orient="bottom" x={0} y={height}/>
    <Axis scale={yscale} orient="left" x={0} y={0}/>
    </g>
    </svg>, element)
