import style from './Button.module.css'

export default function Button({ active, disabled, icon, onClick, className }) {
  return (
    <button
      disabled={disabled}
      data-active={active}
      onClick={onClick}
      className={[style.button, className].join(' ')}
    >
      {icon}
    </button>
  )
}
