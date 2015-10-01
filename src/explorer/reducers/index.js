import { combineReducers } from 'redux'
import datasources from '../ducks/datasources'
import queryspec from '../ducks/queryspec'
import visualspec from '../ducks/visualspec'
import graphic from '../ducks/graphic'

const rootReducer = combineReducers({datasources, queryspec, visualspec, graphic})
export default rootReducer
