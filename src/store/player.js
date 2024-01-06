import { createSlice } from '@reduxjs/toolkit'
import { audioSlicesActions } from '@/store/audioSlices.js'
import { appActions } from '@/store/app.js'
import * as Tone from 'tone'
import { REHYDRATE } from 'redux-persist'
import { effectFunctions } from '@/lib/effects.js'

export function play(audioSlices, players, effects, currentTime, destination) {
  for (const id in audioSlices) {
    const player = players[id]
    const audioSlice = audioSlices[id]
    const effect = effects[id]

    const start = audioSlice.start - currentTime
    const startTime = Math.max(start, 0)
    const offset = audioSlice.trimLeft - Math.min(start, 0)
    const length = audioSlice.trimRight - audioSlice.trimLeft
    const duration = length + Math.min(start, 0)

    const effectsChain = []
    for (const [effectId, { get }] of Object.entries(effectFunctions)) {
      if (effect[effectId].enabled) {
        const { options } = effect[effectId]
        if (effectId === 'fade') {
          player.fadeIn = Math.max(
            options.in.value + Math.min(start, 0) / 1000,
            0,
          )
          player.fadeOut = options.out.value
        } else {
          effectsChain.push(get(options))
        }
      } else {
        player.fadeIn = 0
        player.fadeOut = 0
      }
    }

    player.disconnect()
    player.chain(...effectsChain, destination)

    if (duration > 0)
      Tone.Transport.scheduleOnce(time => {
        player.start(time / 1000, offset / 1000, duration / 1000)
      }, startTime / 1000)
  }

  Tone.Transport.start()
}

const slice = createSlice({
  name: 'player',
  initialState: {},
  reducers: {
    load(state, { payload: { id, player } }) {
      state[id] = player
    },
    reloadAll(state) {
      for (const id in state) {
        const player = new Tone.Player().toDestination()
        player.buffer = state[id].buffer
        state[id] = player
      }
    },
  },
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
        (state, { payload: { currentTime, audioSlices, effects } }) => {
          play(audioSlices, state, effects, currentTime, Tone.getDestination())
        },
      )
      .addCase(appActions.pause, state => {
        Tone.Transport.stop()
        for (const id in state) {
          state[id].stop()
        }
      })
      .addCase(REHYDRATE, (state, action) => {
        if (action.payload && action.payload.undoables.present.audioSlices) {
          const audioSlices = action.payload.undoables.present.audioSlices
          const data = Object.entries(audioSlices).map(([id, audioSlice]) => ({
            id,
            path: audioSlice.path,
          }))
          window.electron.send('load-files', data)
        } else {
          window.electron.send('load-files', [])
        }
      })
  },
})

export const playerActions = slice.actions
export const selectPlayer = state => state.undoables.present.player
export default slice.reducer
