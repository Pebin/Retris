import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import {Shape1, Shape2, Shape3, Shape4, Shape5, Shape6, Shape7} from "./shapes";

export class Position {
  constructor(x, y) {
    this.x = x
    this.y = y
  }
}

function Square(props) {
  const textStyles = {background: props.color}

  return (
    <div
      className={"square"}
      style={textStyles}
    >
    </div>
  )
}

class Board extends React.Component {
  constructor(props) {
    super(props);

    this.boardWidth = props.boardWidth
    this.boardHeight = props.boardHeight
  }

  draw_pieces_to_board() {
    const empty_squares = Array(this.boardHeight).fill(null)
    empty_squares.forEach((value, i) => empty_squares[i] = Array(this.boardWidth).fill("#fff"))

    this.props.pieces.forEach((piece, number) => {
      piece.positions().forEach((position, i) => {
        if (position.y < this.boardHeight) {
          empty_squares[position.y][position.x] = piece.color
        }
      })
    })
    return empty_squares
  }

  render() {
    const filled_squares = this.draw_pieces_to_board()

    return filled_squares.map(col_array => {
      const x_squares = col_array.map(color => {
        return (
          <Square
            color={color}
          />
        )
      })
      return (
        <div className="board-row">
          {x_squares}
        </div>
      )
    })
  }
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
      pieces: [this.newPiece()],
    }
  }

  newPiece() {
    const possiblePieces = [new Shape1(), new Shape2(), new Shape3(), new Shape4(), new Shape5(), new Shape6(), new Shape7()]
    // return new Shape1()
    return possiblePieces[Math.floor((Math.random() * possiblePieces.length))];
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

      let newPiece = this.newPiece()
      if (this.isColliding(newPiece.positions(), oldPieces, 0, 0)) {
        started = false
        this.stopGame()
      }
      oldPieces.push(newPiece)

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
    if (score <= 0){
      return
    }
    let newScore = this.state.score + score
    let gameSpeed = this.state.gameSpeed * 0.97

    this.setState({
      score: newScore,
      gameSpeed: gameSpeed,
    })
    this.stopGame()
    this.startGame()
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
      pieces: [this.newPiece()],
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
          />
        </div>
        <div className="game-info">
          <div>Played time: {(this.state.gameTime / 1000).toFixed(1)}s</div>
          <div>Speed: {(this.state.gameSpeed)}</div>
          <ol>Score: {this.state.score}</ol>
        </div>
        <div className="game-over" hidden={this.state.started}>
          <h1 className="blink_me">Game Over</h1>
          <button className="again_button" onClick={() => this.restartGame()}>Play again</button>
        </div>
      </div>
    )
  }
}

ReactDOM.render(
  <React.StrictMode>
    <h1>Retris</h1>
    <Game/>,
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
