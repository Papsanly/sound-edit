import styles from './AudioSlice.module.css'
import { useDispatch, useSelector } from 'react-redux'
import {
  select,
  actions,
  actions as audioSlicesActions,
  selectSelectedAudioSliceId,
} from '@/store/audioSlices.js'
import { select as selectApp } from '@/store/app.js'
import { useEffect, useRef } from 'react'
import { Delete } from '@/assets'
import { motion } from 'framer-motion'

export default function AudioSlice({ id }) {
  const audioSlice = useSelector(select)[id]
  const scale = useSelector(selectApp).scale
  const dispatch = useDispatch()
  const editNameInputRef = useRef(null)
  const selectedAudioSliceId = useSelector(selectSelectedAudioSliceId)

  useEffect(() => {
    if (audioSlice.isEditingName) {
      editNameInputRef.current.select()
    }
  }, [audioSlice.isEditingName])

  const handleClick = e => {
    dispatch(actions.select(id))
    e.stopPropagation()
  }

  const handleNameInputKeyUp = e => {
    if (e.key === 'Enter') {
      dispatch(actions.submitName(id))
    }
  }

  const handleNameInputChange = e => {
    dispatch(
      actions.setEditName({
        audioSliceId: id,
        value: e.target.value,
      }),
    )
  }

  const handleNameDoubleClick = () => {
    dispatch(actions.startEditingName(id))
  }

  const handleDeleteButtonClick = e => {
    dispatch(audioSlicesActions.delete(id))
    e.stopPropagation()
  }

  const handlePan = (e, { delta }) => {
    dispatch(audioSlicesActions.move({ id, delta: delta.x / scale }))
    console.log(delta)
  }

  const style = {
    left: `calc(${audioSlice.start * scale}px + var(--padding-sm))`,
    width: `${audioSlice.length * scale}px`,
    top: `calc(${audioSlice.track} * var(--track-height) + var(--padding-sm))`,
  }

  return (
    <motion.div
      id={id}
      className={styles.audioSlice}
      data-selected={audioSlice.selected}
      style={style}
      onClick={handleClick}
      onPan={handlePan}
    >
      <div className={styles.verticalSpacer} />
      <div className={styles.horizontalSpacer} />
      {audioSlice.isEditingName ? (
        <input
          type={'text'}
          ref={editNameInputRef}
          className={styles.editName}
          value={audioSlice.editName}
          onClick={e => e.stopPropagation()}
          onKeyUp={handleNameInputKeyUp}
          onChange={handleNameInputChange}
        />
      ) : (
        <p className={styles.name} onDoubleClick={handleNameDoubleClick}>
          {audioSlice.name}
        </p>
      )}
      {id === selectedAudioSliceId && (
        <button
          className={styles.deleteButton}
          onClick={handleDeleteButtonClick}
        >
          <Delete />
        </button>
      )}
    </motion.div>
  )
}
