import { createSlice } from '@reduxjs/toolkit'
import { audioSlicesActions } from '@/store/audioSlices.js'
import allEffects from '@/lib/effects.js'

function toggle(effects, { payload: { audioSliceId, effectId } }) {
  const effect = effects[audioSliceId][effectId]
  effect.enabled = !effect.enabled
}

function changeOption(
  effects,
  { payload: { value, audioSliceId, effectId, optionId } },
) {
  effects[audioSliceId][effectId].options[optionId].value = value
}

const slice = createSlice({
  name: 'effects',
  initialState: {},
  reducers: {
    toggle,
    changeOption,
  },
  extraReducers(builder) {
    builder
      .addCase(audioSlicesActions.load, (state, { payload: { id } }) => {
        state[id] = structuredClone(allEffects)
      })
      .addCase(audioSlicesActions.deleteSlice, (state, { payload: id }) => {
        delete state[id]
      })
      .addCase(audioSlicesActions.cut, (state, { payload: { id, newId } }) => {
        state[newId] = JSON.parse(JSON.stringify(state[id]))
      })
  },
})

export const effectsActions = slice.actions
export const selectEffects = state => state.effects
export default slice.reducer
