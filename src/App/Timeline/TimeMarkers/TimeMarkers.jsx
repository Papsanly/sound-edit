import style from './TimeMarkers.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { selectApp, appActions } from '@/store/app.js'
import { selectEndTime } from '@/store/audioSlices.js'
import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline.js'
import { useEffect, useRef } from 'react'
import WaveSurfer from 'wavesurfer.js'
import { getCssProperty } from '@/lib/utils.js'

export default function TimeMarkers() {
  const { scale, currentTime, width, horizontalScroll } = useSelector(selectApp)
  const dispatch = useDispatch()
  const endTime = useSelector(selectEndTime)
  const containerRef = useRef(null)
  const wavesurfer = useRef(null)

  useEffect(() => {
    wavesurfer.current = WaveSurfer.create({
      container: containerRef.current,
      waveColor: 'transparent',
      interact: false,
      width: `${width}px`,
      height: 'auto',
      cursorColor: '#0000',
      duration: width / scale / 1000,
      peaks: [[0]],
      plugins: [TimelinePlugin.create()],
    })

    return () => {
      wavesurfer.current.destroy()
    }
  }, [width, scale, endTime])

  return (
    <div className={style.timeMarkers}>
      <input
        min={horizontalScroll / scale || 0}
        type={'range'}
        value={currentTime}
        step={Math.round(1 / scale)}
        max={(horizontalScroll + width) / scale || 0}
        onChange={e =>
          dispatch(
            appActions.setTime(Math.min(parseInt(e.target.value), endTime)),
          )
        }
      />
      <div
        className={style.ticks}
        style={{
          left: `${
            -horizontalScroll * scale + parseInt(getCssProperty('--padding-sm'))
          }px`,
        }}
        ref={containerRef}
      />
    </div>
  )
}
