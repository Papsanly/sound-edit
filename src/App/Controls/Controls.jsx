import style from './Contols.module.css'
import Button from '../../components/Button'
import { Play, Pause } from '@/assets'
import { selectApp, appActions } from '@/store/app.js'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useRef } from 'react'
import { selectEndTime } from '@/store/audioSlices.js'

export default function Controls() {
  const app = useSelector(selectApp)
  const endTime = useSelector(selectEndTime)
  const dispatch = useDispatch()
  let interval = useRef(null)

  useEffect(() => {
    if (app.activeControl === 'play') {
      interval.current = setInterval(
        () => dispatch(appActions.updateTime(10)),
        10,
      )
    } else {
      clearInterval(interval.current)
    }

    return () => clearInterval(interval.current)
  }, [dispatch, app.activeControl])

  useEffect(() => {
    if (app.currentTime >= endTime) dispatch(appActions.pause())
  }, [dispatch, endTime, app.currentTime])

  return (
    <div className={style.controls}>
      <Button
        active={app.activeControl === 'play'}
        icon={<Play />}
        onClick={() => dispatch(appActions.play())}
      />
      <Button
        active={app.activeControl === 'pause'}
        icon={<Pause />}
        onClick={() => dispatch(appActions.pause())}
      />
    </div>
  )
}
