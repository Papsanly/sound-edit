import style from './Effects.module.css'
import EffectItem from './EffectItem'
import { useDispatch, useSelector } from 'react-redux'
import { select, actions } from '@/store/effects.js'
import Separator from '@/components/Separator/index.js'
import { Fragment } from 'react'

export default function Effects() {
  const effects = useSelector(select)
  const dispatch = useDispatch()

  return (
    <div className={style.effects}>
      {effects.map(effect => (
        <Fragment key={effect.name}>
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
            {...effect}
          />
          <Separator horizontal />
        </Fragment>
      ))}
    </div>
  )
}
