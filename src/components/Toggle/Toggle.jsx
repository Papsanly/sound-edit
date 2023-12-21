import style from './Toggle.module.css'

export default function Toggle({ enabled, onToggle }) {
  return (
    <div onClick={onToggle} className={style.toggle} data-enabled={enabled}>
      <div className={style.handle} />
    </div>
  )
}
