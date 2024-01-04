import * as Tone from 'tone'

export function findInObject(obj, predicate) {
  const res = Object.entries(obj).find(([, value]) => predicate(value))
  if (res) {
    return res[0]
  }
}

export function filterObjectByKey(obj, predicate) {
  return Object.entries(obj)
    .filter(([key]) => predicate(key))
    .map(([, value]) => value)
}

export function findMax(state, predicate) {
  let maxTrack = Math.max(...Object.values(state).map(predicate))
  return maxTrack === -Infinity ? null : maxTrack
}

export function padWithLeadingZeros(num, totalLength) {
  return String(num).padStart(totalLength, '0')
}

export function getCssProperty(property) {
  const rootStyle = getComputedStyle(document.documentElement)
  return rootStyle.getPropertyValue(property)
}

export function loadPlayerAsync(url) {
  return new Promise((resolve, reject) => {
    const player = new Tone.Player({
      url,
      onload: () => resolve(player),
      onerror: reject,
    }).toDestination()
  })
}

export function recreatePlayers(players) {
  return Object.fromEntries(
    Object.entries(players).map(([id, player]) => {
      const offlinePlayer = new Tone.Player()
      offlinePlayer.buffer = player.buffer
      return [id, offlinePlayer]
    }),
  )
}
