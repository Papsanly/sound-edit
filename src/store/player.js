import { createSlice } from '@reduxjs/toolkit'
import { audioSlicesActions } from '@/store/audioSlices.js'
import { appActions } from '@/store/app.js'
import * as Tone from 'tone'

const slice = createSlice({
  name: 'player',
  initialState: {},
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(
        audioSlicesActions.load,
        (state, { payload: { id, player } }) => {
          state[id] = player
        },
      )
      .addCase(audioSlicesActions.deleteSlice, (state, { payload: id }) => {
        delete state[id]
      })
      .addCase(audioSlicesActions.cut, (state, { payload: { id, newId } }) => {
        state[newId] = new Tone.Player().toDestination()
        state[newId].buffer = state[id].buffer
      })
      .addCase(
        appActions.play,
        (state, { payload: { currentTime, audioSlices } }) => {
          for (const id in audioSlices) {
            const player = state[id]
            const audioSlice = audioSlices[id]

            const start = audioSlice.start - currentTime
            const startTime = Math.max(start, 0)
            const offset = audioSlice.trimLeft - Math.min(start, 0)
            const length = audioSlice.trimRight - audioSlice.trimLeft
            const duration = length + Math.min(start, 0)

            if (duration > 0)
              Tone.Transport.scheduleOnce(time => {
                player.start(time / 1000, offset / 1000, duration / 1000)
              }, startTime / 1000)
          }

          Tone.Transport.start()
        },
      )
      .addCase(appActions.pause, state => {
        Tone.Transport.stop()
        for (const id in state) {
          state[id].stop()
          console.log(`stoping ${id}`)
        }
      })
  },
})

export default slice.reducer
