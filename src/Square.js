import React from "react";
import "./Square.css"

export function Square(props) {
  const textStyles = {background: props.color}

  return (
    <div
      className={props.showGrid ? "square square_grid" : "square" }
      style={textStyles}
    >
    </div>
  )
}
