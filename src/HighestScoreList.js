import React from "react";

export class HighestScore extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      results: [],
      isLoaded: false,
      error: null,
    }
  }

  componentDidMount() {
    fetch("http://retrisdbaccess.azurewebsites.net/api/retrisdbaccess?code=KEPVeUF949R/EZoET9yLc0oFFG1YqACUOqpq3jEsB7Ii11/v4ulR/w==")
      .then(response => response.json())
      .then(result => {
          this.setState({
            isLoaded: true,
            results: result,
          })
        },
        error => {
          this.setState({
            isLoaded: false,
            error: error,
            results: [],
          })
        })

  }

  render() {
    const items = this.state.isLoaded ? this.state.results : []

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
}

