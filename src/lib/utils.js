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
