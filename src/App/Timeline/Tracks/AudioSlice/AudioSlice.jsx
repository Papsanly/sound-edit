import styles from './AudioSlice.module.css'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectAudioSlices,
  audioSlicesActions,
  selectSelectedAudioSliceId,
} from '@/store/audioSlices.js'
import { selectApp as selectApp } from '@/store/app.js'
import { useEffect, useRef } from 'react'
import { Delete } from '@/assets'
import { motion } from 'framer-motion'
import { filterObjectByKey } from '@/lib/utils.js'

export default function AudioSlice({ id }) {
  const audioSlices = useSelector(selectAudioSlices)
  const selectedAudioSliceId = useSelector(selectSelectedAudioSliceId)
  const scale = useSelector(selectApp).scale
  const audioSlice = audioSlices[id]
  const dispatch = useDispatch()
  const editNameInputRef = useRef(null)

  useEffect(() => {
    if (audioSlice.isEditingName) {
      editNameInputRef.current.select()
    }
  }, [audioSlice.isEditingName])

  const handleClick = e => {
    dispatch(audioSlicesActions.select(id))
    e.stopPropagation()
  }

  const handleNameInputKeyUp = e => {
    if (e.key === 'Enter') {
      dispatch(audioSlicesActions.submitName(id))
    }
  }

  const handleNameInputChange = e => {
    dispatch(audioSlicesActions.setEditName({ id, value: e.target.value }))
  }

  const handleNameDoubleClick = () => {
    dispatch(audioSlicesActions.startEditingName(id))
  }

  const handleDeleteButtonClick = e => {
    dispatch(audioSlicesActions.deleteSlice(id))
    e.stopPropagation()
  }

  const handlePanStart = () => {
    dispatch(audioSlicesActions.panStart(id))
    dispatch(audioSlicesActions.select(id))
  }

  const handlePan = (_, info) => {
    dispatch(audioSlicesActions.pan({ id, info, scale }))
  }

  const handlePanEnd = () => {
    dispatch(audioSlicesActions.panEnd(id))
  }

  const style = {
    left: `calc(${audioSlice.start * scale}px)`,
    width: `${audioSlice.length * scale}px`,
    top: `calc(${Math.round(audioSlice.track)} * var(--track-height))`,
  }

  const otherSlices = filterObjectByKey(audioSlices, otherId => otherId !== id)

  const hasRightNeighbor =
    otherSlices.find(
      otherSlice =>
        audioSlice.start + audioSlice.length === otherSlice.start &&
        Math.round(otherSlice.track) === Math.round(audioSlice.track),
    ) !== undefined

  const hasLeftNeighbor =
    otherSlices.find(
      otherSlice =>
        otherSlice.start + otherSlice.length === audioSlice.start &&
        Math.round(otherSlice.track) === Math.round(audioSlice.track),
    ) !== undefined

  return (
    <motion.div
      id={id}
      className={styles.audioSlice}
      data-selected={audioSlice.selected}
      data-has-neighbor-left={hasLeftNeighbor}
      data-has-neighbor-right={hasRightNeighbor}
      data-is-panning={audioSlice.isPanning}
      style={style}
      onClick={handleClick}
      onPan={handlePan}
      onPanEnd={handlePanEnd}
      onPanStart={handlePanStart}
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
