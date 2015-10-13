import d3 from 'd3'
import _ from 'lodash'
import React from 'react'
import { getAccessorName, isStackableField, isAggregateType } from '../../../helpers/field'
const { div, svg } = React.DOM
const ZERO = d => 0
function cumsum(array, sum_fn = _.identity) {
  let sum = 0
  let current_sum
  let result = _.map(array, a => {
    current_sum = sum
    sum += sum_fn(a)
    return current_sum
  })
  result.push(sum)
  return result
}

function stackLayout(markData, name, binField) {
  let accessor = _.property(name)
  if (!binField) {
    let stacked = cumsum(markData, accessor)
    return (d, i) => stacked[i]
  }
  else {
    let sums = {}
    let binName = getAccessorName(binField.field)
    let stacked = _.map(
      markData,
      a => {
        if(null == sums[a[binName]]) sums[a[binName]] = 0
        let current_sum = sums[a[binName]]
        sums[a[binName]] += a[name]
        return current_sum
      })
    return (d, i) => stacked[i]
  }
}

export default class Bar extends React.Component {
  getDefaultScales() {
    const { scales, rowAxis, colAxis, width, height } = this.props
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
    const isBin = _.contains(field.func, 'bin')

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
        let binHeight = Math.abs(scale(0) - scale(field.binner.step))
        return {
          y:      (d) => scale(d[name]) - binHeight,
          height: (d) => binHeight - 1
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
        let binWidth = Math.abs(scale(field.binner.step) - scale(0))
        return {
          x:     (d) => scale(d[name]),
          width: (d) => binWidth - 1
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
    case 'size':
    case 'opacity':
    default:
      return {
      }
    }
  }

  getAttributeTransforms() {
    const { transformFields } = this.props
    const binField = _.find(transformFields, fs => _.contains(fs.field.func, 'bin'))
    let transforms = _.merge(
      this.getDefaultScales(),
      _.reduce(_.map(
        transformFields,
        (fs) => this.getBarScales(fs, binField)), _.merge, {}))
    transforms.transform = (d, i) => `translate(${transforms.x(d, i)}, ${transforms.y(d, i)})`
    return transforms
  }

  _d3Render() {
    d3.select(this.refs.d3container).selectAll("*").remove()
    let transforms = this.getAttributeTransforms()
    let bars = d3.select(this.refs.d3container).selectAll("g.bar")
        .data(this.props.markData)
        .enter().append("g").attr("class", "bar")
    bars.attr('transform', transforms.transform)
    bars.append('rect')
      .attr('width', transforms.width)
      .attr('height', transforms.height)
      .attr('fill', transforms.fill)
  }

  componentDidMount() {
    this._d3Render()
  }

  componentDidUpdate() {
    this._d3Render()
  }

  componentWillUnmount() {
    d3.select(this.refs.d3container).selectAll("*").remove()
  }

  render() {
    const { width, height } = this.props
    return svg({ref: 'd3container', width, height})
  }
}
