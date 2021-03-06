import React from "react";
import {Position, randomPiece} from "../shapes";
import {Board} from "./Board";
import "./Game.css"
import {useSwipeable} from "react-swipeable";
import {HighestScore} from "./HighestScoreList";
import {loadHighestScoresPromise, SCORE_LOADED, SCORE_LOADING, SCORE_LOADING_FAILED, sendScorePromise} from "../scoreManager";
import {SubmitScoreForm} from "./SubmitScoreForm";

export const Swipeable = ({children, ...props}) => {
  const handlers = useSwipeable(props);
  return (<div { ...handlers }>{children}</div>);
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.keyboardHandler = this.keyboardHandler.bind(this);

    this.boardWidth = 8
    this.boardHeight = 20

    this.state = {
      gameSpeed: 400,
      gameTime: 0,
      score: 0,
      started: true,
      pieces: [],
      activePiece: randomPiece(),
      nextPiece: randomPiece(),
      highestScores: [],
      highestScoresLoadedStatus: SCORE_LOADING,
    }
  }

  startGame() {
    this.interval = setInterval(() => this.updateGame(), this.state.gameSpeed)
  }

  stopGame() {
    clearInterval(this.interval)
  }

  componentDidMount() {
    this.startGame()
    document.addEventListener("keydown", this.keyboardHandler, false)
    this.reloadTopScores()
  }

  componentWillUnmount() {
    this.stopGame()
    document.removeEventListener("keydown", this.keyboardHandler, false)
  }

  keyboardHandler(event) {
    switch (event.key) {
      case 'ArrowLeft':
        this.moveLeft()
        break
      case 'ArrowRight':
        this.moveRight()
        break
      case 'ArrowUp':
        this.moveRotation()
        break
      case 'ArrowDown':
        this.moveDown()
        break
      default:
        break
    }
  }

  moveLeft() {
    if (this.state.started && !this.isColliding(this.state.activePiece.positions(), this.state.pieces, -1, 0)) {
      this.state.activePiece.move(-1, 0)
      this.setState({activePiece: this.state.activePiece})
    }
  }

  moveRight() {
    if (this.state.started && !this.isColliding(this.state.activePiece.positions(), this.state.pieces, 1, 0)) {
      this.state.activePiece.move(1, 0)
      this.setState({activePiece: this.state.activePiece})
    }
  }

  moveRotation() {
    if (this.state.started && !this.isColliding(this.state.activePiece.getNextRotation(), this.state.pieces, 0, 0)) {
      this.state.activePiece.rotate()
      this.setState({activePiece: this.state.activePiece})
    }
  }

  moveDown() {
    if (!this.isColliding(this.state.activePiece.positions(), this.state.pieces, 0, 1)) {
      this.state.activePiece.move(0, 1)
      this.setState({activePiece: this.state.activePiece})
    }
  }

  updateGame() {
    const isColliding = this.isColliding(this.state.activePiece.positions(), this.state.pieces, 0, 1)
    if (isColliding) {
      this.state.pieces.push(this.state.activePiece)
      let linesRemoved = this.removeFullLines(this.state.pieces)
      this.increaseScore(Math.pow(linesRemoved, 2) * 100)

      let nextPiece = this.state.nextPiece
      if (this.isColliding(nextPiece.positions(), this.state.pieces, 0, 0)) {
        this.setState({started: false})
        this.stopGame()
      }
      this.setState({
        activePiece: nextPiece,
        nextPiece: randomPiece(),
      })
    } else {
      this.state.activePiece.move(0, 1)
    }

    this.setState({
      gameTime: this.state.gameTime + this.state.gameSpeed,
    })
  }

  increaseScore(score) {
    if (score <= 0) {
      return
    }
    let newScore = this.state.score + score
    let gameSpeed = this.state.gameSpeed * 0.97

    this.setState({
      score: newScore,
      gameSpeed: gameSpeed,
    }, () => {
      this.stopGame()
      this.startGame()
    })
  }

  removeFullLines(allPieces) {
    let linesRemoved = 0
    for (let y = 0; y < this.boardHeight; y++) {
      let lineFull = true
      for (let x = 0; x < this.boardWidth; x++) {
        let occupied = allPieces.some(piece => {
          return piece.positions().some(position => {
            return position.x === x && position.y === y
          })
        })
        if (!occupied) {
          lineFull = false
          break
        }
      }
      if (lineFull) {
        linesRemoved += 1
        allPieces = this.removeLine(allPieces, y)
      }
    }
    return linesRemoved
  }

  removeLine(allPieces, y) {
    const newPieces = []
    allPieces
      .forEach(piece => {
        piece.stored_positions =
          piece.stored_positions.filter(position => position.y !== y)

        piece.stored_positions
          .filter(position => position.y < y)
          .forEach(position => position.y += 1)
        if (piece.positions().length > 0) {
          newPieces.push(piece)
        }
      })
    return newPieces
  }

  isColliding(movingPiecePositions, oldPieces, x, y) {
    return movingPiecePositions.some(movingPiecePosition => {
      const futurePosition = new Position(movingPiecePosition.x + x, movingPiecePosition.y + y)

      // collides with others?
      const collided = oldPieces.some(oldPiece => {
        return oldPiece.positions().some(oldPiecePosition => {
          return JSON.stringify(oldPiecePosition) === JSON.stringify(futurePosition)
        })
      })

      if (!collided) {
        // collides with wall?
        return futurePosition.x < 0 ||
          futurePosition.x >= this.boardWidth ||
          futurePosition.y < 0 ||
          futurePosition.y >= this.boardHeight
      }
      return collided
    })
  }

  submitScore(nick) {
    sendScorePromise(nick, this.state.score)
      .then(() => {
          this.reloadTopScores()
          this.restartGame()
        }
      )
  }

  reloadTopScores() {
    this.setState({highestScoresLoadedStatus: SCORE_LOADING})
    loadHighestScoresPromise()
      .then(result => {
          this.setState({
            highestScoresLoadedStatus: SCORE_LOADED,
            highestScores: result,
          })
        },
        error => {
          this.setState({
            highestScoresLoadedStatus: SCORE_LOADING_FAILED,
            highestScores: [],
          })
        })
  }

  restartGame() {
    this.setState({
      gameSpeed: 400,
      gameTime: 0,
      score: 0,
      started: true,
      activePiece: randomPiece(),
      pieces: [],
      nextPiece: randomPiece(),
    }, () => this.startGame())
  }

  render() {
    const allPieces = this.state.pieces.slice()
    allPieces.push(this.state.activePiece)

    return (
      <Swipeable onSwipedLeft={() => this.moveLeft()}
                 onSwipedRight={() => this.moveRight()}
                 onSwipedUp={() => this.moveRotation()}
                 onSwipedDown={() => this.moveDown()}
                 preventDefaultTouchmoveEvent={true}
      >
        <div className="pure-g">
          <div className="pure-u-1-2">
            <Board
              pieces={allPieces}
              boardWidth={this.boardWidth}
              boardHeight={this.boardHeight}
              showGrid={true}
            />
          </div>
          <div className="pure-u-1-2">
            <div className="game-info">
              <b>Score: {this.state.score}</b>
            </div>
            <div className="game-info">Played time: {(this.state.gameTime / 1000).toFixed(1)}s</div>
            <div className="game-info">Next piece:
              <Board
                pieces={[this.state.nextPiece]}
                boardHeight={4}
                boardWidth={6}
                showGrid={false}
              />
            </div>
            <div className="game-info">
              <HighestScore results={this.state.highestScores} loadedStatus={this.state.highestScoresLoadedStatus}/>
            </div>
            <div className="game-info">
              <br/><span role="img" aria-label="">⬅️</span> Move left
              <br/><span role="img" aria-label="">➡️</span> Move right
              <br/><span role="img" aria-label="">⬆️</span> Rotate
              <br/><span role="img" aria-label="">⬇️</span> Move down
            </div>
            <div className="game-over middle-overlay"
                 hidden={this.state.started || (scoreBoardPosition(this.state.highestScores, this.state.score) !== -1)}>
              <h1 className="blink_me">Game Over</h1>
              <button className="again_button" onClick={() => this.restartGame()}>Play again</button>
            </div>
            <div className="game-win middle-overlay"
                 hidden={this.state.started || !(scoreBoardPosition(this.state.highestScores, this.state.score) !== -1)}>
              <SubmitScoreForm position={scoreBoardPosition(this.state.highestScores, this.state.score)} onSubmitAction={(nick) => {
                this.submitScore(nick)
              }}/>
            </div>
          </div>
        </div>
      </Swipeable>
    )
  }
}

function scoreBoardPosition(scores, newScore) {
  return scores.findIndex(result => result.score < newScore)
}

export default Game
