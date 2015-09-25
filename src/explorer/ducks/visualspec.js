import _ from 'lodash'
import u from 'updeep'
import { combineReducers } from 'redux'

/* ACTION TYPES */
export const SET_TABLE_ENCODING = 'explorer/visualspec/SET_TABLE_ENCODING'

/* ACTIONS */
export function setTableEncoding(encoding) {
  return {
    type: SET_TABLE_ENCODING,
    encoding
  }
}

/* REDUCER */
const tableState = {
  type: 'pivot'
}

function table(state = tableState, action) {
  switch(action.type) {
  case SET_TABLE_ENCODING:
    return u({type: action.encoding}, state)
  default:
    return state
  }
}

const reducer = combineReducers({ table })
export default reducer
