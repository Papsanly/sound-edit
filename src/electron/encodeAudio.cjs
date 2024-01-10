const fs = require('fs')
const ffmpegStatic = require('ffmpeg-static')
const { spawn } = require('child_process')
const wav = require('node-wav')
const os = require('os')
const path = require('path')

/** @return Buffer */
function encodeAudio(channels, sampleRate, encoding) {
  return new Promise((resolve, reject) => {
    const tempDir = os.tmpdir()
    const tempWavPath = path.join(tempDir, 'temp.wav')
    const tempMp3FilePath = path.join(tempDir, 'temp.mp3')

    const wavBuffer = wav.encode(channels, { sampleRate, float: true })

    if (encoding === 'wav') resolve(wavBuffer)

    fs.writeFileSync(tempWavPath, wavBuffer)

    const ffmpegPath = ffmpegStatic.replace('app.asar', 'app.asar.unpacked')
    const ffmpegProcess = spawn(ffmpegPath, [
      '-i',
      tempWavPath,
      tempMp3FilePath,
    ])

    ffmpegProcess.on('close', code => {
      if (code !== 0) {
        reject(new Error(`FFmpeg exited with code ${code}`))
        return
      }
      const mp3Buffer = fs.readFileSync(tempMp3FilePath)
      fs.rmSync(tempWavPath)
      fs.rmSync(tempMp3FilePath)
      resolve(mp3Buffer)
    })

    ffmpegProcess.stderr.on('data', data => {
      console.error(`FFmpeg stderr: ${data}`)
    })
  })
}

module.exports = encodeAudio
