import u from 'updeep'
import { calculateScales } from '../data/scale'

export const UPDATE_SCALE_DATA = 'explorer/scalespec/UPDATE_SCALE_DATA'

export function updateScaleData(key, domains, queryspec, visualspec) {
  return {
    type: UPDATE_SCALE_DATA,
    key,
    domains,
    queryspec,
    visualspec
  }
}

const scalesState = {
}

export default function reducer(state = scalesState, action) {
  switch(action.type) {
  case UPDATE_SCALE_DATA:
    return _.extend({}, state, {[action.key] : calculateScales(action.domains, action.queryspec, action.visualspec)})
  default:
    return state
  }
}
