import { combineReducers, configureStore } from '@reduxjs/toolkit'
import effectsReducer from './effects.js'
import appReducer from './app.js'
import audioSlicesReducer from './audioSlices.js'
import playerReducer from './player.js'
import storage from 'redux-persist/lib/storage'
import undoable, { includeAction } from 'redux-undo'
import logger from 'redux-logger'
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
  blacklist: ['player', 'app'],
}

/** @type import('redux-undo').UndoableOptions */
const undoConfig = {
  limit: 10,
  groupBy: action => {
    const actionsToGroup = [
      'effects/changeOption',
      'audioSlices/trimRight',
      'audioSlices/trimLeft',
      'audioSlices/pan',
    ]
    if (actionsToGroup.includes(action.type)) {
      return `${action.type}-${action.payload.id}`
    }
    return null
  },
  filter: includeAction([
    'effects/changeOption',
    'effects/toggle',
    'audioSlices/trimRight',
    'audioSlices/trimLeft',
    'audioSlices/pan',
    'audioSlices/load',
    'audioSlices/deleteSlice',
    'audioSlices/submitName',
    'audioSlices/cut',
  ]),
}

const rootReducer = combineReducers({
  undoables: undoable(
    combineReducers({
      effects: effectsReducer,
      audioSlices: audioSlicesReducer,
    }),
    undoConfig,
  ),
  app: appReducer,
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
        ignoredPaths: [/(.*)player(.*)/g],
      },
    }).concat(logger),
})
