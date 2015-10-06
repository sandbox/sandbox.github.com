import 'fixed-data-table/dist/fixed-data-table.css'
import '../stylesheets/table.css'

import className from 'classnames'
import React from 'react'
import _ from 'lodash'
import FixedDataTable from 'fixed-data-table'
import Scrollbar from 'fixed-data-table/internal/Scrollbar.react'
import { getAccessorName } from '../data/domain'

const { Table: TableWrapper, Column: ColumnWrapper, ColumnGroup: ColumnGroupWrapper } = FixedDataTable
const [Table, Column, ColumnGroup] = [React.createFactory(TableWrapper), React.createFactory(ColumnWrapper), React.createFactory(ColumnGroupWrapper)]
const { findDOMNode } = React
const { div, pre } = React.DOM
const BORDER_HEIGHT = 1

const TABLE_GRAPHIC_BOUND_METHODS = ['getRow', '_onResize', '_update', 'renderHeaderCell', 'renderFooterCell', 'renderVisualizationCell']
export class TableGraphic extends React.Component {
  constructor() {
    super(...arguments)
    this.state     = { renderTable: false, tableWidth: 500, tableHeight: 500 }
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
    let elem = findDOMNode(this.refs.container)
    if (elem) {
      let { offsetWidth: width, offsetHeight: height } = elem
      this.setState({
        renderTable: true,
        tableWidth: width,
        tableHeight: this.getTableHeight(width, height)
      })
    }
  }

  getHeaderHeight() {
    return Math.max(40, _.first(this.props.axes.col).key.length * 40)
  }

  getFooterHeight() {
    return _.first(this.props.axes.col).field ? 40 : 0
  }

  getTableHeight(containerWidth, containerHeight) {
    const { axes, queryspec } = this.props
    if (null == axes) return containerHeight
    let height = 30 * axes.row.length + this.getFooterHeight() + this.getHeaderHeight() + 2 * BORDER_HEIGHT
    let width = (queryspec.row ? queryspec.row.length : 0) * 150 + axes.col.length * 300
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

  getFooterAxisCell() {
    return {}
  }

  renderRowAxisCell(axisIndex, cellData, cellDataKey, rowData, rowIndex, columnData, width) {
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
    const { isLoading, query, data, error, queryspec, visualspec,
            axes, domains, panes } = this.props
    let contained
    if (!renderTable || query == null || queryspec == null || data == null || error) {
      contained = div({}, `${error ? "Error: " : ""}No Chart`)
    }
    else {
      const axisColumns = _.map(queryspec.row, (field, r) => Column({
        key: field.fieldId, label: field.name, dataKey: field.name,
        fixed: true, width: 150,
        cellClassName: true ? '' : 'public_fixedDataTableCell_axis',
        cellDataGetter: this.getRowAxisCell,
        cellRenderer: this.renderRowAxisCell.bind(this, r)
      }))
      const paneColumns = _.map(axes.col, (axis, c) => Column({
        key: axis.key.join(' '), fixed: false, label: axis, dataKey: c, width: 300,
        headerRenderer: this.renderHeaderCell,
        cellRenderer: this.renderVisualizationCell,
        footerRenderer: this.renderFooterCell,
        allowCellsRecycling: true
      }))
      contained = Table(
        {
          width: tableWidth,
          maxHeight: tableHeight,
          height: tableHeight,
          rowHeight: 30,
          rowGetter: this.getRow,
          rowsCount: axes.row.length,
          headerHeight: this.getHeaderHeight(),
          footerHeight: this.getFooterHeight(),
          footerDataGetter: this.getFooterAxisCell
        },
        axisColumns,
        paneColumns)
    }

    return div({className: "container-flex-fill-wrap graphic-container"},
               div({ref: 'container', className: "container-flex-fill"},
                   renderTable ? contained : null))
  }
}
