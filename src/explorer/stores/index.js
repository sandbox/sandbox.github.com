import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import rootReducer from '../reducers'
import queryRunner from '../middleware'

const createWithMiddleware = applyMiddleware(queryRunner, thunkMiddleware)(createStore)

export default function configureStore(initialState) {
  const store = createWithMiddleware(rootReducer, initialState)

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers')
      store.replaceReducer(nextReducer)
    })
  }

  return store
}
