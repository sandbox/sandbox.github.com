import className from 'classnames'
import _ from 'lodash'
import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import HTML5Backend from 'react-dnd-html5-backend'
import { DropTarget, DragDropContext } from 'react-dnd'
const { div, i: icon } = React.DOM
import { getField, selectTable, connectTableIfNecessary } from './ducks/datasources'
import { getFullQueryspec, clearQuery, addField, removeField, clearFields, insertFieldAtPosition, replaceFieldOnShelf, moveFieldTo, moveAndReplaceField, updateFieldTypecast, updateFieldFunction } from './ducks/queryspec'
import { setTableEncoding, setPropertySetting } from './ducks/visualspec'
import { DataSourceSelect, TableSchema } from './components/DataSource'
import { TableLayoutSpecBuilder, TableVisualSpecBuilder } from './components/TableSpecBuilder'
import { TableContainer } from './components/TableContainer'
import FieldDragLayer from './components/FieldDragLayer'

class Explorer extends React.Component {
  render() {
    const { dispatch, result, queryspec, visualspec, sourceIds, sources, tableId, chartspec } = this.props
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
    const currentData  = result.cache[_.first(result.render.current)]
    const lastData     = result.cache[_.first(result.render.last)]
    const isLoading    = currentData && currentData.isLoading
    const graphicData  = isLoading ? lastData : currentData
    const graphicChart = isLoading ? _.get(chartspec, result.render.last) : _.get(chartspec, result.render.current)
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
                  div({className: "loading-overlay", style: {display: isLoading ? "" : "none"}},
                      div({className: "loading-overlay-background"}),
                      icon({className: "fa fa-spinner fa-pulse"})),
                  <TableContainer {...graphicData} {...{visualspec}} {...graphicChart} />)),
          <TableVisualSpecBuilder getField={getSourceField} {...visualspec} {...graphicChart}
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
    result: state.result,
    chartspec: state.chartspec
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
