import style from './Timeline.module.css'
import TimeMarkers from './TimeMarkers'
import Tracks from './Tracks'
import { selectSelectedAudioSliceId } from '@/store/audioSlices.js'
import { useSelector } from 'react-redux'
import CurrentTime from '@/App/Timeline/CurrentTime/index.js'

export default function Timeline() {
  const selectedAudioSliceId = useSelector(selectSelectedAudioSliceId)

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
