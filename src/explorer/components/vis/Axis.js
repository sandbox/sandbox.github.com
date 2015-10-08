import className from 'classnames'
import d3 from 'd3'
import React from 'react'
const { div, svg } = React.DOM

function axisTickHorizontalLabelShift(d) {
  let bounds = this.getBoundingClientRect()
  let axisBounds = this.parentElement.parentElement.parentElement.getBoundingClientRect()
  if (bounds.left < axisBounds.left) {
    return 'start'
  }
  else if (bounds.right > axisBounds.right) {
    return 'end'
  }
  else {
    let current = d3.select(this).style('text-anchor')
    return current ? current : 'middle'
  }
}

function axisTickVerticalLabelShift(d) {
  let bounds = this.getBoundingClientRect()
  let axisBounds = this.parentElement.parentElement.parentElement.getBoundingClientRect()
  if (bounds.top < axisBounds.top) {
    return 1 + axisBounds.top - bounds.top
  }
  else if (bounds.bottom > axisBounds.bottom) {
    return axisBounds.bottom - bounds.bottom - 1
  }
  else {
    let current = d3.select(this).attr('y')
    return current ? current : 0
  }
}

export class Axis extends React.Component {
  _d3Axis() {
    let { orient, zero, domain, height, width } = this.props
    let min = zero && domain.min > 0 ? 0 : domain.min
    let max = zero && domain.max < 0 ? 0 : domain.max
    let range = 'left' == orient || 'right' == orient ? [ height, 0 ] : [ 0, width ]
    let scale = d3.scale.linear().domain([min, max]).range(range)
    return d3.svg.axis().scale(scale).orient(orient).ticks(10, ",.1s")
  }

  _d3Render() {
    let tickText = d3.select(this.refs.axisContainer)
        .transition().duration(300)
        .call(this._d3Axis())
        .selectAll("text")
    if (this.isHorizontalAxis()) {
      tickText.style("text-anchor", axisTickHorizontalLabelShift)
    }
    else {
      tickText.attr("y", axisTickVerticalLabelShift)
    }
  }

  _orientTransform() {
    let { orient, width, height } = this.props
    let x = 'left' == orient ? width - 1: 0
    let y = 'top' == orient ? height : 0
    return `translate(${x}, ${y})`
  }

  isHorizontalAxis() {
    return 'top' == this.props.orient || 'bottom' == this.props.orient
  }

  componentDidMount() {
    this._d3Render()
  }

  componentDidUpdate() {
    this._d3Render()
  }

  componentWillUnmount() {
    d3.select(this.refs.axisContainer).selectAll("*").remove()
  }

  render() {
    let { domain, name, orient, zero, size, width, height } = this.props
    return div({},
               svg({className: 'axis', width, height}, <g ref='axisContainer' transform={this._orientTransform()}/>),
               div({className: className('axis-label', {[orient]: true})}, name))
  }
}
Axis.defaultProps = {
  orient: 'bottom',
  zero: true
}
