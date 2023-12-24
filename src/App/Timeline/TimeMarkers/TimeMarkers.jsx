import style from './TimeMarkers.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { selectApp, appActions } from '@/store/app.js'

export default function TimeMarkers() {
  const { scale, currentTime, width, horizontalScroll } = useSelector(selectApp)
  const dispatch = useDispatch()

  return (
    <div className={style.timeMarkers}>
      <input
        min={horizontalScroll / scale}
        type={'range'}
        value={currentTime}
        step={Math.round(1 / scale)}
        max={(horizontalScroll + width) / scale}
        onChange={e => dispatch(appActions.setTime(parseInt(e.target.value)))}
      />
    </div>
  )
}
