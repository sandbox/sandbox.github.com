import React from 'react'
import className from 'classnames'
import _ from 'lodash'
import { createDropdownComponent } from '../../components/Dropdown'
import { AGGREGATES } from '../helpers/field'
import { getTable } from '../ducks/datasources'
import { TableField } from './Field'

const {div, i: icon, span} = React.DOM

class DataSource extends React.Component {
  render() {
    switch(this.props.type) {
    case 'table':
    case 'dataframe':
      return div({className: "datasource-name", onClick: (() => this.props.onSelect(_.pick(this.props, ['id', 'datasource_id', 'name'])))},
                 icon({className: "fa fa-table"}), this.props.name)
    case 'db':
      return div({className: "datasource-db"},
                 div({className: "datasource-db-name"},
                     icon({className: "fa fa-database"}), this.props.name),
                 div({className: "datasource-db-tables"},
                     this.props.tables.map(
                       (table, i) => <DataSource key={i} {...table} onSelect={this.props.onSelect} />)))
    }
  }
}

class DataSourceSelect extends React.Component {
  onSelect(table) {
    this.props.onSelectTable(table)
    this.props.closeDropdown()
  }

  render() {
    let is_open = this.props.isDropdownOpen
    let dropdown = !is_open ? null : div(
      {className: "datasource-dropdown"},
      div({className: "datasource-list"},
          this.props.sourceIds.map(
            datasource_id =>
              <DataSource key={datasource_id} {...this.props.sources[datasource_id]} onSelect={this.onSelect.bind(this)}/>)),
      div({className: "datasource-add"}, icon({className: "fa fa-plus"}), "Add data source"))

    let table = getTable(this.props.sources, this.props.tableId)

    return div({className: "datasource-select"},
               div({className: "datasource-title", onClick: this.props.toggleDropdown},
                   icon({className: "fa fa-table"}),
                   table ? table.name : "Connect data source...",
                   icon({className: className("fa", {"fa-caret-down": !is_open, "fa-caret-up": is_open})})),
               dropdown)
  }
}
DataSourceSelect = createDropdownComponent(DataSourceSelect)

class TableSchema extends React.Component {
  render() {
    const { tableId, onSelectField } = this.props

    if (tableId == null)
      return null

    const table = getTable(this.props.sources, tableId)

    if (table.isLoading)
      return div({className: "datasource-table-fields"}, "Loading...")

    return div({className: "datasource-table-fields"},
               AGGREGATES.map(
                 (agg) =>
                   <TableField key={agg.id} {...agg} onClick={() => onSelectField(agg)} />),
               table.schema.map(
                 (field, i) =>
                   <TableField key={field.__id__} tableId={tableId} {...field} onClick={() => onSelectField({tableId, fieldId: field.__id__})} />))
  }
}

export { DataSourceSelect, TableSchema }
