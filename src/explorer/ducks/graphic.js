import u from 'updeep'
import { getTable, fetchQueryData } from './datasources'

export const RECEIVE_GRAPHIC_DATA = 'explorer/graphic/RECEIVE_GRAPHIC_DATA'
export const REQUEST_GRAPHIC_DATA = 'explorer/graphic/REQUEST_GRAPHIC_DATA'

export function makeQueryKey(query) {
  return JSON.stringify(query)
}

export function requestGraphicData(key) {
  return {
    type: REQUEST_GRAPHIC_DATA,
    key
  }
}

export function receiveGraphicData(key, query, data, error=false) {
  return {
    type: RECEIVE_GRAPHIC_DATA,
    key,
    query,
    data,
    error
  }
}

export function runQuery() {
  return (dispatch, getState) => {
    let state = getState()
    let key = makeQueryKey(state.queryspec)
    dispatch(requestGraphicData(key))
    return fetchQueryData(state.datasources, state.queryspec).then(
      response => {
        dispatch(receiveGraphicData(key, response.query, response.data))
      }).catch(error => {
        dispatch(receiveGraphicData(key, null, null, true))
        console.log('Fetch query data failed', error, error.stack)
      })
  }
}

const graphicState = {
  query: {}
}

export default function reducer(state = graphicState, action) {
  switch(action.type) {
  case REQUEST_GRAPHIC_DATA:
    return u({ query: { [action.key] : { isLoading: true } } }, state)
  case RECEIVE_GRAPHIC_DATA:
    return u({ query: { [action.key] : { isLoading: false, ..._.pick(action, 'query', 'data', 'error')} } }, state)
  default:
    return state
  }
}
