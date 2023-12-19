import style from './Tools.module.css'
import Button from '@/components/Button'
import Cut from '@/assets/Cut.jsx'
import Select from '@/assets/Select.jsx'
import Separator from '@/components/Separator'
import Load from '@/assets/Load.jsx'
import Save from '@/assets/Save.jsx'

export default function Tools() {
  return (
    <div className={style.tools}>
      <Button active icon={<Select />} />
      <Button icon={<Cut />} />
      <Separator vertical />
      <Button icon={<Load />} />
      <Button icon={<Save />} />
    </div>
  )
}
