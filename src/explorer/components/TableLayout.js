import 'fixed-data-table/dist/fixed-data-table.css'
import '../css/components/table.scss'

import React from 'react'
import _ from 'lodash'
import FixedDataTable from 'fixed-data-table'
import { getAccessorName } from '../helpers/field'
const Axis = React.createFactory(require('./vis/Axis').Axis)
const Pane = React.createFactory(require('./vis/Pane').Pane)

const { Table: TableWrapper, Column: ColumnWrapper, ColumnGroup: ColumnGroupWrapper } = FixedDataTable
const [Table, Column, ColumnGroup] = [React.createFactory(TableWrapper), React.createFactory(ColumnWrapper), React.createFactory(ColumnGroupWrapper)]
const { div } = React.DOM
const EMPTY_RENDER = () => ''
const EMPTY_DATA   = () => {}

export class TableLayout extends React.Component {
  constructor(props) {
    super(props)
    _.extend(this, _(this).pick([
      'getRow', 'getRowAxisCell',
      'renderRowAxisCell', 'renderRowHeaderCell',
      'renderColHeaderCell', 'renderFooterCell',
      'renderVisualizationCell'
    ]).mapValues(f => f.bind(this)).value())
  }

  getFixedColumns(axis, props) {
    return axis.map((field, r) => {
      let isOrdinal = 'O' == field.algebraType
      return Column({
        fixed: true,
        key: getAccessorName(field), dataKey: field.name,
        columnData: field,
        label: isOrdinal ? field.name : '',
        width: isOrdinal ? props.fixedOrdinalAxisWidth : props.fixedQuantAxisWidth,
        cellClassName: this.props.hasRowNumericAxes ? 'public_fixedDataTableCell_axis' : '',
        cellDataGetter: this.getRowAxisCell,
        headerRenderer: this.renderRowHeaderCell,
        cellRenderer: this.renderRowAxisCell.bind(this, r),
        footerRenderer: EMPTY_RENDER
      })
    })
  }

  getScrollableColumns(cols, props) {
    return _.map(cols, (axis, c) => {
      return Column({
        fixed: false, key: c, dataKey: c, label: axis.label(),
        columnData: axis,
        width: props.colWidth,
        headerRenderer: this.renderColHeaderCell,
        cellRenderer: this.renderVisualizationCell,
        footerRenderer: this.renderFooterCell,
        allowCellsRecycling: true
      })
    })
  }

  getRow(rowIndex) {
    return this.props.panes[rowIndex]
  }

  getRowAxisCell(dataKey, rowData) {
    return dataKey
  }

  renderRowAxisCell(axisIndex, cellData, cellDataKey, rowData, rowIndex, columnData, width) {
    if ('Q' == axisIndex) {
      let name = this.props.axes.row[rowIndex].field.accessor
      return Axis({orient: 'left', scale: this.props.scales.row[name], name, height: this.props.rowHeight, width: width})
    }
    return div({className: "table-row-label"}, this.props.axes.row[rowIndex].key[axisIndex])
  }

  renderRowHeaderCell(label, colIndex, columnData, rowData, width) {
    return div({}, label)
  }

  renderColHeaderCell(label, colIndex, columnData, rowData, width) {
    return div({}, _.map(columnData.key, name => div({key: name}, name)))
  }

  renderFooterCell(label, colIndex, columnData, rowData, width) {
    let name   = getAccessorName(columnData.field)
    return Axis({scale: this.props.scales.col[name], name, height: this.props.footerHeight, width: width})
  }

  renderVisualizationCell(cellData, cellDataKey, rowData, rowIndex, columnData, width) {
    if(null == cellData) return div({})
    return Pane({
      markType: this.props.visualspec.table.type,
      paneData: cellData,
      rowAxis:  this.props.axes.row[rowIndex],
      colAxis:  columnData,
      width: this.props.colWidth,
      height: this.props.rowHeight,
      fieldScales: this.props.fieldScales,
      scales: this.props.scales
    })
  }

  render() {
    const { renderTable, width, height,
            rowHeight, rowsCount, headerHeight, footerHeight,
            error, result, queryspec, axes } = this.props
    if (!renderTable || error || queryspec == null || result == null) {
      return div({}, `${error ? "Error: " : ""}No Chart`)
    }
    else {
      return Table(
        {
          width: width,
          maxHeight: height,
          height: height,
          rowHeight: rowHeight,
          rowGetter: this.getRow,
          rowsCount: rowsCount,
          headerHeight: headerHeight,
          footerHeight: footerHeight,
          footerDataGetter: EMPTY_DATA
        },
        this.getFixedColumns(axes.row[0], this.props),
        this.getScrollableColumns(axes.col, this.props))
    }
  }
}
