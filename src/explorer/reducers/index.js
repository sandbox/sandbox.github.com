import { combineReducers } from 'redux'
import datasources from '../ducks/datasources'
import queryspec from '../ducks/queryspec'
import visualspec from '../ducks/visualspec'
import result from '../ducks/result'

const rootReducer = combineReducers({datasources, queryspec, visualspec, result})
export default rootReducer
