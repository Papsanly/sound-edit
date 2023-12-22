import style from './App.module.css'
import Info from './Info'
import Controls from './Controls'
import Tools from './Tools'
import Timeline from './Timeline'
import Effects from './Effects'
import { useDispatch, useSelector } from 'react-redux'
import { selectSelectedAudioSliceId } from '@/store/audioSlices.js'
import { useEffect } from 'react'
import { actions as scrollActions } from '@/store/scroll.js'

export default function App() {
  const selectedAudioSliceId = useSelector(selectSelectedAudioSliceId)
  const dispatch = useDispatch()

  useEffect(() => {
    const rootStyle = getComputedStyle(document.documentElement)
    const trackHeight = parseInt(rootStyle.getPropertyValue('--track-height'))
    dispatch(scrollActions.setYScale(trackHeight))
  }, [dispatch])

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
