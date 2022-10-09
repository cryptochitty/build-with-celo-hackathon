import {combineReducers, createStore, applyMiddleware} from 'redux';
import {appReducer} from './reducers';
import thunk from 'redux-thunk';
export const rootReducer = combineReducers({
  app: appReducer,
});

const middleware = [thunk];
export const store = createStore(rootReducer, applyMiddleware(...middleware));
