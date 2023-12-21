import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  all: [],
}

const slice = createSlice({
  name: 'audioSlices',
  initialState,
  reducers: {
    load: (state, { payload: filePaths }) => {
      const firstEmptyTrack = Math.max(state.all.map(item => item.track))
      state.all.push(
        ...filePaths.map((filePath, i) => ({
          track: firstEmptyTrack + i,
          x: 0,
          width: 300,
          name: filePath,
        })),
      )
    },
  },
})

export const actions = slice.actions
export const select = state => state.audioSlices.all
export default slice.reducer
