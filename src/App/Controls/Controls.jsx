import style from './Contols.module.css'
import Button from '../../components/Button'
import { Play, Pause } from '@/assets'
import { selectApp, appActions } from '@/store/app.js'
import { useDispatch, useSelector } from 'react-redux'
import { useCallback, useEffect, useRef } from 'react'
import { selectAudioSlices, selectEndTime } from '@/store/audioSlices.js'
import * as Tone from 'tone'

export default function Controls() {
  const app = useSelector(selectApp)
  const audioSlices = useSelector(selectAudioSlices)
  const endTime = useSelector(selectEndTime)
  const dispatch = useDispatch()
  let interval = useRef(null)

  const play = () => {
    if (app.currentTime < endTime) {
      dispatch(appActions.play({ currentTime: app.currentTime, audioSlices }))
      const now = Tone.now()
      const prevTime = app.currentTime
      clearInterval(interval.current)
      interval.current = setInterval(() => {
        const newTime = prevTime + Math.round(1000 * (Tone.now() - now))
        dispatch(appActions.setTime(newTime))
      }, 10)
    }
  }

  const pause = useCallback(() => {
    dispatch(appActions.pause())
    clearInterval(interval.current)
  }, [dispatch])

  useEffect(() => {
    if (app.currentTime >= endTime) pause()
  }, [pause, endTime, app.currentTime])

  return (
    <div className={style.controls}>
      <Button
        active={app.activeControl === 'play'}
        icon={<Play />}
        onClick={play}
      />
      <Button
        active={app.activeControl === 'pause'}
        icon={<Pause />}
        onClick={pause}
      />
    </div>
  )
}
