import style from './Contols.module.css'
import Button from '../../components/Button'
import Play from '@/assets/Play.jsx'
import Pause from '@/assets/Pause.jsx'

export default function Controls() {
  return (
    <div className={style.controls}>
      <Button active icon={<Play />} />
      <Button icon={<Pause />} />
    </div>
  )
}
