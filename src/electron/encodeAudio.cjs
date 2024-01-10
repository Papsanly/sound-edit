const fs = require('fs')
const ffmpegStatic = require('ffmpeg-static')
const { spawn } = require('child_process')
const wav = require('node-wav')

/** @return Buffer */
function encodeAudio(channels, sampleRate, encoding) {
  return new Promise((resolve, reject) => {
    const tempWavPath = 'temp.wav'
    const outputFilePath = `output.${encoding}`

    const wavBuffer = wav.encode(channels, { sampleRate, float: true })

    if (encoding === 'wav') resolve(wavBuffer)

    fs.writeFileSync(tempWavPath, wavBuffer)

    const ffmpegProcess = spawn(ffmpegStatic, [
      '-i',
      tempWavPath,
      outputFilePath,
    ])

    ffmpegProcess.on('close', code => {
      if (code !== 0) {
        reject(new Error(`FFmpeg exited with code ${code}`))
        return
      }
      const mp3Buffer = fs.readFileSync(outputFilePath)
      fs.rmSync(tempWavPath)
      fs.rmSync(outputFilePath)
      resolve(mp3Buffer)
    })

    ffmpegProcess.stderr.on('data', data => {
      console.error(`FFmpeg stderr: ${data}`)
    })
  })
}

module.exports = encodeAudio
