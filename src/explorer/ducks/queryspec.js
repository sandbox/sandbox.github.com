import _ from 'lodash'
import u from 'updeep'
import { getAlgebraType, getAccessorName } from '../helpers/field'
import { TABLE_ENCODINGS } from '../helpers/table'

function getValidShelves(tableType) {
  return ['row', 'col'].concat(TABLE_ENCODINGS[tableType].properties || [])
}

export function getFullQueryspec(getField, queryspec, tableType) {
  return _(queryspec)
    .mapValues((fields) => {
      return _.map(fields,
                   (field) => {
                     return _({}).merge(
                       field,
                       field.fieldId != null ? getField(field.fieldId) : null
                     ).tap(o => _.merge(o, {
                       algebraType: getAlgebraType(o),
                       accessor: getAccessorName(o)
                     })).value()
                   })
    }).pick(getValidShelves(tableType)).omit(_.isEmpty).value()
}

/* ACTION TYPES */
export const INSERT_FIELD_AT_POSITION = 'explorer/queryspec/INSERT_FIELD_AT_POSITION'
export const REPLACE_FIELD_ON_SHELF   = 'explorer/queryspec/REPLACE_FIELD_ON_SHELF'
export const MOVE_FIELD_TO            = 'explorer/queryspec/MOVE_FIELD_TO'
export const MOVE_AND_REPLACE_FIELD   = 'explorer/queryspec/MOVE_AND_REPLACE_FIELD'
export const ADD_FIELD                = 'explorer/queryspec/ADD_FIELD'
export const REMOVE_FIELD             = 'explorer/queryspec/REMOVE_FIELD'
export const CLEAR_FIELDS             = 'explorer/queryspec/CLEAR_FIELDS'
export const CLEAR_QUERY              = 'explorer/queryspec/CLEAR_QUERY'
export const UPDATE_FIELD_FUNCTION    = 'explorer/queryspec/UPDATE_FIELD_FUNCTION'
export const UPDATE_FIELD_TYPECAST    = 'explorer/queryspec/UPDATE_FIELD_TYPECAST'

/* ACTIONS */
export function insertFieldAtPosition(shelf, position, field) {
  return {
    type: INSERT_FIELD_AT_POSITION,
    shelf,
    position,
    field
  }
}

export function replaceFieldOnShelf(shelf, field) {
  return {
    type: REPLACE_FIELD_ON_SHELF,
    shelf,
    field
  }
}

export function moveFieldTo(shelf, position, newshelf, newposition) {
  return {
    type: MOVE_FIELD_TO,
    shelf,
    position,
    newshelf,
    newposition
  }
}

export function moveAndReplaceField(shelf, position, newshelf) {
  return {
    type: MOVE_AND_REPLACE_FIELD,
    shelf,
    position,
    newshelf
  }
}

export function updateFieldPosition(shelf, position, newposition) {
  return {
    type: MOVE_FIELD_TO,
    shelf,
    position,
    newshelf: shelf,
    newposition
  }
}

export function addField(shelf, field) {
  return {
    type: ADD_FIELD,
    shelf,
    field
  }
}

export function removeField(shelf, position) {
  return {
    type: REMOVE_FIELD,
    shelf,
    position
  }
}

export function clearFields(shelf) {
  return {
    type: CLEAR_FIELDS,
    shelf
  }
}

export function clearQuery() {
  return {
    type: CLEAR_QUERY
  }
}

export function updateFieldTypecast(shelf, position, typecast) {
  return {
    type: UPDATE_FIELD_TYPECAST,
    shelf,
    position,
    typecast
  }
}

export function updateFieldFunction(shelf, position, func) {
  return {
    type: UPDATE_FIELD_FUNCTION,
    shelf,
    position,
    func
  }
}

/* REDUCER */
const initialState = {
  filter: [],
  /* shelves */
  row: [],
  col: [],
  size: [],
  x: [], y: [], x2: [], y2: [],
  color: [],
  shape: [],
  background: [],
  opacity: [],
  orientation: [],
  schema: [],
  text: []
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
  case INSERT_FIELD_AT_POSITION:
    return u({[action.shelf]: [...state[action.shelf].slice(0, action.position), action.field, ...state[action.shelf].slice(action.position)]}, state)
  case REPLACE_FIELD_ON_SHELF:
    return u({[action.shelf]: [action.field]}, state)
  case MOVE_FIELD_TO:
    return reducer(reducer(state, removeField(action.shelf, action.position)),
                   insertFieldAtPosition(action.newshelf, action.newposition, state[action.shelf][action.position]))
  case MOVE_AND_REPLACE_FIELD:
    return reducer(reducer(state, removeField(action.shelf, action.position)),
                   replaceFieldOnShelf(action.newshelf, state[action.shelf][action.position]))
  case ADD_FIELD:
    return u({[action.shelf]: (current) => current.concat([action.field])}, state)
  case REMOVE_FIELD:
    return u({
      [action.shelf]: u.reject((value, i) => i === action.position)
    }, state)
  case CLEAR_FIELDS:
    return u({[action.shelf]: () => []}, state)
  case CLEAR_QUERY:
    return initialState
  case UPDATE_FIELD_TYPECAST:
    return u(
      {[action.shelf]: {[action.position]: u.omit('func')}},
      u.updateIn(
        [action.shelf],
        { [action.position]: action.typecast != null ? {typecast: action.typecast} : u.omit('typecast') },
        state))
  case UPDATE_FIELD_FUNCTION:
    return u.updateIn(
      [action.shelf],
      {[action.position]: action.func != null ? { func: action.func } : u.omit('func')},
      state)
  default:
    return state
  }
}
