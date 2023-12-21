import style from './Button.module.css'

export default function Button({ active, icon, onClick, className }) {
  return (
    <button
      data-active={active}
      onClick={onClick}
      className={[style.button, className].join(' ')}
    >
      {icon}
    </button>
  )
}
