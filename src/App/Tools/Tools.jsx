import style from './Tools.module.css'
import Button from '@/components/Button'
import Separator from '@/components/Separator'
import { Cut, Select, Load, Save } from '@/assets'
import { appActions, selectApp } from '@/store/app.js'
import { useDispatch, useSelector } from 'react-redux'
import { useRef } from 'react'
import Range from '@/components/Range'
import * as Tone from 'tone'
import { readFileAsync } from '@/lib/utils.js'
import { audioSlicesActions } from '@/store/audioSlices.js'

export default function Tools() {
  const app = useSelector(selectApp)
  const dispatch = useDispatch()
  const fileInputRef = useRef(null)

  const handleFileInput = async e => {
    await Tone.start()
    const reader = new FileReader()
    for (const file of e.target.files) {
      const url = await readFileAsync(reader, file)
      const id = window.electron.generateId()
      const player = new Tone.Player(url, () => {
        dispatch(audioSlicesActions.load({ id, file, player }))
      }).toDestination()
    }
    e.target.value = ''
  }

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
      <Button icon={<Load />} onClick={() => fileInputRef.current.click()} />
      <input
        ref={fileInputRef}
        style={{ display: 'none' }}
        type={'file'}
        multiple
        accept={'audio/*'}
        onChange={handleFileInput}
      />
      <Button icon={<Save />} />
    </div>
  )
}
