import 'fixed-data-table/dist/fixed-data-table.css'
import '../css/components/table.scss'

import React from 'react'
import _ from 'lodash'
import FixedDataTable from 'fixed-data-table'
import { getAccessorName } from '../helpers/field'
const Axis = React.createFactory(require('./vis/Axis').Axis)
const Pane = React.createFactory(require('./vis/Pane').Pane)

const { Table: TableWrapper, Column: ColumnWrapper, Cell: CellWrapper } = FixedDataTable
const [Table, Column, Cell] = [React.createFactory(TableWrapper), React.createFactory(ColumnWrapper), React.createFactory(CellWrapper)]
const { div } = React.DOM
const EMPTY_RENDER = () => ''
const EMPTY_DATA   = () => {}

const RowAxisCell = ({axisIndex, rowAxis, scaleLookup, markType, ...props}) => {
  return ({rowIndex, height, width, ...cellProps}) => {
    if ('Q' == axisIndex) {
      let field = rowAxis[rowIndex].field
      let name = field.accessor
      return Axis({orient: 'left', scale: scaleLookup[name], name, field, height, width, markType})
    }
    return Cell({}, div({className: "table-row-label"}, rowAxis[rowIndex].key[axisIndex]))
  }
}

const PaneCell = ({paneData, colAxis, colIndex, rowAxisLookup, scales, fieldScales, markType, ...props}) => {
  return ({rowIndex, height, width, ...cellProps}) => {
    const cellData = paneData[rowIndex][colIndex]
    if(null == cellData) return div({})
    return Pane({
      paneData: cellData,
      rowAxis:  rowAxisLookup[rowIndex],
      colAxis,
      width,
      height,
      markType: markType,
      fieldScales: fieldScales,
      scales: scales
    })
  }
}

const FooterCell = ({height, colAxis, colScaleLookup, markType, ...props}) => {
  return ({rowIndex, width, ...cellProps}) => {
    let field = colAxis.field
    let name = field.accessor
    return Axis({scale: colScaleLookup[name], name, field, height, width, markType})
  }
}

export class TableLayout extends React.Component {
  getFixedColumns(axis, props) {
    return axis.map((field, r) => {
      let isOrdinal = 'O' == field.algebraType
      return Column({
        fixed: true,
        key: getAccessorName(field),
        width: isOrdinal ? props.fixedOrdinalAxisWidth : props.fixedQuantAxisWidth,
        header: Cell({}, div({}, isOrdinal ? field.name : '')),
        cell: RowAxisCell({
          markType: props.visualspec.table.type,
          axisIndex: r,
          rowAxis: props.axes.row,
          scaleLookup: props.visScales.row
        }),
        footer: EMPTY_RENDER
      })
    })
  }

  getScrollableColumns(cols, props) {
    return _.map(cols, (axis, c) => {
      return Column({
        fixed: false, key: c,
        width: props.colWidth,
        height: props.rowHeight,
        header: Cell({}, div({}, _.map(axis.key, name => div({key: name}, name)))),
        cell: PaneCell({
          paneData: props.panes,
          colIndex: c,
          colAxis: axis,
          rowAxisLookup: props.axes.row,
          markType: props.visualspec.table.type,
          scales: props.visScales,
          fieldScales: props.fieldScales
        }),
        footer: FooterCell({
          colAxis: axis,
          colScaleLookup: props.visScales.col,
          height: props.footerHeight,
          markType: props.visualspec.table.type
        }),
        allowCellsRecycling: true
      })
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
          rowsCount: rowsCount,
          headerHeight: headerHeight,
          footerHeight: footerHeight
        },
        this.getFixedColumns(axes.row[0], this.props),
        this.getScrollableColumns(axes.col, this.props)
      )
    }
  }
}
