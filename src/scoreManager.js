const ENDPOINT = "https://retrisdbaccess.azurewebsites.net/api/retrisdbaccess?code=KEPVeUF949R/EZoET9yLc0oFFG1YqACUOqpq3jEsB7Ii11/v4ulR/w=="
// const ENDPOINT = "http://localhost:7071/api/retrisdbaccess/"

export const SCORE_LOADED = 0
export const SCORE_LOADING = 1
export const SCORE_LOADING_FAILED = 2

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