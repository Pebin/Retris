import * as React from "react";

export class SubmitScoreForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {nick: ""}

    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleNickChange = this.handleNickChange.bind(this)
  }

  handleSubmit(event) {
    event.preventDefault()
    this.props.onSubmitAction(this.state.nick)
  }

  handleNickChange(event) {
    this.setState({
      nick: event.target.value
    })
  }

  render() {
    return (
      <div>
        <h4>Your position:</h4>
        <h2>{this.props.position + 1}</h2>
        <h4>You made it to the score board!</h4>
        <form className="pure-form" onSubmit={this.handleSubmit}>
          <fieldset className="pure-group">
            <legend className="pure-u-1">Enter your nick to save your score!</legend>
            <input type="text" placeholder="nick" className="pure-input-rounded pure-u-1" value={this.state.nick} onChange={this.handleNickChange}/>
            <button type="submit" className="pure-button pure-button-primary pure-u-1">Save</button>
          </fieldset>
        </form>
      </div>
    );
  }
}