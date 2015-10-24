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
  type: 'bar'
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
  size:        {
    ordinalRange: [30, 50, 80, 120, 170, 230, 300],
    'default': 30,
    scaleRangeMin: 25,
    scaleRangeMax: 625
  },
  shape:       {
    ordinalRange: ["circle", "cross", "diamond", "square", "triangle-down", "triangle-up"],
    'default': 'circle'
  },
  color:       {
    palette: "category10",
    'default': "#356CA7",
    scale: "linear",
    scaleZero: true,
    scaleManualDomain: false,
    scaleManualRange: false,
    scaleRangeMin: "#d6ead1",
    scaleRangeMax: "#0c541f"
  },
  background:  {
    palette: "category10",
    'default': "#356CA7",
    scale: "linear",
    scaleZero: true,
    scaleManualDomain: false,
    scaleManualRange: false,
    scaleRangeMin: "#d6ead1",
    scaleRangeMax: "#0c541f"
  },
  opacity:     {
    'default': 1,
    ordinalRange: [0.2, 0.4, 0.6, 0.8, 1],
    scaleRangeMin: 0.1,
    scaleRangeMax: 1
  },
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
