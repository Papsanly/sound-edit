import style from './Tools.module.css'
import Button from '@/components/Button'
import Cut from '@/assets/Cut.jsx'
import Select from '@/assets/Select.jsx'
import Separator from '@/components/Separator'
import Load from '@/assets/Load.jsx'
import Save from '@/assets/Save.jsx'
import { actions as appActions, select as selectApp } from '@/store/app.js'
import { actions as audioSlicesActions } from '@/store/audioSlices.js'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { nanoid } from '@reduxjs/toolkit'

export default function Tools() {
  const app = useSelector(selectApp)
  const dispatch = useDispatch()

  useEffect(
    () =>
      window.electron.on('selected-file', filePaths => {
        const payload = filePaths.map(filePath => ({ id: nanoid(), filePath }))
        dispatch(audioSlicesActions.load(payload))
      }),
    [dispatch],
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
      <Separator vertical />
      <Button
        icon={<Load />}
        onClick={() => window.electron.send('open-file-dialog')}
      />
      <Button icon={<Save />} />
    </div>
  )
}
