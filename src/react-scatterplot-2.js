import React from 'react'
import ReactDOM from 'react-dom'
import d3 from 'd3'
import Axis from './components/axis'
import {Mixin as tweenMixin, easingTypes} from 'react-tween-state'

var element = document.getElementById("scatterplot")
var margin = {top: 30, right: 100, bottom: 30, left: 100}
var width = element.offsetWidth - margin.left - margin.right
var height = 550 - margin.top - margin.bottom

let normalDistribution = d3.random.normal(0, 1)
var values = d3.range(1000).map(() => [normalDistribution(), normalDistribution()])
var xscale = d3.scale.linear().domain([-3, 3]).range([0, width])
var yscale = d3.scale.linear().domain([-3, 3]).range([height, 0])

function animateGroup(Component, transitionAttributes) {
  const VisualGroup = React.createClass({
    mixins: [tweenMixin],
    getInitialState() {
      let state = this.props.data.reduce(
        function (memo, d, i) {
          transitionAttributes.forEach(
            transition =>
              memo[`__data:${i}:${transition.key}`] = (typeof transition.start === "function") ? transition.start(d) : (transition.start == null ? 0 : transition.start))
          return memo
        }, {})
      return state
    },
    componentDidMount() {
      this.props.data.forEach(
        (d, i) =>
          transitionAttributes.forEach(
            transition =>
              this.tweenState(`__data:${i}:${transition.key}`, {
                easing: transition.ease,
                duration: transition.duration,
                endValue: d[transition.key]
              })))
    },
    render() {
      let marks = this.props.data.map(
        (d, i) => {
          var props = {}
          transitionAttributes.forEach(
            transition => props[transition.prop] = transition.scale(this.getTweeningValue(`__data:${i}:${transition.key}`)))
          return  <Component key={i} {...this.props.markProps} {...props} />
        })
      return <g>{marks}</g>
    }
  })

  return VisualGroup
}

class Circle extends React.Component {
  render() {
    return <circle {...this.props}></circle>
  }
}

let TransitionGroup = animateGroup(Circle, [
  { key: 0, prop: 'cx', scale: xscale, duration: 2000, easing: easingTypes.linear, start: 0},
  { key: 1, prop: 'cy', scale: yscale, duration: 2000, easing: easingTypes.linear, start: 0}
])

ReactDOM.render(
    <svg width={width + margin.left + margin.right} height={height + margin.top + margin.bottom}>
    <g transform={`translate(${margin.left}, ${margin.top})`}>
    <TransitionGroup data={values} markProps={{className: "dot", r: 3}} />
    <Axis scale={xscale} orient="bottom" x={0} y={height/2} tickValues={[-3, -2.5, -2, -1.5, -1, -0.5, 0.5, 1, 1.5, 2, 2.5, 3]}/>
    <Axis scale={yscale} orient="left" x={width/2} y={0} tickValues={[-3, -2.5, -2, -1.5, -1, -0.5, 0.5, 1, 1.5, 2, 2.5, 3]}/>
    </g>
    </svg>, element)
