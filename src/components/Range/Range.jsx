import style from './Range.module.css'

export default function Range({ id, value, min, max, label, units }) {
  return (
    <div className={style.rangeContainer}>
      <input
        id={id}
        className={style.range}
        type="range"
        value={value}
        min={min}
        max={max}
        style={{
          backgroundSize: `${((value - min) * 100) / (max - min)}% 100%`,
        }}
      />
      <label htmlFor={id} className={style.label}>
        {label}: {value}
        {units}
      </label>
    </div>
  )
}
