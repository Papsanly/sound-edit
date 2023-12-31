import styles from './AudioSlice.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { selectAudioSlices, audioSlicesActions } from '@/store/audioSlices.js'
import { appActions, selectApp as selectApp } from '@/store/app.js'
import { useEffect, useRef, useState } from 'react'
import { Delete } from '@/assets'
import { motion } from 'framer-motion'
import { filterObjectByKey } from '@/lib/utils.js'
import Waveform from './Waveform'

export default function AudioSlice({ id }) {
  const audioSlices = useSelector(selectAudioSlices)
  const { scale, activeTool, selectedAudioSliceId } = useSelector(selectApp)
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
    if (activeTool === 'select') {
      if (!audioSlice.isPanning && !audioSlice.isTriming)
        dispatch(appActions.selectAudioSlice(id))
    } else {
      dispatch(
        audioSlicesActions.cut({
          id,
          x: mouseX,
          scale,
          newId: window.electron.generateId(),
        }),
      )
    }
    e.stopPropagation()
  }

  const handleNameInputKeyUp = e => {
    if (e.key === 'Enter') {
      dispatch(audioSlicesActions.setEditNameEnd(id))
    }
  }

  const handleNameInputChange = e => {
    dispatch(audioSlicesActions.setEditName({ id, value: e.target.value }))
  }

  const handleNameDoubleClick = () => {
    dispatch(audioSlicesActions.setEditNameStart(id))
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
    width: `${(audioSlice.trimRight - audioSlice.trimLeft) * scale}px`,
    top: `calc(${Math.round(audioSlice.track)} * var(--track-height))`,
  }

  const otherSlices = filterObjectByKey(audioSlices, otherId => otherId !== id)

  const hasRightNeighbor =
    otherSlices.find(
      otherSlice =>
        audioSlice.start + audioSlice.trimRight - audioSlice.trimLeft ===
          otherSlice.start &&
        Math.round(otherSlice.track) === Math.round(audioSlice.track),
    ) !== undefined

  const hasLeftNeighbor =
    otherSlices.find(
      otherSlice =>
        otherSlice.start + otherSlice.trimRight - otherSlice.trimLeft ===
          audioSlice.start &&
        Math.round(otherSlice.track) === Math.round(audioSlice.track),
    ) !== undefined

  return (
    <motion.div
      id={id}
      ref={ref}
      className={styles.audioSlice}
      data-selected={selectedAudioSliceId === id}
      data-has-neighbor-left={hasLeftNeighbor}
      data-has-neighbor-right={hasRightNeighbor}
      data-is-panning={audioSlice.isPanning}
      style={style}
      onMouseOver={() => setIsHover(true)}
      onMouseOut={() => setIsHover(false)}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
    >
      <Waveform id={id} className={styles.waveform} />
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
