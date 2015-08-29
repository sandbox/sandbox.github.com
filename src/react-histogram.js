import React from 'react'
import d3 from 'd3'

var element = document.getElementById("react-histogram")
var margin = {top: 10, right: 30, bottom: 30, left: 30}
var width = element.offsetWidth - margin.left - margin.right
var height = 550 - margin.top - margin.bottom
var values = d3.range(1000).map(d3.random.bates(10))
var formatCount = d3.format(",.0f")
var xscale = d3.scale.linear().domain([0, 1]).range([0, width])
var data = d3.layout.histogram().bins(xscale.ticks(20))(values)
var yscale = d3.scale.linear().domain([0, d3.max(data, (d) => d.y)]).range([height, 0])

var bars = data.map(
  (d, i) =>
    <g key={i} x="0" y="0" className="bar" transform={`translate(${xscale(d.x)}, ${yscale(d.y)})`}>
    <rect width={xscale(d.dx) - 1} height={height - yscale(d.y)} />
    <text dy=".75em" y={2} x={xscale(d.dx) / 2} textAnchor="middle">{formatCount(d.y)}</text>
    </g>)

class Axis extends React.Component {
  render() {
    let range = this.props.scale.range()
    let guide = (<path className="domain" d={`M${range[0]},6V0H${range[1]}V6`}></path>)

    let tickValues = this.props.scale.ticks.apply(this.props.scale, [10])
    let ticks = tickValues.map(
      (tick) =>
        <g className="tick" transform={`translate(${this.props.scale(tick)},0)`}>
        <line x={0} y={0} x2={0} y2={6} />
        <text y="9" dy=".71em" textAnchor="middle">{tick}</text>
        </g>)
    return <g className="x axis" transform={`translate(0,${this.props.y})`}>{ticks}{guide}</g>
  }
}

React.render(
    <svg width={width + margin.left + margin.right} height={height + margin.top + margin.bottom}>
    <g transform={`translate(${margin.left}, ${margin.top})`}>
    {bars}
    <Axis scale={xscale} orient="bottom" y={height}/>
    </g>
    </svg>, element)
