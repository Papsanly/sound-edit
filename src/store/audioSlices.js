import { createSlice } from '@reduxjs/toolkit'
import {
  filterObjectByKey,
  findInObject,
  findMax,
  getCssProperty,
} from '@/lib/utils.js'

function isIntersecting(first, second) {
  return (
    first.start < second.start + second.length &&
    first.start + first.length > second.start &&
    Math.round(first.track) === Math.round(second.track)
  )
}

function intersect(slice, obstacle) {
  if (!isIntersecting(slice, obstacle)) return

  const centerDelta =
    slice.start + slice.length / 2 - obstacle.start - obstacle.length / 2

  if (centerDelta < 0) {
    return 'left'
  } else {
    return 'right'
  }
}

function clampObstacle(slice, obstacle, intersection) {
  switch (intersection) {
    case 'left':
      slice.start = obstacle.start - slice.length
      break
    case 'right':
      slice.start = obstacle.start + obstacle.length
      break
  }
}

function handleIntersection(audioSlices, id) {
  const audioSlice = audioSlices[id]
  const otherSlices = filterObjectByKey(audioSlices, otherId => otherId !== id)
  const prevStart = audioSlice.start

  for (const otherSlice of otherSlices) {
    const intersection = intersect(audioSlice, otherSlice)
    clampObstacle(audioSlice, otherSlice, intersection)
    if (intersection) break
  }

  if (audioSlice.start < 0) audioSlice.start = 0

  while (
    otherSlices.some(otherSlice => isIntersecting(audioSlice, otherSlice))
  ) {
    audioSlice.track += 1
    audioSlice.start = prevStart
  }
}

function submitName(audioSlices, { payload: id, revertChanges = false }) {
  const audioSlice = audioSlices[id]
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

function deselect(audioSlices) {
  const selectedAudioSliceId = selectSelectedAudioSliceId({ audioSlices })
  if (selectedAudioSliceId) {
    const selectedAudioSlice = audioSlices[selectedAudioSliceId]
    selectedAudioSlice.selected = false
    submitName(audioSlices, {
      payload: selectedAudioSliceId,
      revertChanges: true,
    })
  }
}

function select(audioSlices, { payload: id }) {
  deselect(audioSlices)
  audioSlices[id].selected = true
}

function load(audioSlices, { payload }) {
  const maxTrack = findMax(audioSlices, item => item.track)
  const emptyTrack = maxTrack !== null ? maxTrack + 1 : 0
  payload.forEach(({ id, fileName, length }, i) => {
    audioSlices[id] = {
      track: emptyTrack + i,
      selected: false,
      start: 0,
      length,
      name: fileName,
      isEditingName: false,
      editName: fileName,
      isPanning: false,
      isTriming: false,
    }
  })
}

function panStart(audioSlices, { payload: id }) {
  if (audioSlices[id].isTriming) return
  select(audioSlices, { payload: id })
  audioSlices[id].isPanning = true
}

function pan(audioSlices, { payload: { id, info, scale } }) {
  if (audioSlices[id].isTriming) return

  const trackHeight = parseInt(getCssProperty('--track-height'))
  const audioSlice = audioSlices[id]

  audioSlice.start = Math.max(audioSlice.start + info.delta.x / scale, 0)
  audioSlice.track = Math.max(audioSlice.track + info.delta.y / trackHeight, 0)
}

function panEnd(audioSlices, { payload: id }) {
  if (audioSlices[id].isTriming) return

  select(audioSlices, { payload: id })
  const audioSlice = audioSlices[id]
  audioSlice.isPanning = false

  handleIntersection(audioSlices, id)
  audioSlice.track = Math.round(audioSlice.track)
}

function deleteSlice(audioSlices, { payload: id }) {
  delete audioSlices[id]
}

function startEditingName(audioSlices, { payload: id }) {
  audioSlices[id].isEditingName = true
}

function setEditName(audioSlices, { payload: { id, value } }) {
  audioSlices[id].editName = value
}

function trimStart(audioSlices, { payload: id }) {
  audioSlices[id].isTriming = true
  select(audioSlices, { payload: id })
}

function trimLeft(audioSlices, { payload: { id, info, scale } }) {
  const audioSlice = audioSlices[id]
  const newLength = audioSlice.length - info.delta.x / scale
  audioSlice.length = Math.max(newLength, 0)
  if (newLength >= 0) audioSlice.start += info.delta.x / scale
}

function trimRight(audioSlices, { payload: { id, info, scale } }) {
  const audioSlice = audioSlices[id]
  const newLength = audioSlice.length + info.delta.x / scale
  audioSlice.length = Math.max(newLength, 0)
}

function trimEnd(audioSlices, { payload: id }) {
  audioSlices[id].isTriming = false
  select(audioSlices, { payload: id })
  handleIntersection(audioSlices, id)
}

function cut(audioSlices, { payload: { id, x, scale, newId } }) {
  const audioSlice = audioSlices[id]
  const newAudioSlice = JSON.parse(JSON.stringify(audioSlice))
  audioSlice.length = Math.round(x / scale)
  newAudioSlice.start += audioSlice.length
  newAudioSlice.length -= audioSlice.length
  newAudioSlice.selected = false
  audioSlices[newId] = newAudioSlice
}

const slice = createSlice({
  name: 'audioSlices',
  initialState: {},
  reducers: {
    deselect,
    select,
    load,
    panStart,
    pan,
    panEnd,
    deleteSlice,
    submitName,
    startEditingName,
    setEditName,
    trimStart,
    trimLeft,
    trimRight,
    trimEnd,
    cut,
  },
})

export function selectSelectedAudioSliceId(state) {
  return findInObject(state.audioSlices, value => value.selected)
}

export function selectEndTime(state) {
  return findMax(state.audioSlices, value => value.start + value.length)
}

export const audioSlicesActions = slice.actions
export const selectAudioSlices = state => state.audioSlices
export default slice.reducer
