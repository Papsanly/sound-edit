import style from './Timeline.module.css'
import TimeMarkers from './TimeMarkers'
import Tracks from './Tracks'
import ScrollBar from './ScrollBar'
import { selectSelectedAudioSliceId } from '@/store/audioSlices.js'
import { useSelector } from 'react-redux'

export default function Timeline() {
  const selectedAudioSliceId = useSelector(selectSelectedAudioSliceId)

  return (
    <div
      className={style.timeline}
      data-audio-slice-selected={!!selectedAudioSliceId}
    >
      <TimeMarkers />
      <Tracks />
      <ScrollBar start={0} end={400} />
    </div>
  )
}
