import { configureStore } from '@reduxjs/toolkit'
import effectsReducer from './effects.js'
import appReducer from './app.js'

export default configureStore({
  reducer: {
    effects: effectsReducer,
    app: appReducer,
  },
})
