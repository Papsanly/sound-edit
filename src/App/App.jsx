import style from './App.module.css'
import Info from './Info'
import Controls from './Controls'
import Tools from './Tools'
import Timeline from './Timeline'
import Effects from './Effects'
import { useSelector } from 'react-redux'
import { selectSelectedAudioSliceId } from '@/store/audioSlices.js'

export default function App() {
  const selectedAudioSliceId = useSelector(selectSelectedAudioSliceId)

  return (
    <div className={style.app}>
      <header className={style.header}>
        <Info />
        <Controls />
        <Tools />
      </header>
      <div className={style.dragable} />
      <Timeline />
      {selectedAudioSliceId && <Effects />}
    </div>
  )
}
