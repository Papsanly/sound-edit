import style from './Timeline.module.css'
import TimeMarkers from './TimeMarkers'
import Tracks from './Tracks'
import ScrollBar from './ScrollBar'

export default function Timeline() {
  return (
    <div className={style.timeline}>
      <TimeMarkers />
      <Tracks />
      <ScrollBar start={0} end={400} />
    </div>
  )
}
