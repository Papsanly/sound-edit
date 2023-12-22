import style from './Timeline.module.css'
import TimeMarkers from './TimeMarkers'
import Tracks from './Tracks'
import ScrollBar from './ScrollBar'
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
      <ScrollBar start={0} end={400} horizontal style={{ gridRow: 3 }} />
      <ScrollBar
        start={0}
        end={400}
        vertical
        style={{ gridRow: 2, gridColumn: 2 }}
      />
    </div>
  )
}
