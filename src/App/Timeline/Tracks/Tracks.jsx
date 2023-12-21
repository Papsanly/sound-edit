import style from './Tracks.module.css'
import AudioSlice from './AudioSlice'
import CurrentTime from './CurrentTime'
import {
  select as selectAudioSlices,
  actions as audioSlicesActions,
  selectSelectedAudioSliceId,
} from '@/store/audioSlices.js'
import { actions as scrollActions } from '@/store/scroll.js'
import { useDispatch, useSelector } from 'react-redux'
import { useCallback, useEffect, useRef } from 'react'

export default function Tracks() {
  const audioSlices = useSelector(selectAudioSlices)
  const selectedAudioSliceId = useSelector(selectSelectedAudioSliceId)
  const dispatch = useDispatch()
  const ref = useRef(null)

  const updateDimentions = useCallback(() => {
    const { width, height } = ref.current.getBoundingClientRect()
    dispatch(scrollActions.setWidth(width))
    dispatch(scrollActions.setHeight(height))
  }, [dispatch])

  useEffect(() => {
    window.addEventListener('resize', updateDimentions)
    updateDimentions()
  }, [updateDimentions, dispatch])

  useEffect(() => {
    updateDimentions()
  }, [updateDimentions, selectedAudioSliceId, dispatch])

  return (
    <div
      ref={ref}
      className={style.tracks}
      onClick={() => dispatch(audioSlicesActions.deselect())}
    >
      <CurrentTime time={0} />
      {Object.keys(audioSlices).map(id => (
        <AudioSlice id={id} key={id} />
      ))}
    </div>
  )
}
