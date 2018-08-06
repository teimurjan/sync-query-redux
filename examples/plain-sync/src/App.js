import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { increment, decrement } from "./actions";
import { LISTENING_PATH } from ".";

class App extends Component {
  render() {
    const { value, increment, decrement } = this.props;
    return (
      <div className="container">
        <p className="value">State value is: {value}</p>
        <button onClick={increment}>INCREMENT</button>
        <button onClick={decrement}>DECREMENT</button>
        <p className="status">
          {window.location.pathname === LISTENING_PATH ? (
            "SYNCED"
          ) : (
            <a href={LISTENING_PATH}>NOT SYNCED. GO TO THE LISTENING PATH.</a>
          )}
        </p>
        <div className="help-info">
          LISTENING PATH: {LISTENING_PATH}
          <br />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  value: state
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      increment,
      decrement
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
