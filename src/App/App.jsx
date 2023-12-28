import style from './App.module.css'
import Info from './Info'
import Controls from './Controls'
import Tools from './Tools'
import Timeline from './Timeline'
import Effects from './Effects'
import { useSelector } from 'react-redux'
import { selectSelectedAudioSliceId } from '@/store/audioSlices.js'
import { selectApp } from '@/store/app.js'
import { Loading } from '@/assets'

export default function App() {
  const selectedAudioSliceId = useSelector(selectSelectedAudioSliceId)
  const isLoading = useSelector(selectApp).isLoading

  return (
    <div className={style.app}>
      {isLoading && (
        <div className={style.loadingOverlay}>
          <Loading />
        </div>
      )}
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
