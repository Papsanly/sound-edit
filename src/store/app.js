import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  activeTool: 'select',
  activeControl: 'pause',
}

const slice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    play: state => {
      state.activeControl = 'play'
    },
    pause: state => {
      state.activeControl = 'pause'
    },
    setSelectTool: state => {
      state.activeTool = 'select'
    },
    setCutTool: state => {
      state.activeTool = 'cut'
    },
  },
})

export const actions = slice.actions
export const select = state => state.app
export default slice.reducer
