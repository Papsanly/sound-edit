import style from './Tracks.module.css'
import AudioSlice from './AudioSlice'
import CurrentTime from './CurrentTime'

export default function Tracks() {
  return (
    <div className={style.tracks}>
      <CurrentTime time={200} />
      <AudioSlice track={0} x={0} width={150} name={'Track 1'} />
      <AudioSlice track={1} x={100} width={200} name={'Track 2'} />
    </div>
  )
}
