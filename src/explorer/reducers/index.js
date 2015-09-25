import { combineReducers } from 'redux'
import datasources from '../ducks/datasources'
import queryspec from '../ducks/queryspec'
import visualspec from '../ducks/visualspec'

const rootReducer = combineReducers({datasources, queryspec, visualspec})
export default rootReducer
