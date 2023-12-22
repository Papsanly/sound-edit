import style from './Tracks.module.css'
import AudioSlice from './AudioSlice'
import {
  select as selectAudioSlices,
  actions as audioSlicesActions,
} from '@/store/audioSlices.js'
import { useDispatch, useSelector } from 'react-redux'

export default function Tracks() {
  const audioSlices = useSelector(selectAudioSlices)
  const dispatch = useDispatch()

  return (
    <div
      className={style.tracks}
      onClick={() => dispatch(audioSlicesActions.deselect())}
    >
      {Object.keys(audioSlices).map(id => (
        <AudioSlice id={id} key={id} />
      ))}
    </div>
  )
}
