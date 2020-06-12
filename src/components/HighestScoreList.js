import React from "react";
import "./styles.css"
import {SCORE_LOADED, SCORE_LOADING, SCORE_LOADING_FAILED} from "../scoreManager";

export function HighestScore(props) {
  const items = props.loadedStatus === SCORE_LOADED ? props.results : []

  return (
    <div>
      <div className="pure-g">
        <div className="pure-u-1" style={{margin: "5px 0px 10px 0px"}}>
          Score board:
        </div>
      </div>
      <div className="center-content">
        <div className="loader" hidden={props.loadedStatus !== SCORE_LOADING}> </div>
      </div>
      <div className="center-content" hidden={props.loadedStatus !== SCORE_LOADING_FAILED}>
        Failed to load scoreboard 😞
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

