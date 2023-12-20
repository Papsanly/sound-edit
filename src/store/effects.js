import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  all: [
    {
      name: 'Effect 1',
      enabled: false,
      options: [{ name: 'Option 1', value: 0, min: -10, max: 5 }],
    },
    {
      name: 'Effect 2',
      enabled: false,
      options: [
        { name: 'Option 1', value: 0, min: -10, max: 5 },
        { name: 'Option 2', value: 0, min: -10, max: 5 },
      ],
    },
  ],
}

const slice = createSlice({
  name: 'effects',
  initialState,
  reducers: {
    toggle: (state, { payload: name }) => {
      const effect = state.all.find(effect => effect.name === name)
      effect.enabled = !effect.enabled
    },
    changeOption: (state, { payload: { value, effectName, optionName } }) => {
      const option = state.all
        .find(effect => effect.name === effectName)
        .options.find(option => option.name === optionName)
      option.value = value
    },
  },
})

export const actions = slice.actions
export const select = state => state.effects.all
export default slice.reducer
