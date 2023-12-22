import style from './CurrentTime.module.css'
import { useSelector } from 'react-redux'
import { select as selectApp } from '@/store/app.js'
import { select as selectScroll } from '@/store/scroll.js'

export default function CurrentTime() {
  const { currentTime } = useSelector(selectApp)
  const scroll = useSelector(selectScroll)

  return (
    <div
      className={style.currentTime}
      style={{
        left: `${currentTime * scroll.x.scale - scroll.x.offset}px`,
        height: `calc(${scroll.height}px + 2 * var(--padding-sm) - var(--top) + var(--thikness-lg))`,
      }}
    >
      <div className={style.head} />
      <div className={style.bar} />
    </div>
  )
}
