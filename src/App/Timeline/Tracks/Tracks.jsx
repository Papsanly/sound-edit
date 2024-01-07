import style from './Tracks.module.css'
import AudioSlice from './AudioSlice'
import { selectAudioSlices } from '@/store/audioSlices.js'
import { useDispatch, useSelector } from 'react-redux'
import { useCallback, useEffect, useRef, useState } from 'react'
import { appActions, selectApp } from '@/store/app.js'
import { getCssProperty } from '@/lib/utils.js'

export default function Tracks() {
  const audioSlices = useSelector(selectAudioSlices)
  const dispatch = useDispatch()
  const ref = useRef(null)
  const [scroll, setScroll] = useState({ x: 0, y: 0 })
  const isAudioSliceSelected =
    useSelector(selectApp).selectedAudioSliceId !== null

  const updateWidth = useCallback(() => {
    const { width } = ref.current.getBoundingClientRect()
    const padding = parseInt(getCssProperty('--padding-sm'))
    dispatch(appActions.setWidth(width - 2 * padding))
  }, [dispatch])

  useEffect(() => {
    const scrollElement = ref.current
    const handleScroll = () => {
      setScroll({ x: ref.current.scrollLeft, y: ref.current.scrollTop })
    }

    scrollElement.addEventListener('scroll', handleScroll)

    window.addEventListener('resize', updateWidth)

    return () => {
      scrollElement.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', updateWidth)
    }
  }, [updateWidth, dispatch])

  useEffect(() => updateWidth(), [updateWidth, isAudioSliceSelected])

  useEffect(() => {
    dispatch(appActions.setHorizontalScroll(scroll.x))
  }, [dispatch, scroll.x])

  return (
    <div
      ref={ref}
      className={style.tracks}
      onClick={() => dispatch(appActions.selectAudioSlice(null))}
      style={{ backgroundPositionY: `${-scroll.y}px` }}
    >
      {Object.keys(audioSlices).map(id => (
        <AudioSlice id={id} key={id} />
      ))}
    </div>
  )
}
