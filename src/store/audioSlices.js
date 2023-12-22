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
      const emptyTrack = maxTrack ? maxTrack + 1 : 0
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
    delete: (state, { payload: audioSliceId }) => {
      delete state[audioSliceId]
    },
    submitName,
    startEditingName: (state, { payload: audioSliceId }) => {
      state[audioSliceId].isEditingName = true
    },
    setEditName: (state, { payload: { audioSliceId, value } }) => {
      state[audioSliceId].editName = value
    },
  },
})

function getSelectedAudioSliceId(audioSlices) {
  return findInObject(audioSlices, value => value.selected)
}

function submitName(state, { payload: audioSliceId, revertChanges = false }) {
  const audioSlice = state[audioSliceId]
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
