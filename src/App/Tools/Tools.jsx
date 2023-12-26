import style from './Tools.module.css'
import Button from '@/components/Button'
import Separator from '@/components/Separator'
import { Cut, Select, Load, Save } from '@/assets'
import { appActions, selectApp } from '@/store/app.js'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import Range from '@/components/Range'
import * as Tone from 'tone'
import { audioSlicesActions } from '@/store/audioSlices.js'
import { playerActions } from '@/store/player.js'

export default function Tools() {
  const app = useSelector(selectApp)
  const dispatch = useDispatch()

  useEffect(() => {
    const unsubLoadedFile = window.electron.on('loaded-file', ({ id, url }) => {
      dispatch(appActions.setLoading(true))
      const player = new Tone.Player(url, () => {
        dispatch(appActions.setLoading(false))
        dispatch(playerActions.load({ id, player }))
      }).toDestination()
    })

    const unsubSelectedFile = window.electron.on(
      'selected-file',
      ({ id, name, path, url }) => {
        dispatch(appActions.setLoading(true))
        const player = new Tone.Player(url, () => {
          dispatch(appActions.setLoading(false))
          dispatch(audioSlicesActions.load({ id, name, path, player }))
        }).toDestination()
      },
    )

    const unsubOpenFileCanceled = window.electron.on('open-file-canceled', () =>
      dispatch(appActions.setLoading(false)),
    )

    return () => {
      unsubLoadedFile()
      unsubSelectedFile()
      unsubOpenFileCanceled()
    }
  }, [dispatch])

  return (
    <div className={style.tools}>
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
        min={0.0001}
        step={0.0001}
        max={0.1}
        name={'scale'}
        onChange={e => dispatch(appActions.setScale(e.target.value))}
      />
      <Separator vertical />
      <Button
        icon={<Load />}
        onClick={() => {
          dispatch(appActions.setLoading(true))
          window.electron.send('open-file-dialog')
        }}
      />
      <Button icon={<Save />} />
    </div>
  )
}
