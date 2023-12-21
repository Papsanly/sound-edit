import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  x: {
    offset: 0,
    scale: undefined,
  },
  y: {
    offset: 0,
    scale: getComputedStyle(document.documentElement).getPropertyValue(
      '--track-height',
    ),
  },
}

const slice = createSlice({
  name: 'scroll',
  initialState,
  reducers: {},
})

export const actions = slice.actions
export const select = state => state.scroll
export default slice.reducer
