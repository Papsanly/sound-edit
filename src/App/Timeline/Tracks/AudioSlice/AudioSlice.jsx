import styles from './AudioSlice.module.css'
import { useDispatch, useSelector } from 'react-redux'
import {
  select,
  actions,
  actions as audioSlicesActions,
  selectSelectedAudioSliceId,
} from '@/store/audioSlices.js'
import { useEffect, useRef } from 'react'
import Delete from '@/assets/Delete.jsx'
import { select as selectScroll } from '@/store/scroll.js'

export default function AudioSlice({ id }) {
  const audioSlice = useSelector(select)[id]
  const dispatch = useDispatch()
  const editNameInputRef = useRef(null)
  const selectedAudioSliceId = useSelector(selectSelectedAudioSliceId)
  const scroll = useSelector(selectScroll)

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

  const style = {
    left: `calc(${
      audioSlice.start * scroll.x.scale - scroll.x.offset
    }px + var(--padding-sm))`,
    width: `${audioSlice.length * scroll.x.scale}px`,
    top: `calc(${audioSlice.track} * var(--track-height) - ${scroll.y.offset}px + var(--padding-sm))`,
  }

  return (
    <div
      id={id}
      className={styles.audioSlice}
      data-selected={audioSlice.selected}
      style={style}
      onClick={handleClick}
    >
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
    </div>
  )
}
