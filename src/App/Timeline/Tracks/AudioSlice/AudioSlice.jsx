import style from './AudioSlice.module.css'

export default function AudioSlice({ track, x, width }) {
  return (
    <div
      className={style.audioSlice}
      style={{
        left: `calc(${x}px + var(--slice-padding))`,
        width: `${width}px`,
        top: `calc(${track} * var(--track-height) + var(--slice-padding))`,
      }}
    ></div>
  )
}
