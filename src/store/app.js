import { createSlice } from '@reduxjs/toolkit'
import { audioSlicesActions } from '@/store/audioSlices.js'

const initialState = {
  activeTool: 'select',
  activeControl: 'pause',
  currentTime: 0,
  scale: 0.01,
  debouncedScale: 0.01,
  isLoading: true,
  selectedAudioSliceId: null,
}

const slice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setLoading(state, { payload: value }) {
      state.isLoading = value
    },
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
    setWidth(state, { payload: value }) {
      state.width = value
    },
    setHorizontalScroll(state, { payload: value }) {
      state.horizontalScroll = value
    },
    setScale(state, { payload: scale }) {
      state.scale = scale
    },
    selectAudioSlice(state, { payload: audioSliceId }) {
      state.selectedAudioSliceId = audioSliceId
    },
    updateDebouncedScale(state) {
      state.debouncedScale = state.scale
    },
  },
  extraReducers(builder) {
    builder.addCase(
      audioSlicesActions.deleteSlice,
      (state, { payload: id }) => {
        if (state.selectedAudioSliceId === id) {
          state.selectedAudioSliceId = null
        }
      },
    )
  },
})

export const appActions = slice.actions
export const selectApp = state => state.app
export default slice.reducer
