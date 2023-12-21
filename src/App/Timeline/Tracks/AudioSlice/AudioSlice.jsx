import styles from './AudioSlice.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { select, actions } from '@/store/audioSlices.js'
import { useEffect, useRef, useState } from 'react'

export default function AudioSlice({ id }) {
  const audioSlice = useSelector(select)[id]
  const dispatch = useDispatch()
  const [editName, setEditName] = useState(audioSlice.name)
  const editNameInputRef = useRef(null)

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
    const value = e.target.value
    if (e.key === 'Enter') {
      if (value.trim() === '') {
        return
      }

      dispatch(
        actions.setIsEditingName({ audioSliceId: id, isEditingName: false }),
      )
      dispatch(actions.setName({ audioSliceId: id, name: value }))
    }
  }

  const handleNameInputChange = e => {
    setEditName(e.target.value)
  }

  const handleNameDoubleClick = () => {
    dispatch(
      actions.setIsEditingName({
        audioSliceId: id,
        isEditingName: true,
      }),
    )
  }

  const style = {
    left: `calc(${audioSlice.x}px + var(--padding-sm))`,
    width: `${audioSlice.width}px`,
    top: `calc(${audioSlice.track} * var(--track-height) + var(--padding-sm))`,
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
          value={editName}
          onKeyUp={handleNameInputKeyUp}
          onChange={handleNameInputChange}
        />
      ) : (
        <p className={styles.name} onDoubleClick={handleNameDoubleClick}>
          {audioSlice.name}
        </p>
      )}
    </div>
  )
}
