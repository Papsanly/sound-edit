import style from './CurrentTime.module.css'
import { useSelector } from 'react-redux'
import { selectApp } from '@/store/app.js'

export default function CurrentTime() {
  const { currentTime, scale, horizontalScroll } = useSelector(selectApp)

  return (
    <div
      className={style.currentTime}
      style={{
        left: `calc(${Math.round(
          currentTime * scale - horizontalScroll,
        )}px + var(--padding-sm) - var(--icon-size-md) / 2)`,
      }}
    >
      <div className={style.head} />
      <div className={style.bar} />
    </div>
  )
}
