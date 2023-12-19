import style from './Effects.module.css'
import EffectItem from './EffectItem'

export default function Effects() {
  return (
    <div className={style.effects}>
      <EffectItem
        name={'Effect 1'}
        options={[{ id: 1, label: 'Option 1', value: 1 }]}
      />
      <EffectItem
        enabled
        name={'Effect 2'}
        options={[
          { id: 1, label: 'Option 1', value: 1 },
          { id: 2, label: 'Option 2', value: 0 },
        ]}
      />
    </div>
  )
}
