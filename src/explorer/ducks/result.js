import u from 'updeep'
import { combineReducers } from 'redux'
import { getField, getTable, getDatasource } from './datasources'
import { getFullQueryspec } from './queryspec'
import { updateScaleData } from './scalespec'
import * as local from '../data/local'

export const CHANGE_REQUEST_DATA = 'explorer/result/CHANGE_REQUEST_DATA'
export const REQUEST_RESULT_DATA = 'explorer/result/REQUEST_RESULT_DATA'
export const RECEIVE_RESULT_DATA = 'explorer/result/RECEIVE_RESULT_DATA'

export function makeQueryKey(query) {
  return JSON.stringify(query)
}

export function changeRequestData(key) {
  return {
    type: CHANGE_REQUEST_DATA,
    key
  }
}

export function requestResultData(key) {
  return {
    type: REQUEST_RESULT_DATA,
    key
  }
}

export function receiveResultData(key, response, error=false) {
  return _.extend({
    type: RECEIVE_RESULT_DATA,
    key,
    error
  }, response)
}

export function fetchQueryData(datasources, queryspec, tableType) {
  return new Promise((resolve, reject) => {
    let datasource = getDatasource(datasources.BY_ID, datasources.selectedTable)
    if (datasource.data) {
      setTimeout(() => resolve(local.requestQuery(tableType, queryspec, datasource.data)), 0)
    }
    else {
      reject(Error(`Querying adapter not defined for protocol: ${datasource.protocol}`))
    }
  })
}

export function runQuery(datasources, key, queryspec, visualspec) {
  return (dispatch, getState) => {
    dispatch(requestResultData(key))
    return fetchQueryData(datasources, queryspec, visualspec.table.type).then(
      response => {
        dispatch(updateScaleData(key, response.domains, response.queryspec, visualspec))
        dispatch(receiveResultData(key, response))
      }).catch(error => {
        console.error('Error: query error', error)
        dispatch(receiveResultData(key, null, true))
      })}
}

export function runCurrentQueryIfNecessary() {
  return (dispatch, getState) => {
    let { datasources, queryspec, visualspec, result } = getState()
    let getTableField = _.curry(getField)(datasources.BY_ID, datasources.selectedTable)
    let usableQueryspec = getFullQueryspec(getTableField, queryspec, visualspec.table.type)
    let key = makeQueryKey(usableQueryspec)
    let queryResponse = result.cache[key]
    if (queryResponse == null || (!queryResponse.isLoading && !queryResponse.error && queryResponse.result == null)) {
      dispatch(runQuery(datasources, key, usableQueryspec, visualspec))
    }
    else if (queryResponse && !queryResponse.isLoading && queryResponse.result) {
      dispatch(updateScaleData(key, queryResponse.domains, queryResponse.queryspec, visualspec))
    }
    dispatch(changeRequestData(key))
  }
}

const cacheState = {
}

function cache(state = cacheState, action) {
  switch(action.type) {
  case REQUEST_RESULT_DATA:
    return _.extend({}, state, { [action.key] : { isLoading: true } })
  case RECEIVE_RESULT_DATA:
    return _.extend({}, state, {
      [action.key]: {
        isLoading: false,
        axes: action.axes,
        domains: action.domains,
        error: action.error,
        key: action.key,
        query: action.query,
        queryspec: action.queryspec,
        panes: action.panes,
        result: action.result
      }})
  default:
    return state
  }
}

const initialState = {
  last: null,
  current: null
}

function render(state=initialState, action) {
  switch(action.type) {
  case CHANGE_REQUEST_DATA:
    return { last: state.current, current: action.key }
  default:
    return state
  }
}

const reducer = combineReducers({render, cache})
export default reducer
