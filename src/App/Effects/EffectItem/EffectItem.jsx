import style from './EffectItem.module.css'
import Range from '@/components/Range'
import Toggle from '@/components/Toggle'
import { actions, select as selectEffects } from '@/store/effects.js'
import { useDispatch, useSelector } from 'react-redux'
import { selectSelectedAudioSliceId } from '@/store/audioSlices.js'

export default function EffectItem({ id }) {
  const dispatch = useDispatch()
  const selectedAudioSliceId = useSelector(selectSelectedAudioSliceId)
  const effects = useSelector(selectEffects)
  const effect = effects[selectedAudioSliceId][id]

  const onToggle = () => {
    dispatch(
      actions.toggle({
        audioSliceId: selectedAudioSliceId,
        effectId: id,
      }),
    )
  }

  const onOptionChange = (value, optionId) => {
    dispatch(
      actions.changeOption({
        value,
        audioSliceId: selectedAudioSliceId,
        effectId: id,
        optionId,
      }),
    )
  }

  return (
    <div id={id} className={style.effectItem}>
      <div className={style.title}>
        <Toggle enabled={effect.enabled} onToggle={onToggle} />
        <p>{effect.name}</p>
      </div>
      {effect.enabled &&
        Object.entries(effect.options).map(([optionId, option]) => (
          <Range
            key={option.name}
            {...option}
            onChange={e => onOptionChange(e.target.value, optionId)}
          />
        ))}
    </div>
  )
}
