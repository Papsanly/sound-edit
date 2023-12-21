import style from './AudioSlice.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { select, actions } from '@/store/audioSlices.js'

export default function AudioSlice({ id }) {
  const audioSlice = useSelector(select)[id]
  const dispatch = useDispatch()

  return (
    <div
      id={id}
      className={style.audioSlice}
      data-selected={audioSlice.selected}
      style={{
        left: `calc(${audioSlice.x}px + var(--padding-sm))`,
        width: `${audioSlice.width}px`,
        top: `calc(${audioSlice.track} * var(--track-height) + var(--padding-sm))`,
      }}
      onClick={e => {
        dispatch(actions.select(id))
        e.stopPropagation()
      }}
    >
      <p className={style.name}>{audioSlice.name}</p>
    </div>
  )
}
