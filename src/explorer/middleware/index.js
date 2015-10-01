import _ from 'lodash'
import * as queryspec from '../ducks/queryspec'
import { getField } from '../ducks/datasources'
import { runQuery } from '../ducks/graphic'

const QUERYSPEC_ACTIONS = _.values(queryspec)

const queryRunner = ({dispatch, getState}) => next => action => {
  console.group(action.type)
  console.info('action', action)
  let isQueryChange = _.contains(QUERYSPEC_ACTIONS, action.type)
  let result = next(action)
  if (isQueryChange) {
    result = next(runQuery())
  }
  console.log('next state', getState())
  console.groupEnd(action.type)
  return result
}

export default queryRunner
