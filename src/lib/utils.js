export function findInObject(obj, predicate) {
  const res = Object.entries(obj).find(([, value]) => predicate(value))
  if (res) {
    return res[0]
  }
}

export function findMax(state, predicate) {
  let maxTrack = Math.max(...Object.values(state).map(predicate))
  return maxTrack === -Infinity ? null : maxTrack
}

export function isEmptyObject(obj) {
  return Object.keys(obj).length === 0
}
