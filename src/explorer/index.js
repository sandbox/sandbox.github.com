import className from 'classnames'
import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import HTML5Backend from 'react-dnd/modules/backends/HTML5'
import { DropTarget, DragDropContext } from 'react-dnd'
const {div} = React.DOM
import { getField, selectTable, connectTableIfNecessary } from './ducks/datasources'
import { addField, removeField, clearFields, insertFieldAtPosition, replaceFieldOnShelf, moveFieldTo, moveAndReplaceField, updateFieldTypecast, updateFieldFunction } from './ducks/queryspec'
import { setTableEncoding, setPropertySetting } from './ducks/visualspec'
import { DataSourceSelect, TableSchema } from './components/DataSource'
import { TableLayoutSpecBuilder, TableVisualSpecBuilder } from './components/TableSpecBuilder'
import { TableGraphic } from './components/TableGraphic'
import FieldDragLayer from './components/FieldDragLayer'

class Explorer extends React.Component {
  render() {
    const { dispatch, graphic, queryspec, visualspec, sourceIds, sources, tableId } = this.props
    const { connectDropTarget, isOver, isDragging } = this.props
    const fieldActionCreators = bindActionCreators({
      removeField, clearFields,
      insertFieldAtPosition, moveFieldTo,
      replaceFieldOnShelf, moveAndReplaceField,
      updateFieldTypecast, updateFieldFunction
    }, dispatch)
    const getSourceField = _.curry(getField)(sources)
    const vizActionCreators = bindActionCreators({ setTableEncoding, setPropertySetting }, dispatch)
    return connectDropTarget(
      div({className: className("pane-container")},
          <FieldDragLayer showTrashCan={isOver} />,
          div({className: "pane data-pane"},
              <DataSourceSelect sourceIds={sourceIds} sources={sources} tableId={tableId}
              onSelectTable={tableId => {
                dispatch(selectTable(tableId))
                dispatch(connectTableIfNecessary(tableId))
              }}/>,
              div({className: "datasource-table-container"},
                  <TableSchema sources={sources} tableId={tableId}
                  onSelectField={(field) => {
                    dispatch(addField(queryspec.row.length < queryspec.col.length ? 'row' : 'col', field))
                  }}/>)),
          div({className: "pane graphic-pane"},
              div({className: "querybuilder"},
                  <TableLayoutSpecBuilder
                  getField={getSourceField}
                  isDragging={isDragging}
                  queryspec={queryspec}
                  fieldActionCreators={fieldActionCreators} />),
              <TableGraphic queryspec={queryspec} visualspec={visualspec} />),
          <TableVisualSpecBuilder
          isDragging={isDragging}
          queryspec={queryspec} {...visualspec} getField={getSourceField} vizActionCreators={vizActionCreators} fieldActionCreators={fieldActionCreators}/>
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
    graphic: state.graphic
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
