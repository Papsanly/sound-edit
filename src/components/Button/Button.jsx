import style from './Button.module.css'

export default function Button({ active, icon }) {
  return (
    <button data-active={active} className={style.item}>
      {icon}
    </button>
  )
}
