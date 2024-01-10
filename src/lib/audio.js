import * as Tone from 'tone'

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
  const newPlayers = {}
  for (const id in players) {
    newPlayers[id] = new Tone.Player().toDestination()
    newPlayers[id].buffer = players[id].buffer
  }
  return newPlayers
}
