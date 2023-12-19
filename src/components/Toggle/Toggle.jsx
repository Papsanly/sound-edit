import style from './Toggle.module.css'
import { motion } from 'framer-motion'

export default function App({ toggled, onClick }) {
  return (
    <div onClick={onClick} className={style.toggle} data-toggled={toggled}>
      <motion.div className={style.handle} layout />
    </div>
  )
}
