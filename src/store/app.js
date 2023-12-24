import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  activeTool: 'select',
  activeControl: 'pause',
  currentTime: 0,
  scale: 0.1,
}

const slice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    play(state) {
      state.activeControl = 'play'
    },
    pause(state) {
      state.activeControl = 'pause'
    },
    setSelectTool(state) {
      state.activeTool = 'select'
    },
    setCutTool(state) {
      state.activeTool = 'cut'
    },
    setTime(state, { payload: value }) {
      state.currentTime = value
    },
    updateTime(state, { payload: value }) {
      state.currentTime += value
    },
    setWidth(state, { payload: value }) {
      state.width = value
    },
    setHorizontalScroll(state, { payload: value }) {
      state.horizontalScroll = value
    },
    setScale(state, { payload: scale }) {
      state.scale = scale
    },
  },
})

export const appActions = slice.actions
export const selectApp = state => state.app
export default slice.reducer
