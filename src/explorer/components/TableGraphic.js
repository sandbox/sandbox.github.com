import 'fixed-data-table/dist/fixed-data-table.css'
import '../stylesheets/table.css'

import className from 'classnames'
import React from 'react'
import ReactDOM from 'react-dom'
import _ from 'lodash'
import FixedDataTable from 'fixed-data-table'
import Scrollbar from 'fixed-data-table/internal/Scrollbar.react'
import { getAccessorName } from '../data/domain'

const { Table: TableWrapper, Column: ColumnWrapper, ColumnGroup: ColumnGroupWrapper } = FixedDataTable
const [Table, Column, ColumnGroup] = [React.createFactory(TableWrapper), React.createFactory(ColumnWrapper), React.createFactory(ColumnGroupWrapper)]
const { findDOMNode } = ReactDOM
const { div, pre } = React.DOM
const BORDER_HEIGHT = 1
const EMPTY_RENDER = () => ''
const EMPTY_DATA = () => {}

const TABLE_GRAPHIC_BOUND_METHODS = ['getRow', '_onResize', '_update', 'renderHeaderCell', 'renderFooterCell', 'renderVisualizationCell']

export class TableGraphic extends React.Component {
  constructor() {
    super(...arguments)
    this.state = { renderTable: false, tableWidth: 500, tableHeight: 500 }
    _.extend(this, _(this).pick(TABLE_GRAPHIC_BOUND_METHODS).mapValues(f => f.bind(this)).value())
  }

  componentDidMount() {
    this._update()
    window.addEventListener('resize', this._onResize, false)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._onResize)
  }

  _onResize() {
    clearTimeout(this._updateTimer)
    this._updateTimer = setTimeout(this._update, 16)
  }

  _update() {
    let elem = this.refs.container
    if (elem) {
      let { offsetWidth: width, offsetHeight: height } = elem
      this.setState({
        renderTable: true,
        tableWidth: width,
        tableHeight: this.getTableHeight(width, height)
      })
    }
  }

  getTableHeight(containerWidth, containerHeight) {
    let { tableSettings } = this.props
    if (_.isEmpty(tableSettings)) return containerHeight
    let height = tableSettings.headerHeight + tableSettings.footerHeight + tableSettings.bodyHeight + 2 * BORDER_HEIGHT
    let width = tableSettings.fixedWidth + tableSettings.bodyWidth
    if (containerWidth < width) height += Scrollbar.SIZE
    if (height > containerHeight) height = containerHeight
    return height
  }

  getRow(rowIndex) {
    return this.props.panes[rowIndex]
  }

  getRowAxisCell(dataKey, rowData) {
    return dataKey
  }

  getFixedColumns(axis, settings) {
    let hasQuantitativeField = axis.hasQuantitativeField()
    return axis.map((field, r) => {
      let isOrdinal = 'O' == field.algebraType
      return Column({
        fixed: true,
        key: getAccessorName(field), dataKey: field.name,
        label: isOrdinal ? {key: [field.name]} : '',
        width: isOrdinal ? settings.fixedOrdinalAxisWidth : settings.fixedQuantAxisWidth,
        cellClassName: hasQuantitativeField ? 'public_fixedDataTableCell_axis' : '',
        cellDataGetter: this.getRowAxisCell,
        headerRenderer: this.renderHeaderCell,
        cellRenderer: this.renderRowAxisCell.bind(this, r),
        footerRenderer: EMPTY_RENDER
      })
    })
  }

  getScrollableColumns(cols, settings) {
    return _.map(cols, (axis, c) => Column({
      fixed: false, key: axis.key.join(' '),  dataKey: c, label: axis,
      width: settings.colWidth,
      headerRenderer: this.renderHeaderCell,
      cellRenderer: this.renderVisualizationCell,
      footerRenderer: this.renderFooterCell,
      allowCellsRecycling: true
    }))
  }

  renderRowAxisCell(axisIndex, cellData, cellDataKey, rowData, rowIndex, columnData, width) {
    if ('Q' == axisIndex) return div({}, getAccessorName(this.props.axes.row[rowIndex].field))
    return div({}, this.props.axes.row[rowIndex].key[axisIndex])
  }

  renderHeaderCell(axis, colIndex, columnData, rowData, width) {
    return div({}, _.map(axis.key, key => div({key: key}, key)))
  }

  renderFooterCell(axis, colIndex, columnData, rowData, width) {
    return div({},
               div({}, JSON.stringify(this.props.domains[getAccessorName(axis.field)])),
               div({}, axis.field.name))
  }

  renderVisualizationCell(cellData, cellDataKey, rowData, rowIndex, columnData, width) {
    return div({}, cellData)
  }

  render() {
    const { renderTable, tableWidth, tableHeight } = this.state
    const { isLoading, query, data, error, queryspec, tableSettings } = this.props
    const { rowHeight, rowsCount, headerHeight, footerHeight } = tableSettings
    let contained
    if (!renderTable || query == null || queryspec == null || data == null || error) {
      contained = div({}, `${error ? "Error: " : ""}No Chart`)
    }
    else {
      contained = Table(
        {
          ref: 'table',
          width: tableWidth,
          maxHeight: tableHeight,
          height: tableHeight,
          rowHeight: rowHeight,
          rowGetter: this.getRow,
          rowsCount: rowsCount,
          headerHeight: headerHeight,
          footerHeight: footerHeight,
          footerDataGetter: EMPTY_DATA
        },
        this.getFixedColumns(this.props.axes.row[0], tableSettings),
        this.getScrollableColumns(this.props.axes.col, tableSettings))
    }
    return div({className: "container-flex-fill-wrap graphic-container"},
               div({ref: 'container', className: "container-flex-fill"},
                   renderTable ? contained : null))
  }
}

TableGraphic.getTableSettings = function(axes) {
  if (null == axes) return {}
  let result = {
    rowsCount:    axes.row.length,
    rowHeight:    axes.row[0].field ? 400 : 30,
    colWidth:     axes.col[0].field ? 400 : 100,
    headerHeight: Math.max(axes.row[0].key.length > 0 ? 30 : 0, axes.col[0].key.length * 30),
    footerHeight: axes.col[0].field ? 60 : 0,
    fixedQuantAxisWidth: 120,
    fixedOrdinalAxisWidth: 100
  }
  return _.extend(result, {
    bodyHeight: result.rowsCount * result.rowHeight,
    bodyWidth:  axes.col.length * result.colWidth,
    fixedWidth: axes.row[0].key.length * result.fixedOrdinalAxisWidth + (axes.row[0].field ? result.fixedQuantAxisWidth : 0)
  })
}
