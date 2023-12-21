import { createSlice } from '@reduxjs/toolkit'
import { actions as audioSlicesActions } from '@/store/audioSlices.js'

const initialState = {
  width: undefined,
  height: undefined,
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
  reducers: {
    setWidth: (state, { payload: width }) => {
      state.width = width
    },
    setHeight: (state, { payload: height }) => {
      state.height = height
    },
  },
  extraReducers: builder => {
    builder.addCase(audioSlicesActions.load, state => {
      state.x.scale = state.width / 3
    })
  },
})

export const actions = slice.actions
export const select = state => state.scroll
export default slice.reducer
