import { configureStore } from '@reduxjs/toolkit'
import effectsReducer from './effects.js'

export default configureStore({
  reducer: {
    effects: effectsReducer,
  },
})
