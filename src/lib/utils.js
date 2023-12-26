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

/** @returns {Promise<string>} */
export function readFileAsync(reader, file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      resolve(reader.result)
    }

    reader.onerror = reject

    reader.readAsDataURL(file)
  })
}
