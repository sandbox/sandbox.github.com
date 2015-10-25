import { combineReducers } from 'redux'
import datasources from '../ducks/datasources'
import queryspec from '../ducks/queryspec'
import visualspec from '../ducks/visualspec'
import result from '../ducks/result'
import chartspec from '../ducks/chartspec'

const rootReducer = combineReducers({datasources, queryspec, visualspec, result, chartspec})
export default rootReducer
