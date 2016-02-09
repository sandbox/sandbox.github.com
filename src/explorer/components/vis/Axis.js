import className from 'classnames'
import _ from 'lodash'
import d3 from 'd3'
import React from 'react'
import { getFieldType, isGroupByField } from '../../helpers/field'
const { div, svg } = React.DOM

function axisDiscretizeTicks(axis, format) {
  let numTicks = axis.ticks()[0]
  let axisScale = axis.scale()
  let tickValues = _(axisScale.ticks(numTicks)).map(Math.floor).uniq().map((tick) => tick + 0.5).value()
  if (_.last(tickValues) > _.last(axisScale.domain())) tickValues.pop()
  axis
    .tickValues(tickValues)
    .tickSubdivide(tickValues[1] - tickValues[0] - 1)
    .tickFormat((s) => format(Math.floor(s)))
}

function axisTickHorizontalLabelShift(d) {
  let bounds = this.getBBox()
  const baseVal = this.parentElement.transform.baseVal
  let left = (baseVal[0] || baseVal.getItem(0)).matrix.e + bounds.x
  if (left < 0) {
    return 1 - left
  }
  else {
    let parentWidth = this.parentElement.parentElement.parentElement.width.baseVal.value
    let right = left + bounds.width
    if (right > parentWidth) {
      return parentWidth - right - 2
    }
    else {
      let current = d3.select(this).attr('x')
      return current ? current : 0
    }
  }
}

function axisTickVerticalLabelShift(d) {
  let bounds = this.getBBox()
  const baseVal = this.parentElement.transform.baseVal
  let top = (baseVal[0] || baseVal.getItem(0)).matrix.f + bounds.y
  if (top < 0) {
    return 1 - top
  }
  else {
    let parentHeight = this.parentElement.parentElement.parentElement.height.baseVal.value
    let bottom = top + bounds.height
    if (bottom > parentHeight) {
      return parentHeight - bottom  - 1
    }
    else {
      let current = d3.select(this).attr('y')
      return current ? current : 0
    }
  }
}

export class Axis extends React.Component {
  _d3Axis() {
    let { orient, scale, field, markType } = this.props
    let axis = d3.svg.axis().scale(scale).orient(orient).ticks(5)
    if ('bar' == markType) {
      if ('integer' == field.type && 'bin' == field.func && field.binSettings.step == 1) {
        axisDiscretizeTicks(axis, d3.format(",d"))
      }
      else if ('time' == getFieldType(field) && !_.contains(field.func, 'bin')) {
        axisDiscretizeTicks(axis, d3.format("d"))
      }
    }
    else if ('time' == getFieldType(field) && !_.contains(field.func, 'bin')) {
      axis.tickFormat(d3.format("d"))
    }
    return axis
  }

  _d3Render() {
    let tickText = d3.select(this.refs.axisContainer)
        .call(this._d3Axis())
        .selectAll("text")
    if (this.isHorizontalAxis()) {
      tickText.attr("x", axisTickHorizontalLabelShift)
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

  render() {
    let { domain, name, orient,  width, height } = this.props
    return div({},
               svg({className: 'axis', width, height}, <g ref='axisContainer' transform={this._orientTransform()}/>),
               div({className: className('axis-label', {[orient]: true})}, name))
  }
}
Axis.defaultProps = {
  orient: 'bottom'
}
