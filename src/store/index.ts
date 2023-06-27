import {configureStore, combineReducers} from '@reduxjs/toolkit'
import {createLogger} from 'redux-logger'
import userReducer from './user/userSlice'
import geoReducer from './geo/geoSlice'

// REDUX LOGGER
const loggerMiddleware = createLogger({
  // Specify any desired configuration options for the logger
  collapsed: true,
})

// ROOT REDUCER
const rootReducer = combineReducers({
  user: userReducer,
  geo: geoReducer,
})

// REDUX STORE
export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    process.env.NODE_ENV !== 'production'
      ? getDefaultMiddleware().concat(loggerMiddleware)
      : getDefaultMiddleware(),
})

// REDUX GENERAL TYPES
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
