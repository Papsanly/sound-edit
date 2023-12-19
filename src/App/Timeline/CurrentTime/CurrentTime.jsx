import style from './CurrentTime.module.css'

export default function CurrentTime({ time }) {
  return (
    <div className={style.currentTime} style={{ left: `${time}px` }}>
      <div className={style.head} />
      <div className={style.bar} />
    </div>
  )
}
