import style from './Tools.module.css'
import Button from '@/components/Button'
import Separator from '@/components/Separator'
import { Cut, Select, Load, Save } from '@/assets'
import { actions as appActions, select as selectApp } from '@/store/app.js'
import { actions as audioSlicesActions } from '@/store/audioSlices.js'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { select as selectAudioSlices } from '@/store/audioSlices.js'
import Range from '@/components/Range/index.js'

export default function Tools() {
  const app = useSelector(selectApp)
  const dispatch = useDispatch()
  const audioSlices = useSelector(selectAudioSlices)

  useEffect(
    () =>
      window.electron.on('selected-file', filesData => {
        dispatch(audioSlicesActions.load(filesData))
        dispatch(audioSlicesActions.select(filesData[0].id))
      }),
    [audioSlices, dispatch],
  )

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
        min={0.01}
        step={0.01}
        max={1}
        name={'scale'}
        onChange={e => dispatch(appActions.setScale(e.target.value))}
      />
      <Separator vertical />
      <Button
        icon={<Load />}
        onClick={() => window.electron.send('open-file-dialog')}
      />
      <Button icon={<Save />} />
    </div>
  )
}
