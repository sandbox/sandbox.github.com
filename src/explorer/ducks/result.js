import u from 'updeep'
import { getField, getTable, getDatasource } from './datasources'
import { getFullQueryspec } from './queryspec'
import * as local from '../data/local'

export const RECEIVE_RESULT_DATA = 'explorer/result/RECEIVE_RESULT_DATA'
export const REQUEST_RESULT_DATA = 'explorer/result/REQUEST_RESULT_DATA'

export function makeQueryKey(query) {
  return JSON.stringify(query)
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

export function fetchQueryData(datasources, queryspec) {
  return new Promise((resolve, reject) => {
    let datasource = getDatasource(datasources.BY_ID, datasources.selectedTable)
    if (datasource.data) {
      setTimeout(() => resolve(local.requestQuery(queryspec, datasource.data)), 0)
    }
    else {
      reject(Error(`Querying adapter not defined for protocol: ${datasource.protocol}`))
    }
  })
}

export function runQuery(datasources, key, queryspec) {
  return (dispatch, getState) => {
    dispatch(requestResultData(key))
    return fetchQueryData(datasources, queryspec).then(
      response => {
        dispatch(receiveResultData(key, response))
      }).catch(error => {
        dispatch(receiveResultData(key, null, true))
        console.log('Fetch query data failed', error, error.stack)
      })}
}

export function runCurrentQueryIfNecessary() {
  return (dispatch, getState) => {
    let state = getState()
    let datasources = state.datasources
    let queryspec = state.queryspec
    let getTableField = _.curry(getField)(datasources.BY_ID, datasources.selectedTable)
    let key = makeQueryKey(queryspec)
    let queryResponse = state.result[key]
    if (queryResponse == null || (!queryResponse.isLoading && !queryResponse.error && queryResponse.data == null)) {
      dispatch(runQuery(datasources, key, getFullQueryspec(getTableField, queryspec)))
    }
  }
}

const resultState = {
}

export default function reducer(state = resultState, action) {
  switch(action.type) {
  case REQUEST_RESULT_DATA:
    return _.extend({}, state, { [action.key] : { isLoading: true } })
  case RECEIVE_RESULT_DATA:
    return _.extend({}, state, {
      [action.key]: _.extend({
        isLoading: false
      }, _.omit(action, 'type') )})
  default:
    return state
  }
}
