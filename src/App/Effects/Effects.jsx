import style from './Effects.module.css'
import EffectItem from './EffectItem'
import { useDispatch, useSelector } from 'react-redux'
import { select, actions } from '@/store/effects.js'

export default function Effects() {
  const effects = useSelector(select)
  const dispatch = useDispatch()

  return (
    <div className={style.effects}>
      {effects.map(effect => (
        <EffectItem
          onEnable={() => dispatch(actions.toggle(effect.name))}
          onOptionChange={(value, name) =>
            dispatch(
              actions.changeOption({
                value,
                effectName: effect.name,
                optionName: name,
              }),
            )
          }
          key={effect.name}
          {...effect}
        />
      ))}
    </div>
  )
}
