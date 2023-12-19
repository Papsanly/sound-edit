import style from './ScrollBar.module.css'

export default function ScrollBar({ start, end }) {
  return (
    <div className={style.scrollBar} style={{ width: `${end - start}px` }}>
      <div className={style.start} />
      <div className={style.end} />
    </div>
  )
}
