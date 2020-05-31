import React from "react";
import {Square} from "./Square";

export class Board extends React.Component {
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
            showGrid={this.props.showGrid}
          />
        )
      })
      return (
        <div>
          {x_squares}
        </div>
      )
    })
  }
}
