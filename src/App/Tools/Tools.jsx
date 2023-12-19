import style from './Tools.module.css'
import Button from '@/components/Button'
import Cut from '@/assets/Cut.jsx'
import Select from '@/assets/Select.jsx'

export default function Tools() {
  return (
    <div className={style.tools}>
      <Button active icon={<Select />} />
      <Button icon={<Cut />} />
    </div>
  )
}
