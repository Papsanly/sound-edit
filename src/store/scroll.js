import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  x: {
    offset: 0,
    scale: 100,
  },
  y: {
    offset: 0,
  },
}

const slice = createSlice({
  name: 'scroll',
  initialState,
  reducers: {
    setWidth: (state, { payload: width }) => {
      state.width = width
    },
    setHeight: (state, { payload: height }) => {
      state.height = height
    },
    setYScale: (state, { payload: scale }) => {
      state.y.scale = scale
    },
  },
})

export const actions = slice.actions
export const select = state => state.scroll
export default slice.reducer
