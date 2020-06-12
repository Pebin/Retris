import React from "react";
import "./Square.css"

export function Square(props) {
  const textStyles = {background: props.color}

  return (
    <div
      className={"pure-u-1-8 square " + (props.showGrid ? "square_grid" : "") }
      style={textStyles}
    >
    </div>
  )
}
