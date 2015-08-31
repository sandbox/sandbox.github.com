import React from 'react'
import classNames from 'classnames'
import { d3_scaleRange } from './d3_scale'

class Axis extends React.Component {
  render() {
    let orient = this.props.orient, scale = this.props.scale, innerTickSize = this.props.innerTickSize, outerTickSize = this.props.outerTickSize,
        tickArguments = this.props.tickArguments,
        tickValues = this.props.tickValues != null ? this.props.tickValues : (scale.ticks ? scale.ticks.apply(scale, tickArguments) : scale.domain()),
        tickFormat = this.props.tickFormat != null ? this.props.tickFormat : (scale.tickFormat ? scale.tickFormat.apply(scale, tickArguments) : (x => x)),
        tickSpacing = Math.max(this.props.innerTickSize, 0) + this.props.tickPadding,
        range = d3_scaleRange(scale),
        sign = orient === "top" || orient === "left" ? -1 : 1

    let tickDirection = orient === 'bottom' || orient === 'top' ? {
      x: 0, x2: 0, y: sign * tickSpacing, y2: sign * innerTickSize
    } : {
      x: sign * tickSpacing, x2: sign * innerTickSize, y: 0, y: 0
    }

    let tickTextProps = orient === 'bottom' || orient === 'top' ? {
      x: 0,
      y: sign * tickSpacing,
      dy: sign < 0 ? "0em" : ".71em",
      textAnchor: "middle"
    } : {
      x: sign * tickSpacing,
      y: 0,
      dy: ".32em",
      textAnchor: sign < 0 ? "end" : "start"
    }

    let axisClass = {
      axis: true,
      x: orient === 'top' || orient === 'bottom',
      y: orient === 'left' || orient === 'right'
    }

    let guide = orient === 'bottom' || orient === 'top' ?
        (<path className="domain" d={`M${range[0]},${sign * outerTickSize}V0H${range[1]}V${sign * outerTickSize}`}></path>) :
        (<path className="domain" d={`M${sign * outerTickSize},${range[0]}H0V${range[1]}H${sign * outerTickSize}`}></path>)

    let tickMarks = tickValues.map(
      (tick, i) =>
        <g key={i} className="tick" transform={orient === 'top' || orient === 'bottom' ? `translate(${scale(tick)},0)` : `translate(0, ${scale(tick)})`}>
        <line {...tickDirection} />
        <text y="9" {...tickTextProps}>{tick}</text>
        </g>)

    return <g className={classNames(axisClass)} transform={`translate(${this.props.x},${this.props.y})`}>{tickMarks}{guide}</g>
  }
}

Axis.defaultProps = {
  orient: "bottom",
  innerTickSize: 6,
  outerTickSize: 6,
  tickPadding: 3,
  tickArguments: [10],
  tickValues: null,
  tickFormat: null
}

export default Axis
