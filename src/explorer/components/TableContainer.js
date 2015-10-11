import className from 'classnames'
import React from 'react'
import ReactDOM from 'react-dom'
import { TableLayout } from './TableLayout'
import { calculateScales } from '../data/scale'
import Scrollbar from 'fixed-data-table/internal/Scrollbar.react'

const { findDOMNode } = ReactDOM
const { div } = React.DOM
const BORDER_HEIGHT = 1

export class TableContainer extends React.Component {
  getTableSettings(axes) {
    if (null == axes) return {}
    let result = {
      rowsCount:    axes.row.length,
      rowHeight:    axes.row[0].field ? 400 : 30,
      colWidth:     axes.col[0].field ? 400 : 100,
      headerHeight: Math.max(axes.row[0].key.length > 0 ? 30 : 0, axes.col[0].key.length * 30),
      footerHeight: axes.col[0].field ? 60 : 0,
      fixedQuantAxisWidth: 120,
      fixedOrdinalAxisWidth: 200
    }
    return _.extend(result, {
      bodyHeight: result.rowsCount * result.rowHeight,
      bodyWidth:  axes.col.length * result.colWidth,
      fixedWidth: axes.row[0].key.length * result.fixedOrdinalAxisWidth + (axes.row[0].field ? result.fixedQuantAxisWidth : 0)
    })
  }

  render() {
    let { axes } = this.props
    let tableSettings = this.getTableSettings(axes)
    _.each(this.props.scales && this.props.scales.row, (scale) => scale.range([tableSettings.rowHeight, 0]))
    _.each(this.props.scales && this.props.scales.col, (scale) => scale.range([0, tableSettings.colWidth]))
    return <TableResizeWrapper {...tableSettings} {...this.props} />
  }
}

export class TableResizeWrapper extends React.Component {
  constructor(props) {
    super(props)
    this.state = { renderTable: false, width: 500, height: 500 }
    _.extend(this, _(this).pick('_update', '_onResize').mapValues(f => f.bind(this)).value())
  }

  componentDidMount() {
    this._update()
    window.addEventListener('resize', this._onResize, false)
  }

  componentWillUnmount() {
    clearTimeout(this._updateTimer)
    window.removeEventListener('resize', this._onResize)
  }

  _onResize() {
    clearTimeout(this._updateTimer)
    this._updateTimer = setTimeout(this._update, 16)
  }

  _update() {
    let elem = findDOMNode(this)
    let { offsetWidth: width, offsetHeight: height } = elem
    this.setState({
      renderTable: true,
      width: width,
      height: this.getTableHeight(width, height)
    })
  }

  getTableHeight(containerWidth, containerHeight) {
    let { headerHeight, footerHeight, bodyHeight, fixedWidth, bodyWidth } = this.props
    if (bodyHeight == null) return containerHeight
    let height = headerHeight + bodyHeight + footerHeight + 2 * BORDER_HEIGHT
    let width = fixedWidth + bodyWidth
    if (containerWidth < width) height += Scrollbar.SIZE
    if (height > containerHeight) height = containerHeight
    return height
  }

  render() {
    return div({className: className("container-flex-fill", {
      'table-no-header': 0 == this.props.headerHeight,
      'table-no-footer': 0 == this.props.footerHeight
    })}, <TableLayout {...this.state} {...this.props} />)
  }
}
