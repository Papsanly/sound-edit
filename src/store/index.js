import { combineReducers, configureStore } from '@reduxjs/toolkit'
import effectsReducer from './effects.js'
import appReducer from './app.js'
import audioSlicesReducer from './audioSlices.js'
import playerReducer from './player.js'
import storage from 'redux-persist/lib/storage'
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['player'],
}

const rootReducer = combineReducers({
  effects: effectsReducer,
  app: appReducer,
  audioSlices: audioSlicesReducer,
  player: playerReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export default configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
          'audioSlices/load',
          'player/load',
        ],
        ignoredPaths: ['player'],
      },
    }),
})
