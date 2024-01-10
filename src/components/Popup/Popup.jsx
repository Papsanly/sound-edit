import styles from './Popup.module.css'
import { useState } from 'react'
import Button from '@/components/Button'

export default function Popup({ icon, disabled, children }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={styles.popup} data-is-open={isOpen}>
      <Button
        disabled={disabled}
        className={styles.toggleButton}
        onClick={() => setIsOpen(x => !x)}
        icon={icon}
      />
      {isOpen && (
        <>
          <div className={styles.children} onClick={() => setIsOpen(false)}>
            {children}
          </div>
          <div className={styles.overlay} onClick={() => setIsOpen(false)} />
        </>
      )}
    </div>
  )
}
