import style from './EffectItem.module.css'
import Range from '@/components/Range'
import Toggle from '@/components/Toggle'

export default function EffectItem({ enabled, name, options }) {
  return (
    <div className={style.effectItem}>
      <div className={style.title}>
        <Toggle toggled={enabled} />
        <p>{name}</p>
      </div>
      {enabled &&
        options.map(option => (
          <Range
            key={option.id}
            {...option}
            id={`${name}-${option.id}`}
            min={-10}
            max={5}
          />
        ))}
    </div>
  )
}
