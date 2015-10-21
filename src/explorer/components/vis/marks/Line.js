import _ from 'lodash'
import dl from 'datalib'
import d3 from 'd3'
import React from 'react'
import { getAccessorName, isBinField } from '../../../helpers/field'
const { div, svg } = React.DOM

export default class Line extends React.Component {
  getDefaultScales() {
    const { scales } = this.props
    return {
      stroke:    scales.color.__default__,
      "stroke-width": 2,
      x:       0,
      y:       0
    }
  }

  getLineScales(props) {
    const { markData, width, height } = this.props
    const { field, scale, shelf } = props
    const name = getAccessorName(field)
    switch(shelf) {
    case 'row':
      return {
        y: (d) => scale(d[name])
      }
    case 'col':
      return {
        x: (d) => scale(d[name])
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

  getAttributeTransforms() {
    const { transformFields } = this.props
    let transforms = _.merge(
      this.getDefaultScales(),
      _.reduce(_.map(transformFields, (fs) => this.getLineScales(fs)), _.merge, {}))
    return transforms
  }

  _d3Render() {
    d3.select(this.refs.d3container).selectAll("*").remove()
    const transforms = this.getAttributeTransforms()
    const line = d3.svg.line()
        .x(transforms.x)
        .y(transforms.y)
        .interpolate('linear')

    const lineGroups = dl.groupby(
      _.map(_.filter(this.props.transformFields, fs => !_.contains(['row', 'col'], fs.shelf)), 'field.accessor')
    ).execute(this.props.markData)

    const sortAccessors = _.filter([
      isBinField(this.props.rowAxis.field) ? this.props.rowAxis.field.accessor : null,
      isBinField(this.props.colAxis.field) ? this.props.colAxis.field.accessor : null])
    const markSort = values =>
          _.isEmpty(sortAccessors) ? values : _.sortByAll(values, sortAccessors)

    let lines = d3.select(this.refs.d3container).selectAll("g.line")
      .data(lineGroups) // each line group

    lines.enter().append("g").attr("class", "line").append("path")
    lines.selectAll("g.line path")
      .attr('d', lineGroup => line(markSort(lineGroup.values)))
      .attr('stroke', transforms.stroke)
      .attr('stroke-width', transforms['stroke-width'])
      .attr('fill', 'none')
    lines.exit().remove()
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
