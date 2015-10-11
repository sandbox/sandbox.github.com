import className from 'classnames'
import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import HTML5Backend from 'react-dnd/modules/backends/HTML5'
import { DropTarget, DragDropContext } from 'react-dnd'
const {div} = React.DOM
import { getField, selectTable, connectTableIfNecessary } from './ducks/datasources'
import { getFullQueryspec, clearQuery, addField, removeField, clearFields, insertFieldAtPosition, replaceFieldOnShelf, moveFieldTo, moveAndReplaceField, updateFieldTypecast, updateFieldFunction } from './ducks/queryspec'
import { makeQueryKey } from './ducks/result'
import { setTableEncoding, setPropertySetting } from './ducks/visualspec'
import { DataSourceSelect, TableSchema } from './components/DataSource'
import { TableLayoutSpecBuilder, TableVisualSpecBuilder } from './components/TableSpecBuilder'
import { TableContainer } from './components/TableContainer'
import FieldDragLayer from './components/FieldDragLayer'

class Explorer extends React.Component {
  render() {
    const { dispatch, result, queryspec, visualspec, sourceIds, sources, tableId } = this.props
    const { connectDropTarget, isOver, isDragging } = this.props
    const fieldActionCreators = bindActionCreators({
      removeField, clearFields,
      insertFieldAtPosition, moveFieldTo,
      replaceFieldOnShelf, moveAndReplaceField,
      updateFieldTypecast, updateFieldFunction
    }, dispatch)
    const getSourceField = _.curry(getField)(sources)
    const getTableField = _.curry(getField)(sources, tableId)
    const vizActionCreators = bindActionCreators({ setTableEncoding, setPropertySetting }, dispatch)
    const graphicData = result[makeQueryKey(getFullQueryspec(getTableField, queryspec, visualspec.table.type))]
    return connectDropTarget(
      div({className: className("pane-container")},
          <FieldDragLayer showTrashCan={isOver} />,
          div({className: "pane data-pane"},
              <DataSourceSelect {...{sourceIds, sources, tableId}}
              onSelectTable={tableId => {
                dispatch(clearQuery())
                dispatch(selectTable(tableId))
                dispatch(connectTableIfNecessary(tableId))
              }}/>,
              div({className: "datasource-table-container"},
                  <TableSchema {...{sources, tableId}}
                  onSelectField={(field) => {
                    dispatch(addField(queryspec.row.length < queryspec.col.length ? 'row' : 'col', field))
                  }}/>)),
          div({className: "pane graphic-pane"},
              div({className: "querybuilder"},
                  <TableLayoutSpecBuilder
                  getField={getSourceField}
                  {...{isDragging, queryspec, fieldActionCreators}} />),
              div({className: "container-flex-fill-wrap graphic-container"},
                  <TableContainer {...graphicData} {...{visualspec}} />)),
          <TableVisualSpecBuilder getField={getSourceField} {...visualspec}
          {...{isDragging, queryspec, vizActionCreators, fieldActionCreators}} />
         ))
  }
}

function select(state) {
  return {
    sourceIds: state.datasources.IDS,
    sources: state.datasources.BY_ID,
    tableId: state.datasources.selectedTable,
    queryspec: state.queryspec,
    visualspec: state.visualspec,
    result: state.result
  }
}

export default (connect(select))(DragDropContext(HTML5Backend)(DropTarget(
  'ShelfField',
  {
    canDrop: (props) => true,
    drop(props, monitor, component) {
      if (monitor.didDrop()) return
      return { ..._.pick(monitor.getItem(), 'shelf', 'position'),
               droppedOnBody: true,
               removeField: (shelf, position) => props.dispatch(removeField(shelf, position))
             }
    }
  },
  function (connect, monitor) {
    return {
      connectDropTarget: connect.dropTarget(),
      isOver: monitor.isOver({shallow: true}),
      isDragging: monitor.canDrop()
    }
  })(Explorer)))