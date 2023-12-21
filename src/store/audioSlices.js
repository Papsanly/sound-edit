import { createSelector, createSlice } from '@reduxjs/toolkit'

const initialState = {}

const slice = createSlice({
  name: 'audioSlices',
  initialState,
  reducers: {
    deselect: state => {
      deselect(state)
    },
    select: (state, { payload: audioSliceId }) => {
      deselect(state)
      state[audioSliceId].selected = true
    },
    load: (state, { payload }) => {
      const maxTrack = findMaxTrack(state)
      payload.forEach(({ id, filePath }, i) => {
        state[id] = {
          track: maxTrack + i,
          selected: false,
          x: 0,
          width: 300,
          name: filePath,
        }
      })
    },
  },
})

function findMaxTrack(state) {
  let maxTrack = Math.max(...Object.values(state).map(item => item.track))
  return maxTrack === -Infinity ? 0 : maxTrack + 1
}

function deselect(state) {
  const selectedAudioSliceId = findInObject(state, value => value.selected)
  if (selectedAudioSliceId) {
    state[selectedAudioSliceId].selected = false
  }
}

export const actions = slice.actions
export const select = state => state.audioSlices
export default slice.reducer

export const selectSelectedAudioSliceId = createSelector(
  [select],
  audioSlices => findInObject(audioSlices, value => value.selected),
)

function findInObject(obj, predicate) {
  const res = Object.entries(obj).find(([, value]) => predicate(value))
  if (res) {
    return res[0]
  }
}
