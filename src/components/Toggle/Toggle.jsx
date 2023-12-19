import style from './Toggle.module.css'

export default function App({ toggled }) {
  return (
    <div className={style.toggle} data-toggled={toggled}>
      <div className={style.handle} />
    </div>
  )
}
