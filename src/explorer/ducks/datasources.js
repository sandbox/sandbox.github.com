import _ from 'lodash'
import u from 'updeep'
import fetch from 'isomorphic-fetch'
import dl from 'datalib'

export function getDatasource(sources, tableId) {
  if (tableId == null) return null
  return sources[tableId.id] || sources[tableId.datasource_id]
}

export function getTable(sources, tableId) {
  const datasource = getDatasource(sources, tableId)
  if (datasource == null) return null
  if (datasource.tables != null) {
    return _.find(datasource.tables, (datasource_table) => datasource_table.name === tableId.name)
  } else {
    return datasource
  }
}

export function getField(sources, tableId, fieldId) {
  if (fieldId == null) return null
  const table = getTable(sources, tableId)
  if (table == null) return null
  return table.schema[fieldId]
}

/* ACTION TYPES */

export const REQUEST_TABLE_DATA = 'explorer/datasources/REQUEST_TABLE_DATA'
export const RECEIVE_TABLE_DATA = 'explorer/datasources/RECEIVE_TABLE_DATA'
export const SELECT_TABLE       = 'explorer/datasources/SELECT_TABLE'

/* ACTIONS */

export function selectTable(tableId) {
  return {
    type: SELECT_TABLE,
    tableId
  }
}

export function requestTableData(tableId) {
  return {
    type: REQUEST_TABLE_DATA,
    tableId
  }
}

export function receiveTableData(tableId, data) {
  return {
    type: RECEIVE_TABLE_DATA,
    tableId,
    data
  }
}

export function connectTable(tableId) {
  return (dispatch, getState) => {
    const table = getTable(getState().datasources.BY_ID, tableId)
    dispatch(requestTableData(tableId))

    return fetch(table.url).then(
      response => {
        switch(table.settings.format) {
        case 'csv':
          return response.text()
        default:
          return response.json()
        }
      }
    ).then(
      data => {
        data = dl.read(data, {type: table.settings.format, parse: 'auto'})
        dispatch(receiveTableData(tableId, data))
      }
    )
  }
}

export function connectTableIfNecessary(tableId) {
  return (dispatch, getState) => {
    const table = getTable(getState().datasources.BY_ID, tableId)
    if (table.url != null && !table.isLoading && table.schema == null) {
      return dispatch(connectTable(tableId))
    }
  }
}

/* REDUCER */

const initialState = {
  IDS: [],
  BY_ID: {}
}

export default function reducer(state = initialState, action) {
  let datasource, schema

  switch (action.type) {
  case REQUEST_TABLE_DATA:
    datasource = getTable(state.BY_ID, action.tableId)
    return u({BY_ID: { [datasource.id]: {isLoading: true}}}, state)
  case RECEIVE_TABLE_DATA:
    datasource = getTable(state.BY_ID, action.tableId)
    schema = _(action.data.__types__)
      .map((v, k) => { return {name: k, type: v} })
      .each((field, i) => field.__id__ = i).value()
    return u({BY_ID: {[datasource.id]: {isLoading: false, data: () => action.data, schema: () => schema}}}, state)
  case SELECT_TABLE:
    return u({selectedTable: () => action.tableId}, state)
  default:
    return state
  }
}
