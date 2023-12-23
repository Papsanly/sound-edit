import style from './Contols.module.css'
import Button from '../../components/Button'
import { Play, Pause } from '@/assets'
import { selectApp, appActions } from '@/store/app.js'
import { useDispatch, useSelector } from 'react-redux'

export default function Controls() {
  const app = useSelector(selectApp)
  const dispatch = useDispatch()

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
