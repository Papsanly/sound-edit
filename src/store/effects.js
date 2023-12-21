import { createSlice } from '@reduxjs/toolkit'
import { actions as audioSlicesActions } from '@/store/audioSlices.js'
import allEffects from '@/lib/effects.js'

const initialState = {}

const slice = createSlice({
  name: 'effects',
  initialState,
  reducers: {
    toggle: (state, { payload: { audioSliceId, effectId } }) => {
      const effect = state[audioSliceId][effectId]
      effect.enabled = !effect.enabled
    },
    changeOption: (
      state,
      { payload: { value, audioSliceId, effectId, optionId } },
    ) => {
      state[audioSliceId][effectId].options[optionId].value = value
    },
  },
  extraReducers: builder => {
    builder.addCase(audioSlicesActions.load, (state, { payload }) => {
      payload.forEach(({ id }) => {
        state[id] = structuredClone(allEffects)
      })
    })
  },
})

export const actions = slice.actions
export const select = state => state.effects
export default slice.reducer
