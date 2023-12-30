import { useEffect, useRef } from 'react'
import WaveSurfer from 'wavesurfer.js'
import { getCssProperty } from '@/lib/utils.js'
import { useSelector } from 'react-redux'
import { selectPlayer } from '@/store/player.js'
import { selectAudioSlices } from '@/store/audioSlices.js'
import { selectApp } from '@/store/app.js'
import style from './Waveform.module.css'

export default function Waveform({ id, className }) {
  const containerRef = useRef(null)
  const wavesurfer = useRef(null)
  const player = useSelector(selectPlayer)[id]
  const { trimLeft } = useSelector(selectAudioSlices)[id]
  const { scale } = useSelector(selectApp)

  useEffect(() => {
    if (!player) return

    wavesurfer.current = WaveSurfer.create({
      container: containerRef.current,
      waveColor: getCssProperty('--color-text-default'),
      interact: false,
      width: player.buffer.duration * 1000 * scale,
      height: 'auto',
      cursorColor: '#0000',
      peaks: [player.buffer.getChannelData(0), player.buffer.getChannelData(1)],
      duration: player.buffer.duration,
    })

    return () => {
      wavesurfer.current.destroy()
    }
  }, [player, scale])

  return (
    <div className={[style.waveform, className].join(' ')}>
      <div ref={containerRef} style={{ left: `${-trimLeft * scale}px` }} />
    </div>
  )
}
