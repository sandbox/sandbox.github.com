import _ from 'lodash'
import u from 'updeep'
import { combineReducers } from 'redux'

/* ACTION TYPES */
export const SET_TABLE_ENCODING   = 'explorer/visualspec/SET_TABLE_ENCODING'
export const SET_PROPERTY_SETTING = 'explorer/visualspec/SET_PROPERTY_SETTING'

/* ACTIONS */
export function setTableEncoding(encoding) {
  return {
    type: SET_TABLE_ENCODING,
    encoding
  }
}

export function setPropertySetting(property, setting, value) {
  return {
    type: SET_PROPERTY_SETTING,
    property,
    setting,
    value
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

const propertiesState = {
  size:        {},
  shape:       {},
  color:       {
    palette: "category10",
    value: "#356CA7",
    scale: "linear",
    scaleZero: true,
    scaleManualDomain: false,
    scaleManualRange: false,
    scaleRangeMin: "#ffffff",
    scaleRangeMax: "#0c541f"
  },
  background:  {
    palette: "category10",
    value: "#356CA7",
    scale: "linear",
    scaleZero: true,
    scaleManualDomain: false,
    scaleManualRange: false,
    scaleRangeMin: "#ffffff",
    scaleRangeMax: "#0c541f"
  },
  opacity:     {},
  orientation: {},
  x:           {},
  x2:          {},
  y:           {},
  y2:          {},
  text:        {}
}

function properties(state = propertiesState, action) {
  switch(action.type) {
  case SET_PROPERTY_SETTING:
    return u({[action.property]: { [action.setting]: action.value }}, state)
  default:
    return state
  }
}

const reducer = combineReducers({ table, properties })
export default reducer
