import toWav from 'audiobuffer-to-wav'

/**
 * @param {AudioBuffer} audioBuffer
 * @returns {Promise<Blob>}
 */
export async function audioEncodeWav(audioBuffer) {
  return new Promise((resolve, reject) => {
    try {
      const wavBuffer = toWav(audioBuffer)
      resolve(wavBuffer)
    } catch (error) {
      reject(error)
    }
  })
}
