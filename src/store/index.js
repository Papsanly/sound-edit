import { combineReducers, configureStore } from '@reduxjs/toolkit'
import effectsReducer from './effects.js'
import appReducer from './app.js'
import audioSlicesReducer from './audioSlices.js'
import playerReducer from './player.js'
import { createTransform } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import undoable, { includeAction } from 'redux-undo'
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'

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
    'player/load',
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

const RootTransform = createTransform(
  (inboundState, key) => {
    if (key === 'undoables') {
      const { audioSlices, effects } = inboundState.present || {}
      return { audioSlices, effects }
    }
    return inboundState
  },
  (outboundState, key) => {
    if (key === 'undoables') {
      return {
        past: [],
        present: {
          ...outboundState,
          player: {},
        },
        future: [],
      }
    }
    return outboundState
  },
  { whitelist: ['undoables'] },
)

/** @type import('redux-persist').PersistConfig */
const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['app'],
  transforms: [RootTransform],
}

const rootReducer = persistReducer(
  persistConfig,
  combineReducers({
    undoables: undoable(
      combineReducers({
        effects: effectsReducer,
        audioSlices: audioSlicesReducer,
        player: playerReducer,
      }),
      undoConfig,
    ),
    app: appReducer,
  }),
)

export default configureStore({
  reducer: rootReducer,
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
    }),
})

export const selectPast = state => state.undoables.past
export const selectFuture = state => state.undoables.future
