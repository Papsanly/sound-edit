import style from './Timeline.module.css'
import TimeMarkers from './TimeMarkers'
import Tracks from './Tracks'
import { useSelector } from 'react-redux'
import CurrentTime from '@/App/Timeline/CurrentTime/index.js'
import { selectApp } from '@/store/app.js'

export default function Timeline() {
  const { selectedAudioSliceId } = useSelector(selectApp)

  return (
    <div
      className={style.timeline}
      data-audio-slice-selected={!!selectedAudioSliceId}
    >
      <CurrentTime />
      <TimeMarkers />
      <Tracks />
    </div>
  )
}
