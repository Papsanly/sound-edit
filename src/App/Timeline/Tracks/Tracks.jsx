import style from './Tracks.module.css'
import AudioSlice from './AudioSlice'
import CurrentTime from './CurrentTime'
import { select, actions } from '@/store/audioSlices.js'
import { useDispatch, useSelector } from 'react-redux'

export default function Tracks() {
  const audioSlices = useSelector(select)
  const dispatch = useDispatch()

  return (
    <div className={style.tracks} onClick={() => dispatch(actions.deselect())}>
      <CurrentTime time={0} />
      {Object.keys(audioSlices).map(id => (
        <AudioSlice id={id} key={id} />
      ))}
    </div>
  )
}
