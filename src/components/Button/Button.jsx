import style from './Button.module.css'

export default function Button({ active, icon, onClick }) {
  return (
    <button data-active={active} onClick={onClick} className={style.item}>
      {icon}
    </button>
  )
}
