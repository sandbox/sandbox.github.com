import _ from 'lodash'
import dl from 'datalib'
import d3 from 'd3'
import React from 'react'
import { getFieldType, getAccessorName, isStackableField, isAggregateType, isBinField, isGroupByField } from '../../../helpers/field'
import { stackGroupedLayout } from './layout'
const { div, svg } = React.DOM

export default class Area extends React.Component {
  getDefaultScales() {
    const { scales } = this.props
    return {
      stroke:    scales.color.__default__,
      "stroke-width": 2,
      x:       0,
      y0:      0,
      y1:      0
    }
  }

  getAreaScales(props, sortedMarkData, binField) {
    const { width, height } = this.props
    const { field, scale, shelf } = props
    const name = getAccessorName(field)
    const isStackable = isStackableField(field)
    const isAggregate = isAggregateType(field)
    const isBin = isBinField(field)
    const isTime = 'time' == getFieldType(field)
    switch(shelf) {
    case 'row':
      if (isStackable) {
        let stacked = stackGroupedLayout(sortedMarkData, name, binField)
        return {
          y0: ([d, level], i) => scale(stacked(d, level, i)),
          y1: ([d, level], i) => scale(d[name]) + scale(stacked(d, level, i)) - height
        }
      }
      else if (isBin) {
        return {
          x: ([d, level]) => scale(d[name])
        }
      }
      else {
        return {
          y0: ([d, level]) => height,
          y1: ([d, level]) => scale(d[name])
        }
      }
    case 'col':
      if (isStackable) {
        let stacked = stackGroupedLayout(sortedMarkData, name, binField)
        return {
          y0: ([d, level], i) => width - scale(d[name]) - scale(stacked(d, level, i)),
          y1: ([d, level], i) => width - scale(stacked(d, level, i)),
          transform: `translate(${width}) rotate(90)`
        }
      } else {
        return {
          x: ([d, level]) => scale(d[name])
        }
      }
    case 'color':
      return {
        stroke: (d) => scale(d[name])
      }
    case 'size':
      return {
        // 'stroke-width':
      }
    default:
      return {
      }
    }
  }

  getAttributeTransforms(sortedMarkData) {
    const { transformFields } = this.props
    const binField = _.find(transformFields, fs => isBinField(fs.field))
    let transforms = _.merge(
      this.getDefaultScales(),
      _.reduce(_.map(transformFields, (fs) => this.getAreaScales(fs, sortedMarkData, binField)), _.merge, {}))
    return transforms
  }

  _d3Render() {
    d3.select(this.refs.d3container).selectAll("*").remove()
    const sortAccessors = _.filter([
      isBinField(this.props.rowAxis.field) ? this.props.rowAxis.field.accessor : null,
      isBinField(this.props.colAxis.field) ? this.props.colAxis.field.accessor : null])
    const markSort = values =>
          _.isEmpty(sortAccessors) ? values : _.sortByAll(values, sortAccessors)
    const areaGroups = _.map(
      dl.groupby(
        _.map(_.filter(this.props.transformFields, fs => !_.contains(['row', 'col'], fs.shelf)), 'field.accessor')
      ).execute(this.props.markData),
      areaGroup => _.extend({}, areaGroup, {values: markSort(areaGroup.values)}))

    const transforms = this.getAttributeTransforms(areaGroups)
    const area = d3.svg.area()
        .x(transforms.x)
        .y0(transforms.y0)
        .y1(transforms.y1)
        .interpolate('linear')

    let areas = d3.select(this.refs.d3container).selectAll("g.area")
      .data(areaGroups) // each area group

    areas.enter().append("g").attr("class", "area").append("path")
      .attr('d', (areaGroup, level) =>
            area(_.zip(areaGroup.values,_.times(areaGroup.values.length, x => level))))

    areas.selectAll("g.area path")
      .attr('transform', transforms.transform)
      .attr('stroke', transforms.stroke)
      .attr('stroke-width', transforms['stroke-width'])
      .attr('fill', transforms.stroke)
    areas.exit().remove()
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
