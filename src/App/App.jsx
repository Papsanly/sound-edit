import style from './App.module.css'
import Info from './Info'
import Controls from './Controls'
import Tools from './Tools'
import Timeline from './Timeline'
import Effects from './Effects'

export default function App() {
  return (
    <div className={style.app}>
      <header className={style.header}>
        <Info />
        <Controls />
        <Tools />
      </header>
      <Timeline />
      <Effects />
    </div>
  )
}
