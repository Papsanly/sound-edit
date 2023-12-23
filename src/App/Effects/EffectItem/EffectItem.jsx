import style from './EffectItem.module.css'
import Range from '@/components/Range'
import Toggle from '@/components/Toggle'
import { effectsActions, selectEffects } from '@/store/effects.js'
import { useDispatch, useSelector } from 'react-redux'
import { selectSelectedAudioSliceId } from '@/store/audioSlices.js'

export default function EffectItem({ id }) {
  const dispatch = useDispatch()
  const selectedAudioSliceId = useSelector(selectSelectedAudioSliceId)
  const effect = useSelector(selectEffects)[selectedAudioSliceId][id]

  const onToggle = () => {
    dispatch(
      effectsActions.toggle({
        audioSliceId: selectedAudioSliceId,
        effectId: id,
      }),
    )
  }

  const onOptionChange = (value, optionId) => {
    dispatch(
      effectsActions.changeOption({
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
