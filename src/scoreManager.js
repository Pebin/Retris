const ENDPOINT = "https://retrisdbaccess.azurewebsites.net/api/retrisdbaccess?code=KEPVeUF949R/EZoET9yLc0oFFG1YqACUOqpq3jEsB7Ii11/v4ulR/w=="
// const ENDPOINT = "http://localhost:7071/api/retrisdbaccess/"

export function loadHighestScoresPromise() {
  return fetch(ENDPOINT)
    .then(response => response.json())
}

export function sendScorePromise(nick, score) {
  return fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      nick: nick,
      score: score,
    })
  })
}