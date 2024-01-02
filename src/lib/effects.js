import * as Tone from 'tone'

const effects = {
  gain: {
    name: 'Gain',
    enabled: false,
    options: {
      value: { name: 'Value', min: -20, max: 20, value: 0, units: 'db' },
    },
  },
  reverb: {
    name: 'Reverb',
    enabled: false,
    options: {
      decay: { name: 'Decay', min: 0, max: 10, value: 5, units: 's' },
      predelay: { name: 'Pre-Delay', min: 0, max: 10, value: 5, units: 's' },
      wet: { name: 'Wet', min: 0, max: 1, value: 1, units: '' },
    },
  },
  delay: {
    name: 'Delay',
    enabled: false,
    options: {
      time: { name: 'Time', min: 0, max: 10, value: 5, units: 's' },
      feedback: { name: 'Feedback', min: 0, max: 1, value: 1, units: '' },
    },
  },
  distortion: {
    name: 'Distortion',
    enabled: false,
    options: {
      value: { name: 'Value', min: 0, max: 1, value: 0, units: '' },
      wet: { name: 'Wet', min: 0, max: 1, value: 1, units: '' },
    },
  },
  eq3: {
    name: 'Eq3',
    enabled: false,
    options: {
      low: { name: 'Low', min: -50, max: 10, value: 0, units: 'db' },
      mid: { name: 'Mid', min: -50, max: 10, value: 0, units: 'db' },
      high: { name: 'High', min: -50, max: 10, value: 0, units: 'db' },
    },
  },
  fade: {
    name: 'Fade',
    enabled: false,
    options: {
      in: { name: 'In', min: 0, max: 10, value: 0, units: 's' },
      out: { name: 'Out', min: 0, max: 10, value: 0, units: 's' },
    },
  },
}

export const effectFunctions = {
  gain: {
    apply(player, options) {
      player.disconnect()
      player.chain(new Tone.Volume(options.value.value), Tone.Destination)
    },
    remove(player) {
      player.disconnect()
      player.chain(Tone.Destination)
    },
  },
  reverb: {
    apply(player, options) {
      player.disconnect()
      player.chain(
        new Tone.Reverb({
          decay: options.decay.value,
          preDelay: options.predelay.value,
          wet: options.wet.value,
        }),
        Tone.Destination,
      )
    },
    remove(player) {
      player.disconnect()
      player.chain(Tone.Destination)
    },
  },
  delay: {
    apply(player, options) {
      player.disconnect()
      player.chain(
        new Tone.PingPongDelay(options.time.value, options.feedback.value),
        Tone.Destination,
      )
    },
    remove(player) {
      player.disconnect()
      player.chain(Tone.Destination)
    },
  },
  distortion: {
    apply(player, options) {
      player.disconnect()
      player.chain(
        new Tone.Distortion({
          distortion: options.value.value,
          wet: options.wet.value,
        }),
        Tone.Destination,
      )
    },
    remove(player) {
      player.disconnect()
      player.chain(Tone.Destination)
    },
  },
  eq3: {
    apply(player, options) {
      player.disconnect()
      player.chain(
        new Tone.EQ3(options.low.value, options.mid.value, options.high.value),
        Tone.Destination,
      )
    },
    remove(player) {
      player.disconnect()
      player.chain(Tone.Destination)
    },
  },
  fade: {
    apply(player, options) {
      player.fadeIn = options.in.value
      player.fadeOut = options.out.value
    },
    remove(player) {
      player.fadeIn = 0
      player.fadeOut = 0
    },
  },
}

export default effects
