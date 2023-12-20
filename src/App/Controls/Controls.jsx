import style from './Contols.module.css'
import Button from '../../components/Button'
import Play from '@/assets/Play.jsx'
import Pause from '@/assets/Pause.jsx'
import { select, actions } from '@/store/app.js'
import { useDispatch, useSelector } from 'react-redux'

export default function Controls() {
  const app = useSelector(select)
  const dispatch = useDispatch()

  return (
    <div className={style.controls}>
      <Button
        active={app.activeControl === 'play'}
        icon={<Play />}
        onClick={() => dispatch(actions.play())}
      />
      <Button
        active={app.activeControl === 'pause'}
        icon={<Pause />}
        onClick={() => dispatch(actions.pause())}
      />
    </div>
  )
}
