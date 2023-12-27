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
      'audioSlices/pan',
      'audioSlices/trimLeft',
      'audioSlices/trimRight',
      'audioSlices/setEditName',
    ]

    if (
      actionsToGroup.includes(action.type) ||
      /Start$|End$/g.test(action.type)
    ) {
      const baseActionType = action.type.replace(
        /Start$|End$|Left$|Right$/g,
        '',
      )

      let id = action.payload.id
      if (/Start$|End$/g.test(action.type)) {
        id = action.payload
      }

      return `${baseActionType}-${id}`
    }

    return null
  },
  filter: includeAction([
    'effects/changeOption',
    'effects/toggle',
    'audioSlices/load',
    'audioSlices/panStart',
    'audioSlices/pan',
    'audioSlices/panEnd',
    'audioSlices/deleteSlice',
    'audioSlices/setEditNameStart',
    'audioSlices/setEditName',
    'audioSlices/setEditNameEnd',
    'audioSlices/trimStart',
    'audioSlices/trimLeft',
    'audioSlices/trimRight',
    'audioSlices/trimEnd',
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
