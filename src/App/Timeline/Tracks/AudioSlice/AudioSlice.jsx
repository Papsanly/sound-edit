import styles from './AudioSlice.module.css'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectAudioSlices,
  audioSlicesActions,
  selectSelectedAudioSliceId,
} from '@/store/audioSlices.js'
import { selectApp as selectApp } from '@/store/app.js'
import { useEffect, useRef, useState } from 'react'
import { Delete } from '@/assets'
import { motion } from 'framer-motion'
import { filterObjectByKey } from '@/lib/utils.js'

export default function AudioSlice({ id }) {
  const audioSlices = useSelector(selectAudioSlices)
  const selectedAudioSliceId = useSelector(selectSelectedAudioSliceId)
  const { scale, activeTool } = useSelector(selectApp)
  const audioSlice = audioSlices[id]
  const dispatch = useDispatch()
  const editNameInputRef = useRef(null)
  const [isHover, setIsHover] = useState(false)
  const [mouseX, setMouseX] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    if (audioSlice.isEditingName) {
      editNameInputRef.current.select()
    }
  }, [audioSlice.isEditingName])

  const handleClick = e => {
    if (activeTool === 'select') dispatch(audioSlicesActions.select(id))
    else
      dispatch(
        audioSlicesActions.cut({
          id,
          x: mouseX,
          scale,
          newId: window.electron.generateId(),
        }),
      )
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
    if (activeTool !== 'select') return
    dispatch(audioSlicesActions.panStart(id))
  }

  const handlePan = (_, info) => {
    if (activeTool !== 'select') return
    dispatch(audioSlicesActions.pan({ id, info, scale }))
  }

  const handlePanEnd = () => {
    if (activeTool !== 'select') return
    dispatch(audioSlicesActions.panEnd(id))
  }

  const handleTrimPanStart = () => {
    if (activeTool !== 'select') return
    dispatch(audioSlicesActions.trimStart(id))
  }

  const handleTrimLeftPan = (_, info) => {
    if (activeTool !== 'select') return
    dispatch(audioSlicesActions.trimLeft({ id, info, scale }))
  }

  const handleTrimRightPan = (_, info) => {
    if (activeTool !== 'select') return
    dispatch(audioSlicesActions.trimRight({ id, info, scale }))
  }

  const handleTrimEnd = () => {
    if (activeTool !== 'select') return
    dispatch(audioSlicesActions.trimEnd(id))
  }

  const handleMouseMove = e => {
    const boundingRect = ref.current.getBoundingClientRect()
    setMouseX(e.clientX - boundingRect.x)
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
      ref={ref}
      className={styles.audioSlice}
      data-selected={audioSlice.selected}
      data-has-neighbor-left={hasLeftNeighbor}
      data-has-neighbor-right={hasRightNeighbor}
      data-is-panning={audioSlice.isPanning}
      style={style}
      onMouseOver={() => setIsHover(true)}
      onMouseOut={() => setIsHover(false)}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
    >
      {activeTool === 'cut' && (
        <div
          data-is-hover={isHover}
          className={styles.cutBar}
          style={{ left: `${mouseX}px` }}
        />
      )}
      <motion.div
        className={styles.panner}
        onPan={handlePan}
        onPanEnd={handlePanEnd}
        onPanStart={handlePanStart}
      />
      <div className={styles.verticalSpacer} />
      <div className={styles.horizontalSpacer} />
      <motion.div
        data-active-tool={activeTool}
        onPanStart={handleTrimPanStart}
        onPan={handleTrimLeftPan}
        onPanEnd={handleTrimEnd}
        className={styles.trimLeft}
      />
      <motion.div
        data-active-tool={activeTool}
        onPanStart={handleTrimPanStart}
        onPan={handleTrimRightPan}
        onPanEnd={handleTrimEnd}
        className={styles.trimRight}
      />
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
