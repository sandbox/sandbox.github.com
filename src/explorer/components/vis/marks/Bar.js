import d3 from 'd3'
import _ from 'lodash'
import React from 'react'
import { getFieldType, getAccessorName, isStackableField, isAggregateType, isBinField, isGroupByField } from '../../../helpers/field'
import { stackLayout } from './layout'
const { div, svg } = React.DOM
const ZERO = d => 0

export default class Bar extends React.Component {
  getDefaultScales() {
    const { scales, width, height } = this.props
    return {
      opacity: scales.opacity.__default__,
      fill:    scales.color.__default__,
      x:       ZERO,
      y:       ZERO,
      height:  (d) => height - 1,
      width:   (d) => width - 1
    }
  }

  getBarScales(props, binField) {
    const { markData, width, height } = this.props
    const { field, scale, shelf } = props
    const name = getAccessorName(field)
    const isStackable = isStackableField(field)
    const isAggregate = isAggregateType(field)
    const isBin = isBinField(field)
    const isTime = 'time' == getFieldType(field)

    switch(shelf) {
    case 'row':
      if (isStackable) {
        let stacked = stackLayout(markData, name, binField)
        return {
          y:      (d, i) => scale(d[name]) + scale(stacked(d, i)) - height,
          height: (d) => height - scale(d[name])
        }
      }
      else if (isAggregate) {
        return {
          y:      (d, i) => scale(d[name]),
          height: (d) => height - scale(d[name])
        }
      }
      else if (isBin) {
        if (isTime && _.contains(field.func, 'bin')) {
          return {
            y:     (d) => scale(d3.time[field.binSettings.unit.type].offset(d[name], field.binSettings.step)),
            height: (d) => {
              let nextTime = d3.time[field.binSettings.unit.type].offset(d[name], field.binSettings.step)
              let barHeight = scale(d[name]) - scale(nextTime)
              return barHeight > 1 ? barHeight - 1 : barHeight
            }
          }
        }
        else if (isTime) {
          return {
            y:      (d) => scale(d[name] + 1),
            height: (d) => scale(d[name]) - scale(d[name] + 1) - 1
          }
        }
        else {
          return {
            y:      (d) => scale(d[name] + field.binSettings.step),
            height: (d) => scale(d[name]) - scale(d[name] + field.binSettings.step) - 1
          }
        }
      }
      else {
        return {
          y:      (d) => scale(d[name]),
          height: (d) => height - scale(d[name]) - 1
        }
      }
    case 'col':
      if (isStackable) {
        let stacked = stackLayout(markData, name, binField)
        return {
          x:     (d, i) => scale(stacked(d, i)),
          width: (d) => scale(d[name])
        }
      }
      else if (isAggregate) {
        return {
          width: (d) => scale(d[name])
        }
      }
      else if (isBin) {
        if (isTime && _.contains(field.func, 'bin')) {
          return {
            x:     (d) => scale(d[name]),
            width: (d) => {
              let nextTime = d3.time[field.binSettings.unit.type].offset(d[name], field.binSettings.step)
              let barWidth = scale(nextTime) - scale(d[name])
              return barWidth > 1 ? barWidth - 1 : barWidth
            }
          }
        }
        else if (isTime) {
          return {
            x:     (d) => scale(d[name]),
            width: (d) => scale(d[name] + 1) - scale(d[name]) - 1
          }
        }
        else {
          return {
            x:     (d) => scale(d[name]),
            width: (d) => scale(d[name] + field.binSettings.step) - scale(d[name]) - 1
          }
        }
      }
      else {
        return {
          width: (d) => scale(d[name]) - 1
        }
      }
    case 'color':
      return {
        fill:  (d) => scale(d[name])
      }
    case 'opacity':
      return {
        opacity: (d) => scale(d[name])
      }
    default:
      return {
      }
    }
  }

  getAttributeTransforms() {
    const { transformFields } = this.props
    const binField = _.find(transformFields, fs => isBinField(fs.field))
    let transforms = _.merge(
      this.getDefaultScales(),
      _.reduce(_.map(
        transformFields,
        (fs) => this.getBarScales(fs, binField)), _.merge, {}))
    transforms.transform = (d, i) => `translate(${transforms.x(d, i)}, ${transforms.y(d, i)})`
    return transforms
  }

  _d3Render() {
    let transforms = this.getAttributeTransforms()
    let bars = d3.select(this.refs.d3container).selectAll("rect")
        .data(this.props.markData)
    bars.enter().append('rect')
    bars.attr('fill', transforms.fill)
      .attr('fill-opacity', transforms.opacity)
      .attr('x', transforms.x)
      .attr('y', transforms.y)
      .attr('width', transforms.width)
      .attr('height', transforms.height)
    bars.exit().remove()
  }

  componentDidMount() {
    this._d3Render()
  }

  componentDidUpdate() {
    this._d3Render()
  }

  render() {
    const { width, height } = this.props
    return svg({ref: 'd3container', width, height})
  }
}
