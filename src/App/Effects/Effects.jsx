import style from './Effects.module.css'
import EffectItem from './EffectItem'
import Separator from '@/components/Separator/index.js'
import { Fragment } from 'react'
import allEffects from '@/lib/effects.js'

export default function Effects() {
  return (
    <div className={style.effects}>
      {Object.keys(allEffects).map(effectId => (
        <Fragment key={effectId}>
          <EffectItem id={effectId} />
          <Separator horizontal />
        </Fragment>
      ))}
    </div>
  )
}
