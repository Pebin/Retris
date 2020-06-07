import React from "react";

export function HighestScore(props) {
  const items = props.isLoaded ? props.results : []

  return (
    <div>
      <div className="pure-g">
        <div className="pure-u-1" style={{margin: "5px 0px 10px 0px"}}>
          Score board:
        </div>
      </div>
      {items.map((result, i) => (
        <div className="pure-g">
          <div className="pure-u-3-24">
            {i + 1}
          </div>
          <div className="pure-u-13-24">
            {result.nick}
          </div>
          <div className="pure-u-8-24">
            {result.score}
          </div>
        </div>
      ))}
    </div>
  )
}

