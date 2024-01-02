import * as Tone from 'tone'

const effects = {
  gain: {
    name: 'Gain',
    enabled: false,
    options: {
      value: { name: 'Value', min: -10, max: 5, value: 0, units: 'db' },
    },
    apply(player, options) {
      player.chain(new Tone.Gain(options.value), Tone.Destination)
    },
    remove(player) {
      player.chain(Tone.Destination)
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
    apply(player, options) {
      player.chain(new Tone.Reverb(options), Tone.Destination)
    },
    remove(player) {
      player.chain(Tone.Destination)
    },
  },
  delay: {
    name: 'Delay',
    enabled: false,
    options: {
      time: { name: 'Time', min: 0, max: 10, value: 5, units: 's' },
      feedback: { name: 'Feedback', min: 0, max: 1, value: 1, units: '' },
    },
    apply(player, options) {
      player.chain(
        new Tone.PingPongDelay(options.time, options.feedback),
        Tone.Destination,
      )
    },
    remove(player) {
      player.chain(Tone.Destination)
    },
  },
  distortion: {
    name: 'Distortion',
    enabled: false,
    options: {
      value: { name: 'Value', min: 0, max: 1, value: 0, units: '' },
      wet: { name: 'Wet', min: 0, max: 1, value: 1, units: '' },
    },
    apply(player, options) {
      player.chain(
        new Tone.Distortion({ distortion: options.value, wet: options.wet }),
        Tone.Destination,
      )
    },
    remove(player) {
      player.chain(Tone.Destination)
    },
  },
  eq3: {
    name: 'Eq3',
    enabled: false,
    options: {
      low: { name: 'Low', min: -10, max: 5, value: 0, units: 'db' },
      mid: { name: 'Mid', min: -10, max: 5, value: 0, units: 'db' },
      high: { name: 'High', min: -10, max: 5, value: 0, units: 'db' },
    },
    apply(player, options) {
      player.chain(
        new Tone.EQ3(options.low, options.mid, options.high),
        Tone.Destination,
      )
    },
    remove(player) {
      player.chain(Tone.Destination)
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

export default effects
