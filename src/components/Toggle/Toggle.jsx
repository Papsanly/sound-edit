import style from './Toggle.module.css'

export default function Toggle({ enabled, onClick }) {
  return (
    <div onClick={onClick} className={style.toggle} data-enabled={enabled}>
      <div className={style.handle} />
    </div>
  )
}
