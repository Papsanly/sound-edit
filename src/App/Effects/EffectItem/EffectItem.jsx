import style from './EffectItem.module.css'
import Option from './Option'
import Toggle from '@/components/Toggle/index.js'

export default function EffectItem({ enabled, name, options }) {
  return (
    <div className={style.effectItem}>
      <div className={style.title}>
        <Toggle toggled={enabled} />
        <p className={style.titleText}>{name}</p>
      </div>
      {enabled && options.map(option => <Option key={option.id} {...option} />)}
    </div>
  )
}
