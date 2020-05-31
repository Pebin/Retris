import React from "react";
import {Position, randomPiece} from "./shapes";
import {Board} from "./Board";
import "./Game.css"

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
      pieces: [randomPiece()],
      nextPiece: randomPiece(),
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
  }

  componentWillUnmount() {
    this.stopGame()
    document.removeEventListener("keydown", this.keyboardHandler, false)
  }

  keyboardHandler(event) {
    if (event.key === 'ArrowLeft') {
      const movingPiece = this.state.pieces[this.state.pieces.length - 1]
      const oldPieces = this.state.pieces.slice(0, this.state.pieces.length - 1)
      if (!this.isColliding(movingPiece.positions(), oldPieces, -1, 0)) {
        movingPiece.move(-1, 0)
      }

    } else if (event.key === 'ArrowRight') {
      const movingPiece = this.state.pieces[this.state.pieces.length - 1]
      const oldPieces = this.state.pieces.slice(0, this.state.pieces.length - 1)
      if (!this.isColliding(movingPiece.positions(), oldPieces, 1, 0)) {
        movingPiece.move(1, 0)
      }
    } else if (event.key === 'ArrowUp') {
      const movingPiece = this.state.pieces[this.state.pieces.length - 1]
      const oldPieces = this.state.pieces.slice(0, this.state.pieces.length - 1)

      if (!this.isColliding(movingPiece.getNextRotation(), oldPieces, 0, 0)) {
        movingPiece.rotate()
      }
    } else if (event.key === 'ArrowDown') {
      const oldPieces = this.state.pieces.slice(0, this.state.pieces.length - 1)
      const movingPiece = this.state.pieces[this.state.pieces.length - 1]
      if (!this.isColliding(movingPiece.positions(), oldPieces, 0, 1)) {
        movingPiece.move(0, 1)
      }
    }
  }

  updateGame() {
    let oldPieces = this.state.pieces.slice(0, this.state.pieces.length - 1)
    const movingPiece = this.state.pieces[this.state.pieces.length - 1]
    const isColliding = this.isColliding(movingPiece.positions(), oldPieces, 0, 1)
    let started = this.state.started

    oldPieces.push(movingPiece)
    if (isColliding) {
      let linesRemoved = this.removeFullLines(oldPieces)
      this.increaseScore(Math.pow(linesRemoved, 2) * 100)

      let newPiece = this.state.nextPiece
      if (this.isColliding(newPiece.positions(), oldPieces, 0, 0)) {
        started = false
        this.stopGame()
      }
      oldPieces.push(newPiece)
      this.setState({nextPiece: randomPiece()})
    } else {
      movingPiece.move(0, 1)
    }

    this.setState({
      gameTime: this.state.gameTime + this.state.gameSpeed,
      pieces: oldPieces,
      started: started,
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

  restartGame() {
    this.setState({
      gameSpeed: 400,
      gameTime: 0,
      score: 0,
      started: true,
      pieces: [randomPiece()],
    }, () => this.startGame())
  }

  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board
            pieces={this.state.pieces}
            boardWidth={this.boardWidth}
            boardHeight={this.boardHeight}
            showGrid={true}
          />
        </div>
        <div className="game-info">
          <div><b>Score: {this.state.score}</b></div>
          <div>Played time: {(this.state.gameTime / 1000).toFixed(1)}s</div>
          <div>Next piece:
            <Board
              pieces={[this.state.nextPiece]}
              boardHeight={4}
              boardWidth={6}
              showGrid={false}
            />
          </div>

        </div>
        <div className="game-over" hidden={this.state.started}>
          <h1 className="blink_me">Game Over</h1>
          <button className="again_button" onClick={() => this.restartGame()}>Play again</button>
        </div>
      </div>
    )
  }
}

export default Game
