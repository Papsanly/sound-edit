import { createSelector, createSlice } from '@reduxjs/toolkit'

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
      const maxTrack = findMaxTrack(state)
      payload.forEach(({ id, fileName }, i) => {
        state[id] = {
          track: maxTrack + i,
          selected: false,
          x: 0,
          width: 300,
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

function findInObject(obj, predicate) {
  const res = Object.entries(obj).find(([, value]) => predicate(value))
  if (res) {
    return res[0]
  }
}

function getSelectedAudioSliceId(audioSlices) {
  return findInObject(audioSlices, value => value.selected)
}

function findMaxTrack(state) {
  let maxTrack = Math.max(...Object.values(state).map(item => item.track))
  return maxTrack === -Infinity ? 0 : maxTrack + 1
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
