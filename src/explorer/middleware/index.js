import _ from 'lodash'
import * as queryspec from '../ducks/queryspec'
import * as visualspec from '../ducks/visualspec'
import { getField } from '../ducks/datasources'
import { runCurrentQueryIfNecessary } from '../ducks/result'

const QUERYSPEC_ACTIONS = _.values(queryspec)

const queryRunner = ({dispatch, getState}) => next => action => {
  console.group(action.type)
  let result = next(action)
  let isQueryChange = (
    _.contains(QUERYSPEC_ACTIONS, action.type)
      || visualspec.SET_TABLE_ENCODING == action.type
      || visualspec.SET_PROPERTY_SETTING == action.type
  )
  if (isQueryChange) {
    result = next(runCurrentQueryIfNecessary())
  }
  console.log('next state', getState())
  console.groupEnd(action.type)
  return result
}

export default queryRunner
