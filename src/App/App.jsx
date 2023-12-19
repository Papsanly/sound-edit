import style from './App.module.css'
import Info from './Info'
import Controls from './Controls'
import Tools from './Tools'
import Timeline from './Timeline'
import Effects from './Effects'

export default function App() {
  return (
    <main className={style.app}>
      <div className={style.div1}>
        <Info />
        <Controls />
        <Tools />
      </div>
      <div className={style.div2}>
        <Timeline />
        <Effects />
      </div>
    </main>
  )
}
