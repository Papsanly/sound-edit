import style from './Info.module.css'
import { useSelector } from 'react-redux'
import { selectApp } from '@/store/app.js'
import { padWithLeadingZeros } from '@/lib/utils.js'

export default function Info() {
  const currentTime = useSelector(selectApp).currentTime

  const millis = padWithLeadingZeros(currentTime % 1000, 3)
  const seconds = padWithLeadingZeros(Math.floor(currentTime / 1000) % 60, 2)
  const minutes = padWithLeadingZeros(Math.floor(currentTime / 60000), 2)

  return (
    <p className={style.time}>
      {minutes}:{seconds}:{millis}
    </p>
  )
}
