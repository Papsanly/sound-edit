import style from './Info.module.css'
import { useSelector } from 'react-redux'
import { select } from '@/store/app.js'

export default function Info() {
  const currentTime = useSelector(select).currentTime

  const seconds = Math.round(currentTime / 1000)
  const minutes = Math.round(seconds / 60)
  const hours = Math.round(minutes / 60)

  return (
    <p className={style.time}>
      {hours}:{minutes}:{seconds}:{currentTime}
    </p>
  )
}
