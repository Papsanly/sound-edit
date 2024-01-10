import style from './Tools.module.css'
import Button from '@/components/Button'
import Separator from '@/components/Separator'
import { Cut, Select, Load, Save, Redo, Undo } from '@/assets'
import { appActions, selectApp } from '@/store/app.js'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import Range from '@/components/Range'
import {
  audioSlicesActions,
  selectAudioSlices,
  selectEndTime,
} from '@/store/audioSlices.js'
import { play, playerActions, selectPlayer } from '@/store/player.js'
import { loadPlayerAsync, recreatePlayers } from '@/lib/audio.js'
import { ActionCreators } from 'redux-undo'
import { selectEffects } from '@/store/effects.js'
import * as Tone from 'tone'
import Popup from '@/components/Popup'
import { selectFuture, selectPast } from '@/store/index.js'

export default function Tools() {
  const app = useSelector(selectApp)
  const endTime = useSelector(selectEndTime)
  const players = useSelector(selectPlayer)
  const effects = useSelector(selectEffects)
  const audioSlices = useSelector(selectAudioSlices)
  const past = useSelector(selectPast)
  const future = useSelector(selectFuture)
  const dispatch = useDispatch()

  const save = async encoding => {
    if (!audioSlices) return
    dispatch(appActions.setLoading(true))
    const audioBuffer = await Tone.Offline(context => {
      const offlinePlayers = recreatePlayers(players)
      play(
        audioSlices,
        offlinePlayers,
        effects,
        0,
        context.destination,
        context.transport,
      )
    }, endTime / 1000)
    window.electron.send('save-audio', {
      channels: [
        audioBuffer.get().getChannelData(0),
        audioBuffer.get().getChannelData(1),
      ],
      sampleRate: audioBuffer.sampleRate,
      encoding,
    })
  }

  useEffect(() => {
    const handleLoad = action => async audioData => {
      const promises = audioData.map(({ url }) => loadPlayerAsync(url))
      const results = await Promise.allSettled(promises)

      for (let i = 0; i < results.length; i++) {
        const result = results[i]
        if (result.status === 'fulfilled') action(audioData[i], result.value)
        else {
          window.electron.send(
            'show-message',
            'error',
            'Error decoding audio data',
            result.reason,
          )
        }
      }

      dispatch(appActions.setLoading(false))
    }

    const unsubscribes = [
      window.electron.on('open-file-canceled', () =>
        dispatch(appActions.setLoading(false)),
      ),
      window.electron.on(
        'selected-files',
        handleLoad(({ id, name, path }, player) => {
          dispatch(audioSlicesActions.load({ id, name, path, player }))
        }),
      ),
      window.electron.on(
        'loaded-files',
        handleLoad(({ id }, player) => {
          dispatch(playerActions.load({ id, player }))
        }),
      ),
      window.electron.on('saved-audio', filePath => {
        if (filePath) {
          window.electron.send(
            'show-message',
            'none',
            'Successfully Saved audio file',
            `Saved file to ${filePath}`,
          )
        }
        dispatch(appActions.setLoading(false))
      }),
    ]

    return () => {
      unsubscribes.forEach(unsub => unsub())
    }
  }, [dispatch])

  return (
    <div className={style.tools}>
      <Button
        icon={<Undo />}
        disabled={past.length === 0}
        onClick={() => {
          dispatch(ActionCreators.undo())
        }}
      />
      <Button
        icon={<Redo />}
        disabled={future.length === 0}
        onClick={() => {
          dispatch(ActionCreators.redo())
        }}
      />
      <Separator vertical />
      <Button
        active={app.activeTool === 'select'}
        icon={<Select />}
        onClick={() => dispatch(appActions.setSelectTool())}
      />
      <Button
        active={app.activeTool === 'cut'}
        icon={<Cut />}
        onClick={() => dispatch(appActions.setCutTool())}
      />
      <Range
        value={app.scale}
        displayValue={Math.round(app.scale * 10000) / 10}
        min={0.001}
        step={0.0001}
        max={0.1}
        name={'scale'}
        onChange={e => dispatch(appActions.setScale(e.target.value))}
        onClick={() => dispatch(appActions.updateDebouncedScale())}
      />
      <Separator vertical />
      <Button
        icon={<Load />}
        onClick={() => {
          dispatch(appActions.setLoading(true))
          window.electron.send('open-file-dialog')
        }}
      />
      <Popup icon={<Save />} disabled={Object.keys(audioSlices).length === 0}>
        <ul className={style.saveDialog}>
          <li onClick={() => save('mp3')}>mp3</li>
          <li onClick={() => save('wav')}>wav</li>
        </ul>
      </Popup>
    </div>
  )
}
