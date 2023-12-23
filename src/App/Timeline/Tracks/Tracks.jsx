import style from './Tracks.module.css'
import AudioSlice from './AudioSlice'
import { selectAudioSlices, audioSlicesActions } from '@/store/audioSlices.js'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useRef, useState } from 'react'

export default function Tracks() {
  const audioSlices = useSelector(selectAudioSlices)
  const dispatch = useDispatch()
  const ref = useRef(null)
  const [scrollY, setScrollY] = useState()

  useEffect(() => {
    const scrollElement = ref.current
    const handleScroll = () => {
      setScrollY(ref.current.scrollTop)
    }

    scrollElement.addEventListener('scroll', handleScroll)

    return () => {
      scrollElement.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div
      ref={ref}
      className={style.tracks}
      onClick={() => dispatch(audioSlicesActions.deselect())}
      style={{ backgroundPositionY: `${-scrollY}px` }}
    >
      {Object.keys(audioSlices).map(id => (
        <AudioSlice id={id} key={id} />
      ))}
    </div>
  )
}
