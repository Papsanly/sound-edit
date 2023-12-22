import style from './Tracks.module.css'
import AudioSlice from './AudioSlice'
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
    const rootStyle = getComputedStyle(document.documentElement)
    const padding = parseInt(rootStyle.getPropertyValue('--padding-sm'))
    dispatch(scrollActions.setWidth(width - 2 * padding))
    dispatch(scrollActions.setHeight(height - 2 * padding))
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
      {Object.keys(audioSlices).map(id => (
        <AudioSlice id={id} key={id} />
      ))}
    </div>
  )
}
