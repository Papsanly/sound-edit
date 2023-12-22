import style from './CurrentTime.module.css'
import { useSelector } from 'react-redux'
import { select as selectApp } from '@/store/app.js'

export default function CurrentTime() {
  const { currentTime, scale } = useSelector(selectApp)

  return (
    <div
      className={style.currentTime}
      style={{ left: `${currentTime * scale}px` }}
    >
      <div className={style.head} />
      <div className={style.bar} />
    </div>
  )
}
