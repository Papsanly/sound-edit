import style from './EffectItem.module.css'
import Range from '@/components/Range'
import Toggle from '@/components/Toggle'

export default function EffectItem({
  enabled,
  name,
  options,
  onEnable,
  onOptionChange,
}) {
  return (
    <div className={style.effectItem}>
      <div className={style.title}>
        <Toggle enabled={enabled} onClick={onEnable} />
        <p>{name}</p>
      </div>
      {enabled &&
        options.map(option => (
          <Range
            key={option.name}
            {...option}
            onChange={e => onOptionChange(e.target.value, option.name)}
          />
        ))}
    </div>
  )
}
