import { combineReducers } from 'redux'
import datasources from '../ducks/datasources'
import queryspec from '../ducks/queryspec'
import visualspec from '../ducks/visualspec'
import result from '../ducks/result'
import scalespec from '../ducks/scalespec'

const rootReducer = combineReducers({datasources, queryspec, visualspec, result, scalespec})
export default rootReducer
