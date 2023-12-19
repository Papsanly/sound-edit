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
        <div className={style.div2}>
          <Info />
          <Controls />
          <Tools />
        </div>
        <Timeline />
      </div>
      <Effects />
    </main>
  )
}
