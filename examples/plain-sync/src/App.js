import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { increment, decrement } from "./actions";
import { LISTENING_PATH } from ".";

const getFullUrl = urlPart => `${process.env.PUBLIC_URL}${urlPart}`;
class App extends Component {
  render() {
    const { value, increment, decrement } = this.props;
    const syncPath = getFullUrl(LISTENING_PATH);
    const isSyncPath = getFullUrl(window.location.pathname) === syncPath;
    return (
      <div className="container">
        <p className="value">State value is: {value}</p>
        <button onClick={increment}>INCREMENT</button>
        <button onClick={decrement}>DECREMENT</button>
        <p className="status">
          {isSyncPath ? (
            "SYNCED"
          ) : (
            <a href={syncPath}>NOT SYNCED. GO TO THE LISTENING PATH.</a>
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
