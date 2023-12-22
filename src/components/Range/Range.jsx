import style from './Range.module.css'
import { nanoid } from '@reduxjs/toolkit'

export default function Range({
  value,
  min,
  max,
  name,
  units,
  onChange,
  className,
  step = 0.01,
}) {
  const id = nanoid()
  return (
    <div className={style.rangeContainer}>
      <input
        id={id}
        step={step}
        className={[style.range, className].join(' ')}
        type="range"
        value={value}
        min={min}
        max={max}
        style={{
          backgroundSize: `${((value - min) * 100) / (max - min)}% 100%`,
        }}
        onChange={onChange}
      />
      <label htmlFor={id} className={style.label}>
        {name}: {value}
        {units}
      </label>
    </div>
  )
}
