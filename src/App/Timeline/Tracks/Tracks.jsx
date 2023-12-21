import style from './Tracks.module.css'
import AudioSlice from './AudioSlice'
import CurrentTime from './CurrentTime'
import { select } from '@/store/audioSlices.js'
import { useSelector } from 'react-redux'

export default function Tracks() {
  const audioSlices = useSelector(select)

  return (
    <div className={style.tracks}>
      <CurrentTime time={0} />
      {audioSlices.map(audioSlice => (
        <AudioSlice key={audioSlice.name} {...audioSlice} />
      ))}
    </div>
  )
}
