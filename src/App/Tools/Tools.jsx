import style from './Tools.module.css'
import Button from '@/components/Button'
import Cut from '@/assets/Cut.jsx'
import Select from '@/assets/Select.jsx'
import Separator from '@/components/Separator'
import Load from '@/assets/Load.jsx'
import Save from '@/assets/Save.jsx'
import { select, actions } from '@/store/app.js'
import { useDispatch, useSelector } from 'react-redux'

export default function Tools() {
  const app = useSelector(select)
  const dispatch = useDispatch()

  return (
    <div className={style.tools}>
      <Button
        active={app.activeTool === 'select'}
        icon={<Select />}
        onClick={() => dispatch(actions.setSelectTool())}
      />
      <Button
        active={app.activeTool === 'cut'}
        icon={<Cut />}
        onClick={() => dispatch(actions.setCutTool())}
      />
      <Separator vertical />
      <Button icon={<Load />} />
      <Button icon={<Save />} />
    </div>
  )
}
