import style from './Info.module.css'
import { useSelector } from 'react-redux'
import { selectApp } from '@/store/app.js'
import { padWithLeadingZeros } from '@/lib/utils.js'

export default function Info() {
  const currentTime = useSelector(selectApp).currentTime

  const millis = padWithLeadingZeros(currentTime, 2)
  const seconds = padWithLeadingZeros(Math.round(currentTime / 1000), 2)
  const minutes = padWithLeadingZeros(Math.round(seconds / 60), 2)
  const hours = padWithLeadingZeros(Math.round(minutes / 60), 2)

  return (
    <p className={style.time}>
      {hours}:{minutes}:{seconds}:{millis}
    </p>
  )
}
