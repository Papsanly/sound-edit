import { createSelector, createSlice } from '@reduxjs/toolkit'
import { findInObject, findMax } from '@/lib/utils.js'

const initialState = {}

const slice = createSlice({
  name: 'audioSlices',
  initialState,
  reducers: {
    deselect,
    select: (state, { payload: audioSliceId }) => {
      deselect(state)
      state[audioSliceId].selected = true
    },
    load: (state, { payload }) => {
      const maxTrack = findMax(state, item => item.track)
      const emptyTrack = maxTrack !== null ? maxTrack + 1 : 0
      payload.forEach(({ id, fileName, length }, i) => {
        state[id] = {
          track: emptyTrack + i,
          selected: false,
          start: 0,
          length,
          name: fileName,
          isEditingName: false,
          editName: fileName,
        }
      })
    },
    move: (state, { payload: { id, delta } }) => {
      const start = state[id].start
      let newStart = start + delta
      if (newStart < 0) newStart = 0
      state[id].start = newStart
    },
    delete: (state, { payload: id }) => {
      delete state[id]
    },
    submitName,
    startEditingName: (state, { payload: id }) => {
      state[id].isEditingName = true
    },
    setEditName: (state, { payload: { audioSliceId: id, value } }) => {
      state[id].editName = value
    },
  },
})

function getSelectedAudioSliceId(audioSlices) {
  return findInObject(audioSlices, value => value.selected)
}

function submitName(state, { payload: id, revertChanges = false }) {
  const audioSlice = state[id]
  const editedName = audioSlice.editName.trim()

  if (editedName === '') {
    if (revertChanges) {
      audioSlice.editName = audioSlice.name
      audioSlice.isEditingName = false
    }
    return
  }

  audioSlice.name = audioSlice.editName
  audioSlice.editName = editedName
  audioSlice.isEditingName = false
}

function deselect(state) {
  const selectedAudioSliceId = getSelectedAudioSliceId(state)
  if (selectedAudioSliceId) {
    const selectedAudioSlice = state[selectedAudioSliceId]
    selectedAudioSlice.selected = false
    submitName(state, { payload: selectedAudioSliceId, revertChanges: true })
  }
}

export const actions = slice.actions
export const select = state => state.audioSlices
export default slice.reducer

export const selectSelectedAudioSliceId = createSelector(
  [select],
  audioSlices => getSelectedAudioSliceId(audioSlices),
)
