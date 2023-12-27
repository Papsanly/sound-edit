import { createSlice } from '@reduxjs/toolkit'
import {
  filterObjectByKey,
  findInObject,
  findMax,
  getCssProperty,
} from '@/lib/utils.js'

function isIntersecting(first, second) {
  return (
    first.start < second.start + second.trimRight - second.trimLeft &&
    first.start + first.trimRight - first.trimLeft > second.start &&
    Math.round(first.track) === Math.round(second.track)
  )
}

function intersect(slice, obstacle) {
  if (!isIntersecting(slice, obstacle)) return

  const centerDelta =
    slice.start +
    (slice.trimRight - slice.trimLeft) / 2 -
    obstacle.start -
    (obstacle.trimRight - obstacle.trimLeft) / 2

  if (centerDelta < 0) {
    return 'left'
  } else {
    return 'right'
  }
}

function clampObstacle(slice, obstacle, intersection) {
  switch (intersection) {
    case 'left':
      slice.start = obstacle.start - slice.trimRight + slice.trimLeft
      break
    case 'right':
      slice.start = obstacle.start + obstacle.trimRight - obstacle.trimLeft
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
  const selectedAudioSliceId = selectSelectedAudioSliceId({
    undoables: { present: { audioSlices } },
  })
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

function load(audioSlices, { payload: { id, name, path, player } }) {
  const maxTrack = findMax(audioSlices, item => item.track)
  const emptyTrack = maxTrack !== null ? maxTrack + 1 : 0

  const length = Math.round(1000 * player.buffer.duration)

  audioSlices[id] = {
    track: emptyTrack,
    selected: false,
    start: 0,
    trimLeft: 0,
    trimRight: length,
    length,
    name,
    path,
    isEditingName: false,
    editName: name,
    isPanning: false,
    isTriming: false,
  }

  select(audioSlices, { payload: id })
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
  const delta = Math.round(info.delta.x / scale)

  audioSlice.start = Math.max(audioSlice.start + delta, 0)
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
  const delta = Math.round(info.delta.x / scale)

  const newTrimLeft = Math.min(
    audioSlice.trimRight,
    Math.max(audioSlice.trimLeft + delta, 0),
  )
  const prevTrimLeft = audioSlice.trimLeft
  const trimDelta = newTrimLeft - prevTrimLeft

  audioSlice.trimLeft = newTrimLeft
  audioSlice.start += trimDelta
}

function trimRight(audioSlices, { payload: { id, info, scale } }) {
  const audioSlice = audioSlices[id]
  const delta = Math.round(info.delta.x / scale)
  const newTrimRight = audioSlice.trimRight + delta
  audioSlice.trimRight = Math.min(
    audioSlice.length,
    Math.max(audioSlice.trimLeft, newTrimRight),
  )
}

function trimEnd(audioSlices, { payload: id }) {
  audioSlices[id].isTriming = false
  select(audioSlices, { payload: id })
  handleIntersection(audioSlices, id)
}

function cut(audioSlices, { payload: { id, x, scale, newId } }) {
  const audioSlice = audioSlices[id]
  const newAudioSlice = JSON.parse(JSON.stringify(audioSlice))
  audioSlice.trimRight = Math.round(x / scale) + audioSlice.trimLeft
  newAudioSlice.start += audioSlice.trimRight - audioSlice.trimLeft
  newAudioSlice.trimLeft += audioSlice.trimRight - audioSlice.trimLeft
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
  return findInObject(
    state.undoables.present.audioSlices,
    value => value.selected,
  )
}

export function selectEndTime(state) {
  return findMax(
    state.undoables.present.audioSlices,
    value => value.start + value.trimRight - value.trimLeft,
  )
}

export const audioSlicesActions = slice.actions
export const selectAudioSlices = state => state.undoables.present.audioSlices
export default slice.reducer
