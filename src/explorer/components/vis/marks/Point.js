import _ from 'lodash'
import dl from 'datalib'
import d3 from 'd3'
import React from 'react'
import { getAccessorName, isBinField } from '../../../helpers/field'
const { svg } = React.DOM
const XDEFAULT = d => 30
const YDEFAULT = d => 15
const FILL_OPACITY_DEFAULT = d => 0.4

export default class Point extends React.Component {
  getDefaultScales() {
    const { scales } = this.props
    let symbol = d3.svg.symbol()
    return {
      opacity: FILL_OPACITY_DEFAULT,
      size:    scales.size.__default__,
      symbol:  symbol,
      shape:   scales.shape.__default__,
      color:   scales.color.__default__,
      x:       XDEFAULT,
      y:       YDEFAULT
    }
  }

  getSymbolScales(props) {
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
      let color = (d) => scale(d[name])
      return {
        color
      }
    case 'size':
      return {
        size: d => scale(d[name])
      }
    case 'shape':
      return {
        shape:  d => scale(d[name])
      }
    case 'opacity':
      return {
        opacity: d => scale(d[name])
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
      _.reduce(_.map(transformFields, (fs) => this.getSymbolScales(fs)), _.merge, {}))
    transforms.transform = (d, i) => `translate(${transforms.x(d, i)}, ${transforms.y(d, i)})`
    transforms.d = d => {
      return transforms.symbol.size(transforms.size(d)).type(transforms.shape(d))()
    }
    return transforms
  }

  _d3Render() {
    const transforms = this.getAttributeTransforms()
    let symbols = d3.select(this.refs.d3container).selectAll("g.symbol")
        .data(this.props.markData)
    symbols.enter().append("g").attr("class", "symbol").append('path')
    symbols.selectAll('g.symbol path')
      .attr('stroke-width', 1)
      .attr('d', transforms.d)
      .attr('fill', transforms.color)
      .attr('fill-opacity', transforms.opacity)
      .attr('stroke-opacity', transforms.opacity)
      .attr('stroke', transforms.color)
      .attr('transform', transforms.transform)
    symbols.exit().remove()
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
