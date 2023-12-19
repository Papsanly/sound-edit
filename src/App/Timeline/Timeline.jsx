import style from './Timeline.module.css'
import CurrentTime from './CurrentTime'
import TimeMarkers from './TimeMarkers'
import Tracks from './Tracks'
import ScrollBar from './ScrollBar'

export default function Timeline() {
  return (
    <div className={style.timeline}>
      <CurrentTime time={200} />
      <TimeMarkers />
      <Tracks />
      <ScrollBar start={0} end={400} />
    </div>
  )
}
